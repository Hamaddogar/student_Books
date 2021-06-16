import React, { Fragment, Component } from 'react';
import BookItem from '../components/BookItem/BookItem';
import { connect } from 'react-redux';
import { booksAction } from '../actions/booksAction';
import Spinner from '../ui/Spinner';
import { getBooksByCategory } from '../firebase/firebase-utility';
import Categories from '../data/Categories'
import { removeCategoriesAction, saveCategoryAction, saveLastDocAction, removeLastDocsAction } from '../actions/categoryBookAction';

class CategoryPage extends Component {
    state = {
        books: [],
        loader: false,
        loadMore: true,
    }
    findCategory = () => {
        const cat = Categories.find(cat => cat.route === this.props.match.params.category);
        if (cat) return cat.cat;
        return this.props.history.push('/');
    }
    render() {
        const { books, loadMore } = this.state;
        return (
            <Fragment>
                {this.state.loader ? <Spinner /> : books.length > 0 ?
                    <div className='HomePage mr'>
                        <h3>Books of "{books[0].category}" category {this.props.cityReducer !== "" && `in ${this.props.cityReducer}`} are:</h3>
                        <div className='card'>
                            <div className=' pd8 flex wrap'>
                                {books.map(book => <BookItem book={book} key={book.id} />)}
                            </div>
                        </div>
                        {loadMore && <button onClick={this.loadMoreBooks} className='btn primary shadow' onClick={this.getBooksFromDB}>Load More Books</button>}
                    </div> :
                    <h1 className='HomePageNotFound'>Books not found</h1>
                }
            </Fragment>
        )
    }
    books = {};
    lastdoc = {};
    loadMore = true;
    city = this.props.cityReducer;
    componentDidMount() {
        this.route = this.props.match.params.category;
        this.books = this.props.categoryBookReducer;
        this.lastdoc = this.props.categoryLastDocsReducer;
        const books = this.books[this.route].slice();
        if (books.length > 0) return this.setState({ books, loader: false });
        this.cat = this.findCategory();
        this.getBooks();
    };
    getBooks = () => {
        const { route } = this;
        this.setState({ loader: true })
        getBooksByCategory(this.lastdoc[route], this.city, this.cat)
            .then(({ docs }) => {
                !this[route] && (this[route] = [])
                docs.forEach(doc => {
                    const book = doc.data();
                    this[route].push(book);
                    this.lastdoc[route] = doc;
                })
                docs.length < 20 && (this.loadMore = false);
                this.setState({ books: this[route], loader: false, loadMore: this.loadMore });
                this.props.saveCategoryAction(this[route], route);
                this.props.saveLastDocAction(this.lastdoc[route], route);
            })
            .catch(err => console.log(err))
    }
    componentDidUpdate() {
        const city = this.props.cityReducer;
        if (city !== this.city) {
            this.city = city;
            this.lastdoc = {};
            for (let key in this.books) {
                this[key] = [];
                this.lastdoc[key] = {};
            }
            this.props.removeCategoriesAction();
            this.props.removeLastDocsAction();
            return this.getBooks();
        }

        const route = this.props.match.params.category;
        if (route !== this.route) {
            this.route = route;
            this.cat = this.findCategory();
            const books = this.books[this.route].slice();
            if (books.length < 1) return this.getBooks();
            this.setState({ books, loader: false })
        }
    }
    shouldComponentUpdate(nxtProps, nxtState) {
        if (this.state !== nxtState || nxtProps.cityReducer !== this.city || nxtProps.match.params.category !== this.route) {
            return true;
        }
        return false;
    }
}

const mapStateToProps = ({ categoryBookReducer, cityReducer, categoryLastDocsReducer }) => ({
    cityReducer,
    categoryBookReducer,
    categoryLastDocsReducer,
});
const mapDispatchToProps = dispatch => ({
    booksAction: books => dispatch(booksAction(books)),
    saveCategoryAction: (books, cat) => dispatch(saveCategoryAction(books, cat)),
    saveLastDocAction: (doc, cat) => dispatch(saveLastDocAction(doc, cat)),
    removeCategoriesAction: () => dispatch(removeCategoriesAction()),
    removeLastDocsAction: () => dispatch(removeLastDocsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage);