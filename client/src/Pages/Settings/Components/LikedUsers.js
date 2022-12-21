import NavBar from '../../Navbar/NavBar';
import SettingsMenu from './SettingsMenu';
import SettingsHeader from './SettingsHeader';
import { useEffect, useState } from 'react';
import axios from 'axios';

const LikedUsers = () => {

	const [likeUsers, setLikedUsers] = useState([{ first_name: 'test', last_name: 'test' }, { first_name: 'hardcoded', last_name: 'hardcoded' }]);

	const getLikedUsers = () => {
		console.log('get matched users');

		// axios.get(`http://localhost:3001/block/${currentUser.id}/users`)
		// 	.then(response => {
		// 		setBlockedUsers(response.data);
		// 	})
		// 	.catch(error => {
		// 		console.log(error);
		// 	});
	}

	//unblock a user
	const unlikeUser = (event, id) => {
		event.preventDefault();
		console.log('unlike user', id);
	}

	useEffect(() => {
		getLikedUsers();
	}, []);

	return (
		<>
			<div className="bg-chess-default min-h-screen">
				<NavBar />
				<div className='mx-2 pt-16 h-screen'>
					<SettingsHeader />
					<div className='flex gap-4 mt-2 sm:mx-40'>
						<SettingsMenu />
						<div className='text-white bg-chess-dark p-4 rounded-lg'>
							<span className='font-bold'>Liked Users</span>
							<p className='text-sm py-2 break-words'>
								A liked user is able to see your profile. If a user likes you back but you unliked him, you won't be noticed and will have to like him again.
							</p>
							<div className="pt-2">
								<table className="text-white w-full text-left">
									<tbody>
										{likeUsers.map((user, index) => (
											<tr className="border-b border-chess-bar text-xs">
												<td>
													{user.first_name} {user.last_name}
												</td>
												<td className="text-right">
													<button onClick={(event) => unlikeUser(event, user.blocked_id)}>Unlike</button>
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

export default LikedUsers;