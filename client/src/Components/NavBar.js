import React, { useState, useEffect } from "react"
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom';
// import { socket2 } from './Home';
import axios from 'axios';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Navbar() {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // const token = localStorage.getItem('jwt');
    console.log('send getNotifications event');
    // socket2.emit('getNotifications', { token: token });

    return () => {
    };
  }, []);

  useEffect(() => {
    //   socket2.on('receiveNotifs', (data) => {
    //   console.log('reveiceNotif event');
    //   setNotifications(data);
    // });

    return () => {
      // socket2.off('receiveNotifs');
    };
  });

  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem('jwt');
    navigate('/signin');
  }

  const gotoprofile = (event) => {
    event.preventDefault();
    navigate('/profile');
  }


  const deleteNotifs = (event, notifToRemove) => {
    event.preventDefault(); //do not delete, allow to not autoclose the notifications dropdown on a single suppresion
    console.log('delete notifs with id:', notifToRemove.id);

    axios.delete(`http://localhost:3001/notifications/${notifToRemove.id}`, {id: notifToRemove.id
    })
      .then(response => {
        // handle success
        setNotifications(notifications.filter((notification) => notification.id !== notifToRemove.id));
      })
      .catch(error => {
        // handle error
        console.log(error);
        console.log(error.response.data);
      });
    }


  const setNotifRead = (event, notifToUpdate) => {
    console.log('update notif with id:', notifToUpdate.id);

    if(!notifToUpdate.read)
    {
      axios.put(`http://localhost:3001/notifications/${notifToUpdate.id}`, {
        id: notifToUpdate.id
      })
        .then(response => {
          // handle success
          console.log('update notif success')

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

  let navigate = useNavigate();
  console.log(notifications);

return (
  <Disclosure as="nav" className="bg-gray-800 fixed top-0 min-w-full z-40">
    {({ open }) => (
      <>
        <div className="px-8">
          <div className="relative flex h-16 items-center justify-between">
            <img className="block h-8 w-auto" src="../logo.png" alt="logo"/>
            <div id="navbarRightButtons" className="flex items-center">
              <Menu as="div">
                  <Menu.Button className="relative rounded-ful pt-2 text-gray-400 hover:text-white">
                    <BellIcon className={`h-8 w-8`} aria-hidden="true" />
                    <div id="notifCount" className={`${notifications.filter(notif => notif.read === false).length === 0 ? 'hidden' : ''} absolute bot-0 top-1 right-0 h-4 w-4 flex items-center justify-center rounded-full bg-red-400 text-white text-sm`}>{notifications.filter(notif => notif.read === false).length}</div>
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
                    {notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        <div onMouseEnter={(event) => setNotifRead(event, notification)} className={classNames(notification.read ? '' : 'bg-blue-100', 'px-4 py-2 text-sm text-gray-700 flex items-center gap-1')}>
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""/>
                            <div className="flex-1">{notification.type}</div>
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
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
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
