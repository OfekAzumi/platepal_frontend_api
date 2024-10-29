import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Badge, Box, Button, ButtonGroup, Card, CardBody, Checkbox, Flex, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Stack, StackDivider, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { selectLogged } from '../login/loginSlice'
import { getEmployeesAsync, addEmployeeAsync, updateEmployeeAsync, deleteEmployeeAsync, selectEmployees, hours } from './employeeSlice'



const EmployeesManagment = () => {
    const textStyle = {
        color: '#88AB8E',
        fontFamily: 'Diphylleia, sans-serif'
    }
    const shadowStyle = {
        borderRadius: '10px', outline: 'none', boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
    }

    // category card details
    const [empId, setempId] = useState(0)
    const [empName, setempName] = useState('')
    const [empUnicode, setempUnicode] = useState('')
    const [empNotes, setempNotes] = useState('')
    const [empPermission, setempPermission] = useState({ 'shiftManager': false })
    const [empHours, setEmpHours] = useState<hours[]>([]);
    const logged = useAppSelector(selectLogged);

    // hours modal
    const [modalChoise, setmodalChoise] = useState(0)
    const [from, setfrom] = useState('')
    const [to, setto] = useState('')
    const [empFilteredHours, setEmpFilteredHours] = useState<hours[]>([]);
    const [display, setdisplay] = useState(false)

    const [searchTerm, setSearchTerm] = useState('');
    const employees = useAppSelector(selectEmployees)
    const [forceUpdate, setForceUpdate] = useState(false);

    const dispatch = useAppDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    // filter categories by search term
    const filteredEmployees = employees.filter((employee) => {
        const nameMatch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
        const unicodeMatch = String(employee.unicode).toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || unicodeMatch;
    });


    // add data refresh and toast display
    const addData = () => {
        dispatch(addEmployeeAsync({ unicode: empUnicode, name: empName, notes: empNotes, permission: empPermission, hours: empHours })).then(res => {
            if ((res.type).includes("employee/Add/fulfilled")) {
                toast({
                    title: 'Employee Added.',
                    description: `We've successfully added the employee data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("employee/Add/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'Unable to add data. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            refreshData()
            onClose()
        });
    }

    // update data refresh and toast display
    const updateData = () => {
        dispatch(updateEmployeeAsync({ id: empId, unicode: empUnicode, name: empName, notes: empNotes, permission: empPermission, hours: empHours })).then(res => {
            if ((res.type).includes("employee/Update/fulfilled")) {
                toast({
                    title: 'Employee Information Updated.',
                    description: `We've updated the employee data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("employee/Update/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'A valid unicode is a 6-digit unique integer.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            refreshData()
        });
    }

    // delete data refresh and toast display
    const deleteData = () => {
        dispatch(deleteEmployeeAsync(empId)).then(res => {
            if ((res.type).includes("employee/Delete/fulfilled")) {
                toast({
                    title: 'Employee Deleted.',
                    description: `We've successfully deleted the employee data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("employee/Delete/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'Unable to delete data. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            refreshData()
        });
    }

    // change data display according to changes
    const refreshData = () => {
        setempId(0)
        setempUnicode('')
        setempName('')
        setempNotes('')
        setSearchTerm('')
        setempPermission({ 'shiftManager': false })
        setEmpHours([])
        dispatch(getEmployeesAsync())
        setForceUpdate(prev => !prev);
    }

    // open modal and change unicode according to data
    const openModal = () => {
        onOpen()
        employees[0].id == -1 ? setempUnicode('100000') : setempUnicode(((employees[employees.length - 1].unicode) + 1))
    }

    useEffect(() => {
        // This effect will run whenever forceUpdate changes
    }, [forceUpdate]);

    const handleCodeChange = (value: any) => {
        setempUnicode(value);
    };

    // Define a function to parse the date string into a Date object
    const parseDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // month - 1 because months are 0-indexed in JavaScript
    }

    // Define a function to filter the employee's hours within the date range
    const filterEmployeeHours = (fromDate: Date, toDate: Date) => {
        const filteredHours = empHours.filter(hour => {
            const hourDate = new Date(hour.year, hour.month - 1, hour.day); // month - 1 because months are 0-indexed in JavaScript
            return hourDate >= fromDate && hourDate <= toDate;
        });
        return filteredHours;
    }

    const handleHours = () => {
        if (from.length > 0 && to.length > 0) {
            const fromDate = parseDate(from);
            const toDate = parseDate(to);
            const today = new Date()
            if (fromDate > toDate) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'Invalid data range, must be an existing range.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else if (toDate > today) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'Invalid data range, today is the maximum ending date.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                setEmpFilteredHours(filterEmployeeHours(fromDate, toDate));
            }
        } else {
            toast({
                title: 'An Error Occurred.',
                description: 'Must enter both from and to in order to get data.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const closeHoursModal = () => {
        setfrom('')
        setto('')
        setEmpFilteredHours([])
        setdisplay(false)
        onClose()
    }

    return (
        <div style={{
            position: 'relative',
            zIndex: '1001'
        }}>
            {
                logged ?
                    <div>
                        < h5 className="mt-3 text-center" style={textStyle} > Manage Your Restaurant's Employees</h5>
                        < div className="container-fluid" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {/* Orders Header */}

                            {/* Order Management Section */}
                            <div className="row mt-4 " >
                                {/* Left Side - List with Order Cards and Click Button */}
                                <div className="col-md-3" >
                                    {employees.length.toString().includes('0') ?
                                        <div className="card mb-2 bg-transparent">
                                            <div className="card-body d-flex align-items-center">
                                                <h5 className="card-title">No Employees Available</h5>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className="card mb-2 border-0 bg-transparent">
                                                <input
                                                    className='form-control bg-transparent border-0'
                                                    type="text"
                                                    placeholder='Search by Name or Unicode...'
                                                    style={shadowStyle}
                                                    value={searchTerm}
                                                    onChange={(eve) => setSearchTerm(eve.target.value)}
                                                />
                                            </div>
                                            <div style={{ maxHeight: '60vh', height: '100%', overflowY: 'auto' }}>
                                                {filteredEmployees.map(employee => (
                                                    <div className="card mb-2 bg-transparent" key={employee.id}>
                                                        <div className="card-body d-flex align-items-center">
                                                            <h5 className="card-title ">{employee.name}</h5>
                                                            <Popover>
                                                                <PopoverTrigger>
                                                                    <span className="ml-auto mr-2 btn btn-outline-danger border-0 d-flex align-items-center" role='button'>
                                                                        <span className="material-symbols-outlined"
                                                                            onClick={() => (
                                                                                setempName(employee.name),
                                                                                setempId(employee.id),
                                                                                setempUnicode(String(employee.unicode)),
                                                                                setempNotes(employee.notes),
                                                                                setempPermission(employee.permission),
                                                                                setEmpHours(employee.hours)
                                                                            )}
                                                                        >delete</span>
                                                                    </span>
                                                                </PopoverTrigger>
                                                                <Portal>
                                                                    <PopoverContent bg={'#F2F1EB'}>
                                                                        {/* <PopoverArrow /> */}
                                                                        <PopoverCloseButton />
                                                                        <PopoverHeader pt={4} fontWeight='bold' border='0'>
                                                                            This action cannot be undone.
                                                                        </PopoverHeader>
                                                                        <PopoverBody>
                                                                            <Text fontSize='sm'>
                                                                                Are you sure you want to delete <span style={{ fontWeight: 'bold' }}>{empName}</span> from the employees database?
                                                                            </Text>
                                                                        </PopoverBody>
                                                                        <PopoverFooter
                                                                            border='0'
                                                                            display='flex'
                                                                            alignItems='center'
                                                                            justifyContent='space-between'
                                                                            pb={4}
                                                                        >
                                                                            <ButtonGroup size='sm' >
                                                                                <Button colorScheme='red' onClick={() => deleteData()}>Yes, Delete</Button>
                                                                            </ButtonGroup>
                                                                        </PopoverFooter>
                                                                    </PopoverContent>
                                                                </Portal>
                                                            </Popover>


                                                            <span className="ml-0 btn btn-outline-dark border-0 d-flex align-items-center" role='button'>
                                                                <span className="material-symbols-outlined"
                                                                    onClick={() => (
                                                                        setempName(employee.name),
                                                                        setempId(employee.id),
                                                                        setempUnicode(String(employee.unicode)),
                                                                        setempNotes(employee.notes),
                                                                        setempPermission(employee.permission),
                                                                        setEmpHours(employee.hours)
                                                                    )}
                                                                >open_in_new</span>
                                                            </span>

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                </div>

                                {/* Right Side - List with Order Details Cards */}
                                <div className="col-md-9">
                                    {/* Order Details Header */}
                                    <div className="bg-transparent p-3 rounded border">

                                        <div className="row">
                                            <div className="col-6">
                                                <h5 className="mb-3">Employee Details</h5>
                                            </div>
                                            <div className="col-6 text-right">
                                                <span className="material-symbols-outlined" role='button' onClick={() => (setmodalChoise(0), openModal())}>add</span>
                                            </div>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label>Unicode:</label>
                                            <input
                                                type="number"
                                                className="form-control bg-transparent border-0"
                                                value={String(empUnicode)}
                                                style={shadowStyle}
                                                onChange={(evt => setempUnicode(evt.target.value))}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Name:</label>
                                            <input
                                                type="text"
                                                className="form-control bg-transparent border-0"
                                                value={empName}
                                                style={shadowStyle}
                                                onChange={(evt => setempName(evt.target.value))}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label >Notes:</label>
                                            <textarea
                                                className="form-control bg-transparent border-0"
                                                value={empNotes}
                                                style={shadowStyle}
                                                onChange={(evt) => setempNotes(evt.target.value)}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <Checkbox
                                                isChecked={empPermission['shiftManager']}
                                                onChange={(evt) => setempPermission({ 'shiftManager': evt.target.checked })}
                                            >
                                                Shift Manager
                                            </Checkbox>
                                            <small className="form-text text-muted">
                                                If you check this box, this employee will be able to access actions of a shift manager such as price change, employee managment, etc. <br />
                                                You must register the shift manager employee to the users database to access management board.
                                            </small>
                                        </div>
                                        {(empHours.length == 0) ?
                                            <div className="form-group mb-3">
                                                <label>Employee has no hours yet.</label>
                                            </div>
                                            :
                                            <div className="form-group mb-3">
                                                <button className="btn btn mt-3"
                                                    style={{
                                                        backgroundColor: '#EEE7DA',
                                                        fontFamily: 'Poppins, sans-serif',
                                                        color: '#2E2E2E',
                                                        borderRadius: '10px'
                                                    }}
                                                    onClick={() => (setmodalChoise(1), openModal())}
                                                >Open Hours</button>
                                            </div>
                                        }
                                        <button
                                            className="btn btn-block mt-3"
                                            style={{
                                                backgroundColor: '#EEE7DA',
                                                fontFamily: 'Poppins, sans-serif',
                                                color: '#2E2E2E',
                                                borderRadius: '10px',
                                            }}
                                            onClick={() => updateData()}
                                        >
                                            Save
                                        </button>

                                        {/* Add order details here */}
                                    </div>

                                    {/* Add more cards as needed */}
                                </div>
                            </div>
                        </div >
                    </div >
                    :
                    <h5 className="mt-3 text-center" style={textStyle}>You must enter your credentials to enter the management board.</h5>

            }

            {/* add category modal */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay backdropFilter='blur(10px)' />
                {modalChoise.toString().includes('0') ?
                    <ModalContent bg={'#F2F1EB'}>
                        <ModalHeader>Create your employee</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6} >
                            <FormControl isRequired>
                                <FormLabel>Employee Unicode</FormLabel>
                                <FormHelperText>
                                    <Text fontSize="sm" color="gray.500">
                                        Employee unique-code, unicode, is a 6-digit number.
                                        You can start from 100000 to 999999.
                                    </Text>
                                </FormHelperText>
                                {employees.length.toString().includes('0') ?
                                    <NumberInput max={999999} min={100000} onChange={handleCodeChange} >
                                        <NumberInputField placeholder='For Example... 100000' />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    :

                                    <Input
                                        placeholder='Unicode'
                                        value={((employees[employees.length - 1].unicode) + 1)}
                                        disabled
                                    />
                                }
                            </FormControl>

                            <FormControl mt={4} isRequired>
                                <FormLabel>Employee Name</FormLabel>
                                <Input
                                    placeholder='For Example... Mike Johnson'
                                    onChange={(eve) => setempName(eve.target.value)}
                                />
                            </FormControl>

                            <FormControl mt={4} isRequired>
                                <FormLabel>Employee Notes</FormLabel>
                                <Textarea
                                    placeholder='For Example... Id, Record, etc'
                                    onChange={(eve) => setempNotes(eve.target.value)}
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <Checkbox
                                    onChange={(evt) => setempPermission({ 'shiftManager': evt.target.checked })}
                                >
                                    Shift Manager
                                </Checkbox>
                                <small className="form-text text-muted">
                                    If you check this box, this employee will be able to access actions of a shift manager such as price change, employee managment, etc.<br />
                                    You must register the shift manager employee to the users database to access management board.
                                </small>
                            </FormControl>

                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={() => addData()}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                    :
                    <ModalContent bg={'#F2F1EB'}>
                        <ModalHeader>{empName}'s Hours</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6} >
                            <Flex direction="row">
                                <Box flex="1" mr={4}>
                                    <FormControl isRequired>
                                        <FormLabel>From</FormLabel>
                                        <Input
                                            type="date"
                                            onChange={(evt) => setfrom(evt.target.value)}
                                        />
                                    </FormControl>
                                </Box>
                                <Box flex="1">
                                    <FormControl isRequired>
                                        <FormLabel>To</FormLabel>
                                        <Input
                                            type="date"
                                            onChange={(evt) => setto(evt.target.value)}
                                        />
                                    </FormControl>
                                </Box>

                            </Flex>
                            <FormControl mt={2}>
                                <small className="form-text text-muted">
                                    Enter employee hours range in order to see data.
                                </small>
                            </FormControl>
                            <Card mt={4} bg={'#F2F1EB'}>

                                {(empFilteredHours.length === 0) ?
                                    <CardBody>
                                        No Hours Found In This Data Range.
                                    </CardBody>
                                    :
                                    <CardBody>
                                        <Stack divider={<StackDivider />} spacing='4'>
                                            {empFilteredHours.map(hour => (
                                                <Flex justifyContent="space-between" alignItems="center" mt={1} >
                                                    <Box display="flex" alignItems="center">
                                                        <Text >
                                                            <Badge>{`${hour.day}/${hour.month}/${hour.year}`}</Badge>
                                                            <Badge ml='1' mr='1' colorScheme='green'>
                                                                Enter
                                                            </Badge>
                                                            {`${hour.enter.hour.toString().padStart(2, '0')}:${hour.enter.minutes.toString().padStart(2, '0')}`}
                                                            <Badge ml='1' mr='1' colorScheme='red'>
                                                                Exit
                                                            </Badge>
                                                            {`${hour.exit.hour.toString().padStart(2, '0')}:${hour.exit.minutes.toString().padStart(2, '0')}`}

                                                        </Text>

                                                    </Box>
                                                    <Text>
                                                        <Badge ml='1' mr='1' colorScheme='blue'>
                                                            Total
                                                        </Badge>
                                                        {`${hour.total.hour.toString().padStart(2, '0')}:${hour.total.minutes.toString().padStart(2, '0')}`}
                                                    </Text>
                                                </Flex>
                                            ))}
                                        </Stack>
                                    </CardBody>
                                }
                            </Card>


                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={() => handleHours()}>
                                Save
                            </Button>
                            <Button onClick={() => closeHoursModal()}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                }

            </Modal>

        </div >
    )
}

export default EmployeesManagment