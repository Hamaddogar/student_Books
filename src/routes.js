import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header/Header';
import ProfilePage from './pages/ProfilePage';
import BookPage from './pages/BookPage';
import ContactPage from './pages/ContactPage';
import { connect } from 'react-redux';
import CategoryPage from './pages/CategoryPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import FeedBackPage from './pages/FeedBackPage';

const Routes = props => (
    <Fragment>
        <Header />
        <div className='container'>
            <Switch>
                <Route path='/search' component={HomePage} />
                <Route path='/profile/:id' component={ProfilePage} />
                {props.isUser && !props.isPhoneNumberReducer && <Route path='/contact' component={ContactPage} />}
                <Route path='/book/:id' component={BookPage} />
                <Route path='/category/:category' component={CategoryPage} />
                {props.isUser && <Route path='/changepassword' component={ChangePasswordPage} />}
                <Route path='/feedback' component={FeedBackPage} />
                <Route e path='/' component={HomePage} />
            </Switch>
        </div>
    </Fragment>
)
const mapStateToProps = ({ isPhoneNumberReducer }) => ({ isPhoneNumberReducer })
export default connect(mapStateToProps)(Routes);