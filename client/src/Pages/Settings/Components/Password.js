import NavBar from '../../Navbar/NavBar';
import SettingsMenu from './SettingsMenu';
import { EyeIcon } from '@heroicons/react/24/outline';
// import axios from 'axios';
import { useState } from 'react';
import SettingsHeader from './SettingsHeader';
import api from '../../../ax';
import { useSelector } from 'react-redux';
import SettingsPageLayout from './SettingsPageLayout';
import useValidator from '../../../Hooks/useValidator';

const Password = () => {

    const [emailSent, setEmailSent] = useState(false);
    const [pin, setPIN] = useState(0);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [isRevealed, setIsRevealed] = useState(false);
    const toggleReveal = () => setIsRevealed(!isRevealed);

    const [isRevealedConfirm, setIsRevealedConfirm] = useState(false);
    const toggleRevealConfirm = () => setIsRevealedConfirm(!isRevealedConfirm);
    const [invalidFields, setInvalidFields] = useState([]);

    const [validator, showValidationMessage] = useValidator(null,
        {
            match: {
                rule: () => {
                    return password === passwordConfirm;
                },
            },
            minNum: {
                rule: () => {
                    return password.replace(/[^0-9]/g,"").length > 0;
                },
            }
        });

    const user = useSelector((state) => state.user.user);

    const resetPassword = () => {
        console.log('sne pin clicked');
        api.put(`http://localhost:3001/users/sendPin`, {
            currentPassword: currentPassword,
            id: user.id
        })
            .then(response => {
                console.log(response);
                setEmailSent(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const changePassword = () => {
        console.log('validate new password clicked');
        api.put(`http://localhost:3001/users/pin`, {
            pin: Number(pin),
            newPassword: password,
            id: user.id
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
            
    }

    const validateNewPassword = (event) => {
        console.log('validate new password clicked');
        event.preventDefault();
        if (validator.allValid()) {
            console.log("form is valid");
            changePassword();
        } else {
            const invalidFieldsSet = new Set(invalidFields);
            (!validator.check(password, "required|match|min:12|minNum")) ? invalidFieldsSet.add('password') : invalidFieldsSet.delete('password');
            (!validator.check(passwordConfirm, "required|match")) ? invalidFieldsSet.add('passwordConfirm') : invalidFieldsSet.delete('passwordConfirm');
        
            console.log("invalidFieldsSet", invalidFieldsSet);
            showValidationMessage(true);
            setInvalidFields(Array.from(invalidFieldsSet));
        }
    }
    console.log(invalidFields)
	return (
		<>
            <SettingsPageLayout>
						<SettingsMenu/>
                        <div className=' text-white bg-chess-dark p-4 rounded-lg w-full max-w-3xl flex flex-col'>
							<span className='font-bold'>Change password</span>
                            <div className='flex flex-col w-3/4 h-full'>
                                {emailSent === false ?
                                <div>
                                    <div className='mt-2 flex flex-col sm:flex-row  sm:justify-between mb-2'>
                                        <label className="text-white text-sm self-start">
                                            Current password
                                        </label>
                                        <div className='pl-2 bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                            <input className="w-full bg-transparent text-white focus:outline-none focus:shadow-outline" id="currentPass"
                                                type='password'
                                                value={currentPassword}
                                                onChange={(event) => setCurrentPassword(event.target.value)} />
                                        </div>
                                    </div>
                                    <button onClick={resetPassword}  className={`btn btn-sm mt-auto rounded-md w-fit bg-green-600 hover:bg-green-500 ${ currentPassword <= 0 ? 'btn-disabled': ''}`}>Change password</button>
                                </div>
                                :
                                <div>
                                    <div className='flex flex-col mb-2 sm:flex-row sm:justify-between'>
                                            <label className={`block ${invalidFields.includes('password') ? "text-red-500" : "text-white-700"} text-sm font-bold self-start mb-1`}>
                                                New password
                                                <span className="text-red-500 font-normal inline-block pl-1">{validator.message("password", password, "required|match|min:12|minNum", {
                                                    messages: {
                                                        required: " is required",
                                                        match: "doesn't match",
                                                        min: " too short, at least 12 characters",
                                                        minNum: " need at least one number"
                                                    },
                                                })}</span>
                                            </label>
                                        <div className='bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                            <input id="password"
                                                className={`w-full pl-2 bg-transparent rounded-sm focus:outline-none focus:shadow-outline ${invalidFields.includes('password') ? " text-red-500 border-red-500" : "text-white-700"} mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                                                type={isRevealed ? 'text' : 'password'}
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)} />
                                            <button onClick={toggleReveal}>
                                                <EyeIcon onClick={toggleReveal}  className={`h-6 w-6 p-1 text-chess-place-text hover:text-white`}/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex flex-col mb-2 sm:flex-row sm:justify-between'>
                                            <label className={`block ${invalidFields.includes('passwordConfirm') ? "text-red-500" : "text-white-700"} text-sm font-bold self-start mb-1`}>
                                                Confirm new password
                                                <span className="text-red-500 font-normal inline-block pl-1">{validator.message("passwordConfirm", passwordConfirm, "required|match", {
                                                    messages: {
                                                        required: " is required",
                                                        match: "doesn't match"
                                                    },
                                                })}</span>
                                            </label>
                                            <div className='bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                                <input id="passwordConfirm"
                                                    className={`w-full pl-2 bg-transparent rounded-sm focus:outline-none focus:shadow-outline ${invalidFields.includes('passwordConfirm') ? "text-red-500 border-red-500" : "text-white-700"} mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                                                    type={isRevealedConfirm ? 'text' : 'password'}
                                                    value={passwordConfirm}
                                                    onChange={(event) => setPasswordConfirm(event.target.value)} />
                                                <button onClick={toggleRevealConfirm}>
                                                    <EyeIcon className={`h-6 w-6 p-1 text-chess-place-text hover:text-white`}/>
                                                </button>
                                            </div>
                                    </div>
                                    <div className='flex flex-col sm:flex-row sm:justify-between'>
                                            <label className="text-white text-sm self-start">
                                                Pin sent to your email
                                            </label>
                                            <div className='bg-chess-placeholder flex flex-row rounded-sm sm:w-64'>
                                                <input className="w-full pl-2 bg-transparent text-white rounded-sm focus:outline-none focus:shadow-outline" id="passwordConfirm"
                                                    type={'text'}
                                                    value={pin}
                                                    input={'number'}
                                                    onChange={(event) => setPIN(event.target.value)} />
                                            </div>
                                    </div>
                                    <button onClick={validateNewPassword}  className={`btn btn-sm mt-auto rounded-md w-fit bg-green-600 hover:bg-green-500 `}>Change password</button>
                                </div>}
                            </div>
                        </div>
            </SettingsPageLayout>
		</>
	)
}

export default Password;