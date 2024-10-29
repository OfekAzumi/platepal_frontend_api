import { Box, Button, Container, Heading, Icon, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const Home = () => {

    return (
        <div>
            <Container maxW="container.lg" py={6}>
                <Box
                    bg="#EEE7DA"
                    borderRadius="md"
                    boxShadow="md"
                    p={6}
                    textAlign="center"
                    fontFamily="Poppins, sans-serif"
                >
                    <Heading as="h1" size="2xl" mb={4}>
                        Welcome to PlatePal
                    </Heading>
                    <Text fontSize="lg" mb={6}>
                        Your all-in-one solution for restaurant delivery and takeaway order management.<br />
                        Experience seamless operations with PlatePal!
                    </Text>
                </Box>

                <VStack spacing={8} align="stretch" mt={8}>
                    <Heading as="h2" size="xl" textAlign="center">
                        What Can I Do?
                    </Heading>
                    <SimpleGrid columns={[1, 2, 4]} spacing={10} >
                        <Box textAlign="center" p={4} borderRadius="md" boxShadow="md" bg="#EEE7DA">
                            <Text fontSize="lg" fontWeight="bold">Role-Based Views</Text>
                            <Text>Managers manage employees and orders, employees can handle shifts and payments.</Text>
                        </Box>
                        <Box textAlign="center" p={4} borderRadius="md" bg="#EEE7DA" boxShadow="md">
                            <Text fontSize="lg" fontWeight="bold">Order Creation & Tracking</Text>
                            <Text>Easily search for dishes, add orders, and track order status.</Text>
                        </Box>
                        <Box textAlign="center" p={4} borderRadius="md" bg="#EEE7DA" boxShadow="md">
                            <Text fontSize="lg" fontWeight="bold">PayPal Integration</Text>
                            <Text>Customers can pay by cash or credit through PayPal.</Text>
                        </Box>
                        <Box textAlign="center" p={4} borderRadius="md" bg="#EEE7DA" boxShadow="md">
                            <Text fontSize="lg" fontWeight="bold">Management Board</Text>
                            <Text>A tailored dashboard for managers to oversee operations.</Text>
                        </Box>
                    </SimpleGrid>
                </VStack>
            </Container>
        </div>
    )
}

export default Home