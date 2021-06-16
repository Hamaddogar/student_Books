import React from 'react';
import './SideBar.scss';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import UserBasicDetails from '../User/UserBasicDetails';
import Categories from '../../../data/Categories';

const SideBar = props => {
    const { user, loginPop } = props;
    return (
        <div className='SideBarContainer'>
            {props.className === 'open' && <div className='blur' onClick={props.close}></div>}
            <div className={`SideBar flex col shadow ${props.className}`}>
                {user ? <UserBasicDetails user={user} /> : (
                    <div>
                        <NavLink replace to='/' className='shadow title'>
                            <img src={logo} alt='' height='41' />
                            Student Books
                        </NavLink>
                        <NavLink replace exact to='/'><i className='fas fa-home'></i>Home</NavLink>
                        <NavLink to='/post'><i className='fas fa-book'></i>Sell your book</NavLink>
                        <div className='link' onClick={loginPop}><i className='fas fa-sign-in-alt'></i>Sign in</div>
                    </div>
                )}

                {user && (
                    <div>
                        <NavLink to='/post'><i className='fas fa-book'></i>Sell your book</NavLink>
                        <NavLink to='/changepassword'><i className='fas fa-key'></i>Change password</NavLink>
                        <NavLink to='/feedback'><i className='fas fa-comment'></i>Feedback</NavLink>
                        <div onClick={props.signout} className='link'><i className='fas fa-sign-out-alt'></i>Sign Out</div>
                    </div>

                )}
                <div className='subtitle'>Categories</div>
                <div className='fg'>
                    {Categories
                        .map((props, index) =>
                            <NavLink replace key={index} to={`/category/${props.route}`}>
                                <i className={`fas fa-${props.icon}`}></i>
                                {props.cat}
                            </NavLink>
                        )}
                </div>
                <div className='subtitle'></div>
            </div>
        </div>
    )
}

export default SideBar;