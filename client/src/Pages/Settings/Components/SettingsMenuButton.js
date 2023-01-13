import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SettingsMenuButton = ({buttonText, route, icon}) => {

    const navigate = useNavigate();
    const [active, setActive] = useState('?');

    function gotoRoute(route) {
        navigate(`/settings/${route}`);
    }

    useEffect(() => {
        const path = window.top.location.pathname;
        const lastpart = path.substring(path.lastIndexOf('/') + 1);
        setActive(lastpart)
    }, [active]);

    return (
        <>
            <li key={buttonText} className='text-xs font-bold border-b-2 hover:text-white hover:bg-chess-hover border-chess-default'>
                <button onClick={() => gotoRoute(route)} className={`active:bg-chess-hover ${active === route ? 'bg-chess-hover text-white' : null}`}>
                    {icon}
                    <span className='hidden sm:inline'>{buttonText}</span>
                </button>
            </li>
        </>
    )
}

export default SettingsMenuButton;