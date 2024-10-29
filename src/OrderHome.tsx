import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { getCustomersAsync } from './features/customer/customerSlice'
import { getDishesAsync } from './features/dish/dishSlice'
import { getCategoriesAsync } from './features/category/categorySlice'
import { getOrdersAsync, selectOrders } from './features/order/orderSlice'
import { Divider, Grid, GridItem, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import { Tab } from 'bootstrap'

const OrderHome = () => {
    const dispatch = useAppDispatch()

    const cities = [
        {
            city: ["Rishon Lezion"],
            dFee: 5,
            mOrder: 40
        },
        {
            city: [
                "Tel Aviv",
                "Beer Yaakov",
                "Nes Tziona",
                "Nir Tzvi",
                "Gan Sorek"
            ],
            dFee: 10,
            mOrder: 60
        },
    ]

    const takeOrder = (typeCode: number) => {
        dispatch(getCustomersAsync())
        dispatch(getDishesAsync())
        dispatch(getCategoriesAsync())
        dispatch(getOrdersAsync())
        localStorage.setItem('typecode', String(typeCode))
    }

    return (
        <div className="container mt-4">
            <div className="jumbotron border p-4 " style={{ backgroundColor: '#EEE7DA', fontFamily: 'Poppins, sans-serif', borderRadius: '10px' }}>
                <h1 className="text-center mb-4">Choose Your Order Type</h1>

                <Divider />
                <Grid
                    templateRows='auto 1fr auto'
                    templateColumns='repeat(5, 1fr)'
                    gap={4}
                >
                    <GridItem colSpan={5} alignContent='center'>
                        <Text className="text-center mb-0">
                            Delivery includes a <strong>delivery fee</strong> and requires a <strong>minimum order</strong>.
                        </Text>
                        <Text className="text-center mb-0">
                            No minimum cost for take-away orders.
                        </Text>
                    </GridItem>
                    <GridItem colSpan={5} alignContent='center'>
                        <TableContainer>
                            <Table size='sm' variant='striped' colorScheme='green'>
                                <TableCaption color="gray.700">Delivery Fees & Minimum Cost</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>City</Th>
                                        <Th>Delivery Fee ($)</Th>
                                        <Th>Minimum order ($)</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {cities.map(info => (
                                        <Tr>
                                            <Td>{info.city.length > 1 ? info.city.map(city => <Text>{city}</Text>) : info.city}</Td>
                                            <Td>{info.dFee}</Td>
                                            <Td>{info.mOrder}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </GridItem>
                    <GridItem colSpan={5} alignContent='center'>
                        <Text className="text-center" mb={0} fontSize="sm" color="gray.700">
                            Need help? Click the <strong>question mark</strong> icon in the bottom right corner for assistance.
                        </Text>
                    </GridItem>
                </Grid>
            </div>

            {/* Options Section */}
            <div className="row mt-4 justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm mb-4" style={{ borderRadius: '10px', backgroundColor: '#EEE7DA' }}>
                        <Link className="card-body text-center btn" to='/orderdetails' onClick={() => takeOrder(0)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#2E2E2E' }}>
                                two_wheeler
                            </span>
                            <h5 className="card-title mt-2">Delivery</h5>
                        </Link>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card shadow-sm mb-4" style={{ borderRadius: '10px', backgroundColor: '#EEE7DA' }}>
                        <Link className="card-body text-center btn" to='/orderdetails' onClick={() => takeOrder(1)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#2E2E2E' }}>
                                shopping_bag
                            </span>
                            <h5 className="card-title mt-2">Take Away</h5>
                        </Link>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default OrderHome