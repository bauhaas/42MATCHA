import axios from 'axios';

export const blockUserById = async (sender_id, receiver_id) => {
    return axios.post('http://localhost:3001/relations', {
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
    return axios.post('http://localhost:3001/relations', {
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
    return axios.post('http://localhost:3001/relations', {
        sender_id: sender_id,
        receiver_id: receiver_id,
        type: 'unlike'
    })
        .then(response => response.data)
        .catch(error => {
            console.log(error);
        });
}

export const getUserById = async (id) => {
    return axios.get(`http://localhost:3001/users/${id}`)
        .then(response => response.data
        )
        .catch(error => {
            console.log(error);
        });
}
