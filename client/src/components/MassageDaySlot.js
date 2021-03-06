import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import DateTimeView from './DateTimeView';
import * as colors from 'material-ui/colors';
import { compose } from 'react-apollo'
import PaymentView from './PaymentView';

var classNames = require('classnames');
const baseH = 40;
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
        height: baseH+'px',
    },
    rooth2: {
        height: baseH*2+'px',
    },
    rooth3: {
        height: baseH*3+'px',
    },
    rooth4: {
        height: baseH*4+'px',
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
        backgroundColor: colors['green'][500]
    },
    bgRed: {
        backgroundColor: colors['red'][500]
    },
    bgOrange: {
        backgroundColor: colors['orange'][500]
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


    renderTime(free,warn) {
        const { classes } = this.props;
        return (
            <div className={classNames(classes.time,warn?(classes.bgOrange):(free?classes.bgGreen:classes.bgRed))}>
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
        const time=this.renderTime(false,this.props.warn);
        const clientname = this.props.order.client?this.props.order.client.surname+" "+(this.props.order.client.name||""):"";
        const phone = this.props.order.client? this.props.order.client.phone:"";
        const comment = this.props.order.comment;

        return (
            <div className={classNames(classes.inner,classes.click)} onClick={this.handleSlotClick}>
                {time}
                <div>
                    <Typography noWrap> <b>{clientname} </b>&nbsp;{phone}&nbsp;<em>{comment}</em></Typography>
                    <Typography noWrap> {this.props.order.massage_type.name}, &nbsp; <PaymentView payment={this.props.order.payment}/>  </Typography>
                </div>
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
    warn: PropTypes.bool,
    time: PropTypes.objectOf(Date).isRequired,
    length: PropTypes.number.isRequired,
    order: PropTypes.object,
    onClick: PropTypes.func
}
 
MassageDaySlot.defaultProps = {
    break: false,
    warn: false
}

export default compose(
    withStyles(styles),
)(MassageDaySlot)