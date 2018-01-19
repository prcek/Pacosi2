import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import DateTimeView from './DateTimeView';
import { compose } from 'react-apollo'
var classNames = require('classnames');

const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
    },
    roothb: {
        height: '1.5em',
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
    click: {
        cursor: 'pointer'
    },
    time: {
        width: '3em',
        textAlign: 'center',
        margin: 0,
        paddingTop: '2px',
        borderRight: '1px solid gray'
    },
    bgGreen: {
        backgroundColor: 'green'
    },
    bgRed: {
        backgroundColor: 'red'
    },
    break: {
        width:"100%",
        textAlign: 'center',
        margin: 0,
        paddingTop: '2px',
        backgroundColor:'gray',
    }
});
  


class MassageDaySlot extends React.Component {

    handleSlotClick = () => {
        console.log("slot click")
        if (this.props.onClick) { 
            this.props.onClick(this.props.time,this.props.order);
        }
    }


    renderTime(free) {
        const { classes } = this.props;
        return (
            <div className={classNames(classes.time,free?classes.bgGreen:classes.bgRed)}>
                <DateTimeView date={this.props.time} format={"HH:mm"} />
            </div>
        );
    }
    renderBreak() {
        const { classes } = this.props;
        return (
            <div className={classes.inner}>
            <div className={classes.break} >
            přestávka
            </div>
            </div>
        )
    }

    renderSlot() {
        const { classes } = this.props;
        const time=this.renderTime(false);
        return (
            <div className={classNames(classes.inner,classes.click)} onClick={this.handleSlotClick}>
            {time} <Typography> {this.props.order.customer_name} </Typography>
            </div>
        )
    }
    renderFreeSlot() {
        const { classes } = this.props;
        const time=this.renderTime(true);
        return (
            <div className={classNames(classes.inner,classes.click)} onClick={this.handleSlotClick}>
            {time} <Typography>  </Typography>
            </div>
        )
    }
 
    render() {
        const { classes } = this.props;
        const inner=this.props.break?this.renderBreak():(this.props.order?this.renderSlot():this.renderFreeSlot());
        const lc = [classes.rooth1,classes.rooth2,classes.rooth3,classes.rooth4]
        return (
            <div className={classNames(classes.root,this.props.break?classes.roothb:lc[this.props.length-1])}>
                {inner}
            </div>
        )
    }
}

MassageDaySlot.propTypes = {
    classes: PropTypes.object.isRequired,
    brake: PropTypes.bool,
    time: PropTypes.objectOf(Date).isRequired,
    length: PropTypes.number.isRequired,
    clen: PropTypes.number,
    order: PropTypes.object,
    onClick: PropTypes.func
}
 
MassageDaySlot.defaultProps = {
    break: false
}

export default compose(
    withStyles(styles),
)(MassageDaySlot)