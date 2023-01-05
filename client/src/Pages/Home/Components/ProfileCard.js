import { useNavigate } from 'react-router-dom';
import { AiFillFire } from 'react-icons/ai';

const ProfileCard = ({ user }) => {

	const navigate = useNavigate();

	const gotoprofile = (event) => {
		event.preventDefault();
		navigate(`/profile/${user.id}`);
	}

	return (
		<>
			<div onClick={gotoprofile} className="rounded-md bg-chess-hover hover:bg-chess-dark group w-full scale-90">
				{
					<>
						<div id='cardRevealed' className="flex flex-col h-full">
							<img className="w-full min-h-1/2 max-h-1/2 rounded-t-md" src={user.seed_profile_avatar} alt="user" />
							<div className="p-2 grow">
								<div className="flex flex-row items-center w-full">
									<p className="text-4xl font-bold text-orange-400">{user.first_name}, {user.age}</p>
									<div className='relative ml-auto mb-10 mr-10'>
										<AiFillFire className='absolute w-12 h-12 text-center text-red-600'>{" "}</AiFillFire>
										<p className='absolute ml-4 mt-4 text-white'>{user.fame_rating}</p>
									</div>
								</div>
								<p className='text-xl font-bold text-orange-400'>{user.job}</p>
								<p className='font-bold text-orange-400 pb-2'>{user.city} - {Math.round(user.distance)}km</p>
								<p className='line-clamp-5 text-justify text-gray-300'>{user.bio}</p>
							</div>
							<div className="flex flex-wrap p-2 gap-2">
								{user.interests.map((interest, index) => {
									if (index >= 4) {
										return null;
									}
										return (
										<span key={interest + index} className="bg-orange-300 text-chess-default rounded-lg p-1">{interest}</span>
									);
								})}
							</div>
						</div>
					</>
				}
			</div>
		</>
	)
}

export default ProfileCard;