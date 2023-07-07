import React from 'react'
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import './assets/styles/bootsrap.custom.css';
import './assets/styles/index.css'

const App = () => {
  return (
    <>
      <Header />
      <div className="py-3">
        <Container>
          <Outlet />
        </Container>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App