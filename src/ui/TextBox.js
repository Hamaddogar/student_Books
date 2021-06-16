import React, { Component } from 'react';
import './TextBox.scss';


class TextBox extends Component {
    render() {
        const onChange = e => this.props.onChange && this.props.onChange(e.target);
        const onBlur = ({ target }) => target.value.trim() !== "" ? target.className = "filled" : (this.props.validate ? target.className = "danger" : target.className = '');
        return (
            <label className='input-container TextBox'>
                <textarea type={this.props.type} defaultValue={this.props.value} name={this.props.name} onBlur={onBlur} ref="textbox" onChange={onChange} />
                <span>{this.props.label}</span>
            </label>
        )
    }
    componentDidMount = () => this.props.value && (this.refs.textbox.className = 'filled');
}

export default TextBox;