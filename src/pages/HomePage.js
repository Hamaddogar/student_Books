import React, { Fragment, Component } from 'react';
import BookItem from '../components/BookItem/BookItem';
import { connect } from 'react-redux';
import './HomePage.scss';
import { booksAction } from '../actions/booksAction';
import { lastBookDocAction } from '../actions/lastBookDocAction';
import Spinner from '../ui/Spinner';
import { getBooks } from '../firebase/firebase-utility';

class HomePage extends Component {
  state = {
    books: [],
    loader: true,
    loadMore: true,
    search: this.props.location.search.slice(1).replace(/%20/g, ' ').toLowerCase(),
  }
  render() {
    const { books, search } = this.state;
    const city = this.props.cityReducer
    return (
      <Fragment>
        {this.state.loader ? <Spinner /> :
          <div className='HomePage mr'>
            {city !== "" && search === "" && <h3>Books in "<b>{city}</b>":</h3>}
            {search !== "" && <h3>Results for "{search}" {city !== "" && ` in "${city}"`} are:</h3>}
            <div className='card'>
              <div className=' pd8 flex wrap'>
                {books.map(book => <BookItem book={book} key={book.id} />)}
              </div>
              {books.length < 1 && <h4>not found</h4>}
            </div>
            {this.state.loadMore && <button onClick={this.getBooksFromDB} className='btn primary shadow' onClick={this.getBooksFromDB}>Load More Books</button>}
          </div>
        }
      </Fragment>
    )
  }
  books = [];
  loadMore = true;
  getSearch = () => this.props.location.search.slice(1).trim().replace(/%20/g, ' ').toLowerCase();
  componentDidMount() {
    this.books = this.props.bookReducer;
    this.prevCity = this.props.cityReducer;
    this.lastdoc = this.props.lastBookDocReducer;
    this.search = this.getSearch();
    if (this.books.length < 10) return this.getBooksFromDB();
    this.search !== "" ? this.searchBooks() : this.setState({ books: this.books, loader: false });
  };
  getBooksFromDB = () => {
    const limit = this.search === "" ? 16 : 40;
    getBooks(this.lastdoc, this.prevCity, limit)
      .then(({ docs }) => {
        docs.forEach(doc => {
          this.books.push(doc.data());
          this.lastdoc = doc;
        })
        docs.length < 15 && (this.loadMore = false);
        this.search === "" ? this.setState({ books: this.books, loader: false, loadMore: this.loadMore }) : this.searchBooks();
        this.props.lastBookDocAction(this.lastdoc);
        this.props.booksAction(this.books);
      })
      .catch(err => console.log(err))
  }
  componentDidUpdate() {
    const city = this.props.cityReducer;
    if (city !== this.prevCity) {
      this.books = [];
      this.loadMore = true;
      this.prevCity = city;
      this.lastdoc = {};
      this.setState({ loader: true });
      return this.getBooksFromDB();
    }
    const search = this.getSearch();
    if (search !== this.search) {
      this.search = search;
      this.setState({ search, loader: true });
      this.books.length > 0 ? this.searchBooks() : this.getBooksFromDB()
    }
  }
  searchBooks = () => {
    const { search } = this;
    const books = this.books.filter(
      book =>
        book.category.toLowerCase().includes(search) ||
        book.title.toLowerCase().includes(search) ||
        book.city.toLowerCase().includes(search) ||
        book.description.toLowerCase().includes(search) ||
        book.uid.toLowerCase().includes(search) ||
        book.id.toLowerCase().includes(search) ||
        book.writer.toLowerCase().includes(search)
    );
    if (books.length < 16 && this.loadMore) {
      this.prevLength = books.length;
      this.getBooksFromDB();
      return this.setState({ books, loader: false, search });
    }
    this.setState({ loader: false, loadMore: this.loadMore, books });
  }
  shouldComponentUpdate(nxtProps, nxtState) {
    if (this.props.cityReducer !== nxtProps.cityReducer || nxtState !== this.state || this.props.location.search !== nxtProps.location.search) {
      return true;
    }
    return false;
  }
}

const mapStateToProps = ({ bookReducer, cityReducer, lastBookDocReducer }) => ({
  bookReducer,
  cityReducer,
  lastBookDocReducer
});
const mapDispatchToProps = dispatch => ({
  booksAction: books => dispatch(booksAction(books)),
  lastBookDocAction: doc => dispatch(lastBookDocAction(doc)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);