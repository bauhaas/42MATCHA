import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import SettingsPageLayout from './SettingsPageLayout';
import SettingsMenu from './SettingsMenu';
import ListUsers from './ListUsers';

import api from '../../../ax';
import { getMatchedUsers } from '../../../api';

const MatchedUsers = () => {

  const currentUser = useSelector((state) => state.user.user);
  const [matchedUsers, setmatchedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const unmatchUser = (event, id) => {
    event.preventDefault();
    console.log('unmatch user', id);
    api.post('http://localhost:3001/relations', {
      sender_id: currentUser.id,
      receiver_id: id,
      type: 'unlike'
    })
      .then(response => {
        console.log(response);
        getMatchedUsers(currentUser.id, setmatchedUsers, setIsLoading);
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    setTimeout(function () {
      getMatchedUsers(currentUser.id, setmatchedUsers, setIsLoading);
      }, 1000);
  }, []);

  return (
    <>
      <SettingsPageLayout>
          <SettingsMenu />
          <ListUsers
          title="Matched Users"
          description="A matched user is able to see your profile and send you messages. Unmatch a user will delete your chat history with him but you are able rematch"
          users={matchedUsers}
          onAction={unmatchUser}
          actionType="Unmatch"
          isLoading={isLoading}
          />

      </SettingsPageLayout>
    </>
  )
}

export default MatchedUsers;