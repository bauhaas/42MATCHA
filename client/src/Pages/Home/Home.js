import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import CardsMap from './Components/CardsMap';
import NavBar from '../Navbar/NavBar';

const Home = () => {
	const user = useSelector((state) => state.user.user);

	return(
		<>
			<div className="bg-chess-default min-h-screen">
				<NavBar/>
				<CardsMap/>

			</div>
		</>
	)
}

export default Home;