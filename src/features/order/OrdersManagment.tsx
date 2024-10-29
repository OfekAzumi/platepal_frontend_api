import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Badge, Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Checkbox, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Stack, StackDivider, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { selectLogged } from '../login/loginSlice'
import { getOrderDetailsAsync, selectOrders } from './orderSlice';
import { getCustomerByIdAsync } from '../customer/customerSlice';
import { selectDishes } from '../dish/dishSlice';

export interface order {
    id: number;
    unicode: string;
    createdTime: string;
    customer: number;
    payment: string;
    active: boolean;
}

export interface customer {
    id: number;
    unicode: string;
    phone: string;
    name: string;
    city: string;
    address: string;
    floor: string;
    apt: string;
    entry: string;
    notes: string;
}

export interface dish {
    id: number;
    unicode: string;
    name: string;
    price: number;
    description: string;
    category: number;
}

export interface orderDetails {
    typecode: number;
    dish: number;
    quantity: number;
    is_free: boolean;
    adjusted_price: number
}

const OrdersManagment = () => {
    const textStyle = {
        color: '#88AB8E',
        fontFamily: 'Diphylleia, sans-serif'
    }
    const shadowStyle = {
        borderRadius: '10px', outline: 'none', boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
    }


    // category card details
    const [orderId, setorderId] = useState(0)
    const [orderUnicode, setorderUnicode] = useState('')
    const [custId, setcustId] = useState(0)
    const [payment, setpayment] = useState('')
    const [createdTime, setcreatedTime] = useState('')
    const [typeCode, settypeCode] = useState(-1)
    const logged = useAppSelector(selectLogged);
    const dishes = useAppSelector(selectDishes)
    const [orderdetails, setorderdetails] = useState<orderDetails[]>()
    const [customersInfo, setcustomersInfo] = useState<customer>()
    const [dishInfo, setdishInfo] = useState<dish>()
    const [searchTerm, setSearchTerm] = useState('');
    const orders = useAppSelector(selectOrders)
    const [from, setfrom] = useState('')
    const [to, setto] = useState('')

    const [forceUpdate, setForceUpdate] = useState(false);

    const dispatch = useAppDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    // filter orders by search term
    const filteredOrders = orders.filter((order) => {
        const unicodeMatch = String(order.unicode).toLowerCase().includes(searchTerm.toLowerCase());
        return unicodeMatch;
    });

    const getOrderDetails = (orderId: number) => {
        dispatch(getOrderDetailsAsync(orderId)).then(res => {
            if ((res.type).includes("order/GetDetails/fulfilled")) {
                setorderdetails(res.payload)
                settypeCode(res.payload[0].typecode)
                console.log(orderdetails);
            } else if ((res.type).includes("order/GetDetails/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'Unable to find order details.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                })
            }
        });
    }

    const getCustomersInfo = (customerId: number) => {
        dispatch(getCustomerByIdAsync(customerId)).then(res => {
            if ((res.type).includes("customer/GetCustomerById/fulfilled")) {
                console.log(res.payload);
                setcustomersInfo(res.payload)
            } else if ((res.type).includes("customer/GetCustomerById/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'Unable to find a customer by this id.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                })
            }
        });
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

    const Empty = (array: any) => {
        if (array === undefined) {
            return true;
        }
        return false;
    }

    // Define a function to parse the date string into a Date object
    const parseDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // month - 1 because months are 0-indexed in JavaScript
    }

    const getDishName = (dishId: number) => {
        const DishById = dishes.filter((dish) => {
            const idMatch = String(dish.id).toLowerCase().includes(String(dishId));
            return idMatch;
        });
        return DishById[0].name;
    }

    const calculateTotal = () => {
        return orderdetails?.reduce((total, item) => {
            return total + (item.quantity * item.adjusted_price);
        }, 0);
    }


    return (
        <div style={{
            position: 'relative',
            zIndex: '1001'
        }}>
            {
                logged ?
                    <div>
                        < h5 className="mt-3 text-center" style={textStyle} > Manage Your Restaurant's Orders</h5>
                        < div className="container-fluid" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {/* Orders Header */}
                            {/* <div>
                                <FormControl mt={2}>
                                    <small className="form-text text-muted text-center">
                                        Enter a dates range in order to get data.
                                    </small>
                                </FormControl>
                                <Flex direction="row">
                                    <Box flex="1" mr={4}>
                                        <FormControl isRequired>
                                            <FormLabel>From</FormLabel>
                                            <Input
                                                type="date"
                                                style={shadowStyle}
                                                onChange={(evt) => setfrom(evt.target.value)}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box flex="1" mr={4}>
                                        <FormControl isRequired>
                                            <FormLabel>To</FormLabel>
                                            <Input
                                                type="date"
                                                style={shadowStyle}
                                                onChange={(evt) => setto(evt.target.value)}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box flex='1' >
                                        <FormControl>
                                            <FormLabel>Order's Name or Unicode</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder='Search by Name or Unicode...'
                                                value={searchTerm}
                                                style={shadowStyle}
                                                onChange={(eve) => setSearchTerm(eve.target.value)}
                                            />
                                        </FormControl>

                                    </Box>
                                </Flex>
                            </div> */}
                            {/* Order Management Section */}
                            <div className="row mt-4 " >
                                {/* Left Side - List with Order Cards and Click Button */}
                                <div className="col-md-3" >
                                    {orders.length.toString().includes('0')?
                                        <div className="card mb-2 bg-transparent">
                                            <div className="card-body d-flex align-items-center">
                                                <h5 className="card-title">No Orders Available</h5>
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
                                                {filteredOrders.map(order => (
                                                    <div className="card mb-2 bg-transparent" key={order.id}>
                                                        <div className="card-body d-flex align-items-center">
                                                            <h5 className="card-title ">{order.unicode}</h5>
                                                            <span className="ml-auto mr-2 btn btn-outline-dark border-0 d-flex align-items-center" role='button'>
                                                                <span className="material-symbols-outlined"
                                                                    onClick={() => (
                                                                        setorderId(order.id),
                                                                        setorderUnicode(order.unicode),
                                                                        setcustId(order.customer),
                                                                        setcreatedTime(order.createdTime),
                                                                        setpayment(order.payment),
                                                                        getOrderDetails(order.id),
                                                                        getCustomersInfo(order.customer)
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
                                        {
                                            Empty(orderdetails) ?
                                                <div className="row">
                                                    <div className="col-6">
                                                        <h5 className="mb-2">Please Select An order.</h5>
                                                    </div>
                                                </div>
                                                :
                                                <div>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <h5 className="mb-3">Order Details</h5>
                                                        </div>
                                                        <div className="col-6 d-flex justify-content-end align-items-center">
                                                            <span className='mb-3'><Text fontSize='sm' >{formatDate(createdTime).date}, {formatDate(createdTime).hour}</Text></span>
                                                        </div>
                                                    </div>
                                                    {typeCode === 0 ?
                                                        <div className="row">
                                                            <Text>
                                                                <Text as='b'>Delivery</Text> for <Text as='b'>{customersInfo?.name}</Text> to <Text as='b'>{customersInfo?.address}, {customersInfo?.city}</Text>
                                                            </Text>
                                                        </div>
                                                        :
                                                        <div className="row">
                                                            <Text>
                                                                <Text as='b'>Take Away</Text> for <Text as='b'>{customersInfo?.name}</Text>
                                                            </Text>
                                                        </div>

                                                    }
                                                    <div className="form-group mb-3">
                                                        <button className="btn btn mt-3"
                                                            style={{
                                                                backgroundColor: '#EEE7DA',
                                                                fontFamily: 'Poppins, sans-serif',
                                                                color: '#2E2E2E',
                                                                borderRadius: '10px'
                                                            }}
                                                            onClick={() => (
                                                                getOrderDetails(orderId),
                                                                onOpen())}
                                                        >Order's Info</button>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >
                    :
                    <h5 className="mt-3 text-center" style={textStyle}>You must enter your credentials to enter the management board.</h5>
            }

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay backdropFilter='blur(10px)' />
                <ModalContent bg={'#F2F1EB'}>
                    {typeCode === 0 ?
                        <ModalHeader>{customersInfo?.name}'s Deilvery</ModalHeader>
                        :
                        <ModalHeader>{customersInfo?.name}'s Take Away</ModalHeader>
                    }
                    <ModalCloseButton />
                    <ModalBody pb={6} >
                        <Card mt={4} bg={'#F2F1EB'}>
                            <CardHeader>
                                <Heading size='md'>Order Items</Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    {orderdetails?.map(order =>
                                        <Box display="flex" justifyContent="space-between">
                                            <Box>
                                                <Heading size="xs" textTransform="uppercase">
                                                    {order.quantity} X {getDishName(order.dish)}
                                                </Heading>
                                            </Box>
                                            <Box>
                                                <Heading size="xs" textTransform="uppercase">
                                                    ${(order.quantity) * (order.adjusted_price)}
                                                </Heading>
                                            </Box>
                                        </Box>
                                    )}
                                </Stack>
                            </CardBody>
                            <CardFooter>
                                <Heading size='md'>${calculateTotal()}</Heading>
                            </CardFooter>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div >
    )
}

export default OrdersManagment