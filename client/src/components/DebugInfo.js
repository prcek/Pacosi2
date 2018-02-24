import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import Typography from 'material-ui/Typography';


const styles = theme => ({
    root: {
      margin: theme.spacing.unit,
    },

});


class DebugInfo extends React.Component {
 
    render() {
        const { classes } = this.props;
        const debug = (process.env.NODE_ENV !== 'production');
        if (!debug) {
            return null;
        }

        return (
            <Typography color={"secondary"} className={classes.root} variant="caption">
               {this.props.children}
            </Typography>
        )
    }
}




export default compose(
    withStyles(styles),
)(DebugInfo)