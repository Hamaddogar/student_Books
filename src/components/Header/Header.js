import React, { useContext, useState, Fragment } from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import logo from '../../assets/logo.png';
import SideBar from './SIdeBar/SideBar';
import User from './User/User';
import DropMenu from './DropMenu/DropMenu';
import Categories from '../../data/Categories';
import SearchBar from './SearchBar/SearchBar';
import MobileSearchBar from './MobileSearchBar/MobileSearchBar';
import VerfyEmail from './VerfyEmail/VerfyEmail';
import { signOut } from '../../firebase/firebase-utility';
import CityInput from './CityInput/CityInput';
import MobileCityInput from './MobileCityInput/MobileCityInput';

const Header = () => {
    const { user, loginPop } = useContext(AuthContext);
    const [className, setClass] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showLocation, setShowLocation] = useState(false);
    const getCategories = () => Categories.map(({ cat, route }, index) => <NavLink replace to={`/category/${route}`} key={index}>{cat}</NavLink>)
    return (
        <Fragment>
            <header className='shadow'>
                <div className='container'>
                    {user && (
                        !user.emailVerified && <VerfyEmail />
                    )}
                    <div className='flex-block sb ai navbar'>
                        <div className='flex ai sb smallNav'>
                            <button className='fas fa-bars ss'
                                onClick={() => setClass('open')}
                                onBlur={() => setClass('')}></button>
                            <NavLink to='/' replace className='logo flex ai'>
                                <img src={logo} alt='' />
                                <h3 className='hs'>Student Books</h3>
                            </NavLink>
                            <div className='flex ai'>
                                <i className='fas fa-map-marker-alt ss' onClick={() => setShowLocation(true)} style={{ marginRight: '12px' }}></i>
                                <i className='fas fa-search ss' onClick={() => setShowSearch(true)}></i>
                            </div>
                        </div>
                        <div className='categories'>
                            <div className='dropDownCon'>
                                <div className='dropDowntitle'>
                                    <i className="fas fa-th-large"></i>
                                    Categories
                                </div>
                                <DropMenu left={0}>{getCategories()}</DropMenu>
                            </div>
                        </div>
                        <CityInput />
                        <SearchBar />
                        <ul className='flex ai hs'>

                            <li><NavLink to='/post'>Sell your book</NavLink></li>
                            {user ?
                                <User className='hs' user={user} signout={signOut} /> :
                                <li>
                                    <div className='link' onClick={() => loginPop()}>Sign In</div>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </header>
            <SideBar signout={signOut} user={user} loginPop={() => loginPop()} close={() => setClass('')} className={className} categories={getCategories} />
            {showSearch && <MobileSearchBar clicked={() => setShowSearch(false)} />}
            {showLocation && <MobileCityInput clicked={() => setShowLocation(false)} />}
        </Fragment>
    )
}

export default React.memo(Header);