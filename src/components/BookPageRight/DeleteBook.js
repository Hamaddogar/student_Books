import React, { Component } from 'react';
import './DeleteBook.scss';
import Spinner from '../../ui/Spinner';
import { deleteBook } from '../../firebase/firebase-utility';
import { withRouter } from 'react-router-dom';

class DeleteBook extends Component {
    state = {
        del: false,
        deleting: false,
    }
    deleteBook = () => {
        this.setState({ deleting: true });
        deleteBook(this.props.book)
            .then(this.props.history.goBack)
            .catch(err => this.setState({ deleting: false, er: err.message }))
    }
    render() {
        const { del, deleting } = this.state;
        return (
            <div className='deleteThisBook'>
                <div className='card pd'>
                    <div className='border'>
                        <div className='deletebook' onClick={() => this.setState({ del: true })}>
                            <span onClick={() => this.setState({ del: true })}>
                                <i className='fas fa-trash'></i>
                                Delete this book
                            </span>
                        </div>
                    </div>
                </div>
                {del && (
                    <div className='deletModel'>
                        <div className='blur'>{deleting && <Spinner />}</div>
                        <div className='Model card'>
                            <h3>Are you sure?</h3>
                            <div>Are you sure you want to delete your "{this.props.book.title}" book</div>
                            <div className='__footer flex ai'>
                                <span onClick={() => this.setState({ del: false })}>No</span>
                                <span onClick={this.deleteBook}>Yes</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default withRouter(DeleteBook);