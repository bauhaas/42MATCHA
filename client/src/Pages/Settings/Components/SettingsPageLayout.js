import SettingsHeader from './SettingsHeader';
import NavBar from '../../Navbar/NavBar';
import CustomAlert  from '../../../SharedComponents/CustomAlert';

const SettingsPageLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen overflow-y-auto bg-chess-default">
            <NavBar />
            <CustomAlert />
            <div className='h-screen pt-16 mx-2'>
                <SettingsHeader />
                <div className='flex gap-4 mt-2'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SettingsPageLayout;