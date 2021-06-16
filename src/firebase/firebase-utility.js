import firebase from './firebase-config';
import getDate from '../utility/getDate';

// Authentication
export const auth = firebase.auth();

const user = () => auth.currentUser;

export const storageRef = firebase.storage().ref();

// Sign Out
export const signOut = () => auth.signOut();

// Google Authentication
const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
provider.setCustomParameters({ prompt: 'select_account' });

// Facebook Authentication
const fbProvider = new firebase.auth.FacebookAuthProvider();
fbProvider.setCustomParameters({ 'display': 'popup' });
export const signInWithFacebook = () => auth.signInWithPopup(fbProvider)

// Sign In/Up With Email and Password
export const signInWithEmailAndPassword = (email, password) => auth.signInWithEmailAndPassword(email, password)
export const createUserWithEmailAndPassword = (email, password) => auth.createUserWithEmailAndPassword(email, password)

// Email Verification
export const sendEmailVerification = (cb, ercb) => {
    auth.currentUser.sendEmailVerification()
        .then(() => cb())
        .catch(err => ercb(err));
}
export const forgetPassword = email => auth.sendPasswordResetEmail(email)
export const updatePassword = (oldPassword, newPassword, cb, errcb) => {
    signInWithEmailAndPassword(auth.currentUser.email, oldPassword)
        .then(({ user }) => {
            user.updatePassword(newPassword)
                .then(_ => cb())
                .catch(err => errcb(err))
        })
        .catch(err => errcb(err))
}
// Firestore
export const db = firebase.firestore();

// Storing Auth Data
export const createUserProfileDocument = (user, isNewAccount = false) => {
    const userRef = db.doc(`users/${user.uid}`);
    userRef.get()
        .then(snapShot => {
            if (!snapShot.exists || isNewAccount) {
                const { displayName, email, photoURL } = user;
                userRef.set({
                    displayName,
                    photoURL,
                    createdAt: getDate(),
                    following: []
                })
                db.doc(`contacts/${user.uid}`).set({ email });
            }
        });
    db.doc(`contacts/${user.uid}`).set({ emailVerified: user.emailVerified }, { merge: true });
}

export const getSellerFollowers = sellerId => db.collection(`users/${sellerId}/followers`).get();
export const followSeller = (sellerId, userId) => {
    const ref = db.doc(`users/${userId}`);
    ref.get().then(doc => {
        const { following } = doc.data();
        following.push(sellerId);
        ref.set({ following }, { merge: true });
    })
    return db.doc(`users/${sellerId}/followers/${userId}`).set({ following: true });
}
export const unFollowSeller = (sellerId, userId) => {
    const ref = db.doc(`users/${userId}`);
    ref.get().then(doc => {
        const following = doc.data().following.filter(id => id !== sellerId);
        ref.set({ following }, { merge: true });
    })
    return db.doc(`users/${sellerId}/followers/${userId}`).delete()
}
export const getOptions = () => db.doc('search/options').get();
export const storeBook = (book, options) => {
    db.doc('search/options').set({ options });
    return db.doc(`books/${book.id}`).set(book)
};
export const deleteBook = ({ uid, id, photos }) => {
    photos.forEach(({ name }) => storageRef.child(`${uid}/${id}/${name}`).delete());
    return db.doc(`books/${id}`).delete();
};
export const getBookId = () => db.collection('books').doc().id;
export const storeBooksPhotos = (url, image, index, cb, ccb) => {
    const task = storageRef.child(url).put(image);
    task.on('state_changed',
        snapshot => {
            const perecentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            cb(perecentage, index);
        },
        err => console.log(err),
        _ => storageRef.child(url).getDownloadURL().then(ur => ccb(ur, index))
    )
}
export const giveFeedBack = (feedback, cb, errcb) => {
    const { uid, email, displayName, photoURL } = user();
    db.collection('feedbacks').add({ uid, email, displayName, feedback, photoURL })
        .then(_ => cb())
        .catch(err => errcb(err));
};
export const updateProfileImage = (userId, photoURL) => db.doc(`users/${userId}`).set({ photoURL }, { merge: true });
export const updateContact = (contact, userId) => db.doc(`contacts/${userId}`).set(contact, { merge: true });
export const updateDisplayName = (user, displayName, cb, ecb) => {
    user.updateProfile({ displayName }).then(_ => cb());
    db.doc(`users/${user.uid}`)
        .set({ displayName }, { merge: true })
        .catch(err => ecb(err));
}

export const updateEmail = (user, email, updateProfile) => user.updateEmail(email)
    .set({ email }, { merge: true })
    .then(_ => updateProfile());

export const deletePhoto = url => storageRef.child(url).delete();
export const getBook = bookId => db.doc(`books/${bookId}`).get();
export const getSeller = sellerId => db.doc(`users/${sellerId}`).get();
export const getBooks = (lastdoc, city, limit = 20) => {
    if (city !== "") return db.collection('books')
        .where('city', '==', city)
        .orderBy("postedAt", "desc")
        .startAfter(lastdoc).limit(limit).get()

    return db.collection('books')
        .orderBy("postedAt", "desc")
        .startAfter(lastdoc).limit(limit).get()
};

export const getSellerBooks = id => db.collection('books').where('uid', '==', id).orderBy('postedAt', 'desc').get();

export const getBooksByCategory = (lastdoc, city, cat) => {
    if (city !== "") return db.collection('books')
        .where('city', '==', city)
        .where('category', '==', cat)
        .orderBy("postedAt", "desc")
        .startAfter(lastdoc).limit(20).get()

    return db.collection('books')
        .orderBy("postedAt", "desc")
        .where('category', '==', cat)
        .startAfter(lastdoc).limit(20).get()
}
export const getContact = userId => db.doc(`contacts/${userId}`).get();
export const storeContactInfo = (userId, { phoneNumber, address, college, qualification, session, city }) => {
    db.doc(`users/${userId}`).set({
        college,
        qualification,
        session
    }, { merge: true })
    return db.doc(`contacts/${userId}`)
        .set({ phoneNumber, address, city }, { merge: true })
}

export const isContactDetails = userId => db.doc(`contacts/${userId}`).get();