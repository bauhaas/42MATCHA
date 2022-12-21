import { NoSymbolIcon, KeyIcon, HeartIcon, UserIcon, UsersIcon} from '@heroicons/react/24/outline';
import SettingsMenuButton from './SettingsMenuButton';

const SettingsMenu = () => {
    return (
        <>
            <ul className="menu bg-chess-dark min-w-fit h-fit text-chess-bar rounded-lg">
                <SettingsMenuButton buttonText={'Profile'} route={''} icon={<UserIcon className="h-6 w-6" />} />
                <SettingsMenuButton buttonText={'Blocked users'} route={'blockedUsers'} icon={<NoSymbolIcon className="h-6 w-6" />} />
                <SettingsMenuButton buttonText={'Matched users'} route={'matchedUsers'} icon={<HeartIcon className="h-6 w-6" />} />
                <SettingsMenuButton buttonText={'Liked users'} route={'likedUsers'} icon={<UsersIcon className="h-6 w-6" />} />
                <SettingsMenuButton buttonText={'Password'} route={'password'} icon={<KeyIcon className="h-6 w-6" />}/>
            </ul>
        </>
    )
}

export default SettingsMenu;