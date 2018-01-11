import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import DateTimeView from './DateTimeView';

const styles = theme => ({
    root: {
      width: '100%',
      minHeight: 100,
      padding: theme.spacing.unit,
      cursor: 'pointer'
    },
});
  


class MassageDayCard extends React.Component {
    handleClick() {
        this.props.onClick(this.props.date);
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root} onClick={()=>{this.handleClick()}}>
            <Typography> <DateTimeView date={this.props.date} format={"llll"}/> </Typography>
            status: {this.props.status}
            </div>
        )
    }
}

MassageDayCard.propTypes = {
    classes: PropTypes.object.isRequired,
    date: PropTypes.oneOfType([PropTypes.string,PropTypes.instanceOf(Date)]),
    status: PropTypes.number,
    onClick: PropTypes.func
}; 

export default compose(
    withStyles(styles),
)(MassageDayCard)