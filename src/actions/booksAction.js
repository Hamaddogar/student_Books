// Getting Books
export const booksAction = x => ({ type: 'get_all_books', payload: x });

// Storing Book
export const storeBookAction = book => ({ type: "store_book", payload: book });