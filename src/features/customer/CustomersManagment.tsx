import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Badge, Box, Button, ButtonGroup, Card, CardBody, Checkbox, Flex, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Stack, StackDivider, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { selectLogged } from '../login/loginSlice'
import { addCustomerAsync, deleteCustomerAsync, getCustomerOrdersAsync, getCustomersAsync, selectCustomerOrders, selectCustomers, updateCustomerAsync } from './customerSlice'
import { selectOrders } from '../order/orderSlice'

export interface order {
    id: number;
    unicode: string;
    createdTime: string;
    customer: number;
    payment: string;
    active: boolean;
}


const CustomersManagment = () => {
    const textStyle = {
        color: '#88AB8E',
        fontFamily: 'Diphylleia, sans-serif'
    }
    const shadowStyle = {
        borderRadius: '10px', outline: 'none', boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
    }

    const cities = [
        "Rishon Lezion",
        "Tel Aviv",
        "Beer Yaakov",
        "Nes Tziona",
        "Nir Tzvi",
        "Gan Sorek"
    ]

    // category card details
    const [custId, setcustId] = useState(0)
    const [custUnicode, setcustUnicode] = useState('')
    const [custName, setcustName] = useState('')
    const [custPhone, setcustPhone] = useState('')
    const [custCity, setcustCity] = useState('')
    const [custAddress, setcustAddress] = useState('')
    const [custFloor, setcustFloor] = useState('')
    const [custApt, setcustApt] = useState('')
    const [custEntry, setcustEntry] = useState('')
    const [custNotes, setcustNotes] = useState('')
    const logged = useAppSelector(selectLogged);

    const [searchTerm, setSearchTerm] = useState('');
    const customers = useAppSelector(selectCustomers)
    const orders = useAppSelector(selectOrders)
    const customerOrders = useAppSelector(selectCustomerOrders)
    const [forceUpdate, setForceUpdate] = useState(false);

    const dispatch = useAppDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    // filter categories by search term
    const filteredCustomers = customers.filter((customer) => {
        const nameMatch = customer.name.toLowerCase().includes(searchTerm.toLowerCase());
        const unicodeMatch = String(customer.unicode).toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || unicodeMatch;
    });

    const [filteredOrdersByCustomer, setfilteredOrdersByCustomer] = useState<order[]>([])

    // add data refresh and toast display
    const addData = () => {
        dispatch(addCustomerAsync(
            {
                unicode: custUnicode,
                name: custName,
                phone: custPhone,
                city: custCity,
                address: custAddress,
                apt: custApt,
                entry: custEntry,
                floor: custFloor,
                notes: custNotes
            }
        )).then(res => {
            if ((res.type).includes("customer/Add/fulfilled")) {
                toast({
                    title: 'Customer Added.',
                    description: `We've successfully added the customer data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("customer/Add/rejected")) {
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
        dispatch(updateCustomerAsync({
            id: custId,
            unicode: custUnicode,
            name: custName,
            phone: custPhone,
            city: custCity,
            address: custAddress,
            apt: custApt,
            entry: custEntry,
            floor: custFloor,
            notes: custNotes
        })).then(res => {
            if ((res.type).includes("customer/Update/fulfilled")) {
                toast({
                    title: 'Customer Information Updated.',
                    description: `We've updated the customer data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("customer/Update/rejected")) {
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

    const getCustomersOrders = () => {
        setfilteredOrdersByCustomer([])
        dispatch(getCustomerOrdersAsync(custId)).then(res => {
            if ((res.type).includes("customer/GetOrdersById/fulfilled")) {
                const custOrders = res.payload
                const tmp: order[] = []
                for (let index = 0; index < custOrders.length; index++) {
                    const tmpId = custOrders[index].id
                    const filterOrders = orders.filter((order) => {
                        const idMatch = String(order.id).toLowerCase().includes(String(tmpId).toLowerCase());
                        return idMatch;
                    });
                    tmp.push(...filterOrders)

                }
                setfilteredOrdersByCustomer(tmp)
                onOpen()

            } else if ((res.type).includes("customer/GetOrdersById/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'Unable to get data. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        });
    }

    // change data display according to changes
    const refreshData = () => {
        setcustId(0)
        setcustUnicode('')
        setcustName('')
        setcustPhone('')
        setcustCity('')
        setcustAddress('')
        setcustApt('')
        setcustFloor('')
        setcustEntry('')
        setcustNotes('')
        setSearchTerm('')
        dispatch(getCustomersAsync())
        setForceUpdate(prev => !prev);
    }

    useEffect(() => {
        // This effect will run whenever forceUpdate changes
    }, [forceUpdate]);

    const formatDate = (dateString: string) => {
        // Parse the timestamp string into a Date object
        const dateObj = new Date(dateString);

        // Extract date components
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = dateObj.getFullYear();

        // Extract time components
        const hour = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        // Formatted date string
        const formattedDate = `${month}/${day}/${year}`;
        const formattedHour = `${hour}:${minutes}`;

        return { 'date': formattedDate, 'hour': formattedHour }; // Output: "28/01/2024, 20:08"
    }

    return (
        <div style={{
            position: 'relative',
            zIndex: '1001'
        }}>
            {
                logged ?
                    <div>
                        < h5 className="mt-3 text-center" style={textStyle} > Manage Your Restaurant's Customers</h5>
                        < div className="container-fluid" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {/* Orders Header */}

                            {/* Order Management Section */}
                            <div className="row mt-4 " >
                                {/* Left Side - List with Order Cards and Click Button */}
                                <div className="col-md-3" >
                                    {customers.length.toString().includes('0') ?
                                        <div className="card mb-2 bg-transparent">
                                            <div className="card-body d-flex align-items-center">
                                                <h5 className="card-title">No Customers Available</h5>
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
                                                {filteredCustomers.map(customer => (
                                                    <div className="card mb-2 bg-transparent" key={customer.id}>
                                                        <div className="card-body d-flex align-items-center">
                                                            <h5 className="card-title ">{customer.name}</h5>
                                                            <span className="ml-auto mr-2 btn btn-outline-dark border-0 d-flex align-items-center" role='button'>
                                                                <span className="material-symbols-outlined"
                                                                    onClick={() => (
                                                                        setcustId(customer.id),
                                                                        setcustUnicode(customer.unicode),
                                                                        setcustName(customer.name),
                                                                        setcustPhone(customer.phone),
                                                                        setcustCity(customer.city),
                                                                        setcustAddress(customer.address),
                                                                        setcustApt(customer.apt),
                                                                        setcustFloor(customer.floor),
                                                                        setcustEntry(customer.entry),
                                                                        setcustNotes(customer.notes)
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
                                                <h5 className="mb-3">Customer Details</h5>
                                            </div>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Unicode:</label>
                                            <input
                                                type="number"
                                                className="form-control bg-transparent border-0"
                                                value={String(custUnicode)}
                                                style={shadowStyle}
                                                onChange={(evt => setcustUnicode(evt.target.value))}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Phone:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-transparent border-0"
                                                        value={custPhone}
                                                        style={shadowStyle}
                                                        onChange={(evt => setcustPhone(evt.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Name:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-transparent border-0"
                                                        value={custName}
                                                        style={shadowStyle}
                                                        onChange={(evt => setcustName(evt.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>City:</label>
                                                <select
                                                    className="form-control bg-transparent border-0"
                                                    value={custCity}
                                                    style={shadowStyle}
                                                    onChange={(evt) => setcustCity(evt.target.value)}
                                                >
                                                    <option value="">Select a city</option>
                                                    {cities.map(item => (
                                                        <option>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Address:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-transparent border-0"
                                                        value={custAddress}
                                                        style={shadowStyle}
                                                        onChange={(evt) => setcustAddress(evt.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Floor:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-transparent border-0"
                                                        value={custFloor}
                                                        style={shadowStyle}
                                                        onChange={(evt) => setcustFloor(evt.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Apt:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-transparent border-0"
                                                        value={custApt}
                                                        style={shadowStyle}
                                                        onChange={(evt) => setcustApt(evt.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Entry:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-transparent border-0"
                                                        value={custEntry}
                                                        style={shadowStyle}
                                                        onChange={(evt) => setcustEntry(evt.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label>Notes:</label>
                                            <textarea
                                                className="form-control bg-transparent border-0"
                                                value={custNotes}
                                                style={shadowStyle}
                                                onChange={(evt) => setcustNotes(evt.target.value)}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <button className="btn btn mt-3"
                                                style={{
                                                    backgroundColor: '#EEE7DA',
                                                    fontFamily: 'Poppins, sans-serif',
                                                    color: '#2E2E2E',
                                                    borderRadius: '10px'
                                                }}
                                                onClick={() => (getCustomersOrders())}
                                            >Check For Orders</button>
                                        </div>
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
            {/* <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay backdropFilter='blur(10px)' />
                <ModalContent bg={'#F2F1EB'}>
                    <ModalHeader>Create your customer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6} >
                        <FormControl isRequired>
                            <FormLabel>Customer Unicode</FormLabel>
                            <FormHelperText>
                                <Text fontSize="sm" color="gray.500">
                                    Customer unique-code, unicode, is a 6-digit number.
                                    You can start from 100000 to 999999.
                                </Text>
                            </FormHelperText>
                            {customers[0].id == -1 ?
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
                                    value={((customers[customers.length - 1].unicode) + 1)}
                                    disabled
                                />
                            }
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Customer Name</FormLabel>
                            <Input
                                placeholder='For Example... Mike Johnson'
                                onChange={(eve) => setcustName(eve.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Customer Notes</FormLabel>
                            <Textarea
                                placeholder='For Example... Id, Record, etc'
                                onChange={(eve) => setcustNotes(eve.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => addData()}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal> */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay backdropFilter='blur(10px)' />
                {customerOrders.length > 0 ?
                    <ModalContent bg={'#F2F1EB'}>
                        <ModalHeader>{custName}'s Orders</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6} >
                            <Card mt={4} bg={'#F2F1EB'}>


                                <CardBody>
                                    <Stack divider={<StackDivider />} spacing='4'>
                                        {filteredOrdersByCustomer.map(order => (
                                            <Flex justifyContent="space-between" alignItems="center" mt={1} >
                                                <Box display="flex" alignItems="center">
                                                    <Text >
                                                        order no.
                                                        <Badge ml='1' mr='1' colorScheme='blue'>
                                                            {order.unicode}
                                                        </Badge>

                                                    </Text>

                                                </Box>
                                                <Text>
                                                    <Badge>{formatDate(order.createdTime).date}
                                                    </Badge>
                                                    <Badge mr='1'>
                                                        {formatDate(order.createdTime).hour}
                                                    </Badge>
                                                </Text>
                                            </Flex>
                                        ))}
                                    </Stack>
                                </CardBody>

                            </Card>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                    :
                    <ModalContent bg={'#F2F1EB'}>
                        <ModalHeader>No previous orders</ModalHeader>
                    </ModalContent>
                }

            </Modal>

        </div >
    )
}

export default CustomersManagment