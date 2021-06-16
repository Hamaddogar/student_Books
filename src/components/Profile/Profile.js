import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';
import './Profile.scss';
import ProfilePhoto from './ProfilePhoto';
import FollowUser from './FollowUser';
import ContactDetails from './ContactDetails';
import { getContact, updateDisplayName } from '../../firebase/firebase-utility';
import EditContact from './EditContact';

class Profile extends Component {
    static contextType = AuthContext;
    state = {
        followers: this.props.followers,
        contact: null
    }
    render() {
        const { seller } = this.props;
        const { followers, contact } = this.state;
        const { user, loginPop, updateProfile } = this.context;
        let isUser = false;
        user && (user.uid === seller.id && (isUser = true));
        isUser && getContact(user.uid).then(doc => this.setState({ contact: doc.data() }));
        const onSubmit = (user, value, updateProfile, errorHandler, update) => {
            updateDisplayName(user, value, updateProfile, errorHandler, update);
        }
        return (
            <div className='profile'>
                <div className='card'>
                    <div className='border'>
                        <ProfilePhoto
                            user={user}
                            isUser={isUser}
                            avtar={seller.photoURL}
                            updateProfile={updateProfile}
                            displayName={seller.displayName}
                        />
                        {!isUser ?
                            <div>
                                <h2 className='seller-name'>{seller.displayName}</h2>
                                <FollowUser
                                    user={user}
                                    loginPop={loginPop}
                                    sellerId={seller.id}
                                    followers={followers}
                                    updateFollowers={followers => this.setState({ followers })}
                                />
                            </div> :
                            <div className='displayNameProfile'>
                                <EditContact title='Full Name' value={user.displayName} name='displayName' onSubmit={onSubmit} />
                            </div>
                        }
                    </div>
                </div>
                <div className='card'>
                    <div className='border'>
                        <h3>Friends</h3>
                        <div className='flex sb'>Followers <b>{followers.length}</b></div>
                        <div className='flex sb'>Following <b>{seller.following.length}</b></div>
                    </div>
                </div>
                {contact && user && <ContactDetails contact={contact} user={seller} onSubmit={onSubmit} />}
            </div>
        )
    }
}

export default Profile;