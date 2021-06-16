import React from 'react';
import './UserAvtar.scss';

const UserAvtar = ({ avtar, name }) => (
    <h3 className='UserAvtar' style={{ backgroundImage: `url(${avtar})` }}>
        {!avtar && (name && name[0])}
    </h3>
)

export default UserAvtar;