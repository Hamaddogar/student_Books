import React, { Component, Fragment } from 'react';
import Spinner from '../ui/Spinner';
import TextBox from '../ui/TextBox';
import logo from '../assets/logo.png';
import { giveFeedBack } from '../firebase/firebase-utility';

class FeedBackPage extends Component {
    state = {
        loader: false,
        isSuggetionSent: false,
        err: null
    }
    onSubmit = e => {
        e.preventDefault();
        const { feedb } = e.target;
        if (feedb.value.trim().length < 10) {
            this.setState({ err: "Feedback must be minimum 20 characters long!" })
            feedb.className = 'danger';
            return feedb.focus()
        }
        this.setState({ loader: true });
        giveFeedBack(
            feedb.value,
            () => this.setState({ loader: false, isSuggetionSent: true }),
            err => this.setState({ loader: false, err: err.message })
        )
    }
    closeModel = () => {
        const { history } = this.props;
        history.action === "POP" ? history.push('/') : history.goBack();
    }
    render() {
        const { loader, isSuggetionSent, err } = this.state;
        return (
            <Fragment>
                <div className='blur'>{loader && <Spinner />}</div>
                <div className={`Sign-In Model ${loader ? 'hideModel' : ''}`}>
                    <div className='fas fa-times' onClick={this.closeModel}><div></div></div>
                    {!isSuggetionSent ?
                        <Fragment>
                            <img src={logo} alt='' />
                            <h3>Leave Feedback or Share Your Idea</h3>
                            <form onSubmit={this.onSubmit} ref="PCForm">
                                <TextBox label='Feedback' name='feedb' />
                                {err && <div className='alert'>{err}</div>}
                                <button className='primary btn'>Send</button>
                            </form>
                        </Fragment> :
                        <div className='forgot-password__message'>
                            <h2>Feedback Sent</h2>
                            <div style={{ marginTop: 0 }}>Thank you so much for your feedback!</div>
                            <div className='btn primary' onClick={this.closeModel} >Go Back</div>
                        </div>

                    }
                </div>
            </Fragment>
        )
    }
}

export default FeedBackPage;