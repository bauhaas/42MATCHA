
import CardsMap from './Components/CardsMap';
import NavBar from '../Navbar/NavBar';

const Home = () => {
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