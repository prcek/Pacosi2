import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
var classNames = require('classnames');

const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
    },
    rooth1: {
        height: '2em',
    },
    rooth2: {
        height: '4em',
    },
    rooth3: {
        height: '6em',
    },
    rooth4: {
        height: '8em',
    },

    inner: {
        display:'flex',
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        borderBottom: '1px solid gray'        
    },
    time: {
        width: '3em',
        textAlign: 'center',
        margin: 0,
        paddingTop: '2px',
        borderRight: '1px solid gray'
    }
});
  


class MassageDaySlot extends React.Component {

    renderTime() {
        const { classes } = this.props;
        return (
            <div className={classes.time}>
                11:55
            </div>
        );
    }

    render() {
        const { classes } = this.props;
        const time=this.renderTime();
        const lc = [classes.rooth1,classes.rooth2,classes.rooth3,classes.rooth4]
        return (
            <div className={classNames(classes.root,lc[this.props.length-1])}>
            <div className={classes.inner}>
            {time} <Typography> massage day slot </Typography>
            </div>
            </div>
        )
    }
}

MassageDaySlot.propTypes = {
    classes: PropTypes.object.isRequired,
    length: PropTypes.number
}
 
MassageDaySlot.defaultProps = {
    length: 1
}

export default compose(
    withStyles(styles),
)(MassageDaySlot)