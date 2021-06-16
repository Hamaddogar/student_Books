import React from 'react';
import './Navbar.scss';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

const Navbar = ({history}) => {
    const moveToPageHandler = () => history.action === "PUSH" ? history.goBack() : history.push('/');
    return (
        <div className='navbar'>
            <nav className='shadow card'>
                <div className='flex ai container'>
                    <i className='fas fa-arrow-left' onClick={moveToPageHandler}></i>
                    <Link to='/' className='logo'><img src={logo} width='48' alt='' /></Link>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;