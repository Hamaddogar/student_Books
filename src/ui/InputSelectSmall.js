import React, { useState, useRef } from 'react';
import './InputSelectSmall.scss';

const InputSmallSelect = props => {
    const [data, setData] = useState({
        value: props.value ? props.value : "",
        list: []
    })
    const onSubmit = e => {
        e.preventDefault();
        const { value } = data;
        props.onSubmit(value);
        props.clicked();
    }
    const onChange = e => {
        const value = e.target.value;
        if (value.trim() !== "") {
            const newList = [];
            props.options.forEach(option => option.toLowerCase().includes(value.toLowerCase().trim()) && newList.push(option));
            return setData({ value, list: newList });
        }
        setData({ value: '', list: [] });
    }
    const elm = useRef();
    const onSelect = title => {
        setData({ value: title, list: [] });
        elm.current.focus();
        props.autoSelect && props.onSubmit(title);
    };
    return (
        <div className='InputSelectSmall'>
            <div className='blur' onClick={props.clicked}></div>
            <form onSubmit={onSubmit} className='card shadow'>
                <button className={`fas fa-${props.icon}`}></button>
                <input type='text'
                    ref={elm}
                    autoFocus={true}
                    autoComplete='off'
                    value={data.value}
                    onChange={onChange}
                    placeholder={props.title}
                />
                <i className='fas fa-times' onClick={props.clicked}></i>
                <div className='data-list'>
                    {data.list.map((option, index) => <div onClick={() => onSelect(option)} key={index}>{option}</div>)}
                </div>
            </form>
        </div>
    )
}

export default InputSmallSelect;