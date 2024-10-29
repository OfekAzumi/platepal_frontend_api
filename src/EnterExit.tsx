import { Button, FormControl, FormHelperText, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'

const EnterExit = (props: any) => {


    const { isOpen, onOpen, onClose } = useDisclosure()

    

    return (
        <div className="modal-dialog modal-sm modal-dialog-centered">
            {/* <div className="modal-content" style={{ backgroundColor: '#F2F1EB', fontFamily: 'Poppins, sans-serif' }}>
                {props.data == 'enter' ?
                    <div className="modal-header text-center mx-auto">
                        <h4 className="modal-title text-center" style={{ color: '#2E2E2E' }}>Nice To See You!</h4>
                    </div>
                    : props.data == 'exit' ?
                        <div className="modal-header text-center mx-auto">
                            <h4 className="modal-title text-center" style={{ color: '#2E2E2E' }}>Thank You For Today!</h4>
                        </div>
                        :
                        <div className="modal-header text-center mx-auto">
                            <h4 className="modal-title text-center" style={{ color: '#2E2E2E' }}>Active Workers</h4>
                        </div>
                }

                {props.data == 'enter' ?
                    (<div>
                        <div className="modal-body">
                            <p className="text-center">Enter Your Worker Code:</p>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control border-1 bg-transparent"
                                    placeholder="Enter Worker Code Here" aria-label="Worker Code" aria-describedby="workerCodeAddon"
                                    onChange={(evt) => setcode(evt.target.value)}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="workerCodeAddon" ><i className="fas fa-user"></i></span>
                                </div>
                            </div>
                        </div>



                        <div className="modal-footer d-flex justify-content-center">
                            <button type="button" className="btn border btn-lg btn-block"
                                style={{ backgroundColor: '#EEE7DA', fontFamily: 'Poppins, sans-serif', color: '#2E2E2E' }}

                                onClick={() => createTime()}
                            >
                                ENTER
                            </button>
                        </div>
                    </div>)
                    : props.data == 'exit' ?
                        (<div>
                            <div className="modal-body">
                                <p className="text-center">Enter Your Worker Code:</p>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control border-1 bg-transparent"
                                        placeholder="Enter Worker Code Here" aria-label="Worker Code" aria-describedby="workerCodeAddon"
                                        onChange={(evt) => setcode(evt.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text" id="workerCodeAddon" ><i className="fas fa-user"></i></span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer d-flex justify-content-center">
                                <button type="button" className="btn btn-danger border btn-lg btn-block"
                                    style={{ backgroundColor: '#EEE7DA', fontFamily: 'Poppins, sans-serif', color: '#2E2E2E' }} data-dismiss="modal">
                                    EXIT
                                </button>
                            </div>
                        </div>)
                        :
                        <div></div>
                }

            </div> */}

            
        </div>
    )
}

export default EnterExit