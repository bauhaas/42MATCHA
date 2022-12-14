import React, { useState, useEffect } from "react"
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom';
import { socket } from '../App';
import axios from 'axios';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Navbar() {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    console.log('send getNotifications event');
    socket.emit('getNotifications', { token: token });

    return () => {
    };
  }, []);

  useEffect(() => {
    socket.on('receiveNotifs', (data) => {
      console.log('reveiceNotif event');
      setNotifications(data);
    });

    return () => {
      socket.off('receiveNotifs');
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

            console.log(updatedNotifications);
            // Find the index of the notifToUpdate object in the array
            const index = updatedNotifications.findIndex(notif => notif.id === notifToUpdate.id);

            // Create a new object with the same properties as the notifToUpdate object,
            // but with the "read" property set to true
            const updatedNotif = {
              ...notifToUpdate,
              read: true
            };

            // Update the notifications state array with the new object
            updatedNotifications[index] = updatedNotif;

            // Return the new state object
            return updatedNotifications;
          });
        })
        .catch(error => {
          // handle error
          console.log(error);
          console.log(error.response.data);
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
            <div id="navbarMobileButton" className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div id="navbarLogo" className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="block h-8 w-auto lg:hidden"
                  src="../logo2-B65YbTK81-transformed.png"
                  alt="Your Company"
                />
                <img
                  className="hidden h-8 w-auto lg:block"
                  src="../logo2-B65YbTK81-transformed.png"
                  alt="Your Company"
                />
              </div>
            </div>
            <div id="navbarRightButtons" className="absolute right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Menu as="div">
                  <Menu.Button className="relative rounded-ful pt-2 text-gray-400 hover:text-white">
                    <BellIcon className="h-8 w-8" aria-hidden="true" /> {/* TODO make below div hidden if no unread notifs*/}
                    <div id="notifCount" className="absolute bot-0 top-1 right-0 h-4 w-4 flex items-center justify-center rounded-full bg-red-400 text-white text-sm">{notifications.filter(notif => notif.read === false).length}</div>
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right rounded-md h-80 bg-white py-1 shadow-lg overflow-auto scrollbar">
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
                    <span className="sr-only">Open user menu</span>
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
                          className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                        >
                          Your Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#a"
                          className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                        >
                          Settings
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
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

        <Disclosure.Panel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block px-3 py-2 rounded-md text-base font-medium'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
)
}

export default Navbar;
