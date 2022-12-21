import NavBar from '../Navbar/NavBar';
import { useLocation } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import InitProfile from './Components/InitProfile';
import { useState, useEffect } from 'react';
import ProfileDetails from './Components/ProfileDetails';
import {  useParams } from 'react-router-dom';

const Profile = () => {

    // Save the token receive from email
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const { id } = useParams();

    const [userId, setUserId] = useState();
    useEffect(() => {
        // Use the token value in your component
        if (token) {
            //store it in localstorage to allow future api calls
            localStorage.setItem('jwt', token);

            //log to check
            const user = jwt_decode(token);
            setUserId(user.id);
        }
    }, [token]);



    return (
        <>
            <div className="bg-chess-default min-h-screen">
                {
                token ?
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