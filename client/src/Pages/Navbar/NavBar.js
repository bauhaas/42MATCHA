import { useState, useEffect, Fragment } from "react"
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { BellIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { Disclosure, Menu, Transition } from '@headlessui/react'

import  socket  from '../../Context/socket'
import Avatar from "../../SharedComponents/Avatar";
import { setConvs } from "../../convSlice";
import api from "../../ax";
import { setUser } from "../../userSlice";

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
		if (socket.client === undefined || socket.client.connected === false) {
			socket.connect(user.id);
		}
	}, [user]);

  useEffect(() => {
      api.get(`http://localhost:3001/notifications/${user.id}/receiver`, {
        id: user.id
      })
        .then(response => {
          // handle success
          setNotifications(response.data);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }, [user]);


  useEffect(() => {
    socket.client.on('convUpdate', (data) => {

      //to detect if the user is currently chatting with the other. in that case don't notice him
      const pathParts = window.location.pathname.split('/');
      const urlEnd = pathParts[pathParts.length - 1];
      const conversation = data.find(conv => conv.id === Number(urlEnd));
      if (!conversation || Number(urlEnd) !== conversation.id) {
        dispatch(setConvs(data));
      }
    })

    socket.client.on('hasvisitNotif', (data) => {
      setNotifications([...notifications, data]);
    })

    socket.client.on('haslikeNotif', (data) => {
      setNotifications([...notifications, data]);
    })

    socket.client.on('hasmatchNotif', (data) => {
      setNotifications([...notifications, data]);
    })

    socket.client.on('hasunlikeNotif', (data) => {
      setNotifications([...notifications, data]);
    })

    return () => {
      socket.client.off('convUpdate');
      socket.client.off('hasvisitNotif');
      socket.client.off('haslikeNotif');
      socket.client.off('hasmatchNotif');
      socket.client.off('hasunlikeNotif');
    };
  }, [notifications, dispatch]);

  useEffect(() => {
    setConvList(convs);
  }, [convs]);

  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem('jwt');

    // persistor.pause();
    // persistor.flush().then(() => {
      dispatch(setUser(null));
    // });

    if (socket.client && socket.client.connected === true) {
      socket.disconnect();
    }
    navigate('/signin');
  }

  const gotoprofile = (event, id) => {
    event.preventDefault();
    navigate(`/profile/${id}`);
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

    api.delete(`http://localhost:3001/notifications/${notifToRemove.id}`, {id: notifToRemove.id
    })
      .then(response => {
        // handle success
        setNotifications(notifications.filter((notification) => notification.id !== notifToRemove.id));
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    }

  const setNotifRead = (event, notifToUpdate) => {

    if(!notifToUpdate.read)
    {
      api.put(`http://localhost:3001/notifications/${notifToUpdate.id}/update_read`, {
        id: notifToUpdate.id
      })
        .then(response => {
          // handle success
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

  const sortedNotifications = notifications && notifications.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA;
  });

  const getNotifText = (notification) => {
    switch(notification.type){
      case 'match':
        return `You matched with ${notification.fullname}`;
      case 'unlike':
        return ` ${notification.fullname} unmatched you`;
      case 'like':
        return ` ${notification.fullname} liked you`;
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
                      <Menu.Item key={notification.id} onClick={(event) => gotoprofile(event, notification.sender_id)}>
                        <div  onMouseEnter={(event) => setNotifRead(event, notification)} className={classNames(notification.read ? '' : 'bg-blue-100', 'px-4 py-2 text-sm text-gray-700 flex items-center gap-1')}>
                          <Avatar imageAttribute={'rounded-full w-8'} attribute={'avatar'} imagePath={notification.file_path} />
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
                    <Avatar imageAttribute={'rounded-full w-10'} attribute={'avatar'} imagePath={user.files.find((file) => file.is_profile_pic === true).file_path} />
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
                          onClick={(event) => gotoprofile(event, user.id)}
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
