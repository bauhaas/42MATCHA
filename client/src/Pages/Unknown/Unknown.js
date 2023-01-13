import { useNavigate} from 'react-router-dom';

const Unknown = () => {
    let navigate = useNavigate();

    const handleNavToHome = (event) => {
      event.preventDefault();
      navigate("/Home");
    }

    const handleNavToProfile = (event) => {
      event.preventDefault();
      navigate("/Settings");
    }

    return(
        <>
          <div className="flex flex-col items-center justify-center h-screen text-center bg-chess-default ">
              <h1 className='text-2xl font-bold text-white'>Whoops</h1>
              <p className='text-white'>Looks like this page doesn't want to match with you</p>
              <div className='text-sm text-white font-small'>Go back to  <a href="/home" onClick={handleNavToHome} className="text-blue-600 dark:text-blue-500 hover:underline">find your love</a> or <a href="/settings" onClick={handleNavToProfile} className="text-blue-600 dark:text-blue-500 hover:underline">update your profile</a></div>
          </div>
        </>
    )
}

export default Unknown;