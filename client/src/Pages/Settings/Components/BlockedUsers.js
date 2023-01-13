import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import SettingsPageLayout from './SettingsPageLayout';
import SettingsMenu from './SettingsMenu';
import ListUsers from './ListUsers';

import api from '../../../ax';
import { getBlockedUsers } from '../../../api';

const BlockedUsers = () => {

  const currentUser = useSelector((state) => state.user.user);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const unblockUser = (event, id) => {
    event.preventDefault();
    console.log('unblock user', id);
    api.delete('http://localhost:3001/relations', {
    data:{
        sender_id: currentUser.id,
        receiver_id: id,
        type: 'block'
      }
    })
  .then(response => {
    getBlockedUsers(currentUser.id, setBlockedUsers, setIsLoading);
  })
  .catch(error => {
    console.log(error);
  });
  }

  useEffect(() => {
    setTimeout(function () {
      getBlockedUsers(currentUser.id, setBlockedUsers, setIsLoading);
    }, 1000);
  }, []);

  return (
    <>
      <SettingsPageLayout>
      <SettingsMenu />
        <ListUsers
        title="Blocked Users"
        description="A blocked user will not see your profile appear in their searches, or be able to send you messages. Blocking a user will delete your chat history with them"
        users={blockedUsers}
        onAction={unblockUser}
        actionType="Unblock"
        isLoading={isLoading}
        />
      </SettingsPageLayout>
    </>
    )
}

export default BlockedUsers;