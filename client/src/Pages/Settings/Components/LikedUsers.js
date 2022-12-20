import NavBar from '../../Navbar/NavBar';
import SettingsMenu from './SettingsMenu';
import { Cog6ToothIcon,  } from '@heroicons/react/24/outline';

const LikedUsers = () => {

    return (
        <>
            <div className="bg-gray-700 min-h-screen">
                <NavBar/>
                <div className='mx-2 pt-16 h-screen'>
                    <div className='flex items-center text-white font-bold text-2xl'>
                        <Cog6ToothIcon className={`h-6 w-6 align-middle`}/>
                        <span className="align-middle">Settings</span>
                    </div>
                    <div className='flex gap-4'>
                        <SettingsMenu/>
                        <div className='bg-red-400 grow rounded-lg'>
                           likedusers
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LikedUsers;