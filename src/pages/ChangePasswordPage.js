import React, { Fragment, Component } from 'react';
import Spinner from '../ui/Spinner';
import logo from '../assets/logo.png';
import Input from '../ui/Input';
import { updatePassword } from '../firebase/firebase-utility';

class ChangePasswordPage extends Component {
    state = {
        loader: false,
        isPasswordChanged: false
    }
    closeModel = () => {
        const { history } = this.props;
        history.action === "POP" ? history.push('/') : history.goBack();
    }
    render() {
        const { loader, err, isPasswordChanged } = this.state;
        return (
            <Fragment>
                <div className='blur'>{loader && <Spinner />}</div>
                <div className={`Sign-In Model ${loader ? 'hideModel' : ''}`}>
                    <div className='fas fa-times' onClick={this.closeModel}><div></div></div>
                    {!isPasswordChanged ?
                        <Fragment>
                            <img src={logo} alt='' />
                            <h3>Change Your Account Password</h3>
                            <form onSubmit={this.onSubmit} ref="PCForm">
                                <Input type='password' name='password' label="Password" validate="true" autoFocus={true} />
                                <Input type='password' name='newPassword' label="New Password" validate="true" />
                                {err && <div className='alert'>{err}</div>}
                                <button className='primary btn'>Change Password</button>
                            </form>
                        </Fragment> :
                        <div className='forgot-password__message'>
                            <h2>Password Changed</h2>
                            <p>You have successfully changed your account password</p>
                            <div className='btn primary' onClick={this.closeModel} >Go Back</div>
                        </div>

                    }
                </div>
            </Fragment>
        )
    }
    onSubmit = e => {
        e.preventDefault();
        const { password, newPassword } = e.target;
        let err = 'Password must be 8 characters long!';
        let verify = true;
        if (newPassword.value.trim() < 8) {
            verify = false;
            newPassword.className = 'danger';
            newPassword.focus();
        }
        if (password.value.trim() === "") {
            verify = false;
            password.className = 'danger';
            password.focus();
        }
        if (password.value === newPassword.value && newPassword.value !== '') {
            verify = false;
            err = "Password must not matched!";
            password.focus();
        }
        if (!verify) return this.setState({ err });
        this.setState({ loader: true })
        updatePassword(password.value, newPassword.value, this.onChangePassword, this.onError)
    }
    onChangePassword = () => this.setState({ isPasswordChanged: true, loader: false });
    onError = err => {
        const { password } = this.refs.PCForm;
        if (err.code === "auth/wrong-password") {
            password.className = 'danger';
            this.setState({ err: "You have provided an incorrect password!", loader: false })
            return password.focus();
        }
        this.setState({err: err.code, loader: false});
    }
}

export default ChangePasswordPage;