import React, { Component } from 'react';
import './InputSelect.scss';


class InputSelect extends Component {
    state = {
        list: [],
        index: -1,
        value: this.props.value ? this.props.value : ''
    }
    onChange = e => {
        const value = e.target.value;
        if (value.trim() === "") {
            this.props.autoSelect && this.props.onSubmit(value);
            return this.setState({ list: [], index: -1, value })
        };
        const newList = this.props.options.filter(option => option.toLowerCase().includes(value.toLowerCase().trim()));
        this.setState({ list: newList, index: -1, value });
    }
    onSubmit = e => {
        e.preventDefault();
        const { value, index } = this.state;
        if (index < 0 && value !== "") return this.props.onSubmit(value);

        this.setState({ index: -1 });
    }
    onKeyDown = e => {
        let { index, list } = this.state;
        const { keyCode } = e;
        if (e.target.value !== "") {
            if (keyCode === 40) {
                index < list.length - 1 ? index++ : index = 0;
                return this.setState({ index });
            }
            if (keyCode === 38) {
                index > 0 ? index-- : index = list.length - 1;
                return this.setState({ index });
            }
            if (keyCode === 13 && index > -1 && list.length > 0) {
                const { active } = this.refs;
                this.props.autoSelect && this.props.onSubmit(active.innerHTML);
                return this.setState({ value: active.innerHTML, list: [], index: -1 });
            }
        }
    }
    onSelect = value => {
        this.refs.InputSelect.focus();
        this.setState({ value: value, list: [], index: -1 });
        this.props.autoSelect && this.props.onSubmit(value);
    }
    onBlur = () => setTimeout(()=>{
        this.setState({ list: [] })
    }, 200);
    render() {
        const { list, index, value } = this.state;
        return (
            <form className={`fg hs InputSelect ${this.props.className}`} onSubmit={this.onSubmit}>
                <input type='text'
                    autoComplete="off"
                    ref='InputSelect'
                    value={value}
                    onBlur={this.onBlur}
                    onFocus={this.onChange}
                    onChange={this.onChange}
                    placeholder={this.props.title}
                    onKeyDown={this.onKeyDown}
                />
                {list.length > 0 && <div className='options shadow card'>
                    <div ref='scrollbar' className='scrollbar'>
                        {list.map((option, i) => (
                            <div
                                ref={index === i && 'active'}
                                key={i}
                                onClick={() => this.onSelect(option)}
                                className={`link option ${index === i ? 'active' : ''}`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>}
                <button className={`fas fa-${this.props.icon}`}></button>
            </form>
        )
    }
    componentDidUpdate() {
        const { scrollbar } = this.refs;
        scrollbar && (scrollbar.scrollTop = 39 * this.state.index)
    }
}

export default InputSelect;