import Categories from '../data/Categories';

let initialState = JSON.parse(localStorage.getItem('categoryBooks'));
let emptyState = {};

Categories.forEach(cat => {
    emptyState[cat.route] = []
});
if (!initialState) {
    initialState = emptyState;
}

const categoryBookReducer = (state = initialState, action) => {
    switch (action.type) {
        case "category_is_added":
            const newState = state;
            newState[action.cat] = action.payload.slice();
            localStorage.setItem('categoryBooks', JSON.stringify(newState));
            return newState
        case "remove_all_books_of_category":
            localStorage.removeItem('categoryBooks');
            return emptyState;
        default:
            return state;
    }
}

export default categoryBookReducer;