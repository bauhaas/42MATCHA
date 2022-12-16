import { useNavigate} from 'react-router-dom';

const Unknown = () => {
    let navigate = useNavigate();

    const handleNavToHome = (event) => {
      event.preventDefault();
      navigate("/Home");
    }

    const handleNavToProfile = (event) => {
      event.preventDefault();
      navigate("/Profile");
    }

    return(
        <>
          <div className="h-screen bg-gray-500 flex flex-col items-center justify-center text-center ">
              <h1 className='text-2xl font-bold'>Whoops</h1>
              <div>Looks like this page doesn't want to match with you</div>
              <div className='text-sm font-small'>Go back to  <a href="/home" onClick={handleNavToHome} className="text-blue-600 dark:text-blue-500 hover:underline">find your love</a> or <a href="/profile" onClick={handleNavToProfile} className="text-blue-600 dark:text-blue-500 hover:underline">update your profile</a></div>
          </div>
        </>
    )
}

export default Unknown;