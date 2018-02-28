import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import version from './../version.json';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    version: {
        margin:0,
        paddingRight: "10px",
        width: '100%',
        textAlign:'right',
        fontSize: "0.75rem"
    }
    
});



class Version extends React.Component {
 
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.version}>
                {version.commit + " - " +version.log+ " ("+version.date+")"}
            </div>
        )
    }
}




export default compose(
    withStyles(styles),
)(Version)