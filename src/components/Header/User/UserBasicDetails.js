import React from 'react';
import { Link } from 'react-router-dom';
import UserAvtar from './UserAvtar';
import './UserBasicDetails.scss';

const UserBasicDetails = props => {
    const { photoURL, displayName, email, uid } = props.user;
    return (
        <Link to={`/profile/${uid}`} className='UserBasicDetails flex ai'>
            <UserAvtar avtar={photoURL} name={displayName} />
            <div>
                <b>{displayName}</b>
                <span>{email}</span>
            </div>
        </Link>
    )
}

export default UserBasicDetails;