import React, { Component, Fragment } from 'react';
import './PostBookPage.scss';
import Input from '../ui/Input';
import Categories from '../data/Categories';
import { cities } from '../data/cities';
import logo from '../assets/logo.png';
import TextBox from '../ui/TextBox';
import { getBook, getBookId } from '../firebase/firebase-utility';
import AuthContext from '../context/auth-context';
import Spinner from '../ui/Spinner';
import PostBookValidation from './PostBookValidation';
import Navbar from '../components/NavBar/Navbar';
import { connect } from 'react-redux';
import { activeBookAction } from '../actions/activeBookAction';

class PostBookPage extends Component {
    state = {
        err: '',
        loader: true,
        book: {},
        initailState: false,
        id: "",
        isEditMode: false,
    }
    static contextType = AuthContext;
    onSubmit = e => {
        e.preventDefault();
        const { book, isEditMode, id } = this.state;
        let newBook = PostBookValidation(e, err => this.setState({ err }));
        if (!newBook) return;
        this.setState({ err: "" });
        if (isEditMode) newBook = { ...book, ...newBook };
        else {
            book.id = id;
            newBook.photos = []
            newBook.postedAt = new Date();
        }
        const isUserValidate = user => {
            newBook.uid = user.uid;
            this.setState({ loader: false });
            this.props.activeBookAction(newBook);
            this.props.history.push(`/bookimages/${id}`);
        }
        const { user, loginPop } = this.context;
        if (!user) return loginPop(isUserValidate);

        isUserValidate(user);
    }
    render() {
        const { title, price, city, category, writer, description } = this.state.book;
        return (
            <Fragment>
                {this.state.loader && <Spinner />}
                <Navbar history={this.props.history} />
                {this.state.initailState && (
                    <div className='PostBookPage card border pd'>
                        <img src={logo} alt='' />
                        <h2>Please Provide the Book Information</h2>
                        <form onSubmit={this.onSubmit}>
                            <div className='BasiFormGrid'>
                                <Input type='text' value={title} name='title' label='Title' validate="true" autoFocus={true} />
                                <Input type='number' value={price} name='price' label='Price' validate="true" autoComplete="off" />
                            </div>
                            <Input name='city' value={city} label='City' validate="true" list='cities' />
                            <Input name='category' value={category} label='Categories' list='bookCategories' validate="true" />
                            <p className='alert'>{this.state.err}</p>
                            <h3>Optional</h3>
                            <Input type='text' name='writer' value={writer} label='Writer Name' />
                            <TextBox type='text' name='description' value={description} label='Description' />
                            <button className='btn primary'>Next</button>
                        </form>
                        <datalist id='cities'>
                            {cities.map((city, index) => <option key={index} value={city} />)}
                        </datalist>
                        <datalist id='bookCategories'>
                            {Categories.map(({ cat }, index) => <option value={cat} key={index} />)}
                        </datalist>
                    </div>
                )}
            </Fragment>
        )
    }
    componentDidMount = () => {
        const isEditMode = this.props.match.url.toLowerCase().includes('edit');
        if (isEditMode) this.editMode();
        else {
            const id = getBookId();
            this.props.isBookReducer && this.setState({ book: this.props.isBookReducer });
            this.setState({ loader: false, initailState: true, id })
        }
    }
    editMode = () => {
        const { history, match, activeBookReducer } = this.props;
        const { id } = match.params;
        if (!id) return history.push('/');
        let book = null;
        activeBookReducer.id === id && (book = activeBookReducer);
        book ? this.checkUser(book) : this.getBookFromDB(id)
    }
    getBookFromDB = id => {
        getBook(id).then(doc => {
            const book = doc.data();
            book && this.checkUser(book);
        })
    }
    checkUser = book => {
        const { user } = this.context;
        if (book.uid === user.uid) return this.setState({ id: book.id, book, loader: false, isEditMode: true, initailState: true });
        this.props.history.push('/');
    }
}
const mapStateToProps = ({ activeBookReducer }) => ({ activeBookReducer });
const mapDispatchToProps = dispatch => ({ activeBookAction: book => dispatch(activeBookAction(book)) })

export default connect(mapStateToProps, mapDispatchToProps)(PostBookPage);