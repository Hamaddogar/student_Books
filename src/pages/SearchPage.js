import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import BookItem from '../components/BookItem/BookItem';
import Spinner from '../ui/Spinner'
import { getBooks } from '../firebase/firebase-utility';
import { booksAction } from '../actions/booksAction';

class SearchPage extends Component {
    state = {
        books: [],
        search: "",
        loader: false
    };
    render() {
        const { books, search } = this.state;
        return (
            <Fragment>
                {this.state.loader ? <Spinner /> : <div className='HomePage mr'>
                    <h3>results for "{search}" {this.props.cityReducer !== "" && `in "${this.props.cityReducer}"`} are:</h3>
                    <div className='card'>
                        <div className='pd8 flex wrap'>
                            {books.map(book => <BookItem book={book} key={book.id} />)}
                        </div>
                    </div>
                </div>
                }
            </Fragment>
        )
    }
    books = [];
    prevSearch = this.props.location.search.slice(1).replace(/%20/g, ' ').toLowerCase();
    componentDidMount = () => {
        this.lastDoc = "";
        this.prevCity = this.props.cityReducer;
        this.books.length < 1 ?
        this.getBooksFromDB():
        this.searchBooks(this.prevSearch);
    };
    getBooksFromDB = () => {
        this.setState({ loader: true });
        const search = this.props.location.search.slice(1).replace(/%20/g, ' ').toLowerCase();
        getBooks(this.lastDoc, this.prevCity, 40)
            .then(({ docs }) => {
                docs.forEach(doc => {
                    const book = doc.data();
                    this.books.push(book);
                    this.lastdoc = doc;
                })
                docs.length < 20 && (this.loadMore = false);
                this.searchBooks(search);
            })
            .catch(err => console.log(err))
    }
    componentDidUpdate() {
        const search = this.props.location.search.slice(1).replace(/%20/g, ' ').toLowerCase();
        const city = this.props.cityReducer;
        if (search !== this.prevSearch || this.prevCity !== city) {
            this.prevCity = city;
            this.prevSearch = search;
            this.books = [];
            this.getBooksFromDB(search)
        }
    }
    searchBooks = (search) => {
        let books = this.books.filter(
            book =>
                book.category.toLowerCase().includes(search) ||
                book.title.toLowerCase().includes(search) ||
                book.city.toLowerCase().includes(search) ||
                book.description.toLowerCase().includes(search) ||
                book.uid.toLowerCase().includes(search) ||
                book.id.toLowerCase().includes(search) ||
                book.writer.toLowerCase().includes(search)
        );
        this.setState({ books, loader: false, loadMore: this.loadMore, search });
    }
}

const mapStateToProps = ({ bookReducer, cityReducer }) => ({ bookReducer, cityReducer });
const mapDispatchToProps = dispatch => ({ booksAction: books => dispatch(booksAction(books)) });


export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);