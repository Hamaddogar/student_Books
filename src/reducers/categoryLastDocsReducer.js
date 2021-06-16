import Categories from '../data/Categories';

const initialState = {};
Categories.forEach(cat => {
    initialState[cat.route] = {}
});

const categoryLastDocsReducer = (state = initialState, action) => {
    switch(action.type){
        case 'last_doc_is_saved':
            const newState = state;
            newState[action.cat] = action.payload;
            return newState;
        case 'remove_all_last_docs':
            return initialState;
        default:
            return state;
    }
} 

export default categoryLastDocsReducer;