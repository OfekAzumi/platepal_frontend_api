import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { addCustomerAsync, getCustomerByPhoneAsync, getCustomersAsync, selectCustomerByPhone, selectCustomers, updateCustomerAsync } from './features/customer/customerSlice'
import { Input, InputGroup, InputLeftElement, InputRightElement, useToast } from '@chakra-ui/react'
import { Navigate } from "react-router-dom";
import { getDishesAsync } from './features/dish/dishSlice';
import { getCategoriesAsync } from './features/category/categorySlice';
import { selectOrders } from './features/order/orderSlice';

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

const OrderDetails = () => {
    const cities = [
        "Rishon Lezion",
        "Tel Aviv",
        "Beer Yaakov",
        "Nes Tziona",
        "Nir Tzvi",
        "Gan Sorek"
    ]

    const [orderUnicode, setorderUnicode] = useState('')
    const [orderName, setorderName] = useState('')
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
    const [searchTerm, setSearchTerm] = useState('');
    const [forceUpdate, setForceUpdate] = useState(false);
    const customers = useAppSelector(selectCustomers)
    const dispatch = useAppDispatch()
    const toast = useToast()

    const [navigate, setNavigate] = useState(false)
    const orders = useAppSelector(selectOrders)

    const textStyle = {
        color: '#88AB8E',
        fontFamily: 'Diphylleia, sans-serif'
    }
    const shadowStyle = {
        borderRadius: '10px', outline: 'none', boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
    }


    const LocalStorageOrderUnicode = () => {
        localStorage.setItem('unicode', String((orders[orders.length - 1].unicode) + 1))
    }

    // add data refresh and toast display
    const addData = () => {
        console.log({
            unicode: custUnicode,
            name: custName,
            phone: custPhone,
            city: custCity,
            address: custAddress,
            apt: custApt,
            entry: custEntry,
            floor: custFloor,
            notes: custNotes
        });
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
                });
                if (localStorage.getItem('typecode') === '0') {
                    localStorage.setItem('city', String(custCity))
                } else { localStorage.setItem('city', '') }
                dispatch(getCustomersAsync()).then(result => localStorage.setItem('customer', String(result.payload[result.payload.length - 1].id)))
                dispatch(getDishesAsync())
                dispatch(getCategoriesAsync())
                setNavigate(true)
            } else if ((res.type).includes("customer/Add/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'Unable to add data. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
                setNavigate(false)
            }
            refreshData()
        });
    }

    // update data refresh and toast display
    const updateData = () => {
        console.log({
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
        });
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
                });
                if (localStorage.getItem('typecode') === '0') {
                    localStorage.setItem('city', String(res.payload.city))
                } else { localStorage.setItem('city', '') }
                dispatch(getDishesAsync())
                dispatch(getCategoriesAsync())
                setNavigate(true)
            } else if ((res.type).includes("customer/Update/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'A valid unicode is a 6-digit unique integer.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
                setNavigate(false)
            }
            refreshData()
        });
    }

    function isStringOnlyDigits(inputString: string) {
        return /^\d+$/.test(inputString);
    }

    const searchCustomer = () => {
        if (searchTerm.length === 10 && isStringOnlyDigits(searchTerm)) {
            dispatch(getCustomerByPhoneAsync(searchTerm)).then(res => {
                if ((res.type).includes("customer/GetByPhone/fulfilled")) {
                    toast({
                        title: 'Customer Found.',
                        description: `We've successfully found the customer data for you.`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    })
                    LocalStorageOrderUnicode()
                    localStorage.setItem('customer', String(res.payload.id))
                    if (localStorage.getItem('typecode') === '0') {
                        localStorage.setItem('city', String(res.payload.city))
                    } else { localStorage.setItem('city', '') }
                    setcustId(res.payload.id)
                    setcustUnicode(res.payload.unicode)
                    setcustName(res.payload.name)
                    setcustPhone(res.payload.phone)
                    setcustCity(res.payload.city)
                    setcustAddress(res.payload.address)
                    setcustApt(res.payload.apt)
                    setcustFloor(res.payload.floor)
                    setcustEntry(res.payload.entry)
                    setcustNotes(res.payload.notes)
                } else if ((res.type).includes("customer/GetByPhone/rejected")) {
                    toast({
                        title: 'An Error Occurred.',
                        description: 'Unable to find a customer by this phone.',
                        status: 'info',
                        duration: 3000,
                        isClosable: true,
                    })
                    setcustId(0)
                    customers.length.toString().includes('0') ? setcustUnicode('100000') : setcustUnicode(((customers[customers.length - 1].unicode) + 1))
                    setcustName('')
                    setcustPhone(searchTerm)
                    setcustCity('')
                    setcustAddress('')
                    setcustApt('')
                    setcustFloor('')
                    setcustEntry('')
                    setcustNotes('')
                }
            });
        } else {
            toast({
                title: 'An Error Occurred.',
                description: 'Phone must be a 10 digit-only number.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            setcustId(0)
            setcustUnicode('')
            setcustName('')
            setcustPhone('')
            setcustCity('')
            setcustAddress('')
            setcustApt('')
            setcustFloor('')
            setcustEntry('')
        }
        setSearchTerm('')
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
        dispatch(getCustomerByPhoneAsync(searchTerm))
        setForceUpdate(prev => !prev);
    }

    useEffect(() => {
        // This effect will run whenever forceUpdate changes
    }, [forceUpdate]);

    return (
        <div style={{ fontFamily: 'Poppins, sans-serif' }}>
            {navigate ? <Navigate to='/orderitems' />
                :
                <div />
            }
            <div className="container mt-4">
                <div>
                    <p className='text-center mt-3'>
                        Please enter customer's phone number.
                    </p>
                </div>
                <InputGroup style={shadowStyle}>
                    <Input type='tel'
                        placeholder="Search by Phone Number..."
                        value={searchTerm}
                        onChange={(eve) => setSearchTerm(eve.target.value)}
                    />
                    <InputRightElement>
                        <i role='button' className="fa fa-search" onClick={() => searchCustomer()}></i>
                    </InputRightElement>
                </InputGroup>
                {/* Order Details Header */}
                {custId === 0 ?
                    <div className="bg-transparent p-3 rounded border mt-4">

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
                                disabled
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
                                        disabled
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
                                <div className="form-group mb-3">
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
                        <button
                            className="btn btn-block mt-3"
                            style={{
                                backgroundColor: '#EEE7DA',
                                fontFamily: 'Poppins, sans-serif',
                                color: '#2E2E2E',
                                borderRadius: '10px',
                            }}
                            onClick={() => addData()}
                        >
                            Add New Customer
                        </button>

                        {/* Add order details here */}
                    </div>
                    :
                    localStorage.getItem('typecode')?.includes('0') ?
                        // delivery - all info
                        <div className="bg-transparent p-3 rounded border mt-4">

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
                                    disabled
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
                                            disabled
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
                                    <div className="form-group mb-3">
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
                                Save & Continue
                            </button>

                            {/* Add order details here */}
                        </div>
                        :
                        // take away - only phone, name and notes
                        <div className="bg-transparent p-3 rounded border mt-4">
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
                                    disabled
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
                                            disabled
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
                            <div className="form-group mb-3">
                                <label>Notes:</label>
                                <textarea
                                    className="form-control bg-transparent border-0"
                                    value={custNotes}
                                    style={shadowStyle}
                                    onChange={(evt) => setcustNotes(evt.target.value)}
                                />
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
                                Save & Continue
                            </button>

                            {/* Add order details here */}
                        </div>
                }


                {/* Add more cards as needed */}
            </div>
        </div >
    )
}

export default OrderDetails