import React from 'react';
import { withRouter } from 'react-router-dom';
import './EmailNotification.scss';

const EmailNotification = ({ history }) => {
    const checkSecurePath = () => {
        setTimeout(() => history.action === 'PUSH' ? history.goBack() : history.push('/'), 3000);
    }
    return (
        <div className='blur flex EmailNotification'>
            <h2 className='card pd'>We have sent you an email for verification<br />Please check your mailbox</h2>
            {checkSecurePath()}
        </div>
    )
}

export default withRouter(EmailNotification);