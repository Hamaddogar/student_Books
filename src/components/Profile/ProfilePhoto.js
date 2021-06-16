import React, { useState } from 'react';
import resizeImage from '../../utility/resizeImage';
import { storeBooksPhotos, updateProfileImage } from '../../firebase/firebase-utility';
import './ProfilePhoto.scss';

const ProfilePhoto = props => {
    const [photo, setPhoto] = useState({
        progress: 100,
        avtar: props.avtar
    });
    const { user, isUser, displayName } = props;
    const onChange = e => {
        const img = e.target.files[0];
        if (!img) return false;
        resizeImage(img, storeToServer);
    }
    const storeToServer = img => {
        const url = `${user.uid}/photoURL`;
        setPhoto({ avtar: URL.createObjectURL(img), progress: 0 });
        storeBooksPhotos(url, img, 1, cb, ccb)
    }
    const cb = value => setPhoto({ progress: value, avtar: photo.avtar })
    const ccb = url => {
        user.updateProfile({ photoURL: url }).then(_ => props.updateProfile('photoURL', url));
        updateProfileImage(user.uid, url).then(_ => {
            setPhoto({ progress: 100, avtar: url });
        });
    };
    return (
        <div className='profilePic'>
            <div className='backgroundImage' style={{ backgroundImage: `url(${photo.avtar})`, padding: photo.avtar ? '50% 0' : 'calc(50% - 41px) 0' }}>
                {!photo.avtar && <h1>{isUser ? user.displayName[0] : displayName[0]}</h1>}
                {isUser && photo.progress === 100 &&
                    <label>
                        <i className='fas fa-camera'></i>
                        <input type='file' onChange={onChange} />
                    </label>
                }
                {photo.progress < 100 &&
                    <div className='image-blur'>
                        <progress value={photo.progress}>{photo.progress}</progress>
                    </div>
                }
            </div>
        </div>
    )
}

export default React.memo(ProfilePhoto);