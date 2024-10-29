import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { getDishesAsync, selectDishes } from './features/dish/dishSlice'
import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, CircularProgress, CircularProgressLabel, Flex, FormHelperText, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Stack, StackDivider, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { getCategoriesAsync, selectCategories } from './features/category/categorySlice'
import { getCustomersAsync, selectCustomers } from './features/customer/customerSlice'
import { addOrderAsync, createPaypalPaymentAsync, executePaypalPaymentAsync, getOrdersAsync, orderDetails } from './features/order/orderSlice'
import { Navigate } from 'react-router-dom'

export interface Dish {
    id: number;
    unicode: string;
    name: string;
    price: number;
    description: string;
    category: number;
}

export interface cartItem {
    typecode?: number;
    quantity: number;
    is_free: boolean;
    adjusted_price: number;
    dish: number;
}

export interface dbData {
    unicode: string;
    customer: number;
    payment: string;
    active: boolean;
    cart: orderDetails[]
}

const OrderItems = () => {
    const textStyle = {
        color: '#88AB8E',
        fontFamily: 'Diphylleia, sans-serif'
    }
    const shadowStyle = {
        borderRadius: '10px', outline: 'none', boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
    }

    const dispatch = useAppDispatch()
    const [forceUpdate, setForceUpdate] = useState(false);
    const toast = useToast()
    const [newprice, setNewPrice] = useState('')
    const TYPECODE = Number(localStorage.getItem('typecode'))
    const [dishId, setdishId] = useState(0)
    const [dishName, setdishName] = useState('')
    const [dishUnicode, setdishUnicode] = useState('')
    const [dishDescription, setdishDescription] = useState('')
    const [dishPrice, setdishPrice] = useState(0.0)
    const [dishCategory, setdishCategory] = useState(0)
    // search bar
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryId, setcategoryId] = useState(0);
    const [option, setoption] = useState(0); //0-search term, 1-category select

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [navigate, setNavigate] = useState(false)

    const categories = useAppSelector(selectCategories)
    const dishes = useAppSelector(selectDishes)
    const customers = useAppSelector(selectCustomers)

    const [cart, setcart] = useState<orderDetails[]>([])

    const getDishName = (dishId: number) => {
        const DishById = dishes.filter((dish) => {
            const idMatch = String(dish.id).toLowerCase().includes(String(dishId));
            return idMatch;
        });
        return DishById[0].name;
    }

    const getCustomerName = (customerId: number) => {
        const CustomerById = customers.filter((customer) => {
            const idMatch = String(customer.id).toLowerCase().includes(String(customerId));
            return idMatch;
        });
        return CustomerById[0].name;
    }

    let filteredDishes = dishes.filter((dish) => {
        if (option === 0) {
            const nameMatch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
            return nameMatch;
        } else {
            const categoryMatch = String(dish.category).toLowerCase().includes(String(categoryId).toLowerCase());
            return categoryMatch;
        }
    });

    //cart management
    const resetCart = () => {
        setcart([]);
        refreshData();
    }

    const AddToCart = (cartItem: orderDetails) => {
        const existingItem = cart.filter(item => item.id === cartItem.id)[0];
        if (existingItem) {
            existingItem.quantity += 1;
            console.log(cart);
        } else {
            if (cart.length === 0 && TYPECODE?.toString().includes('0')) {
                let tmpCart = cart;
                if (localStorage.getItem('city')?.includes('Rishon Lezion')) {
                    let tmpDish = dishes.filter(dish => (dish.name.toLowerCase().includes('Close-Radius Delivery Fees'.toLowerCase())))[0];
                    tmpCart.push({
                        typecode: TYPECODE,
                        quantity: 1,
                        adjusted_price: tmpDish.price,
                        is_free: false,
                        id: tmpDish.id
                    });
                } else {
                    let tmpDish = dishes.filter(dish => (dish.name.toLowerCase().includes('Long-Radius Delivery Fees'.toLowerCase())))[0];
                    tmpCart.push({
                        typecode: TYPECODE,
                        quantity: 1,
                        adjusted_price: tmpDish.price,
                        is_free: false,
                        id: tmpDish.id
                    });
                }
                if (cartItem.typecode.toString()) {
                    tmpCart.push({
                        typecode: cartItem.typecode,
                        quantity: 1,
                        adjusted_price: cartItem.adjusted_price,
                        is_free: cartItem.is_free,
                        id: cartItem.id
                    });
                    setcart(tmpCart);
                }
            } else {
                let tmpCart = cart;
                if (cartItem.typecode.toString()) {
                    tmpCart.push({
                        typecode: cartItem.typecode,
                        quantity: 1,
                        adjusted_price: cartItem.adjusted_price,
                        is_free: cartItem.is_free,
                        id: cartItem.id
                    });
                    setcart(tmpCart);
                }
                console.log(cart);
            }
        }
        refreshData();
    }

    const increaseQuantity = (cartItem: orderDetails) => {
        const existingItem = cart.find(item => item.id === cartItem.id);
        if (existingItem) {
            existingItem.quantity += 1;
        }
        refreshData()
    }

    const decreaseQuantity = (cartItem: orderDetails) => {
        const existingItem = cart.find(item => item.id === cartItem.id);
        if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                // Remove item from cart when quantity reaches 0
                const updatedCart = cart.filter(item => item.id !== existingItem.id);
                setcart(updatedCart);
            }
        }
        refreshData();
    };

    const deleteFromCart = (cartItem: orderDetails) => {
        const existingItem = cart.find(item => item.id === cartItem.id);
        if (existingItem) {
            const updatedCart = cart.filter(item => item.id !== existingItem.id);
            toast({
                title: 'A Confirmation Alert',
                description: `Deleted ${getDishName(cartItem.id)} From Cart`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            setcart(updatedCart);
        }
        refreshData();
    }

    const adjustItemsPrice = (cartItem: orderDetails, new_price: number) => {
        const existingItem = cart.find(item => item.id === cartItem.id);
        if (existingItem) {
            if (new_price) {
                if (new_price < 0) {
                    toast({
                        title: 'An Error Occurred',
                        description: `Please enter a valid new item price.`,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    })
                } else {
                    existingItem.adjusted_price = new_price
                    existingItem.is_free = false
                    toast({
                        title: 'A Confirmation Alert',
                        description: `You Changed ${getDishName(cartItem.id)}'s price to ${new_price}`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    })

                }
            } else {
                //check if is_free
                if (new_price === 0) {
                    existingItem.adjusted_price = 0
                    existingItem.is_free = true
                    toast({
                        title: 'A Confirmation Alert',
                        description: `You Added ${getDishName(cartItem.id)} for free`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    })
                } else {
                    toast({
                        title: 'An Error Occurred',
                        description: `Please enter a new item price.`,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    })
                }
            }
        }
        refreshData();
    }

    const countItems = () => {
        // Sum the quantity of all items in the cart
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const countTotal = () => {
        // Sum the adjusted price of all items multiplied by their quantities
        return cart.reduce((total, item) => total + item.adjusted_price * item.quantity, 0);
    };

    const enforceMinimum = (payment: string) => {
        if (cart.length === 0) {
            toast({
                title: 'An Error Occurred',
                description: `Cart is empty.`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        else {
            if (TYPECODE?.toString().includes('0')) {
                if (localStorage.getItem('city')?.includes('Rishon Lezion')) {
                    let term = countTotal();
                    if (term < 40) {
                        toast({
                            title: 'An Error Occurred',
                            description: `Minimum order cost is $40, cart is at $${term}.`,
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        })
                    } else {
                        let unicode = localStorage.getItem('unicode')
                        if (payment.includes('cash')) {
                            if (unicode) {
                                let tmpData: dbData = {
                                    unicode: unicode,
                                    customer: Number(localStorage.getItem('customer')),
                                    payment: payment,
                                    active: false,
                                    cart: cart
                                }
                                sendCart(tmpData)
                            }
                        } else {
                            if (unicode) {
                                let tmpData: dbData = {
                                    unicode: unicode,
                                    customer: Number(localStorage.getItem('customer')),
                                    payment: payment,
                                    active: false,
                                    cart: cart
                                }
                                let paypalData = {
                                    total: countTotal(),
                                    unicode: unicode
                                }
                                CreatePaypalPayment(paypalData, tmpData)
                            }
                        }
                    }
                }
                else {
                    let term = countTotal();
                    if (term < 60) {
                        toast({
                            title: 'An Error Occurred',
                            description: `Minimum order cost is $60, cart is at $${term}.`,
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        })
                    } else {
                        let unicode = localStorage.getItem('unicode')
                        if (payment.includes('cash')) {
                            if (unicode) {
                                let tmpData: dbData = {
                                    unicode: unicode,
                                    customer: Number(localStorage.getItem('customer')),
                                    payment: payment,
                                    active: false,
                                    cart: cart
                                }
                                sendCart(tmpData)
                            }
                        } else {
                            if (unicode) {
                                let tmpData: dbData = {
                                    unicode: unicode,
                                    customer: Number(localStorage.getItem('customer')),
                                    payment: payment,
                                    active: false,
                                    cart: cart
                                }
                                let paypalData = {
                                    total: countTotal(),
                                    unicode: unicode
                                }
                                CreatePaypalPayment(paypalData, tmpData)
                            }
                        }
                    }
                }
            } else {
                let unicode = localStorage.getItem('unicode')
                if (payment.includes('cash')) {
                    if (unicode) {
                        let tmpData: dbData = {
                            unicode: unicode,
                            customer: Number(localStorage.getItem('customer')),
                            payment: payment,
                            active: false,
                            cart: cart
                        }
                        sendCart(tmpData)
                    }
                } else {
                    if (unicode) {
                        let tmpData: dbData = {
                            unicode: unicode,
                            customer: Number(localStorage.getItem('customer')),
                            payment: payment,
                            active: false,
                            cart: cart
                        }
                        let paypalData = {
                            total: countTotal(),
                            unicode: unicode
                        }
                        CreatePaypalPayment(paypalData, tmpData)
                    }
                }
            }
        }
    }

    const CreatePaypalPayment = (paypalData: { total: number, unicode: string }, dbData: dbData) => {
        if (paypalData) {
            dispatch(createPaypalPaymentAsync(paypalData)).then(res => {
                if ((res.type).includes("order/PaypalCreate/fulfilled")) {
                    toast({
                        title: `Paypal Payment Created Successfully.`,
                        description: `Your paypal payment has been created, you will be redirected to a paypal payment page.`,
                        status: 'info',
                        duration: 3000,
                        isClosable: true,
                    });
                    localStorage.setItem('dbData', JSON.stringify(dbData))
                    window.location.href = res.payload.approval_url;
                } else if ((res.type).includes("order/PaypalCreate/rejected")) {
                    toast({
                        title: 'An Error Occurred.',
                        description: 'Failed creating paypal payment. Please try again.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
                refreshData()
            });
        }
    }

    const sendCart = (data: dbData) => {
        console.log(data);
        if (data) {
            dispatch(addOrderAsync(data)).then(res => {
                if ((res.type).includes("order/Add/fulfilled")) {
                    toast({
                        title: `Order #${data.unicode} Completed Successfully.`,
                        description: `Your order has been fulfilled and is on its way! Thank you for choosing us.`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    setNavigate(true)
                } else if ((res.type).includes("order/Add/rejected")) {
                    toast({
                        title: 'An Error Occurred.',
                        description: 'Unable to add data. Please try again.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    setNavigate(false)
                }
                refreshData()
            });
        }
    }

    // change data display according to changes
    const refreshData = () => {
        setdishId(0)
        setdishUnicode('')
        setdishDescription('')
        setdishPrice(0.0)
        setdishCategory(0)
        dispatch(getDishesAsync())
        dispatch(getCategoriesAsync())
        dispatch(getCustomersAsync())
        dispatch(getOrdersAsync())
        setForceUpdate(prev => !prev);
    }

    const handlePriceChange = (value: any) => {
        console.log(value);
        setNewPrice(value);
    };

    useEffect(() => {
        // This effect will run whenever forceUpdate changes
    }, [forceUpdate]);


    return (
        <div>
            {navigate ? <Navigate to='/orderhome' />
                :
                <div />
            }
            <div className="container-fluid" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className="row mt-4">
                    <div className="col mb-2">
                        <div className="col">
                            <div className="row">
                                {categories.map(category => (
                                    <Tooltip key={category.id} hasArrow label={category.name} bg='#88AB8E' placement='bottom'>
                                        <div className="col card bg-transparent p-3" key={category.id} role='button'
                                            onClick={() => (setcategoryId(category.id), setoption(1))}>
                                            <div className="d-flex align-items-center justify-content-center h-100">
                                                <span className="text-truncate text-center">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </div>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {/* Left Side - List with Order Cards and Click Button */}
                    <div className="col-md-7 border-right" >
                        <div>
                            <div className="card mb-2 border-0 bg-transparent">
                                <input
                                    className='form-control bg-transparent border-1'
                                    type="text"
                                    placeholder='Search by Name...'
                                    // style={shadowStyle}
                                    value={searchTerm}
                                    onChange={(eve) => (setSearchTerm(eve.target.value), setoption(0))}
                                />
                            </div>
                            <div style={{ maxHeight: '60vh', height: '100%', overflowY: 'auto' }}>

                                {filteredDishes.map(dish => (
                                    <div className="card mb-2 bg-transparent" key={dish.id}>
                                        <div className="card-body d-flex align-items-center">
                                            <h5 className="card-title ">
                                                <Tooltip hasArrow label={dish.description} bg='#88AB8E' placement='right'>
                                                    {dish.name}
                                                </Tooltip>
                                            </h5>
                                            <span className="ml-auto mr-2 text-danger border-0 d-flex align-items-center">
                                                ${dish.price}
                                            </span>
                                            <span className="ml-2 btn btn-outline-dark border-0 d-flex align-items-center" role='button'>
                                                <span className="material-symbols-outlined"
                                                    onClick={() => (
                                                        setdishName(dish.name),
                                                        setdishId(dish.id),
                                                        setdishUnicode(String(dish.unicode)),
                                                        setdishPrice(dish.price),
                                                        setdishDescription(dish.description),
                                                        setdishCategory(dish.category),
                                                        AddToCart({
                                                            typecode: TYPECODE,
                                                            quantity: 1,
                                                            is_free: false,
                                                            adjusted_price: dish.price,
                                                            id: dish.id
                                                        })
                                                    )}
                                                >add_shopping_cart</span>
                                            </span>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - List with Order Details Cards */}
                    <div className="col-md-5">
                        {/* Order Details Header */}
                        <div style={{ maxHeight: '60vh', height: '100%', overflowY: 'auto' }}>
                            <div className="card mb-2 bg-transparent  border-0" key={0}>
                                <div className="card-body d-flex align-items-center ">
                                    {TYPECODE?.toString().includes('0') ? (
                                        <h5 className="card-title">
                                            Delivery for <strong>{getCustomerName(Number(localStorage.getItem('customer')))}</strong> to <strong>{localStorage.getItem('city')}</strong>
                                            {localStorage.getItem('city')?.includes('Rishon Lezion') ?
                                                <Text mt='2' mb={0} fontSize="sm" color="gray.500">
                                                    The delivery fees for {localStorage.getItem('city')} are close-radius / $5. Including, There's a minimun of $40 per order.<br></br>
                                                    The shipping fee will be added automatically when you start the order. The minimum for the order will be enforced at the time of payment.
                                                </Text>
                                                :
                                                <Text mt='2' mb={0} fontSize="sm" color="gray.500">
                                                    The delivery fees for {localStorage.getItem('city')} are long-radius / $10. Including, There's a minimun of $60 per order.<br></br>
                                                    The shipping fee will be added automatically when you start the order. The minimum for the order will be enforced at the time of payment.
                                                </Text>
                                            }

                                        </h5>
                                    ) : (
                                        <h5 className="card-title">
                                            TakeAway for <strong>{getCustomerName(Number(localStorage.getItem('customer')))}</strong>
                                            <Text mt='2' mb={0} fontSize="sm" color="gray.500">
                                                For take-away, there is no minimum order cost.
                                            </Text>
                                        </h5>
                                    )}
                                </div>
                                {/* <div style={{ maxHeight: '55vh', height: '100%', overflowY: 'auto' }}> */}
                                <div className="card-body">
                                    {cart.length === 0 ? (
                                        <Box>
                                            <Text fontWeight="bold">Cart is empty.</Text>
                                        </Box>
                                    ) : (
                                        <Flex direction="column" width="100%" borderTop="1px" borderColor="gray.200">
                                            {cart.map(item => (
                                                <Flex key={item.id} p={4} align="center" borderBottom="1px" borderColor="gray.200" width="100%">
                                                    <Box flex="1">
                                                        <Text fontWeight="bold">{getDishName(item.id)}</Text>
                                                    </Box>
                                                    <Flex alignItems="center" flex="1">
                                                        {/* delete */}
                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <Text className="material-symbols-outlined btn btn-outline-danger border-0 " mx={2} fontSize="lg" role='button' >delete</Text>
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
                                                                            Are you sure you want to delete <span style={{ fontWeight: 'bold' }}>{getDishName(item.id)}</span> from the cart?
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
                                                                            <Button colorScheme='red' onClick={() => deleteFromCart(item)}>Yes, Delete</Button>
                                                                        </ButtonGroup>
                                                                    </PopoverFooter>
                                                                </PopoverContent>
                                                            </Portal>
                                                        </Popover>
                                                        {/* price change */}
                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <Text className="material-symbols-outlined btn btn-outline-dark border-0" mx={2} fontSize="lg" role='button'>price_change</Text>
                                                            </PopoverTrigger>
                                                            <Portal>
                                                                <PopoverContent bg={'#F2F1EB'}>
                                                                    {/* <PopoverArrow /> */}
                                                                    <PopoverCloseButton />
                                                                    <PopoverHeader pt={4} fontWeight='bold' border='0'>
                                                                        Please enter a valid new item price.
                                                                    </PopoverHeader>
                                                                    <PopoverBody>
                                                                        <Text fontSize="sm" color="gray.500">
                                                                            A valid price is a negative number.<br></br>
                                                                            If you want to add a price for free, enter 0 or nothing.
                                                                        </Text>
                                                                        <NumberInput max={9999} min={0} onChange={handlePriceChange} >
                                                                            <NumberInputField placeholder='For Example... 15' />
                                                                            <NumberInputStepper >
                                                                                <NumberIncrementStepper />
                                                                                <NumberDecrementStepper />
                                                                            </NumberInputStepper>
                                                                        </NumberInput>
                                                                    </PopoverBody>
                                                                    <PopoverFooter
                                                                        border='0'
                                                                        display='flex'
                                                                        alignItems='center'
                                                                        justifyContent='space-between'
                                                                        pb={4}
                                                                    >
                                                                        <ButtonGroup size='sm' >
                                                                            <Button colorScheme='green' onClick={() => adjustItemsPrice(item, Number(newprice))}>Change Price</Button>
                                                                        </ButtonGroup>
                                                                    </PopoverFooter>
                                                                </PopoverContent>
                                                            </Portal>
                                                        </Popover>

                                                        <Text className='btn btn-outline-dark border-0' mx={2} fontSize="xs" role='button' onClick={() => decreaseQuantity(item)} >-</Text>
                                                        <Text mx={2} fontSize="lg" >{item.quantity}</Text>
                                                        <Text className='btn btn-outline-dark border-0' mx={2} fontSize="xs" role='button' onClick={() => increaseQuantity(item)}>+</Text>
                                                    </Flex>
                                                    <Box textAlign="right">
                                                        <Text fontWeight="bold">
                                                            ${((item.adjusted_price * item.quantity))}
                                                            {item.quantity > 1 && (
                                                                <Text as="span" fontSize="sm" color="gray.500">
                                                                    {' / '} ${item.adjusted_price}{' per unit'}
                                                                </Text>
                                                            )}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                            ))}
                                        </Flex>
                                    )}
                                </div>
                                {/* </div> */}
                            </div>
                        </div>
                        <Flex mt={10} alignItems="center" justifyContent="center" gap={4}>
                            {cart.length === 0 ? (
                                <Text>Subtotal (0 items):</Text>
                            ) : (
                                <Text>
                                    Subtotal ({countItems()} items): <strong>${countTotal()}</strong>
                                </Text>
                            )}
                            {/* info */}
                            <Text>
                                {TYPECODE?.toString().includes('0') ?
                                    (
                                        localStorage.getItem('city')?.includes('Rishon Lezion') ?
                                            (countTotal() < 40 ?
                                                <CircularProgress value={(countTotal() / 40) * 100} color='red.400'>
                                                    <CircularProgressLabel>{Math.floor((countTotal() / 40) * 100)}%</CircularProgressLabel>
                                                </CircularProgress>
                                                :
                                                <CircularProgress value={100} color='green.400'>
                                                    <CircularProgressLabel>100%</CircularProgressLabel>
                                                </CircularProgress>
                                            )
                                            :
                                            (countTotal() < 60 ?
                                                < CircularProgress value={(countTotal() / 60) * 100} color='red.400'>
                                                    <CircularProgressLabel>{Math.floor((countTotal() / 60) * 100)}%</CircularProgressLabel>
                                                </CircularProgress>
                                                :
                                                <CircularProgress value={100} color='green.400'>
                                                    <CircularProgressLabel>100%</CircularProgressLabel>
                                                </CircularProgress>
                                            )
                                    )
                                    :
                                    <div></div>
                                }
                            </Text>
                            {/* cart reset */}
                            <Popover>
                                <PopoverTrigger>
                                    <Text className="material-symbols-outlined btn btn-outline-danger border-0 " mx={2} fontSize="lg" role='button' > remove_shopping_cart
                                    </Text>
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
                                                Are you sure you want to reset the cart?
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
                                                <Button colorScheme='red' onClick={() => resetCart()}>Yes, Delete</Button>
                                            </ButtonGroup>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </Portal>
                            </Popover>
                            {/* cart to db */}
                            <Popover>
                                <PopoverTrigger>
                                    <Text className="material-symbols-outlined btn btn-outline-dark border-0 " mx={2} fontSize="lg" role='button' > payments
                                    </Text>
                                </PopoverTrigger>
                                <Portal>
                                    <PopoverContent bg={'#F2F1EB'}>
                                        {/* <PopoverArrow /> */}
                                        <PopoverCloseButton />
                                        <PopoverHeader pt={4} fontWeight='bold' border='0'>
                                            This action is irreversible.
                                        </PopoverHeader>
                                        <PopoverBody>
                                            <Text fontSize='sm'>
                                                Are you sure you want to forward to payment?<br />
                                                Proceed by choosing a payment method.
                                            </Text>
                                        </PopoverBody>
                                        <PopoverFooter
                                            border='0'
                                            display='flex'
                                            alignItems='center'
                                            justifyContent="center"
                                            pb={4}
                                        >
                                            <Text className="material-symbols-outlined btn btn-success border-0 " mx={2} fontSize="lg" role='button' onClick={() => enforceMinimum('cash')}> attach_money
                                            </Text>
                                            <Text className="material-symbols-outlined btn btn-info border-0 " mx={2} fontSize="lg" role='button' onClick={() => enforceMinimum('card')}> credit_card
                                            </Text>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </Portal>
                            </Popover>
                            {/* credit card payment modal */}
                            <Modal
                                isOpen={isOpen}
                                onClose={onClose}
                                isCentered
                            >
                                <ModalOverlay backdropFilter='blur(10px)' />
                                <ModalContent bg={'#F2F1EB'}>
                                    {TYPECODE?.toString().includes('0') ?
                                        <ModalHeader>Delivery for <strong>{getCustomerName(Number(localStorage.getItem('customer')))}</strong> to <strong>{localStorage.getItem('city')}</strong></ModalHeader>
                                        :
                                        <ModalHeader>TakeAway for <strong>{getCustomerName(Number(localStorage.getItem('customer')))}</strong></ModalHeader>
                                    }
                                    <Text>Total: ${countTotal()}</Text>
                                    <ModalCloseButton />
                                    <ModalBody pb={6} >
                                        <Text>Choose Card Payment Options</Text>

                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                                            Close
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </Flex>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default OrderItems