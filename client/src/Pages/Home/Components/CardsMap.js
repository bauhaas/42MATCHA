import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';

import ProfileCard from './ProfileCard';

const CardsMap = () => {
    const [users, setUsers] = useState([]);
	const user = useSelector((state) => state.user.user);

    useEffect(() => {
        axios.get(`http://localhost:3001/users/${user.id}/bachelors`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <>
            <div className='mt-16'>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {users.map((user, index) => (
                        <li key={user + index} id={user + index} className="scale-90">
                            <ProfileCard user={user} />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default CardsMap;