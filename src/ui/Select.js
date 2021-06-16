import React, { Component } from 'react';
import './Select.scss';

class Select extends Component {
    state = {
        data: [],
        value: ''
    }
    render() {
        const onChange = e => {
            const { value } = e.target;
            let searched = [];
            if (value !== "") {
                this.props.data.forEach(item => {
                    if (item.toLowerCase().includes(value.toLowerCase())) {
                        searched.push(value);
                    }
                });
            } else {
                searched = [];
            }
            this.setState({ value: value });
            this.props.onChange && this.props.onChange(e.target);
            console.log(this.state.data)
        };
        const onBlur = ({ target }) => target.value.trim() !== "" ? target.className = "filled" : (this.props.validate ? target.className = "danger" : target.className = '');
        return (
            <label className='input-container'>
                <input type='text' name={this.props.name} onBlur={onBlur} value={this.state.value} ref="input" onChange={onChange} />
                <span>{this.props.label}</span>
                <div className='DropDownOptions'>
                    {this.state.data.map((item, index) => (
                        <div>{item}</div>
                    ))}
                </div>
            </label>
        )
    }
    componentDidMount() {
        this.props.getRef && this.props.getRef(this.refs.input);
    }
}

export default Select;