import React from 'react';
import './BookPageRight.scss';
import getDate from '../../utility/getDate';
import { Link } from "react-router-dom";
import SellerContact from './SellerContact';
import DeleteBook from './DeleteBook';

const BookPageRight = ({ book, seller, user, isUser, loginPop }) => {
    return (
        <div className='BookPageRight'>
            <div className='card pd'>
                <div className='border'>
                    <h2>Rs. {book.price}</h2>
                    <h3>{book.title}</h3>
                    <div className='posted-at'>Posted at {getDate(book.postedAt)}</div>
                </div>
            </div>
            {isUser ? <div>
                <div className='card pd'>
                    <div className='border editbook'>
                        <Link to={`/edit/${book.id}`}>
                            <i className='fas fa-pen'></i>
                                Edit your book
                        </Link>
                    </div>
                </div>
                <DeleteBook book={book} />
            </div> : <SellerContact seller={seller} user={user} loginPop={loginPop} />}
        </div>
    )
}

export default BookPageRight;