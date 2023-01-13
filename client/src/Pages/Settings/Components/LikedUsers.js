import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import SettingsPageLayout from './SettingsPageLayout';
import SettingsMenu from './SettingsMenu';
import ListUsers from './ListUsers';

import api from '../../../ax';
import { getLikedUsers } from '../../../api';

const LikedUsers = () => {

  const currentUser = useSelector((state) => state.user.user);
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const unlikeUser = (event, id) => {
    event.preventDefault();
    api.post('http://localhost:3001/relations/', {
        sender_id: currentUser.id,
        receiver_id: id,
        type:'unlike'
    })
      .then(response => {
        getLikedUsers(currentUser.id, setLikedUsers, setIsLoading);
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    setTimeout(function () {
      getLikedUsers(currentUser.id, setLikedUsers, setIsLoading);
    }, 1000);
  }, []);

  return (
    <>
      <SettingsPageLayout>
        <SettingsMenu />
        <ListUsers
        title="Liked Users"
        description="A liked user is able to see your profile. If a user likes you back but you unliked him, you won't be noticed and will have to like him again."
        users={likedUsers}
        onAction={unlikeUser}
        actionType="Unlike"
        isLoading={isLoading}
        />
      </SettingsPageLayout>
    </>
  )
}

export default LikedUsers;