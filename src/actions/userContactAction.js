import { isContactDetails, storeContactInfo } from '../firebase/firebase-utility';

export const addContactAction = contact => ({ type: "user_contact_is_added", payload: contact })

export const userContactAction = userId => dispatch => {
    isContactDetails(userId)
        .then(doc => {
            const contact = doc.data();
            contact.id = userId;
            dispatch(addContactAction(contact));
        });
}

export const storeContactAction = (userId, contact, cb) => dispatch => {
    storeContactInfo(userId, contact).then(() => {
        contact.id = userId;
        dispatch(addContactAction(contact));
        cb();
    })
}