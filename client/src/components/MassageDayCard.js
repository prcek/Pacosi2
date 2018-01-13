import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import DateTimeView from './DateTimeView';
var classNames = require('classnames');


const styles = theme => ({
    root: {
      width: '100%',
      minHeight: '6em',
      padding: theme.spacing.unit,
      cursor: 'pointer',
    },
    header: {
        width: '100%',
        minHeight: '2em',
        padding: theme.spacing.unit,
    },
    selected0: {
        backgroundColor:'gray',
        borderStyle: 'solid',
        borderColor: 'black'
    },
    selected1: {
        backgroundColor:'green',
        borderStyle: 'solid',
        borderColor: 'black'
    },
    selected2: {
        backgroundColor:'red',
        borderStyle: 'solid',
        borderColor: 'black'
    },
    status0: {
        backgroundColor:'gray',
        borderStyle: 'solid',
        borderColor: 'gray'
    },
    status1: {
        backgroundColor:'green',
        borderStyle: 'solid',
        borderColor: 'green',
    },
    status2: {
        backgroundColor:'red',
        borderStyle: 'solid',
        borderColor: 'red',
    }
});
  


class MassageDayCard extends React.Component {
    handleClick() {
        this.props.onClick(this.props.date);
    }
    render() {
        const { classes } = this.props;
        const ss = [classes.status0,classes.status1,classes.status2]
        const ses = [classes.selected0,classes.selected1,classes.selected2]
        return (
            <div className={classNames(classes.root,this.props.selected?ses[this.props.status]:ss[this.props.status])} onClick={()=>{this.handleClick()}}>
            <Typography> <DateTimeView date={this.props.date} format={"LL"}/> </Typography>
            </div>
        )
    }
}

MassageDayCard.propTypes = {
    classes: PropTypes.object.isRequired,
    date: PropTypes.oneOfType([PropTypes.string,PropTypes.instanceOf(Date)]),
    status: PropTypes.number,
    selected: PropTypes.bool,
    onClick: PropTypes.func
}; 


class MassageDayCardHeader extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.header}>
            <Typography> {this.props.label} </Typography>
            </div>
        )
    }
}

MassageDayCardHeader.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string
}

var MassageDayCard_ = compose(withStyles(styles))(MassageDayCard)
var MassageDayCardHeader_ = compose(withStyles(styles))(MassageDayCardHeader)

export {
    MassageDayCard_ as MassageDayCard,
    MassageDayCardHeader_ as MassageDayCardHeader
}