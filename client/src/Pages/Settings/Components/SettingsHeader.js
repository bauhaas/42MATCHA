import { Cog6ToothIcon, } from '@heroicons/react/24/outline';

const SettingsHeader = () => {

    return (
        <>
            <div className='flex items-center gap-2 p-2 text-white font-bold text-2xl sm:mx-40'>
                <Cog6ToothIcon className={`h-6 w-6`} />
                <span>Settings</span>
            </div>
        </>
    )
}

export default SettingsHeader;