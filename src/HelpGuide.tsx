import { Divider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useState } from 'react'

const HelpGuide = () => {

    return (
        <div>
            <div className="modal-content" style={{ backgroundColor: '#F2F1EB', fontFamily: 'Poppins, sans-serif' }}>

                <div className="modal-header text-center mx-auto">
                    <h4 className="modal-title" style={{ color: '#2E2E2E' }}>We're Here For You</h4>
                </div>

                <div className="modal-body">
                    <p className="text-center">Relax and follow these simple steps:</p>
                    <p className="text-center">On the <span style={{ color: '#88AB8E', fontFamily: 'Diphylleia, sans-serif' }}>Take-An-Order</span> page, make sure to select your preferred order type</p>
                    <Divider />
                    <h5 className="text-center mt-4" style={{ color: '#2E2E2E' }}>Select Your Preferred Order Type</h5>
                    <Tabs isFitted variant='enclosed'>
                        <TabList mt='1em' mb='1em'>
                            <Tab>Delivery</Tab>
                            <Tab>Take Away</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <div>
                                    <ul>
                                        <li>Check full name, full address, and add any necessary customer notes.</li>
                                        <li>Repeat the order and wait for customer confirmation.</li>
                                        <li>Add utensils as required.</li>
                                    </ul>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div>
                                    <ul>
                                        <li>Verify the full name and add any additional necessary customer notes.</li>
                                        <li>Repeat the order and wait for customer confirmation.</li>
                                        <li>Add utensils as required.</li>
                                    </ul>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>

                <div className="modal-footer d-flex justify-content-center">
                    <p>You got this! <span role="img" aria-label="heart">❤️</span></p>
                </div>

            </div>
        </div>
    )

}

export default HelpGuide