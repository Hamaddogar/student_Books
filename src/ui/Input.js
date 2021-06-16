import React, { Component } from 'react';
import './Input.scss';


class Input extends Component {
    render() {
        const onChange = e => {
            const { value } = e.target;
            const { length } = value;
            this.props.type === "number" && !+value && length > 0 &&
                (e.target.value = value.slice(0, (length - 1)));
        };
        const onBlur = ({ target }) => target.value.trim() !== "" ? target.className = "filled" : (this.props.validate ? target.className = "danger" : target.className = '');
        return (
            <label className='input-container'>
                <input ref="input"
                    onBlur={onBlur}
                    onChange={onChange}
                    list={this.props.list}
                    name={this.props.name}
                    maxLength={this.props.length}
                    defaultValue={this.props.value}
                    autoFocus={this.props.autoFocus}
                    autoComplete={this.props.autoComplete}
                    type={this.props.type === 'password' ? 'password' : 'text'}
                />
                <span>{this.props.label}</span>
            </label>
        )
    }
    componentDidMount = () => this.props.value && (this.refs.input.className = 'filled')
}

export default Input;