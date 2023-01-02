import NavBar from '../../Navbar/NavBar';
import SettingsMenu from './SettingsMenu';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SettingsHeader from './SettingsHeader';
import { useSelector } from 'react-redux';
import SettingsLayout from './SettingsLayout';

const BlockedUsers = () => {

	const [blockedUsers, setBlockedUsers] = useState([]);
	const currentUser = useSelector((state) => state.user.user);

	//unblock a user
	const unblockUser = (event, id) => {
		event.preventDefault();
		console.log('unblock user', id);
		axios.delete('http://localhost:3001/relations', {
			data:{
				sender_id: currentUser.id,
				receiver_id: id,
				type: 'block'
			}

		  })
		.then(response => {
			console.log(response);
			getBlockedUsers();
		})
		.catch(error => {
			console.log(error);
		});
	}

	const getBlockedUsers = () => {
		console.log(currentUser.id);
		axios.get(`http://localhost:3001/users/${currentUser.id}/blocked`)
            .then(response => {
				console.log(response.data);
				setBlockedUsers(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

	useEffect(() => {
			console.log('get blocked users');
			getBlockedUsers();
	  }, []);

	console.log(blockedUsers);

	return (
		<>
			<div className="bg-chess-default min-h-screen overflow-y-auto">
				<NavBar/>
				<div className='mx-2 pt-16 h-screen'>
					<SettingsHeader />
					<div className='flex gap-4 mt-2'>
						<SettingsMenu/>
						<div className='text-white bg-chess-dark p-4 rounded-lg max-w-3xl'>
							<span className='font-bold'>Blocked Users</span>
							<p className='text-sm py-2 break-words'>
								A blocked user will not see your profile appear in their searches, or be able to send you messages. Blocking a user will delete your chat history with them
							</p>
							<div className='flex gap-2 w-full'>
								<input className={`grow rounded-lg focus:outline-none max-w-xs px-2 text-sm bg-chess-placeholder placeholder-chess-place-text text-chess-place-text`} type="text" placeholder="search..." />
								<button className="btn btn-xs bg-chess-button btn-disabled text-white">
									block
								</button>
							</div>
							<div className="pt-2">
								<table className="text-white w-full text-left">
									<tbody>
									{blockedUsers.map((user, index) => (
										<tr className="border-b border-chess-bar text-xs">
											<td>
												{user.first_name} {user.last_name}
											</td>
											<td className="text-right">
												<button onClick={(event) => unblockUser(event, user.id)}>Unblock</button>
											</td>
										</tr>
									))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default BlockedUsers;