import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLogged } from '../login/loginSlice';
import { useToast } from '@chakra-ui/react';
import { registerAsync } from './registerSlice';

const Register = () => {

    const textStyle = {
        color: '#88AB8E',
        fontFamily: 'Diphylleia, sans-serif'
    }
    const shadowStyle = {
        borderRadius: '10px', outline: 'none', boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
    }
    const [password, setPassword] = useState('')
    const [username, setuserName] = useState('')
    const logged = useAppSelector(selectLogged);
    const dispatch = useAppDispatch()
    const toast = useToast()
    const [forceUpdate, setForceUpdate] = useState(false);

    const registerActions = () => {
        dispatch(registerAsync({ username: username, password: password })).then(res => {
            if ((res.type).includes("register/Register/fulfilled")) {
                toast({
                    title: 'Shift Manager Added.',
                    description: `We've successfully added ${username} to the database.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("register/Register/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'Unable to add data. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            setuserName('')
            setPassword('')
            setForceUpdate(prev => !prev);
        });
    }

    useEffect(() => {
        // This effect will run whenever forceUpdate changes
    }, [forceUpdate]);

    return (
        <div>
            <div className="container mt-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className="row justify-content-center ">
                    {logged ? (
                        <div className="container mt-5">
                            <div className="row justify-content-center ">
                                <div className="col-md-6">
                                    <div className="card bg-transparent">
                                        <div className="card-header">
                                            <h3 className="text-center">Register Shift Manager</h3>
                                        </div>
                                        <div className="card-body ">
                                            <div className="form-group">
                                                <label>Username</label>
                                                <input onChange={(evt) => setuserName(evt.target.value)} className="form-control bg-transparent border-0" placeholder="Enter your username" style={shadowStyle} />
                                            </div>
                                            <div className="form-group ">
                                                <label>Password</label>
                                                <input onChange={(evt) => setPassword(evt.target.value)} type="password" className="form-control bg-transparent border-0" placeholder="Enter your password" style={shadowStyle} />
                                            </div>
                                            <button onClick={() => registerActions()} className="btn btn-dark btn-block">Register</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) :
                        <h5 className="mt-3 text-center" style={textStyle}>You must enter your credentials to enter the management board.</h5>
                    }
                </div>
            </div></div>
    )
}

export default Register