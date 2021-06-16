import React from 'react';
import { cities } from '../../../data/cities';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import cityAction from '../../../actions/cityAction';
import { booksAction } from '../../../actions/booksAction';
import InputSelect from '../../../ui/InputSelect';
import './CityInput.scss';

const CityInput = props => {
    const onSelect = value => {
        props.cityAction(value);
        props.booksAction();
    };
    return <InputSelect
        options={cities}
        autoSelect={true}
        onSubmit={onSelect}
        icon="map-marker-alt"
        title='Choose your city'
        className='chooseCityInput'
        value={localStorage.getItem('city')}
    />
}

const mapDispatchToProps = dispatch => ({
    cityAction: city => dispatch(cityAction(city)),
    booksAction: () => dispatch(booksAction([]))
})

export default connect(null, mapDispatchToProps)(withRouter(CityInput));