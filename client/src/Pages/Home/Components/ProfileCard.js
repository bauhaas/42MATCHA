import { motion } from "framer-motion"
import useToggle from '../../../Hooks/useToggle';

const transition = {
	duration: 0.5,
	ease: 'linear',
	delay: 0.5
}

const ProfileCard = ({ user }) => {

	return (
		<>
			<div className="rounded-md bg-black group w-full scale-90">
				{
					<>
						<div id='cardRevealed' className="flex flex-col h-full">
							<img className="w-full rounded-t-md" src={user.photos} alt="user" />
							<div className="p-2 grow">
								<p className="text-4xl font-bold text-orange-400">{user.first_name}, {user.age}</p>
								<p className='text-xl font-bold text-orange-400'>Student</p>
								<p className='font-bold text-orange-400 pb-2'>{user.city} - {Math.round(user.distance)}km</p>
								<p className='line-clamp-5 text-justify text-gray-300'>{user.bio}</p>
							</div>
							<div className="flex flex-wrap p-2 gap-2">
								{user.interests.map((interest, index) => {
									if (index >= 4) {
										return null;
									}
									return (
										<span className="bg-orange-300 text-orange-900 rounded-md px-1">{interest}</span>
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

// {/* <motion.div transition={transition} whileHover={{ translateY: '50%'}}   id='cardHidden' className={isToggle ?'absolute rounded-md min-w-full min-h-full  grid ':'hidden'}>
// 							<img src="../bg-profilecard.svg" className="col-start-1 row-start-1 object-cover w-full h-full rounded-md" alt="Hidden Card" />
// 							<div className="col-start-1 row-start-1 self-center justify-self-center text-4xl font-bold group-hover:animate-wiggle">
// 								100%
// 							</div>
// 							<img
// 								className="col-start-1 row-start-1 h-8 w-8 self-end justify-self-center mb-10 group-hover:animate-wiggle"
// 								src="../logo.png"
// 								alt="logo"
// 							/>
// 						</motion.div> */}