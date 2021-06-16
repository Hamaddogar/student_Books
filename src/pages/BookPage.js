import React, { Component } from 'react';
import Spinner from '../ui/Spinner';
import './BookPage.scss';
import BookPageSlider from '../components/BookPageSlider/BookPageSlider';
import BookPageRight from '../components/BookPageRight/BookPageRight';
import { getSeller, getBook } from '../firebase/firebase-utility';
import { connect } from 'react-redux';
import { activeBookAction } from '../actions/activeBookAction';
import { activeSellerAction } from '../actions/activeSellerAction';
import AuthContext from '../context/auth-context';

class BookPage extends Component {
    state = {
        seller: null,
        book: null,
        err: null,
    }
    static contextType = AuthContext;
    render() {
        const { book, err, seller } = this.state;
        const { user } = this.context;
        let isUser = false;
        user && book && (book.uid === user.uid && (isUser = true));
        return (
            <div>
                {err ?
                    <h1 className='HomePageNotFound'>{err}</h1> :
                    book && (seller || isUser) ?
                        <div className='BookPage flex-block mr'>
                            <div className='bookleft fg'>
                                <BookPageSlider photos={book.photos} />
                                <div className='card pd details-wrapper'>
                                    <div className='border'>
                                        <h2>Details</h2>
                                        <h3>Writer</h3>
                                        <div className='writer'>{book.writer}</div>
                                        <h3>Location</h3>
                                        <div>This book is available in <b>{book.city}</b></div>
                                        <h3>Description</h3>
                                        <div>{book.description}</div>
                                    </div>
                                </div>
                            </div>
                            <BookPageRight {...this.state} isUser={isUser} {...this.context} />
                        </div> :
                        <Spinner />
                }
            </div>
        )
    }
    componentDidMount() {
        const { id } = this.props.match.params;
        const book = this.props.activeBookReducer;
        const { user } = this.context;
        if (book.id === id) {
            if (user) {
                if (book.uid === this.context.user.uid) return this.setState({ book });
            }
            return this.getSellerDetails(book);
        }
        this.getBookFromDB(id)
    }
    getBookFromDB = id => {
        getBook(id).then(doc => {
            const book = doc.data();
            if (book) {
                this.props.activeBookAction(book);
                const { user } = this.context;
                if (user) {
                    if (book.uid === user.uid) return this.setState({ book });
                }
                return this.getSellerDetails(book);
            }
            this.setState({ err: "404, book not found!" });
        })
    }
    getSellerDetails = book => {
        getSeller(book.uid).then(doc => {
            const seller = doc.data();
            seller.id = doc.id;
            this.setState({ seller, book });
            this.props.activeSellerAction(seller);
        })
    }
    shouldComponentUpdate(_, nxtState) {
        if (this.state !== nxtState) {
            return true
        }
        return false;
    }
}

const mapStateToProps = ({ activeBookReducer }) => ({ activeBookReducer })
const mapDispatchToProps = dispatch => ({
    activeBookAction: book => dispatch(activeBookAction(book)),
    activeSellerAction: seller => dispatch(activeSellerAction(seller))
})
export default connect(mapStateToProps, mapDispatchToProps)(BookPage);