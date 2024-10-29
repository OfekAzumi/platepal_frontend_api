import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectStatus } from './loginSlice'

const NotLogged = () => {
    const status = useAppSelector(selectStatus)

    return (
        <div className="col-md-6 text-center">
            <h3 className="text-danger">Not Logged In</h3>
            <div className="row">
                <div className="col-md-12">
                    {status == 'idle' ?
                        <div className="alert alert-danger" role="alert" >
                            You must enter your credentials to enter the website.
                        </div>
                        :
                        <div className="alert alert-danger" role="alert" >
                            {status}
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default NotLogged