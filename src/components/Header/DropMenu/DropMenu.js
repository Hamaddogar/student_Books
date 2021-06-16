import React from 'react';
import './DropMenu.scss'

const DropMenu = props => (
    <div className='DropMenu hs'>
            <div className='caret-up'>
                <div></div>
            </div>
            <div className='shadow'>
                {props.children}
            </div>
    </div>
)

export default DropMenu;