import React, { Component, Fragment } from 'react';
import './BookImagesPage.scss';
import AuthContext from '../context/auth-context';
import Navbar from '../components/NavBar/Navbar';
import { storeBooksPhotos, storeBook, deletePhoto } from '../firebase/firebase-utility';
import resizeImage from '../utility/resizeImage';
import Spinner from '../ui/Spinner';
import { connect } from 'react-redux';
import { storeBookAction } from '../actions/booksAction';

class BookImagesPage extends Component {
    state = {
        images: [],
        loader: true,
        book: {},
        err: null,
        showButton: true
    }
    photos = [];
    static contextType = AuthContext;
    onChange = e => {
        const img = e.target.files[0];
        if (!img) return false;
        const isPhoto = this.photos.find(photo => photo.name === img.name);
        isPhoto ? this.showTost() : resizeImage(img, this.storeToServer);
        e.target.value = ''
    }
    storeToServer = img => {
        const url = `${this.context.user.uid}/${this.state.id}/${img.name}`;
        this.photos.push({ name: img.name });
        const { images } = this.state;
        images.push({ url: URL.createObjectURL(img), completed: false });
        this.setState({ images, showButton: false });
        storeBooksPhotos(url, img, images.length - 1, this.progressCallBack, this.completeCallBack)
    }

    // CallBacks
    progressCallBack = (value, index) => this.refs[`progress${index}`].value = value;

    completeCallBack = (url, index) => {
        const images = this.state.images.slice();
        this.photos[index].url = url;
        images[index].completed = true;
        this.setState({ images, showButton: true });
    }
    storeBook = () => {
        this.setState({ loader: true });
        const { book, id } = this.state;
        book.id = id;
        const title = book.title.toLowerCase().trim();
        book.photos = this.photos.slice();
        const { history, searchReducers, userContactReducer } = this.props;
        let phoneNumber = null;
        userContactReducer && (phoneNumber = userContactReducer.phoneNumber);
        const isTitle = searchReducers.find(option => option === title);
        !isTitle && searchReducers.push(title);
        this.setState({ images: [] });
        storeBook(book, searchReducers)
            .then(() => {
                this.props.storeBookAction(book);
                phoneNumber ?
                    history.push(`/book/${id}`) :
                    history.push({
                        pathname: '/contact',
                        hash: id
                    })
            })
            .catch(err => this.showTost(err.message));
    }
    showTost = (err = "A photo already exists with same name") => {
        this.setState({ err });
        setTimeout(() => {
            this.setState({ err: null })
        }, 2500)
    }
    render() {
        return (
            <Fragment>
                <Navbar history={this.props.history} />
                {this.state.loader ? <Spinner /> :
                    <div className='BookImagesPage pd mr'>
                        {this.state.err && <div className='toast'>{this.state.err}</div>}
                        <h2>Upload photos for "{this.state.book.title}" book</h2>
                        <div className='flex wrap'>
                            <div className='card pd images-container upload-wrapper'>
                                <div className='image-uploader border flex ai'>
                                    <div className='details-to-display'>
                                        <i className='far fa-image'></i>
                                        <span>Browse </span>
                                            the photos
                                    </div>
                                    <input type='file' multiple onChange={this.onChange} />
                                </div>
                            </div>
                            {this.state.images.map((img, index) => (
                                <div className='card pd images-container' key={index}>
                                    <div className='backgroundImage' style={{ backgroundImage: `url(${img.url})` }}>
                                        <i className='fas fa-trash-alt' onClick={() => this.onDelete(index)} style={{ visibility: img.completed ? 'visible' : 'hidden' }}></i>
                                        {!img.completed && (
                                            <div className='image-blur'>
                                                <progress ref={`progress${index}`} max="100" value={img.value}>{img.value}</progress>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {this.state.images.length > 0 && this.state.showButton && <div className='pd shadow card footer'><button onClick={this.storeBook} className='primary btn'>Save</button></div>}
            </Fragment>
        )
    }
    onDelete = index => {
        const { book, id, images } = this.state;
        deletePhoto(`${book.uid}/${id}/${images[index].name}`)
            .then(_ => this.deletePhotosFromState(index))
            .catch(err => err.code === "storage/object-not-found" ?
                this.deletePhotosFromState(index) :
                this.showTost(err.message)
            );
    }
    deletePhotosFromState = index => {
        const images = this.state.images.slice();
        this.photos.splice(index, 1);
        images.splice(index, 1);
        this.setState({ images });
    }
    componentDidMount() {
        const { history, match, activeBookReducer } = this.props;
        if (history.action === "POP") return history.replace('/');
        const { id } = match.params;
        const { user } = this.context;
        if (!id || activeBookReducer.uid !== user.uid) return history.replace('/');
        if (activeBookReducer.uid === user.uid) {
            const images = [];
            this.photos = activeBookReducer.photos.slice()
            this.photos.forEach(photo => images.push({ name: photo.name, url: photo.url, completed: true, value: 100 }));
            return this.setState({ book: activeBookReducer, loader: false, images, id });
        }
        history.push('/')
    }
}
const mapStateToProps = ({ activeBookReducer, searchReducers, userContactReducer }) =>
    ({ activeBookReducer, searchReducers, userContactReducer });
const mapDispatchToProps = dispatch => ({ storeBookAction: book => dispatch(storeBookAction(book)) });
export default connect(mapStateToProps, mapDispatchToProps)(BookImagesPage);