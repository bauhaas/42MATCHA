import axios from 'axios';

const WaitEmailConfirmation = ({email, setError, setErrorToggle}) => {
    const handleResendEmail = () => {
        axios.post('http://localhost:3001/users/sendSignupEmail', {
            email: email
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
                setErrorToggle(true);
                setError([error.response.status, error.response.data]);
            });
    }

    return(
    <>
            <img className="w-1/5" src='../logo.png' alt='logo' />
            <h1 className="text-3xl font-bold">Confirm your email</h1>
            <br/>
            <p className="text-xl font-bold">Thanks for joining Matcha !</p>
            <p>We have sent you an email at:</p>
            <br />
            <p className="font-bold">{email}</p>
            <br />
            <p className="text-center">Please confirm your email address by clicking the link you received.</p>
            <br />
            <p className="text-sm">You didn't receive an email from us ?</p>
            <button onClick={handleResendEmail} className="h-10 w-full items-center justify-center gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none">
                <span>Resend Email</span>
            </button>
    </>
    );
}

export default WaitEmailConfirmation;