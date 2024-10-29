import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectLogged, selectUserName } from './loginSlice'

const LoggedIn = () => {

    const username = useAppSelector(selectUserName);
    const logged = useAppSelector(selectLogged);

    const capitalizeFirstLetter = (name: string) => {
        return (name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    }
    return (
        <div className="col-md-6 text-center">
            <h3 className="text-success">Welcome Back {capitalizeFirstLetter(username)}!</h3>
            <div className="row">
                <div className="col-md-12">
                    <div className="alert alert-success" role="alert">
                        We are happy to welcome you to our site.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoggedIn 