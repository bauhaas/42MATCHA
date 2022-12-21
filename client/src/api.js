import axios from 'axios';

export const blockUser =(blocker_id, blocked_id) => {
    axios.post('http://localhost:3001/block', {
        blocker_id: blocker_id,
        blocked_id: blocker_id
    })
        .then(response => {
            console.log(response);
        })
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