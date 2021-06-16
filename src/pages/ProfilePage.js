import React, { Component } from 'react';
import './ProfilePage.scss';
import Profile from '../components/Profile/Profile';
import { connect } from 'react-redux';
import Spinner from '../ui/Spinner';
import { getSeller, getSellerBooks, getSellerFollowers } from '../firebase/firebase-utility';
import BookItem from '../components/BookItem/BookItem';

class ProfilePage extends Component {
    state = {
        seller: this.props.activeSellerReducer,
        books: null,
        followers: []
    }
    render() {
        const { seller, books } = this.state;
        return (
            <div>
                {seller && books ?
                    <div className='ProfilePage flex-block mr'>
                        <Profile seller={seller} followers={this.state.followers} />
                        <div className='fg bookscontainer'>
                            <h3 className='pd card'>Published Books</h3>
                            {books.length > 0 && <div className='flex wrap card'>
                                {this.state.books.map(book => <BookItem book={book} key={book.id} />)}
                            </div>}
                        </div>
                    </div>
                    : <Spinner />
                }
            </div>
        )
    }
    id;
    componentDidMount() {
        this.id = this.props.match.params.id;
        if (this.state.seller.id !== this.id) {
            getSeller(this.id).then(doc => {
                const seller = doc.data();
                seller.id = doc.id;
                this.setState({ seller });
            })
        }

        const books = [];
        getSellerBooks(this.id).then(({ docs }) => {
            docs.forEach(doc => books.push(doc.data()));
        })
            .catch(err => console.log(err));

        getSellerFollowers(this.id).then(({ docs }) => {
            const followers = [];
            docs.forEach(doc => followers.push(doc.id));
            this.setState({ followers, books })
        })
    }
    componentDidUpdate() {
        if (this.id !== this.props.match.params.id) {
            this.setState({ seller: null, books: null })
            this.componentDidMount();
        }
    }
    shouldComponentUpdate(nxtProps, nxtState) {
        if (this.state !== nxtState || nxtProps.match.params.id !== this.id) {
            return true;
        }
        return false;
    }
}

const mapStateToProps = ({ activeSellerReducer }) => ({ activeSellerReducer });
export default connect(mapStateToProps)(ProfilePage);