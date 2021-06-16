let initialState = JSON.parse(localStorage.getItem('books'));
!initialState && (initialState = []);

const bookReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "get_all_books":
            localStorage.setItem(JSON.stringify(payload), 'books');
            return payload;
        case "store_book":
            const books = state.filter(book => book.id !== payload.id);
            state = [payload, ...books];
            localStorage.setItem(JSON.stringify(state), 'books');
            return state
        default:
            return state;
    }
}

export default bookReducer;

export const lastBookDocReducer = (state = {}, action) => action.type !== "last_book_document" ? state : action.payload;