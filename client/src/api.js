import api from './ax';

export const blockUserById = async (sender_id, receiver_id) => {
    return api.post('http://localhost:3001/relations', {
        sender_id: sender_id,
        receiver_id: receiver_id,
        type: 'block'
    })
        .then(response => response.data)
        .catch(error => {
            console.log(error);
        });
}

export const likeUserById = async (sender_id, receiver_id) => {
    return api.post('http://localhost:3001/relations', {
        sender_id: sender_id,
        receiver_id: receiver_id,
        type:'like'
    })
        .then(response => response.data)
        .catch(error => {
            console.log(error);
        });
}

export const unlikeUserById = async (sender_id, receiver_id) => {
    return api.post('http://localhost:3001/relations', {
        sender_id: sender_id,
        receiver_id: receiver_id,
        type: 'unlike'
    })
        .then(response => response.data)
        .catch(error => {
            console.log(error);
        });
}

export const getUserById = async (id, visit_id) => {
    try {
        const response = await api.get(`http://localhost:3001/users/${id}/profile/${visit_id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

/////
export const getBlockedUsers = (userId, setUsers, setIsLoading) => {
    api.get(`http://localhost:3001/users/${userId}/blocked`)
      .then(response => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
}

export const getMatchedUsers = (userId, setUsers, setIsLoading) => {
    api.get(`http://localhost:3001/users/${userId}/matched`)
      .then(response => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
}

export const getLikedUsers = (userId, setUsers, setIsLoading) => {
    api.get(`http://localhost:3001/users/${userId}/liked`)
      .then(response => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
}