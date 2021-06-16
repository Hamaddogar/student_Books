import React, { PureComponent } from 'react';
import './App.scss';
import { Route, Switch } from 'react-router-dom';
import SignIn from './components/Sign-In';
import { auth, createUserProfileDocument } from './firebase/firebase-utility';
import AuthContext from './context/auth-context';
import Routes from './routes';
import PostBookPage from './pages/PostBookPage';
import BookImagesPage from './pages/BookImagesPage';
import { connect } from 'react-redux';
import { userContactAction } from './actions/userContactAction';
import searchAction from './actions/searchAction';

class App extends PureComponent {
  state = {
    loginPop: false,
    user: null,
    initialState: false,
    phoneNumer: false,
    displayName: null,
    loginCallBack: null
  }
  updateProfile = () => {
    const { user } = this.state;
    this.setState({ user: null });
    this.setState({ user });
  };
  closeModel = user => {
    const { loginCallBack } = this.state;
    if (user && loginCallBack && this.refreshToken) {
      loginCallBack(user);
      this.setState({ loginCallBack: null })
    }
    this.setState({ loginPop: false })
  }
  showLoginPop = (loginCallBack = null) => this.setState({ loginCallBack, loginPop: true });
  render = () => (
    <AuthContext.Provider value={{ loginPop: this.showLoginPop, user: this.state.user, updateProfile: this.updateProfile }}>
      {this.state.loginPop &&
        <SignIn
          displayName={this.state.displayName}
          isUser={this.state.user ? true : false}
          close={this.closeModel}
          onSignUp={displayName => this.setState({ displayName })}
        />}
      <Switch>
        <Route path='/post' component={PostBookPage} />
        {this.state.user && <Route path='/bookimages/:id' component={BookImagesPage} />}
        {this.state.user && <Route path='/edit/:id' component={PostBookPage} />}
        <Route e path='/' render={() => <Routes isUser={this.state.user ? true : false} />} />
      </Switch>
    </AuthContext.Provider>
  )
  componentDidMount = () => {
    this.props.searchAction();
    this.unsubscribeFromAuth =
      auth.onAuthStateChanged(async user => {
        this.refreshToken = undefined;
        if (user) {
          this.refreshToken = user.refreshToken;
          const { loginCallBack } = this.state;
          loginCallBack && loginCallBack(user);
          const { displayName } = this.state;
          if (displayName) {
            await user.updateProfile({ displayName }).then(_ => {
              createUserProfileDocument(user);
            })
          }
          else {
            this.props.userContactAction(user.uid);
            await createUserProfileDocument(user);
          }
        }
        this.setState({ user: user, loginPop: false, displayName: null, loginCallBack: null });
      });
  }
  componentWillUnmount = () => this.unsubscribeFromAuth();
}

const mapDispatchToProps = dispatch => ({
  userContactAction: userId => dispatch(userContactAction(userId)),
  searchAction: () => dispatch(searchAction()),
})

export default connect(null, mapDispatchToProps)(App);