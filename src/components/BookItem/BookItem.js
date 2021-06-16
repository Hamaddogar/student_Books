import React from 'react';
import { Link } from 'react-router-dom';
import './BookItem.scss'
import getDate from '../../utility/getDate';
import { connect } from 'react-redux';
import { activeBookAction } from '../../actions/activeBookAction';

const BookItem = ({ book, activeBookAction }) => {
    return (
        <Link to={`/book/${book.id}`} className='BookItem mr8 pd' onClick={() => activeBookAction(book)}>
            <div className='bookImage backgroundImage' style={{ backgroundImage: `url(${book.photos[0].url})` }}></div>
            <div className='bookDetails'>
                <h3 className='flex sb ai'>Rs. {book.price} <div className='__category ss'>{book.category}</div></h3>
                <div className='title'>{book.title}</div>
                <div className='date'>Posted at {getDate(book.postedAt)}</div>
            </div>
        </Link>
    )
}

const mapDispatchToProps = disptach => ({ activeBookAction: book => disptach(activeBookAction(book)) })

export default connect(null, mapDispatchToProps)(BookItem);