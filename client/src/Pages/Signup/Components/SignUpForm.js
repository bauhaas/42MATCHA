import React, { useState } from "react"
import useValidator from '../../../Hooks/useValidator';
import useToggle from '../../../Hooks/useToggle';
import axios from 'axios';

const SignUpForm = (setHasSignedUP) => {

    const [isErrorToggle, setErrorToggle] = useToggle(false);
    const [error, setError] = useState([])
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const addUser = () => {
        axios.post('http://localhost:3001/users', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })
            .then(response => {
                console.log(response);
                setHasSignedUP(true);
            })
            .catch(error => {
                setErrorToggle(true);
                setError([error.response.status, error.response.data]);
                console.log(error);
            });
    }

    return (
        <>
            <div>did sign up</div>
        </>
    );
}

export default SignUpForm;