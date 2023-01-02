import NavBar from '../../Navbar/NavBar';
import SettingsMenu from './SettingsMenu';
import SettingsHeader from './SettingsHeader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const LikedUsers = () => {

	const [likedUsers, setLikedUsers] = useState([]);
	const currentUser = useSelector((state) => state.user.user);

	const getLikedUsers = () => {
		console.log(currentUser.id);
		axios.get(`http://localhost:3001/users/${currentUser.id}/liked`)
			.then(response => {
				console.log(response.data);
				setLikedUsers(response.data);
			})
			.catch(error => {
				console.log(error);
			});
	}

	//unlike a user
	const unlikeUser = (event, id) => {
		event.preventDefault();
		console.log('unlike user', id);
		axios.post('http://localhost:3001/relations/', {
				sender_id: currentUser.id,
				receiver_id: id,
				type:'unlike'
		})
			.then(response => {
				console.log(response);
				getLikedUsers();
			})
			.catch(error => {
				console.log(error);
			});
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
										{likedUsers.map((user, index) => (
											<tr className="border-b border-chess-bar text-xs">
												<td>
													{user.first_name} {user.last_name}
												</td>
												<td className="text-right">
													<button onClick={(event) => unlikeUser(event, user.id)}>Unlike</button>
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