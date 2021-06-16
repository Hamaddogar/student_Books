import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import InputSmallSelect from '../../../ui/InputSelectSmall';
import { cities } from '../../../data/cities';
import Categories from '../../../data/Categories';

const MobileSearchBar = props => {
    const onSubmit = value => {
        if(value !== "") props.history.push({ pathName: '/search', search: value });
        props.clicked();
    };

    const options = [...props.searchReducers];
    Categories.forEach(({ cat }) => options.push(cat.toLowerCase()));
    cities.forEach(city => options.push(city.toLowerCase()));

    return (
        <InputSmallSelect
            icon="search"
            options={options}
            onSubmit={onSubmit}
            title="Search books"
            clicked={props.clicked}
        />
    )
}

const mapStateToProps = ({ searchReducers }) => ({ searchReducers })
export default connect(mapStateToProps)(withRouter(MobileSearchBar));