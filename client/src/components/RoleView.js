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
  

class RoleView extends React.Component {


    render() {
        var s = "";
        switch (this.props.role) {
            case "ADMIN": s = "správce"; break;
            case "DOCTOR": s ="doktor"; break;
            case "RECEPTION": s ="recepce"; break;
            default: s="?"
        }
        return (
            <span>{s}</span>
        )
    }
}


RoleView.propTypes = {
    classes: PropTypes.object.isRequired,
    role: PropTypes.string,
};
  

export default compose(
    withStyles(styles),
)(RoleView)