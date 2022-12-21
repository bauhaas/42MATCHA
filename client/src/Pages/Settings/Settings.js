import React, { useState } from 'react';
import NavBar from '../Navbar/NavBar';
import { NoSymbolIcon, KeyIcon, HeartIcon, UserIcon, UsersIcon, Cog6ToothIcon,  } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import SettingsMenu from './Components/SettingsMenu';
import SettingsProfile from './Components/SettingsProfile';
import axios from 'axios';

const Settings = () => {

    const navigate = useNavigate();

    function gotoRoute(route) {
      navigate(`/settings/${route}`);
    }





    return (
        <>
            <div className="bg-chess-default min-h-screen">
                <NavBar/>
                <div className='mx-2 pt-16 h-full'>
                    <div className='flex items-center gap-2 p-2 text-white font-bold text-2xl sm:mx-40'>
                        <Cog6ToothIcon className={`h-6 w-6`}/>
                        <span>Settings</span>
                    </div>
                    <div className='flex gap-4 h-full mt-2 sm:mx-40'>
                        <SettingsMenu/>
                        <div className='text-white bg-chess-dark p-4 rounded-lg'>
							<span className='font-bold'>Blocked Users</span>
							<p className='text-sm py-2 break-words'>
								A blocked user will not see your profile appear in their searches, or be able to send you messages. Blocking a user will delete your chat history
							</p>
							<div className='flex gap-2 w-full'>
								<input className={`grow rounded-lg focus:outline-none max-w-xs px-2 text-sm bg-chess-placeholder placeholder-chess-place-text text-chess-place-text`} type="text" placeholder="search..." />
								<button className="btn btn-xs bg-chess-button btn-disabled text-white">
									block
								</button>
							</div>
							<div className="pt-2">
								<table className="text-white w-full text-left">
									<tbody>
										<tr className="border-b border-chess-bar text-xs">
											<th className='font-normal'>
												Baudoin Haas
											</th>
											<td className="text-right">
												<a href="#">Unblock</a>
											</td>
										</tr>
										<tr className="border-b border-chess-bar text-xs">
											<th className='font-normal'>
												Baudoin Haas
											</th>
											<td className="text-right">
												<a href="#">Unblock</a>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Settings;