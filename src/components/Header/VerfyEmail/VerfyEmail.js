import React, { Component } from 'react';
import './VerfyEmail.scss';
import Spinner from '../../../ui/Spinner';
import { sendEmailVerification } from '../../../firebase/firebase-utility';
class VerfyEmail extends Component {
    state = {
        message: "We have sent you an email for verification, ",
        show: true,
        loader: false,
    }
    sendEmailForVerification = () => {
        this.setState({ loader: true });
        const cb = () => this.setState({ loader: false, message: "Email has been sent again!, " });
        const ercb = (err) => this.setState({ loader: false, show: false, message: err.message });
        sendEmailVerification(cb, ercb);
    }
    render() {
        return (
            <div className='VerfyEmail'>
                {this.state.message}
                {this.state.show &&
                    <span>
                         Please check your mailbox!
                            <button className='btn primary'
                            onClick={this.sendEmailForVerification}
                        >Send again</button>
                    </span>
                }
                {this.state.loader && <Spinner />}
            </div>
        )
    }
}

export default VerfyEmail;