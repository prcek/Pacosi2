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
  

class PaymentView extends React.Component {
 
    render() {
        var s = "";
        switch (this.props.payment) {
            case "NOT_PAID": s = "neplaceno"; break;
            case "VOUCHER": s ="dárkový poukaz"; break;
            case "INVOICE": s ="faktura"; break;
            case "PAID": s ="placeno"; break;
            default: s="?"
        }
        return (
            <span>{s}</span>
        )
    }
}


PaymentView.propTypes = {
    classes: PropTypes.object.isRequired,
    payment: PropTypes.string,
};
  

export default compose(
    withStyles(styles),
)(PaymentView)