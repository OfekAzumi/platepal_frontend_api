import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectLogged, selectUserName } from './features/login/loginSlice';
import HelpGuide from './HelpGuide';
import EnterExit from './EnterExit';
import { Badge, Box, Button, ButtonGroup, Flex, FormControl, FormHelperText, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { getEmployeesAsync, hours, selectEmployees, updateEmployeeAsync } from './features/employee/employeeSlice';

const NavBar = () => {
    const username = useAppSelector(selectUserName);
    const logged = useAppSelector(selectLogged);
    const [workerChoise, setworkerChoise] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [code, setcode] = useState('')
    const [forceCode, setforceCode] = useState('')
    const toast = useToast()
    const dispatch = useAppDispatch()
    const employees = useAppSelector(selectEmployees)
    const [emplys, setemplys] = useState([{ 'unicode': '', 'name': '', 'enter': '' }])

    const capitalizeFirstLetter = (name: string) => {
        return (name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    }

    const openModal = (choise: string) => {
        setworkerChoise(choise)
        scanForEmployees()
        if (employees[0].id == -1) {
            dispatch(getEmployeesAsync())
        }
        onOpen()
    }

    const createTime = () => {
        if (code === '') {
            // no unicode entered
            toast({
                title: 'An Error Occurred.',
                description: 'Please enter employee code.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else {
            // find employee with this unicode
            const filteredEmployees = employees.filter((employee) => {
                const unicodeMatch = String(employee.unicode).toLowerCase().includes(code.toLowerCase());
                return unicodeMatch;
            });
            console.log(filteredEmployees);
            // check if found
            if (filteredEmployees.length === 0) {
                // no employee found
                toast({
                    title: 'An Error Occurred.',
                    description: `No existing employee with the code ${code}.`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                // check if there is an enter data
                const result = localStorage.getItem(`${code} enter`);
                if (workerChoise === 'enter') {
                    if (result) {
                        // if chose to enter, and alreay entered
                        toast({
                            title: 'Oops! Something Went Wrong.',
                            description: `Employee's status is already active.`,
                            status: 'info',
                            duration: 3000,
                            isClosable: true,
                        })
                    } else {
                        // first entry
                        const now = new Date();
                        localStorage.setItem(`${code} enter`, now.toISOString())
                        onClose()
                        toast({
                            title: `Nice Too See You ${filteredEmployees[0].name}!`,
                            description: `Have a nice shift, make sure to smile!`,
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        })
                    }
                } else {
                    // if exit
                    if (result) {
                        // employee is active
                        const now = new Date();
                        const enter = new Date(result);
                        localStorage.removeItem(`${code} enter`)

                        // Calculate the total hours and minutes
                        const timeDifference = now.getTime() - enter.getTime(); // Calculate difference in milliseconds
                        const Totalhours = Math.floor(timeDifference / (1000 * 60 * 60));
                        const Totalminutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

                        const prevHours = filteredEmployees[0].hours
                        const todayHours: hours = {
                            "year": enter.getFullYear(),
                            "month": enter.getMonth() + 1,
                            "day": enter.getDate(),
                            "enter": {
                                "hour": enter.getHours(),
                                "minutes": enter.getMinutes()
                            },
                            "exit": {
                                "hour": now.getHours(),
                                "minutes": now.getMinutes()
                            },
                            "total": {
                                "hour": Totalhours,
                                "minutes": Totalminutes
                            }
                        }
                        const allHours = [...prevHours, todayHours]
                        console.log(allHours);
                        dispatch(updateEmployeeAsync(
                            {
                                id: filteredEmployees[0].id,
                                unicode: filteredEmployees[0].unicode,
                                name: filteredEmployees[0].name,
                                notes: filteredEmployees[0].notes,
                                permission: filteredEmployees[0].permission,
                                hours: allHours,
                            }));
                        onClose()
                        toast({
                            title: `Thank You For Today ${filteredEmployees[0].name}!`,
                            description: `Hope to see you again soon, make sure to smile!`,
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        })
                    } else {
                        // if chose to exit, and not entered
                        onClose()
                        toast({
                            title: 'An Error Occurred.',
                            description: `Employee with this code is not active in the system.`,
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        })
                    }
                }

            }
            setcode('')
        }
    }

    const scanForEmployees = () => {
        const tmpEmps = [];

        for (let index = 0; index < employees.length; index++) {
            const tmpEmp = employees[index];
            const result = localStorage.getItem(`${tmpEmp.unicode} enter`);

            if (result) {
                const enter = new Date(result);
                const minutes = enter.getMinutes().toString().padStart(2, '0');
                const formattedEnter = `${enter.getHours()}:${minutes}`;

                tmpEmps.push({ 'unicode': tmpEmp.unicode, 'name': tmpEmp.name, 'enter': formattedEnter });
            }
        }

        // Sort tmpEmps based on the 'enter' time
        tmpEmps.sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.enter}`);
            const timeB = new Date(`1970-01-01T${b.enter}`);
            return timeA.getTime() - timeB.getTime();
        });

        setemplys(tmpEmps);
    }

    const kickEmployee = () => {
        if (code === '') {
            // no unicode entered
            toast({
                title: 'An Error Occurred.',
                description: 'Please enter a shift manager code.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else {
            // find employee with this unicode
            const filteredEmployees = employees.filter((employee) => {
                const unicodeMatch = String(employee.unicode).toLowerCase().includes(code.toLowerCase());
                return unicodeMatch;
            });
            if (!filteredEmployees[0].permission.shiftManager) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'This employee have no permission for this action.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                setworkerChoise('exit')
                setcode(forceCode)
                createTime()
            }
        }
    }

    const handleCodeChange = (value: any) => {
        setcode(value);
    };

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay backdropFilter='blur(10px)' />
                <ModalContent bg={'#F2F1EB'}>
                    {
                        workerChoise.includes('help') ?
                            <HelpGuide />
                            :
                            workerChoise.includes('enter') ?
                                <div>
                                    <ModalHeader>Nice To See You!</ModalHeader>
                                    <ModalBody pb={6} >
                                        <FormControl isRequired>
                                            <FormLabel>Employee Code</FormLabel>
                                            <FormHelperText>
                                                <Text fontSize="sm" color="gray.500">
                                                    Employee unique-code, unicode, is a 6-digit number.
                                                    You get your own unique code from your supervisor.
                                                </Text>
                                            </FormHelperText>
                                            <NumberInput max={999999} min={100000} onChange={handleCodeChange} >
                                                <NumberInputField placeholder='For Example... 855268' />
                                                <NumberInputStepper >
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>
                                    </ModalBody>
                                    <ModalCloseButton />
                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={() => createTime()}>
                                            Enter
                                        </Button>
                                        <Button onClick={onClose}>Cancel</Button>
                                    </ModalFooter>

                                </div>

                                : workerChoise.includes('exit') ?
                                    <div>
                                        <ModalHeader>Thank You For Your Work!</ModalHeader>
                                        <ModalBody pb={6} >
                                            <FormControl isRequired>
                                                <FormLabel>Employee Code</FormLabel>
                                                <FormHelperText>
                                                    <Text fontSize="sm" color="gray.500">
                                                        Employee unique-code, unicode, is a 6-digit number.
                                                        You get your own unique code from your supervisor.
                                                    </Text>
                                                </FormHelperText>
                                                <NumberInput max={999999} min={100000} onChange={handleCodeChange}>
                                                    <NumberInputField placeholder='For Example... 855268' />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>
                                        </ModalBody>
                                        <ModalCloseButton />
                                        <ModalFooter>
                                            <Button colorScheme='blue' mr={3} onClick={() => createTime()}>
                                                Exit
                                            </Button>
                                            <Button onClick={onClose}>Cancel</Button>
                                        </ModalFooter>
                                    </div>
                                    :
                                    <div>
                                        <ModalHeader>Active Employees</ModalHeader>
                                        <ModalBody pb={6} >
                                            {emplys.length === 0 ?
                                                <Text mt='3' >No Employees Found In The System.</Text>
                                                :
                                                <FormControl isRequired mb='2'>
                                                    <FormLabel>Shift Manager Code</FormLabel>
                                                    <FormHelperText>
                                                        <Text fontSize="sm" color="gray.500">
                                                            Only Shift Managers Can Force-Out An Employee. Please Enter Your Shift Manager Unicode.
                                                        </Text>
                                                    </FormHelperText>
                                                    <NumberInput max={999999} min={100000} onChange={handleCodeChange}>
                                                        <NumberInputField placeholder='For Example... 855268' />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                    {emplys.map(emp => (
                                                        <Flex key={emp.name} mt='3' alignItems="center">
                                                            <span className="material-symbols-outlined"
                                                                role='button'
                                                                onClick={() => (
                                                                    kickEmployee(),
                                                                    setforceCode(emp.unicode))}
                                                                style={{ opacity: 0.5, fontSize: '0.9em' }}>
                                                                logout
                                                            </span>
                                                            <Badge ml='1' mr='1' colorScheme='green'>
                                                                {emp.enter}
                                                            </Badge>
                                                            {emp.name}
                                                        </Flex>

                                                    ))
                                                    }

                                                </FormControl>

                                            }
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button onClick={onClose}>Cancel</Button>
                                        </ModalFooter>
                                    </div>
                    }

                </ModalContent>
            </Modal >

            <div className='navbar-bottom'>
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#88AB8E', fontFamily: 'Diphylleia, sans-serif' }}>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav d-flex justify-content-between align-items-center w-100">
                            <li className="nav-item">
                                <Link className="nav-link" to='/'>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/orderhome'>Take-An-Order</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/managment/login'>Management-Board</Link>
                            </li>
                            <li className="nav-item">
                                <div className="dropdown dropup">
                                    <a className="nav-link dropdown-toggle" role="button" id="hoursDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Hours
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="hoursDropdown" style={{ backgroundColor: '#F2F1EB' }}>
                                        <a className="dropdown-item" role="button" data-toggle="modal" onClick={() => openModal('enter')}><span style={{ fontWeight: 'bold', opacity: '0.7', color: '#88AB8E' }}>ENTER</span> Now</a>
                                        <a className="dropdown-item" role="button" data-toggle="modal" onClick={() => openModal('exit')}><span className='text-danger' style={{ fontWeight: 'bold', opacity: '0.7' }}>EXIT</span> Now</a>
                                        <a className="dropdown-item" role="button" data-toggle="modal" onClick={() => openModal('active')}>Active Workers</a>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link d-flex">
                                    <a className="material-symbols-outlined ml-auto" role="button" data-toggle="modal" data-target="#myHelpModal" onClick={() => openModal('help')}>
                                        help
                                    </a>
                                </span>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div >
    )
}

export default NavBar