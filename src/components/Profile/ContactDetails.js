import React, { useContext } from 'react';
import EditContact from './EditContact';
import AuthContext from '../../context/auth-context';

const ContactDetails = ({ contact }) => {
    const { loginPop } = useContext(AuthContext);

    const onSubmit = (user, email, updateProfile, errorHandler, update) => {
        const loginPopCallBack = (usr = user) => usr.updateEmail(email)
            .then(() => {
                usr.sendEmailVerification();
                return update();
            })
            .then(updateProfile)
            .catch(err => {
                if (err.code === "auth/requires-recent-login") return loginPop(loginPopCallBack)
                errorHandler(err);
            })
        
        loginPopCallBack();
    }

    return (
        <div className='card'>
            <div className='border'>
                <h3>Contact</h3>
                <EditContact title='Email' value={contact.email} name='email' onSubmit={onSubmit} />
                <EditContact title='Phone' value={contact.phoneNumber} name='phoneNumber' />
                <EditContact title='Address' value={contact.address} name='address' />
            </div>
        </div>
    )
}

export default ContactDetails;