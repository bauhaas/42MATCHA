import ProfileCard from './ProfileCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CardsMap = () => {
    const [users, setUsers] = useState([]);

    // Fetch the users data from the backend when the component mounts
    useEffect(() => {
        axios.get('http://localhost:3001/users')
            .then(response => {
                // Set the users state variable to the data from the response
                setUsers(response.data);
            })
            .catch(error => {
                // Handle any errors that occurred while fetching the data
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