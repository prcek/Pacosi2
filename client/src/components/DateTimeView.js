import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
});
  
var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');


class DateTimeView extends React.Component {


    render() {
        const s = moment(this.props.date).format(this.props.format)
        return (
            <span>{s}</span>
        )
    }
}


DateTimeView.propTypes = {
    classes: PropTypes.object.isRequired,
    date: PropTypes.oneOfType([PropTypes.string,PropTypes.instanceOf(Date),PropTypes.instanceOf(moment)]),
    format: PropTypes.string
};
  
DateTimeView.defaultProps = {
    format: "LL"
}

export default compose(
    withStyles(styles),
)(DateTimeView)