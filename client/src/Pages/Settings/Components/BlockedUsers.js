import NavBar from '../../Navbar/NavBar';
import SettingsMenu from './SettingsMenu';
import { Cog6ToothIcon,  } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';

const BlockedUsers = () => {

	const [blockedUsers, setBlockedUsers] = useState([]);


	//block a user
	const blockUser = () => {
        var randomNumber = Math.floor(Math.random() * 20) + 1;
        axios.post('http://localhost:3001/block', {
            blocker_id: 1,
            blocked_id: randomNumber
        })
            .then(response => {
                console.log(response);
				getBlockedUsers();
            })
            .catch(error => {
                console.log(error);
            });
    }

	//unblock a user
	const unblockUser = (event, id) => {
		event.preventDefault();
		console.log('unblock user', id);
		axios.delete('http://localhost:3001/block', {
			data: {
			  blocker_id: 1,
			  blocked_id: id
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
		const myId = 1;
		axios.get(`http://localhost:3001/block/${myId}/users`)
            .then(response => {
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
					<div className='flex items-center gap-2 p-2 text-white font-bold text-2xl sm:mx-40'>
						<Cog6ToothIcon className={`h-6 w-6`}/>
						<span>Settings</span>
					</div>
					<div className='flex gap-4 mt-2 sm:mx-40'>
						<SettingsMenu/>
						<div className='text-white bg-chess-dark p-4 rounded-lg'>
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
												<button onClick={(event) => unblockUser(event, user.blocked_id)}>Unblock</button>
											</td>
										</tr>
									))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div className='absolute bottom-0'>
                    	<div className='text-red-600 text-center'>TMP TEST</div>
                    	<button onClick={() => blockUser()} className='btn btn-sm bg-red-600'>block random user</button>
                	</div>
				</div>
			</div>
		</>
	)
}

export default BlockedUsers;