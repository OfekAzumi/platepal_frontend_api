import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
// import { addCategoryAsync, updateCategoryAsync, deleteCategoryAsync, selectCategories, getCategoriesAsync } from './categorySlice'
import { Button, ButtonGroup, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { selectLogged } from '../login/loginSlice'
import { addCategoryAsync, deleteCategoryAsync, getCategoriesAsync, selectCategories, updateCategoryAsync } from './categorySlice'


const CategoryManagement = () => {

    const textStyle = {
        color: '#88AB8E',
        fontFamily: 'Diphylleia, sans-serif'
    }
    const shadowStyle = {
        borderRadius: '10px', outline: 'none', boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
    }

    // category card details
    const [catName, setcatName] = useState('')
    const [catUnicode, setcatUnicode] = useState('')
    const [catId, setcatId] = useState(0)
    const logged = useAppSelector(selectLogged);

    const [searchTerm, setSearchTerm] = useState('');
    const categories = useAppSelector(selectCategories)
    const [forceUpdate, setForceUpdate] = useState(false);

    const dispatch = useAppDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    // filter categories by search term
    const filteredCategories = categories.filter((category) => {
        const nameMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
        const unicodeMatch = String(category.unicode).toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || unicodeMatch;
    });


    // add data refresh and toast display
    const addData = () => {
        dispatch(addCategoryAsync({ unicode: catUnicode, name: catName })).then(res => {
            if ((res.type).includes("category/Add/fulfilled")) {
                toast({
                    title: 'Category Added.',
                    description: `We've successfully added the category data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("category/Add/rejected")) {
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
        dispatch(updateCategoryAsync({ id: catId, unicode: catUnicode, name: catName })).then(res => {
            if ((res.type).includes("category/Update/fulfilled")) {
                toast({
                    title: 'Category Information Updated.',
                    description: `We've updated the category data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("category/Update/rejected")) {
                toast({
                    title: 'An Error Occurred.',
                    description: 'A valid unicode is a 3-digit unique integer.',
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
        dispatch(deleteCategoryAsync(catId)).then(res => {
            if ((res.type).includes("category/Delete/fulfilled")) {
                toast({
                    title: 'Category Deleted.',
                    description: `We've successfully deleted the category data for you.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else if ((res.type).includes("category/Delete/rejected")) {
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
        setcatId(0)
        setcatUnicode('')
        setcatName('')
        setSearchTerm('')
        dispatch(getCategoriesAsync())
        setForceUpdate(prev => !prev);
    }

    // open modal and change unicode according to data
    const openModal = () => {
        onOpen()
        categories[0].id == -1 ? setcatUnicode('100') : setcatUnicode(((categories[categories.length - 1].unicode) + 1))
    }

    useEffect(() => {
        // This effect will run whenever forceUpdate changes
    }, [forceUpdate]);

    const handleCodeChange = (value: any) => {
        setcatUnicode(value);
    };

    return (
        <div>
            {logged ?
                <div>
                    <h5 className="mt-3 text-center" style={textStyle}>Manage Your Restaurant's Categories</h5>
                    <div className="container-fluid" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {/* Orders Header */}

                        {/* Order Management Section */}
                        <div className="row mt-4 " >
                            {/* Left Side - List with Order Cards and Click Button */}
                            <div className="col-md-3" >
                                {categories.length.toString().includes('0') ?
                                    <div className="card mb-2 bg-transparent">
                                        <div className="card-body d-flex align-items-center">
                                            <h5 className="card-title">No Categories Available</h5>
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
                                            {filteredCategories.map(category => (
                                                <div className="card mb-2 bg-transparent" key={category.id}>
                                                    <div className="card-body d-flex align-items-center">
                                                        <h5 className="card-title ">{category.name}</h5>
                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <span className="ml-auto mr-2 btn btn-outline-danger border-0 d-flex align-items-center" role='button'>
                                                                    <span className="material-symbols-outlined"
                                                                        onClick={() => (
                                                                            setcatName(category.name),
                                                                            setcatId(category.id),
                                                                            setcatUnicode(String(category.unicode))
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
                                                                            Are you sure you want to delete the <span style={{ fontWeight: 'bold' }}>{catName}</span> category?
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
                                                                    setcatName(category.name),
                                                                    setcatId(category.id),
                                                                    setcatUnicode(String(category.unicode))
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
                                            <h5 className="mb-3">Category Details</h5>
                                        </div>
                                        <div className="col-6 text-right">
                                            <span className="material-symbols-outlined" role='button' onClick={() => openModal()}>add</span>
                                        </div>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="unicodeInput">Unicode:</label>
                                        <input
                                            type="number"
                                            className="form-control bg-transparent border-0"
                                            id="unicodeInput"
                                            value={String(catUnicode)}
                                            style={shadowStyle}
                                            onChange={(evt => setcatUnicode(evt.target.value))}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="nameInput">Name:</label>
                                        <input
                                            type="text"
                                            className="form-control bg-transparent border-0"
                                            id="nameInput"
                                            value={catName}
                                            style={shadowStyle}
                                            onChange={(evt => setcatName(evt.target.value))}
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
                                        Save
                                    </button>

                                    {/* Add order details here */}
                                </div>

                                {/* Add more cards as needed */}
                            </div>
                        </div>
                    </div>
                </div>
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
                    <ModalHeader>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6} >
                        <FormControl isRequired>
                            <FormLabel>Unicode</FormLabel>
                            <FormHelperText>
                                <Text fontSize="sm" color="gray.500">
                                    Category unique-code, unicode, is a 3-digit number.
                                    You can start from 100 to 999.
                                </Text>
                            </FormHelperText>
                            {categories.length.toString().includes('0') ?
                                <NumberInput max={999} min={100} onChange={handleCodeChange} >
                                    <NumberInputField placeholder='For Example... 001' />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                :

                                <Input
                                    placeholder='Unicode'
                                    value={((categories[categories.length - 1].unicode) + 1)}
                                    disabled
                                />
                            }
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Category Name</FormLabel>
                            <Input
                                placeholder='For Example... Staters'
                                onChange={(eve) => setcatName(eve.target.value)}
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
            </Modal>

        </div >
    )
}

export default CategoryManagement