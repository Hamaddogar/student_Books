import React from 'react';
import './User.scss';
import DropMenu from '../DropMenu/DropMenu';
import { NavLink } from 'react-router-dom';
import UserAvtar from './UserAvtar';
import UserBasicDetails from './UserBasicDetails';

const User = ({ user, signout }) => (
    <div className='UserContainer'>
        <div className='flex ai'>
            <UserAvtar avtar={user.photoURL} name={user.displayName} />
            <i className='fas fa-caret-down'></i>
        </div>
        <DropMenu>
            <UserBasicDetails user={user} />
            <NavLink to='/changepassword'>Change password</NavLink>
            <NavLink to='/feedback'>Feedback</NavLink>
            <div className='link' onClick={signout}>Sign Out</div>
        </DropMenu>
    </div>
)

export default User;