import { useState, useEffect, Fragment } from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { BellIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Disclosure, Menu, Transition } from '@headlessui/react'

import  socket  from '../../Context/socket'
import axios from 'axios';
import Avatar from "../../SharedComponents/Avatar";
import { setConvs } from "../../convSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = () => {

  const user = useSelector((state) => state.user.user);
  const convs = useSelector((state) => state.convs.convs);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [convlist, setConvList] = useState([]);

	useEffect(() => {
		if (socket.client === undefined) {
      console.log('connect socket with:', user.id);
			socket.connect(user.id);
		}
	}, []);

  useEffect(() => {
    console.log('retrieve all notifs')
      axios.get(`http://localhost:3001/notifications/${user.id}/receiver`, {
        id: user.id
      })
        .then(response => {
          // handle success
          console.log('get all notifs of currentuser', response.data);
          setNotifications(response.data);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }, []);


  useEffect(() => {
    console.log('socket useEffect');
    socket.client.on('convUpdate', (data) => {
      console.log('receive message history event in navbar page', data)

      //to detect if the user is currently chatting with the other. in that case don't notice him
      const pathParts = window.location.pathname.split('/');
      const urlEnd = pathParts[pathParts.length - 1];
      const conversation = data.find(conv => conv.id === Number(urlEnd));
      if (!conversation || Number(urlEnd) !== conversation.id) {
        console.log('redux save convs', data);
        dispatch(setConvs(data));
      }
    })

    socket.client.on('hasvisitNotif', (data) => {
      console.log('receive a visit', data)
      setNotifications([...notifications, data]);
    })

    socket.client.on('haslikeNotif', (data) => {
      console.log('receive a like', data)
      console.log('before update notif:',notifications)
      setNotifications([...notifications, data]);
      // dispatch(addNotif(data));
    })

    return () => {
      socket.client.off('convUpdate');
      socket.client.off('hasVisitNotif');
    };
  }, [notifications]);

  useEffect(() => {
    console.log('redux convs value:', convs);
    setConvList(convs);
  }, [convs]);

  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem('jwt');
    if (socket.client && socket.client.connected === true) {
      socket.disconnect();
    }
    navigate('/signin');
  }

  const gotoprofile = (event) => {
    event.preventDefault();
    navigate(`/profile/${user.id}`);
  }

  const gotomenu = (event) => {
    event.preventDefault();
    navigate(`/home`);
  }

  const gotochat = (event) => {
    event.preventDefault();
    navigate('/chat');
  }

  const gotosettings = (event) => {
    event.preventDefault();
    navigate('/settings');
  }

  const deleteNotifs = (event, notifToRemove) => {
    event.preventDefault(); //do not delete, allow to not autoclose the notifications dropdown on a single suppresion
    console.log('delete notifs with id:', notifToRemove.id);

    axios.delete(`http://localhost:3001/notifications/${notifToRemove.id}`, {id: notifToRemove.id
    })
      .then(response => {
        console.log('notif has been deleted in db', response);
        // handle success
        setNotifications(notifications.filter((notification) => notification.id !== notifToRemove.id));
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    }

  const setNotifRead = (event, notifToUpdate) => {
    console.log('update notif with id:', notifToUpdate);

    if(!notifToUpdate.read)
    {
      console.log('notif has been read');
      // dispatch(updateNotif({ id: notifToUpdate.id }));
      axios.put(`http://localhost:3001/notifications/${notifToUpdate.id}/update_read`, {
        id: notifToUpdate.id
      })
        .then(response => {
          // handle success
          console.log('update notif has read to the db', response);

          // Use the setState method to update the notifications state in an immutable way
          setNotifications(prevState => {
            // Make a copy of the notifications state array
            const updatedNotifications = [...prevState];

            const index = updatedNotifications.findIndex(notif => notif.id === notifToUpdate.id);
            const updatedNotif = {
              ...notifToUpdate,
              read: true
            };
            updatedNotifications[index] = updatedNotif;

            return updatedNotifications;
          });
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }

  }

  console.log('notifications:', notifications);

  const sortedNotifications = notifications && notifications.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA;
  });

  if(convlist)
    console.log(convlist.filter(conv => conv.last_message_unread === true).length !== 0);

    console.log('notificqtions check:', notifications && notifications.filter(notif => notif.read === false).length === 0);

  const getNotifText = (notification) => {
    console.log(notification.type);
    switch(notification.type){
      case 'match':
        return `You got a match with ${notification.fullname}`;
      case 'unmatch':
        return ` ${notification.fullname} unmatched you`;
      case 'like':
        return ` ${notification.fullname} liked you`;
      case 'block':
        return ` ${notification.fullname} blocked you`;
      case 'unblock':
        return ` ${notification.fullname} unblocked you`;
      case 'visit':
        return ` ${notification.fullname} visited your profile`;
      default:
        return notification.type;
    }
  }
return (
  <Disclosure as="nav" className="bg-chess-hover fixed top-0 min-w-full z-40">
    {({ open }) => (
      <>
        <div className="px-8">
          <div className="relative flex h-16 items-center justify-between">
            <img onClick={(event) => gotomenu(event)} className="block h-8 w-auto" src="../logo.png" alt="logo"/>
            <div id="navbarRightButtons" className="flex items-center gap-4">
              <div id="TODELETELATER" className="border-2 border-red-500 text-white">id:{user.id}, name:{user.first_name} {user.last_name}</div>
              <Menu as="div">
                <Menu.Button onClick={gotochat} className="relative rounded-ful pt-2 text-gray-400 hover:text-white">
                  <ChatBubbleLeftRightIcon className={`h-8 w-8`} aria-hidden="true" />
                  <div id="chat" className={`${convlist && convlist.filter(conv => conv.last_message_unread === true).length !== 0 ? '' : 'hidden'} absolute top-1 right-0 h-4 w-4 flex items-center justify-center rounded-full bg-red-400 text-white text-sm`}>{convlist && convlist.filter(conv => conv.last_message_unread === true).length}</div>
                </Menu.Button>
              </Menu >
              <Menu as="div">
                  <Menu.Button className="relative rounded-ful pt-2 text-gray-400 hover:text-white">
                    <BellIcon className={`h-8 w-8`} aria-hidden="true" />
                  <div id="notifCount" className={`${notifications  && notifications.filter(notifications => notifications.read === false).length !== 0 ? 'absolute top-1 right-0 h-4 w-4 flex items-center justify-center rounded-full bg-red-400 text-white text-sm':'hidden'} `}>{notifications && notifications.filter(notif => notif.read === false).length}</div>
                  </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="h-80 w-full absolute right-0 z-10 mt-2 rounded-md  bg-white py-1 shadow-lg overflow-auto scrollbar">
                    {sortedNotifications && sortedNotifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        <div onMouseEnter={(event) => setNotifRead(event, notification)} className={classNames(notification.read ? '' : 'bg-blue-100', 'px-4 py-2 text-sm text-gray-700 flex items-center gap-1')}>
                            <Avatar imageAttribute={'rounded-full w-8'} attribute={'avatar'} />
                            <div className="flex-1">{getNotifText(notification)}</div>
                            <svg onClick={(event) =>deleteNotifs(event, notification)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 rounded-full hover:bg-blue-200">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu >


              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm">
                    <Avatar imageAttribute={'rounded-full w-10'} attribute={'avatar'}/>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={gotoprofile}
                          className={classNames(active ? 'bg-gray-200' : '', 'block px-4 py-2 text-sm text-gray-700 min-w-full text-start')}
                        >
                          Your Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={gotosettings}
                          className={classNames(active ? 'bg-gray-200' : '', 'block px-4 py-2 text-sm text-gray-700 min-w-full text-start')}
                        >
                          Settings
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={classNames(active ? 'bg-gray-200' : '', 'block px-4 py-2 text-sm text-gray-700 min-w-full text-start')}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </>
    )}
  </Disclosure>
)
}

export default Navbar;
