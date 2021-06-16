export const saveCategoryAction = (books, cat) => ({ type: 'category_is_added', payload: books, cat });
export const removeCategoriesAction = () => ({ type: "remove_all_books_of_category" });

export const saveLastDocAction = (doc, cat) => ({ type: 'last_doc_is_saved', payload: doc, cat });
export const removeLastDocsAction = () => ({type: "remove_all_last_docs"})