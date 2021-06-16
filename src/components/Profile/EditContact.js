import React, { Component } from "react";
import './EditContact.scss';
import Input from "../../ui/Input";
import { updateContact } from "../../firebase/firebase-utility";
import AuthContext from '../../context/auth-context';

class EditContact extends Component {
    state = {
        isEdit: false,
        value: this.props.value,
        err: false
    }
    static contextType = AuthContext;
    render() {
        const { isEdit, value, err } = this.state;
        const { title, name } = this.props
        return isEdit ? (
            <form className='update-contact-container' onSubmit={this.onSubmit}>
                {err && <div className='toast'>{err}</div>}
                <Input label={title} name={name} value={value} validate autoFocus={true} />
                <div className='flex'>
                    <button className='btn primary f1'>{value ? 'Update' : 'Add'}</button>
                    <div className='btn f1' onClick={() => this.setState({ isEdit: false })}>Cancel</div>
                </div>
            </form>
        ) : (
                <div className='EditContact'>
                    <div className='flex sb ai editNow'>
                        {value}
                        {value ? <i className='fas fa-pen' onClick={() => this.setState({ isEdit: true })}></i>
                            :
                            <b className='addcontact' onClick={() => this.setState({ isEdit: true })}>Add {title.toLowerCase()}</b>
                        }
                    </div>
                </div>
            )
    }
    onSubmit = e => {
        e.preventDefault();
        const { name, onSubmit } = this.props
        const { value } = e.target[name];
        if (value === "") return e.target[name].blur();
        if (value === this.state.value) return this.setState({ isEdit: false });
        this.setState({ isEdit: false, value })
        const oldValue = value;
        const newContactDetails = {};
        newContactDetails[name] = value;
        const { user, updateProfile } = this.context;

        const errorHandler = err => {
            this.setState({
                err: err.message,
                isEdit: true,
                value: oldValue
            })
            setTimeout(() => {
                this.setState({ err: false });
            }, 2500);
        }

        const update = () => updateContact(newContactDetails, user.uid).catch(err => errorHandler(err))
        if (onSubmit) return onSubmit(user, value, updateProfile, errorHandler, update);
        update();
    }
}

export default EditContact;