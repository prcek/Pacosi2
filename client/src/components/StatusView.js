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
  

class StatusView extends React.Component {


    render() {
        var s = "";
        switch (this.props.status) {
            case "ACTIVE": s = "aktivni"; break;
            case "DISABLED": s ="neaktivni"; break;
            default: s="?"
        }
        return (
            <span>{s}</span>
        )
    }
}


StatusView.propTypes = {
    classes: PropTypes.object.isRequired,
    status: PropTypes.string,
};
  

export default compose(
    withStyles(styles),
)(StatusView)