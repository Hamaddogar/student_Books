import React, { useState } from 'react';
import './SellerContact.scss';
import { Link } from 'react-router-dom';
import UserAvtar from '../Header/User/UserAvtar';
import Spinner from '../../ui/Spinner';
import { getContact } from '../../firebase/firebase-utility';

const SellerContact = ({ seller, user, loginPop }) => {
    const [loader, setLoader] = useState(false);
    const [contact, setContact] = useState(null);
    const [isEmailVerified, setEmailVerified] = useState(true);
    const showContact = (usr = user) => {
        if (usr) {
            if (usr.emailVerified) {
                setLoader(true);
                setEmailVerified(true);
                getContact(seller.id).then(doc => {
                    setContact(doc.data());
                    setLoader(false);
                })
            }
            else setEmailVerified(false);
        } else loginPop(showContact)
    }
    return (
        <div className='card pd'>
            <div className='border'>
                <h3>Seller Details</h3>
                <Link to={`/profile/${seller.id}`} className='flex userDetails ai'>
                    <UserAvtar avtar={seller.photoURL} name={seller.displayName} />
                    <div>
                        <b>{seller.displayName}</b>
                        <span>Member Since {seller.createdAt}</span>
                    </div>
                    <i className="fas fa-chevron-right"></i>
                </Link>

                <div className='phoneNumber'>
                    {!contact ? (!loader ? (
                        isEmailVerified || !user ? <span onClick={() => showContact()}>
                            <i className='fas fa-address-card'></i>
                            <span className='link'>Show contact</span>
                        </span> : <b>Please verify your email first!</b>
                    ) : <Spinner />) : <div>
                            {contact.phoneNumber && <b><i className='fas fa-phone-alt'></i>{contact.phoneNumber}</b>}
                            <b><i className='fas fa-envelope'></i>{contact.email}</b>
                            {!contact.emailVerified && <b className='alert'>Seller has not verified his email address</b>}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default SellerContact;


{/* <div>
    {contact.phoneNumber && <b><i className='fas fa-phone-alt'></i>{contact.phoneNumber}</b>}
    <b><i className='fas fa-envelope'></i>{contact.email}</b>
    {!contact.emailVerified && <b className='alert'>Seller has not verified his email address</b>}
</div> */}

{/* <b>Please verify your email first!</b> */ }

{/* <span onClick={verifyUser}>
    <i className='fas fa-address-card'></i>
    <span className='link'>Show contact</span>
</span> */}