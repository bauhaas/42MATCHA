import ActiveConversations from './ActiveConversations';
import NavBar from './NavBar';

const Profile = () => {

    return (
        <>
            <div className="bg-gray-700 min-h-screen pt-20">
                <NavBar />
                <div className='flex mx-48 py-2 min-h-full rounded-lg bg-slate-600'>

                    <img
                        className="h-32 w-32 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="" />
                    <div className='p-2'>
                        <div className="pb-2">
                            <p className="text-4xl font-bold text-orange-400">John, 28</p>
                            <p className='text-xl font-bold text-orange-400'>Student</p>
                            <p className='font-bold text-orange-400 pb-2'>Paris - 4km</p>
                            <p className='text-justify text-gray-300'>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            <span className="bg-orange-300 text-orange-900 text-sm font-medium py-0.5 rounded-md flex justify-center">food</span>
                            <span className="bg-orange-300 text-orange-900 text-sm font-medium py-0.5 rounded-md flex justify-center">cinema</span>
                            <span className="bg-orange-300 text-orange-900 text-sm font-medium py-0.5 rounded-md flex justify-center">test</span>
                            <span className="bg-orange-300 text-orange-900 text-sm font-medium py-0.5 rounded-md flex justify-center">food</span>
                            <span className="bg-orange-300 text-orange-900 text-sm font-medium py-0.5 rounded-md flex justify-center">cinema</span>
                            <span className="bg-orange-300 text-orange-900 text-sm font-medium py-0.5 rounded-md flex justify-center">test</span>
                        </div>
                    </div>
                </div>
                <ActiveConversations />
            </div>
        </>
    )
}

export default Profile;