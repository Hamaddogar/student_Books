import React from 'react';
import { cities } from '../../../data/cities';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import cityAction from '../../../actions/cityAction';
import { booksAction } from '../../../actions/booksAction';
import InputSmallSelect from '../../../ui/InputSelectSmall';

const MobileCityInput = props => {
    const onSelect = value => {
        props.cityAction(value);
        props.booksAction();
        props.clicked();
    };
    return <InputSmallSelect
        options={cities}
        autoSelect={true}
        onSubmit={onSelect}
        icon="map-marker-alt"
        clicked={props.clicked}
        title='Choose your city'
        value={localStorage.getItem('city')}
    />
}

const mapDispatchToProps = dispatch => ({
    cityAction: city => dispatch(cityAction(city)),
    booksAction: () => dispatch(booksAction([]))
})
export default connect(null, mapDispatchToProps)(withRouter(MobileCityInput));