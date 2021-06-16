import React, { Component, Fragment } from 'react';
import './Sign-In.scss';
import logo from '../assets/logo.png';
import Input from '../ui/Input';
import {
    signInWithGoogle,
    signInWithEmailAndPassword,
    signInWithFacebook,
    createUserWithEmailAndPassword,
    forgetPassword
} from '../firebase/firebase-utility';
import Spinner from '../ui/Spinner';
import { withRouter } from 'react-router-dom';

class SignIn extends Component {
    state = {
        loader: false,
        isSignUp: !this.props.isUser,
        isForgot: false,
        isEmailSent: false,
    }
    closeModel = () => !this.state.loader && this.props.close();
    changeMode = () => {
        this.setState({ isSignUp: !this.state.isSignUp, err: null, isForgot: false });
        try {
            const { email, password } = this.refs.userform;
            email.value.trim() !== "" ? email.className = "filled" : email.className = "";
            password.value.trim() !== "" ? password.className = "filled" : password.className = "";
        }
        catch (err) { }
    }
    render() {
        const { loader, isSignUp, err, isForgot, isEmailSent } = this.state;
        const { isUser } = this.props;
        return (
            <Fragment>
                <div className='blur'>{loader && <Spinner />}</div>
                <div className={`Sign-In Model ${loader ? 'hideModel' : ''}`}>
                    <div className='fas fa-times' onClick={this.closeModel}><div></div></div>
                    {!isEmailSent ? (
                        <Fragment>
                            <img src={logo} alt='' />
                            {isUser && <h3>Please login again for verification</h3>}
                            {isForgot && <h3>Reset Your Password</h3>}
                            <form onSubmit={this.handleSubmit} ref='userform'>
                                {isSignUp && <Input type='text' name='displayName' label="Full Name" validate="true" />}
                                <Input type='text' name='email' label="Email" validate="true" />
                                {!isForgot && <Input type='password' name='password' label="Password" validate="true" />}
                                {err && <div className='alert'>{err}</div>}
                                {!isSignUp && !isForgot && !isUser &&
                                    <span className='forgotPassword signup' onClick={this.forgotPasswordMode}> Forgot Password!</span>}
                                <button className='btn primary'>{!isForgot ? `Sign ${isSignUp ? "up" : 'in'}` : 'Send Reset Email'}</button>
                                <span className='signup' onClick={this.changeMode}>
                                    {!isUser && (isSignUp ? 'Already have an acount, sign in!' : "Don't have an accout, sign up today!")}
                                </span>
                            </form>
                            {!isForgot && <div>
                                <p>OR</p>
                                <div className='google btn flex'>
                                    <span className='fg' onClick={this.signInWithGoogle}>Sign In with Google</span>
                                </div>
                                <div className='facebook btn flex'>
                                    <span className='fg' onClick={this.signInWithFacebook}>Sign In with Facebook</span>
                                </div>
                            </div>}
                        </Fragment>
                    ) : (
                            <div className='forgot-password__message'>
                                <h2>Email sent</h2>
                                <p>We have sent you an email to reset your account password. <br /> Please check your mailbox</p>
                                <div className='btn primary' onClick={() => this.setState({ isSignUp: false, isEmailSent: false, isForgot: false })} >Continue to Sign In</div>
                            </div>
                        )}
                </div>
            </Fragment>
        )
    }
    signInWithGoogle = () => {
        this.setState({ loader: true });
        signInWithGoogle().then(({ user }) => this.props.close(user)).catch(err => this.errHandler(err));
    }
    signInWithFacebook = () => {
        this.setState({ loader: true });
        signInWithFacebook().then(({ user }) => this.props.close(user)).catch(err => this.errHandler(err));
    }
    forgotPasswordMode = () => {
        const { email } = this.refs.userform;
        email.value.trim() !== "" ? email.className = "filled" : email.className = "";
        this.setState({ err: null, isForgot: true });
        email.focus();
    }

    handleSubmit = event => {
        event.preventDefault();
        const { email, password, displayName } = event.target;
        const form = {};
        let verify = true;
        email && (form.email = email);
        password && (form.password = password);
        displayName && (form.displayName = displayName);

        for (let key in form) {
            if (form[key].value === "") {
                form[key].className = 'danger';
                verify = false;
            }
        }

        if (!verify) return this.setState({ err: "All the fields are mandatory!" });

        this.setState({ loader: true });

        const { isSignUp, isForgot } = this.state;

        if (isForgot) {
            return forgetPassword(email.value)
                .then(_ => this.setState({ loader: false, isEmailSent: true }))
                .catch(err => this.errHandler(err))
        }

        if (isSignUp) {
            this.props.onSignUp(displayName.value);
            this.SignUpWIthEmail(email.value, password.value)
        }
        else this.SignInWithEmail(email.value, password.value);
    };
    SignUpWIthEmail = (email, password) => {
        createUserWithEmailAndPassword(email, password)
            .then(({ user }) => user.sendEmailVerification())
            .catch(err => this.errHandler(err))
    }
    SignInWithEmail = (email, password) => {
        signInWithEmailAndPassword(email, password)
            .then(({ user }) => this.props.close(user))
            .catch(err => this.errHandler(err));
    }
    errHandler = ({ code }) => {
        switch (code) {
            case "auth/wrong-password":
                return this.showErr("Email or Password is invalid!");
            case "auth/user-not-found":
                return this.showErr("User not found!")
            case "auth/email-already-in-use" || "auth/account-exists-with-different-credential":
                return this.showErr("Email is already in use!");
            case "auth/network-request-failed":
                return this.showErr("Failed to connect internet");
            case "auth/invalid-email":
                return this.showErr("Please provide a valid email address!");
            case "auth/weak-password":
                return this.showErr("Password must be 6 characters long!");
            case "auth/popup-closed-by-userSIGN":
                return this.showErr("You have closed the popup!")
            case "auth/too-many-requests":
                return this.showErr("Please try again after 15 minures!");
            default:
                return this.showErr(code);
        }
    }
    showErr = err => this.setState({ err: err, loader: false });
    componentWillUnmount = () => {
        this.props.onSignUp(null);
    }
}

export default withRouter(SignIn);