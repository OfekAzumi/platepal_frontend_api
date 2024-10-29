import React from 'react'
import { Outlet } from 'react-router-dom'
import ManagersNavBar from './ManagersNavBar'

const Managment = () => {
    return (
        <div>
            <ManagersNavBar />
            <Outlet />
        </div>
    )
}

export default Managment