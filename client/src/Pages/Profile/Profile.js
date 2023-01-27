import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ProfileDetails from './Components/ProfileDetails';
import NavBar from '../Navbar/NavBar';

const Profile = () => {
    const location = useLocation();
    const { id } = useParams();

    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    useEffect(() => {
        if (token)
            localStorage.setItem('jwt', token);
    }, [token]);

    return (
        <>
            <div className="bg-chess-default min-h-screen overflow-y-auto">
                        <>
                            <NavBar />
                            <ProfileDetails id={id}/>
                        </>
            </div>
        </>
    )
}

export default Profile;