import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logOut, loginAsync, selectLogged } from './loginSlice'
import LoggedIn from './LoggedIn'
import NotLogged from './NotLogged'
import { getCategoriesAsync } from '../category/categorySlice'
import { getEmployeesAsync } from '../employee/employeeSlice'
import { getDishesAsync } from '../dish/dishSlice'
import { getCustomersAsync } from '../customer/customerSlice'
import { getOrdersAsync } from '../order/orderSlice'
import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputProps, useDisclosure } from '@chakra-ui/react';


const Login = () => {
  const [password, setPassword] = useState('')
  const [username, setuserName] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const logged = useAppSelector(selectLogged);
  const dispatch = useAppDispatch();

  const shadowStyle = {
    borderRadius: '10px', outline: 'none', boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      LoginActions(); // Ensure LoginActions is defined or imported correctly
    }
  };

  const LoginActions = () => {
    dispatch(loginAsync({ username, password }))
    dispatch(getCategoriesAsync())
    dispatch(getEmployeesAsync())
    dispatch(getCustomersAsync())
    dispatch(getOrdersAsync())
    dispatch(getDishesAsync())
  }

  return (
    <div>
      <Box className="container mt-5" fontFamily="Poppins, sans-serif">
        <Box className="row justify-content-center">
          {logged ? <LoggedIn /> : <NotLogged />}
        </Box>
        <Box className="row justify-content-center">
          {logged && (
            <Button colorScheme="teal" onClick={() => dispatch(logOut())}>
              Logout
            </Button>
          )}
          {!logged && (
            <Box className="container mt-5">
              <Box className="row justify-content-center">
                <Box className="col-md-6">
                  <Box bg="transparent" borderRadius="md" boxShadow="md">
                    <Box p={4}>
                      <h3 className="text-center">Login</h3>
                      <FormControl mt={4}>
                        <FormLabel color='gray.500'>Username</FormLabel>
                        <Input
                          onChange={(evt) => setuserName(evt.target.value)}
                          placeholder="Enter your username"
                          variant="outline"
                          onKeyPress={handleKeyPress}
                        />
                      </FormControl>
                      <FormControl mt={4}>
                        <FormLabel  color='gray.500'>Password</FormLabel>
                        <InputGroup>
                          <Input
                            onChange={(evt) => setPassword(evt.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            variant="outline"
                            onKeyPress={handleKeyPress}
                          />
                          <Button
                            onClick={() => setShowPassword(!showPassword)}
                            variant="outline"
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </Button>
                        </InputGroup>
                      </FormControl>
                      <Button onClick={() => LoginActions()} colorScheme="green" width="full" mt={4}>
                        Login
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Login