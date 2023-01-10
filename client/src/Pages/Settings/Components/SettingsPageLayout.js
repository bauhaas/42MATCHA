import SettingsHeader from './SettingsHeader';
import NavBar from '../../Navbar/NavBar';

const SettingsPageLayout = ({ children }) => {

    console.log('settings pqge lqyout');

    return (
        <div className="bg-chess-default min-h-screen overflow-y-auto">
            <NavBar />
            <div className='mx-2 pt-16 h-screen'>
                <SettingsHeader />
                <div className='flex gap-4 mt-2'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SettingsPageLayout;