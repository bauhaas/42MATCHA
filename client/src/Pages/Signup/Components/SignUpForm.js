import React, { useContext, useState } from "react"
import useValidator from '../../../Hooks/useValidator';
import api from "../../../ax";
import position from '../../../Context/position'

import { setUser } from "../../../userSlice";
import { useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router-dom';
import { ErrorContext } from "../../../Context/error";

const SignUpForm = ({email, setEmail, setHasSignedUP}) => {

    const { setError, setShowError } = useContext(ErrorContext);

    let navigate = useNavigate();

    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
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

    //TODO should return user, not token
    const addUser = () => {
        api.post('http://localhost:3001/users', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            longitude: position.longitude,
            latitude: position.latitude,
        })
            .then(response => {
                setHasSignedUP(true);
                return ;
            })
            .catch(error => {
                setShowError(true);
                setError([error.response.status, error.response.data]);
            });
    }

    const handleSignInClick = (event) => {
        event.preventDefault();
        navigate("/signin");
    }

    const handleSignUpClick = (event) => {
        event.preventDefault();
        if (validator.allValid()) {
            addUser();
        } else {
            const invalidFieldsSet = new Set(invalidFields);
            (!validator.check(firstName, "required|alpha|max:15")) ? invalidFieldsSet.add('firstName') : invalidFieldsSet.delete('firstName');
            (!validator.check(lastName, "required|alpha|max:15")) ? invalidFieldsSet.add('lastName') : invalidFieldsSet.delete('lastName');
            (!validator.check(email, "required|email")) ? invalidFieldsSet.add('email') : invalidFieldsSet.delete('email');
            (!validator.check(password, "required|match|min:12|minNum")) ? invalidFieldsSet.add('password') : invalidFieldsSet.delete('password');
            (!validator.check(passwordConfirm, "required|match")) ? invalidFieldsSet.add('passwordConfirm') : invalidFieldsSet.delete('passwordConfirm');

            showValidationMessage(true);
            setInvalidFields(Array.from(invalidFieldsSet));
            return ;
        }
    }

    return (
        <>
            <h1 className="self-start mb-2 text-2xl font-bold">Create your account</h1>
            <label className={`block ${invalidFields.includes('firstName') ? "text-red-500" : "text-gray-700"} text-sm font-bold self-start mb-1`}>
                First name
                <span className="inline-block pl-1 font-normal text-red-500">
                    {validator.message("firstName", firstName, "required|alpha|max:15", {
                        messages: {
                            required: " is required",
                            alpha: " isn't valid",
                            max: " too long"
                        }
                    })}</span>
            </label>
            <input className={`${invalidFields.includes('firstName') ? "text-red-500 border-red-500" : "text-gray-700"} shadow appearance-none border rounded w-full mb-4 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`} id="firstname" type="text" placeholder="John"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)} />

            <label className={`block ${invalidFields.includes('lastName') ? "text-red-500" : "text-gray-700"} text-sm font-bold self-start mb-1`}>
                Last Name
                <span className="inline-block pl-1 font-normal text-red-500">{validator.message("lastName", lastName, "required|alpha|max:15", {
                    messages: {
                        required: " is required",
                        alpha: " isn't valid",
                        max: "too long"
                    }
                })}</span>
            </label>
            <input className={`shadow appearance-none border rounded w-full mb-4 py-2 px-3 ${invalidFields.includes('lastName') ? " text-red-500 border-red-500" : "text-gray-700"} leading-tight focus:outline-none focus:shadow-outline`} id="lastname" type="text" placeholder="Doe"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)} />

            <label className={`block ${invalidFields.includes('email') ? "text-red-500 border-red-500" : "text-gray-700"} text-sm font-bold self-start mb-1`}>
                Email address
                <span className="inline-block pl-1 font-normal text-red-500">{validator.message("email", email, "required|email", {
                    messages: {
                        required: " is required",
                        email: ' isn\'t valid'
                    }
                })}</span>
            </label>
            <input className={`shadow appearance-none border rounded w-full mb-4 py-2 px-3 ${invalidFields.includes('email') ? "text-red-500 border-red-500" : "text-gray-700"} leading-tight focus:outline-none focus:shadow-outline`} id="email" type="text" placeholder="john.doe@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)} />
            <form className="text-sm font-bold self-start mb-1 block w-full">
                <label className={`${invalidFields.includes('password') ? " text-red-500" : "text-gray-700"}`}>
                    Password
                    <span className="text-red-500 font-normal inline-block pl-1">{validator.message("password", password, "required|match|min:12|minNum", {
                        messages: {
                            required: " is required",
                            match: "doesn't match",
                            min: " too short, at least 12 characters",
                            minNum: " need at least one number"
                        },
                    })}</span>
                </label>
                <input className={`shadow appearance-none border rounded w-full py-2 px-3 ${invalidFields.includes('password') ? " text-red-500 border-red-500" : "text-gray-700"} mb-3 leading-tight focus:outline-none focus:shadow-outline`} id="password" type="password" placeholder="***********" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="off"/>

                <label className={`${invalidFields.includes('passwordConfirm') ? "text-red-500" : "text-gray-700"}`}>
                    Password confirmation
                    <span className="inline-block pl-1 font-normal text-red-500">{validator.message("passwordConfirm", passwordConfirm, "required|match", {
                        messages: {
                            required: " is required",
                            match: "doesn't match"
                        },
                    })}</span>
                </label>
                <input className={`shadow appearance-none border rounded w-full py-2 px-3 ${invalidFields.includes('passwordConfirm') ? "text-red-500 border-red-500" : "text-gray-700"} mb-3 leading-tight focus:outline-none focus:shadow-outline`} id="passwordConfirm" type="password" placeholder="***********" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} autoComplete="off" />
            </form>

            <button onClick={handleSignUpClick} className="items-center justify-center w-full h-10 gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none">
                <span>Sign up</span>
            </button>
            <label className="mt-2 self-start text-sm font-small text-gray-900 dark:text-gray-300">Already registered ? <a href="/signin" onClick={handleSignInClick} className="text-blue-600 dark:text-blue-500 hover:underline">Sign in</a></label>

        </>
    );
}

export default SignUpForm;