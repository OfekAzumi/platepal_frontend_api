import React from 'react';
import { Outlet } from 'react-router-dom';
import TitleNavBar from './TitleNavBar';
import NavBar from './NavBar';
import OrderHome from './OrderHome';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <div className="App" >
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <TitleNavBar />
          <div style={{ flex: '1', position: 'relative', zIndex: '1' }}>
            <Outlet />
          </div>
          <NavBar />
        </div>

      </div>
    </ChakraProvider >

  );
}

export default App;
