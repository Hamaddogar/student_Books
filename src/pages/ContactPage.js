import React, { Component, Fragment } from 'react';
import './ContactPage.scss';
import { connect } from 'react-redux';
import Input from '../ui/Input';
import logo from '../assets/logo.png';
import Spinner from '../ui/Spinner';
import { cities } from '../data/cities';
import { storeContactAction } from '../actions/userContactAction';

class ContactPage extends Component {
    state = {
        err: "",
        loader: false
    }
    render() {
        const { userContactReducer, bookReducer, location, storeContactAction, history } = this.props;
        const book = bookReducer.find(bk => location.hash.includes(bk.id));
        const onSubmit = e => {
            e.preventDefault();
            let err = null;
            const { phoneNumber, address, city, college, qualification, session } = e.target;
            let contact = {
                phoneNumber: phoneNumber.value,
                address: address.value,
                city: city.value,
            }
            const isCity = cities.find(c => c.toLowerCase() === city.value.toLowerCase());
            if (!isCity) {
                err = "City not found!";
                city.className = "danger"
            }
            for (let key in contact) {
                if (contact[key].trim() === "") {
                    err = "Please fill the above, fields!";
                    e.target[key].className = "danger";
                }
            }
            if (err) return this.setState({ err });
            contact.phoneNumber = `+92${contact.phoneNumber}`;
            this.setState({ loader: true });
            contact = { ...contact, college: college.value, qualification: qualification.value, session: session.value }
            storeContactAction(userContactReducer.id, contact, () => history.push(book ? `/book/${book.id}` : '/'));
        }
        return (
            <Fragment>
                {this.state.loader ? <Spinner /> :
                    <div className='ContactPage card border PostBookPage'>
                        {book &&
                            <div className='verify'>
                                <div>We have saved your book ad but it is not online to make it online, you have to:</div>
                                <ul>
                                    {!userContactReducer.emailVerified && <li>verify your email</li>}
                                    <li>provide your address</li>
                                    <li>provide your phone number</li>
                                </ul>
                            </div>}
                        <div className='pd'>
                            <img src={logo} alt='' />
                            <h2>Please Provide the following Information</h2>
                            <form onSubmit={onSubmit}>
                                <div className='flex ai mobilenumber'>
                                    <div className='countrycode'>+92</div>
                                    <Input type='number' name='phoneNumber' length='10' label="Phone Number" validate />
                                </div>
                                <Input name="address" label="Address" validate />
                                <Input name="city" list='cities' label="City" validate />
                                <datalist id='cities'>
                                    {cities.map((city, index) => <option value={city} key={index} />)}
                                </datalist>
                                <div className='alert'>{this.state.err}</div>
                                <h3>Optional</h3>
                                <Input name='college' label='College/University' />
                                <div className='flex ai form-container'>
                                    <Input name='qualification' label='Course / Class' />
                                    <Input name='session' label='Session' />
                                </div>
                                <button className='btn primary'>Submit</button>
                            </form>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
    verifyNumber = () => {
        const contact = this.props.userContactReducer;
        contact && (contact.phoneNumber && this.props.history.push('/'));
    }
    componentDidUpdate = () => this.verifyNumber();
    componentDidUpdate = () => this.verifyNumber();
}
const mapStateToProps = ({ bookReducer, userContactReducer }) => ({ bookReducer, userContactReducer });
const mapDispatchToProps = dispach => ({
    storeContactAction: (userId, contact, cb) => dispach(storeContactAction(userId, contact, cb))
})
export default connect(mapStateToProps, mapDispatchToProps)(ContactPage);