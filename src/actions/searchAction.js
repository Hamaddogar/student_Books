import { getOptions } from '../firebase/firebase-utility';

const storeOptions = options => ({ type: "search_results", payload: options })

const searchAction = () => dispatch => {
    getOptions().then(doc => {
        const { options } = doc.data();
        options && dispatch(storeOptions(options));
    }).catch(err => console.log(err));
}

export default searchAction;