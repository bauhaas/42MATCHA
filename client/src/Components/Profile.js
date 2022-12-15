import ActiveConversations from './ActiveConversations';
import NavBar from './NavBar';

const Profile = () => {

    return (
        <>
            <div className="bg-gray-700 min-h-screen">
                <NavBar />
                <div className='text-white text-2xl mt-16'>Profile page</div>
                <ActiveConversations />
            </div>
        </>
    )
}

export default Profile;