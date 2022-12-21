import NavBar from '../../Navbar/NavBar';
import SettingsMenu from './SettingsMenu';
import { Cog6ToothIcon, EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { current } from 'daisyui/src/colors';

const Password = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [isRevealed, setIsRevealed] = useState(false);
    const toggleReveal = () => setIsRevealed(!isRevealed);

    const [isRevealedConfirm, setIsRevealedConfirm] = useState(false);
    const toggleRevealConfirm = () => setIsRevealedConfirm(!isRevealedConfirm);


	useEffect(() => {
			console.log('password');
	  }, []);

	return (
		<>
			<div className="bg-chess-default min-h-screen overflow-y-auto">
				<NavBar/>
				<div className='mx-2 pt-16 h-screen'>
					<div className='flex items-center gap-2 p-2 text-white font-bold text-2xl sm:mx-40'>
						<Cog6ToothIcon className={`h-6 w-6`}/>
						<span>Settings</span>
					</div>
					<div className='flex gap-4 mt-2 sm:mx-40'>
						<SettingsMenu/>
						<div className='relative text-white bg-chess-dark p-4 rounded-lg'>
							<span className='font-bold'>Change password</span>

                            <div className=' pt-2 flex flex-col sm:flex-row mb-2 sm:justify-between sm:gap-2'>
                                    <label className="block text-white text-sm self-start">
                                        Current password
                                    </label>
                                    <div className='bg-chess-placeholder flex flex-row rounded-sm'>
                                        <input className=" px-2 bg-transparent text-white rounded-sm focus:outline-none focus:shadow-outline" id="password"
                                                type='password'
                                                value={currentPassword}
                                                onChange={(event) => setCurrentPassword(event.target.value)} />
                                    </div>
                            </div>
                            <div className='flex flex-col mb-2 sm:flex-row sm:justify-between sm:gap-2'>
                                    <label className="block text-white text-sm self-start">
                                        New password
                                    </label>
                                    <div className='bg-chess-placeholder flex flex-row rounded-sm'>
                                        <input className=" px-2 bg-transparent text-white rounded-sm focus:outline-none focus:shadow-outline" id="password"
                                                type={isRevealed ? 'text' : 'password'}
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)} />
                                        <button onClick={toggleReveal}>
                                            <EyeIcon className={`h-6 w-6 p-1 text-chess-place-text hover:text-white`}/>
                                        </button>
                                    </div>

                            </div>
                            <div className='flex flex-col sm:flex-row mb-2 sm:justify-between sm:gap-2'>
                                    <label className="block text-white text-sm self-start">
                                        Confirm new password
                                    </label>
                                    <div className='bg-chess-placeholder flex flex-row rounded-sm'>
                                        <input className=" px-2 bg-transparent text-white rounded-sm focus:outline-none focus:shadow-outline" id="password"
                                                type={isRevealedConfirm ? 'text' : 'password'}
                                                value={passwordConfirm}
                                                onChange={(event) => setPasswordConfirm(event.target.value)} />
                                        <button onClick={toggleRevealConfirm}>
                                            <EyeIcon className={`h-6 w-6 p-1 text-chess-place-text hover:text-white`}/>
                                        </button>
                                    </div>

                            </div>
                            <button className='btn btn-sm  rounded-md absolute bottom-5 bg-green-600 hover:bg-green-500'>Change password</button>

						</div>
					</div>

				</div>
			</div>
		</>
	)
}

export default Password;