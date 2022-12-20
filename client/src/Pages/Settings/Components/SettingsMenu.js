import { useNavigate } from 'react-router-dom';
import { NoSymbolIcon, KeyIcon, HeartIcon, UserIcon, UsersIcon, Cog6ToothIcon,  } from '@heroicons/react/24/outline';

const SettingsMenu = () => {

    const navigate = useNavigate();

    function gotoRoute(route) {
      navigate(`/settings/${route}`);
    }

    return (
        <>
            <ul className="menu bg-base-100 w-auto p-2 rounded-box">
                            <li>
                                <a onClick={() => gotoRoute('')}>
                                    <UserIcon className={`h-6 w-6`}/>
                                    <span className='hidden sm:inline'>Profile</span>
                                </a>
                            </li>
                            <li>
                            <a onClick={() => gotoRoute('blockedUsers')}>
                                    <NoSymbolIcon className={`h-6 w-6`}/>
                                    <span className='hidden sm:inline'>Blocked users</span>
                                </a>
                            </li>
                            <li>
                            <a onClick={() => gotoRoute('matchedUsers')}>
                                    <HeartIcon className={`h-6 w-6`}/>
                                    <span className='hidden sm:inline'>Matched users</span>
                                </a>
                            </li>
                            <li>
                            <a onClick={() => gotoRoute('likedUsers')}>
                                    <UsersIcon className={`h-6 w-6`}/>
                                    <span className='hidden sm:inline'>Liked users</span>
                                </a>
                            </li>
                            <li>
                            <a onClick={() => gotoRoute('password')}>
                                    <KeyIcon className={`h-6 w-6`}/>
                                    <span className='hidden sm:inline'>Password</span>
                                </a>
                            </li>
                        </ul>
        </>
    )
}

export default SettingsMenu;