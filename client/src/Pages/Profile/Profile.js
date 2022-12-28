import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import jwt_decode from "jwt-decode";

import ProfileDetails from './Components/ProfileDetails';
import InitProfile from './Components/InitProfile';
import NavBar from '../Navbar/NavBar';

const Profile = () => {
    const location = useLocation();
    const { id } = useParams();

    const params = new URLSearchParams(location.search);
    const token = params.get('token');


    const [userId, setUserId] = useState();
    useEffect(() => {
        if (token) {
            localStorage.setItem('jwt', token);
            const user = jwt_decode(token);
            setUserId(user.id);
        }
    }, [token]);

    return (
        <>
            <div className="bg-chess-default min-h-screen">
                {
                    token
                    ?
                        <InitProfile userId={userId}/>
                    :
                        <div>
                            <NavBar />
                            <ProfileDetails id={id}/>
                        </div>
                }

            </div>
        </>
    )
}

export default Profile;