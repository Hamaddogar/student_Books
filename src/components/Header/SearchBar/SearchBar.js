import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import InputSelect from '../../../ui/InputSelect';
import { cities } from '../../../data/cities';
import Categories from '../../../data/Categories';

const SearchBar = ({ searchReducers, history }) => {
    const onSubmit = value => history.push({
        pathname: '/search',
        search: value
    });

    const options = [...searchReducers];
    Categories.forEach(({ cat }) => options.push(cat.toLowerCase()));
    cities.forEach(city => options.push(city.toLowerCase()));

    return (
        <InputSelect
            icon="search"
            options={options}
            title='Search books'
            onSubmit={onSubmit}
        />
    )
}


const mapStateToProps = ({ searchReducers }) => ({ searchReducers })
export default connect(mapStateToProps)(withRouter(SearchBar));