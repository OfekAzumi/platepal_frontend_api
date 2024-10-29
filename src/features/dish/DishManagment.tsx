import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button, ButtonGroup, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Select, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { selectLogged } from '../login/loginSlice'
import { addDishAsync, deleteDishAsync, getDishesAsync, selectDishes, updateDishAsync } from './dishSlice'
import { selectCategories } from '../category/categorySlice'


const DishManagment = () => {
    const textStyle = {
        color: '#88AB8E',
        fontFamily: 'Diphylleia, sans-serif'
    }
    const shadowStyle = {
        borderRadius: '10px', outline: 'none', boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
    }

    // category card details
    const [dishId, setdishId] = useState(0)
    const [dishName, setdishName] = useState('')
    const [dishUnicode, setdishUnicode] = useState('')
    const [dishDescription, setdishDescription] = useState('')
    const [dishPrice, setdishPrice] = useState(0.0)
    const [dishCategory, setdishCategory] = useState(0)
    const logged = useAppSelector(selectLogged);

    const [searchTerm, setSearchTerm] = useState('');
    const dishes = useAppSelector(selectDishes)
    const categories = useAppSelector(selectCategories)
    const [forceUpdate, setForceUpdate] = useState(false);

    const dispatch = useAppDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    // filter categories by search term
    const filteredDishes = dishes.filter((dish) => {
        const nameMatch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
        const unicodeMatch = String(dish.unicode).toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || unicodeMatch;
    });


    // add data refresh and toast display
    const addData = () => {
        console.log({ unicode: dishUnicode, name: dishName, price: dishPrice, description: dishDescription, category: dishCategory });
        dispatch(addDishAsync({ unicode: dishUnicode, name: dishName, price: dishPrice, description: dishDescription, category: dishCategory })).then(res => {
            if ((res.type).includes("dish/Add/fulfilled")) {
                toast({
                    title: 'Dish Added.',
                    description: `We've successfully added the dish data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("dish/Add/rejected")) {
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
        dispatch(updateDishAsync({ id: dishId, unicode: dishUnicode, name: dishName, price: dishPrice, description: dishDescription, category: dishCategory })).then(res => {
            if ((res.type).includes("dish/Update/fulfilled")) {
                toast({
                    title: 'Dish Information Updated.',
                    description: `We've updated the dish data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("dish/Update/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'A valid unicode is a 4-digit unique integer.',
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
        dispatch(deleteDishAsync(dishId)).then(res => {
            if ((res.type).includes("dish/Delete/fulfilled")) {
                toast({
                    title: 'Dish Deleted.',
                    description: `We've successfully deleted the dish data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("dish/Delete/rejected")) {
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
        setdishId(0)
        setdishUnicode('')
        setdishName('')
        setdishPrice(0.0)
        setdishDescription('')
        setdishCategory(0)
        setSearchTerm('')
        dispatch(getDishesAsync())
        setForceUpdate(prev => !prev);
    }

    // open modal and change unicode according to data
    const openModal = () => {
        onOpen()
        dishes[0].id == -1 ? setdishUnicode('1000') : setdishUnicode(((dishes[dishes.length - 1].unicode) + 1))
    }

    useEffect(() => {
        // This effect will run whenever forceUpdate changes
    }, [forceUpdate]);

    const handleCodeChange = (value: any) => {
        setdishUnicode(value);
    };

    return (
        <div style={{
            position: 'relative',
            zIndex: '1001'
        }}>
            {
                logged ?
                    <div>
                        < h5 className="mt-3 text-center" style={textStyle} > Manage Your Restaurant's Dishes</h5>
                        < div className="container-fluid" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {/* Orders Header */}

                            {/* Order Management Section */}
                            <div className="row mt-4 " >
                                {/* Left Side - List with Order Cards and Click Button */}
                                <div className="col-md-3" >
                                    {dishes.length.toString().includes('0') ?
                                        <div className="card mb-2 bg-transparent">
                                            <div className="card-body d-flex align-items-center">
                                                <h5 className="card-title">No Dishes Available</h5>
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
                                                {filteredDishes.map(dish => (
                                                    <div className="card mb-2 bg-transparent" key={dish.id}>
                                                        <div className="card-body d-flex align-items-center">
                                                            <h5 className="card-title ">{dish.name}</h5>
                                                            <Popover>
                                                                <PopoverTrigger>
                                                                    <span className="ml-auto mr-2 btn btn-outline-danger border-0 d-flex align-items-center" role='button'>
                                                                        <span className="material-symbols-outlined"
                                                                            onClick={() => (
                                                                                setdishName(dish.name),
                                                                                setdishId(dish.id),
                                                                                setdishUnicode(String(dish.unicode)),
                                                                                setdishPrice(dish.price),
                                                                                setdishDescription(dish.description),
                                                                                setdishCategory(dish.category)
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
                                                                                Are you sure you want to delete <span style={{ fontWeight: 'bold' }}>{dishName}</span> from the dishes database?
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
                                                                        setdishName(dish.name),
                                                                        setdishId(dish.id),
                                                                        setdishUnicode(String(dish.unicode)),
                                                                        setdishPrice(dish.price),
                                                                        setdishDescription(dish.description),
                                                                        setdishCategory(dish.category)
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
                                                <h5 className="mb-3">Dishes Details</h5>
                                            </div>
                                            <div className="col-6 text-right">
                                                <span className="material-symbols-outlined" role='button' onClick={() => openModal()}>add</span>
                                            </div>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label>Unicode:</label>
                                            <input
                                                type="number"
                                                className="form-control bg-transparent border-0"
                                                value={String(dishUnicode)}
                                                style={shadowStyle}
                                                onChange={(evt => setdishUnicode(evt.target.value))}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Name:</label>
                                            <input
                                                type="text"
                                                className="form-control bg-transparent border-0"
                                                value={dishName}
                                                style={shadowStyle}
                                                onChange={(evt => setdishName(evt.target.value))}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Price:</label>
                                            <input
                                                type="text"
                                                className="form-control bg-transparent border-0"
                                                value={dishPrice.toString()}
                                                style={shadowStyle}
                                                onChange={(evt => setdishPrice(parseFloat(evt.target.value)))}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label >Description:</label>
                                            <textarea
                                                className="form-control bg-transparent border-0"
                                                value={dishDescription}
                                                style={shadowStyle}
                                                onChange={(evt) => setdishDescription(evt.target.value)}
                                            />
                                        </div>
                                        {(categories.length.toString().includes('0')) ?
                                            <div className="form-group mb-3">
                                                <label>Must Add Categories To Use A Dish.</label>
                                            </div>
                                            :
                                            <div className="form-group mb-3">
                                                <label>Category:</label>
                                                <select
                                                    className="form-control bg-transparent border-0"
                                                    value={dishCategory}
                                                    style={shadowStyle}
                                                    onChange={(evt) => setdishCategory(Number(evt.target.value))}
                                                >
                                                    <option value="">Select a category</option>
                                                    {categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
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
                <ModalContent bg={'#F2F1EB'}>
                    <ModalHeader>Create your dish</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6} >
                        <FormControl isRequired>
                            <FormLabel>Dish Unicode</FormLabel>
                            <FormHelperText>
                                <Text fontSize="sm" color="gray.500">
                                    Dish unique-code, unicode, is a 4-digit number.
                                    You can start from 1000 to 9999.
                                </Text>
                            </FormHelperText>
                            {dishes.length.toString().includes('0') ?
                                <NumberInput max={9999} min={1000} onChange={handleCodeChange} >
                                    <NumberInputField placeholder='For Example... 1000' />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                :

                                <Input
                                    placeholder='Unicode'
                                    value={((dishes[dishes.length - 1].unicode) + 1)}
                                    disabled
                                />
                            }
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Dish Name</FormLabel>
                            <Input
                                placeholder='For Example... Roast Beef'
                                onChange={(eve) => setdishName(eve.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Dish Price</FormLabel>
                            <Input
                                placeholder='For Example... 9.9'
                                onChange={(eve) => setdishPrice(parseFloat(eve.target.value))}
                            />
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Dish Description</FormLabel>
                            <Textarea
                                placeholder='For Example... carrot, beef, etc'
                                onChange={(eve) => setdishDescription(eve.target.value)}
                            />
                        </FormControl>

                        {(categories.length.toString().includes('0')) ?
                            <FormControl mt={4}>
                                <FormLabel>Must Add Categories To Use A Dish.</FormLabel>
                            </FormControl>

                            :
                            <FormControl mt={4} isRequired>
                                <FormLabel>Dish Category</FormLabel>
                                <Select
                                    value={dishCategory}
                                    onChange={(evt) => setdishCategory(Number(evt.target.value))}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => addData()}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div >
    )
}

export default DishManagment