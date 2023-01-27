import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import jwt_decode from "jwt-decode";
import InitProfile from './Components/InitProfile';

const Activation = () => {
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const [user, setUser] = useState();

    useEffect(() => {
        if (token) {
            localStorage.setItem('jwt', token);
            const user = jwt_decode(token);
            setUser(user);
        }
    }, [token]);


    return (
        <>
            <div className="bg-chess-default min-h-screen overflow-y-auto">
                <InitProfile user={user} />
            </div>
        </>
    )
}

export default Activation;