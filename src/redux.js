import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import usersReducer from './reducers/usersReducer';
import cityReducer from './reducers/cityReducer';
import bookReducer from './reducers/bookReducer';
import searchReducers from './reducers/searchReducers';
import { activeBookReducer } from './reducers/activeBookReducer';
import categoryBookReducer from './reducers/categoryBookReducer';
import { lastBookDocReducer } from './reducers/bookReducer';
import { activeSellerReducer } from './reducers/activeSellerReducer';
import categoryLastDocsReducer from './reducers/categoryLastDocsReducer';
import userContactReducer from './reducers/userContactReducer';

const allReducers = combineReducers({
    cityReducer,
    bookReducer,
    usersReducer,
    searchReducers,
    activeBookReducer,
    lastBookDocReducer,
    userContactReducer,
    activeSellerReducer,
    categoryBookReducer,
    categoryLastDocsReducer,
})

const store = createStore(allReducers, applyMiddleware(thunk));

export default store;