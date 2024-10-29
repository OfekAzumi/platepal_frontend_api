import React, { useEffect, useRef, useState } from 'react'
import { addOrderAsync, executePaypalPaymentAsync } from './features/order/orderSlice';
import { Box, Flex, Heading, Spinner, Text, useToast } from '@chakra-ui/react';
import { useAppDispatch } from './app/hooks';
import { dbData } from './OrderItems';
import { Navigate } from 'react-router-dom';

const Loading = () => {

    const dispatch = useAppDispatch();
    const toast = useToast();
    const [navigate1, setNavigate1] = useState(false);
    const [navigate2, setNavigate2] = useState(false);
    const hasFetched = useRef(false); // Ref to ensure one-time execution

    const ExecutePaypalPayment = (paypalData: { paymentId: string; payerId: string }, dbData: dbData) => {
        dispatch(executePaypalPaymentAsync(paypalData)).then(res => {
            if (res.type.includes("order/PaypalExecute/fulfilled")) {
                toast({
                    title: "Paypal Payment Completed Successfully.",
                    description: "Your paypal payment has been fulfilled, please wait for an order confirmation.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                sendCart(dbData);
            } else {
                toast({
                    title: "An Error Occurred.",
                    description: "Paypal Payment Failed. Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        });
    };

    const sendCart = (data: dbData) => {
        if (data) {
            dispatch(addOrderAsync(data)).then(res => {
                if (res.type.includes("order/Add/fulfilled")) {
                    toast({
                        title: `Order #${data.unicode} Completed Successfully.`,
                        description: "Your order has been fulfilled and is on its way! Thank you for choosing us.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                    setNavigate1(true);
                } else {
                    toast({
                        title: "An Error Occurred.",
                        description: "Unable to add data. Please try again.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                    setNavigate2(false);
                }
            });
        }
    };

    useEffect(() => {
        if (hasFetched.current) return; // Stop if already fetched

        const fetchData = async () => {
            hasFetched.current = true; // Mark as fetched
            const dbData = localStorage.getItem("dbData");
            if (dbData) {
                localStorage.clear();
                const queryParams = new URLSearchParams(window.location.search);
                const paymentId = queryParams.get("paymentId");
                const payerId = queryParams.get("PayerID");

                if (paymentId && payerId) {
                    ExecutePaypalPayment({ paymentId, payerId }, JSON.parse(dbData));
                } else {
                    toast({
                        title: "An Error Occurred.",
                        description: "Unable to fetch payment data from PayPal. Please try again.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                    setNavigate2(true);
                }
            } else {
                toast({
                    title: "An Error Occurred.",
                    description: "Unable to fetch data from order items. Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                setNavigate2(true);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {navigate1 ? <Navigate to='/orderhome' />
                :
                navigate2 ? <Navigate to='/' />
                    :
                    <div />
            }
            <Flex
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
            >
                <Box
                    bg="#EEE7DA"
                    p="6"
                    borderRadius="md"
                    boxShadow="lg"
                    textAlign="center"
                    maxW="500px"
                    w="full"
                >
                    <Heading as="h1" size="lg" fontFamily="Poppins, sans-serif" mb="4">
                        Processing Your Request
                    </Heading>
                    <Text fontFamily="Poppins, sans-serif" mb="6">
                        Please hold on while we prepare your data. You’ll be redirected shortly.
                    </Text>
                    <Spinner
                        thickness="6px"
                        speed="0.65s"
                        emptyColor="rgba(255, 255, 255, 0.1)"
                        color="green.500"
                        size="xl"
                    />
                </Box>
            </Flex>
        </div>
    )
}

export default Loading