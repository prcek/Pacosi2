import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import classNames from 'classnames'
import GridList, { GridListTile } from 'material-ui/GridList';
const styles = theme => ({
    root: {
      width: '100%',
    },
    dayCellWrapper: {
        display: "flex",
        justifyContent: "center", /* align horizontal */
        alignItems: "center",
        //borderStyle: 'solid',
        //borderColor: 'green',
        //borderWidth: 'thin',
    },
    dayCell: {
        height: 35,
        width: 35,
        display: "flex",
        justifyContent: "center", /* align horizontal */
        alignItems: "center",

        padding:0,
        borderRadius: '50%',
       // borderStyle: 'solid',
       // borderColor: 'red',
       // borderWidth: 'thin',
       '&$disabled': {
        boxShadow: theme.shadows[6],
       },
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            // Reset on mouse devices
            //'@media (hover: none)': {
            //    backgroundColor: theme.palette.grey[300],
            //},
            '&$disabled': {
                backgroundColor: theme.palette.action.disabledBackground,
            },
        },
    },
    disabled: {
        color: theme.palette.action.disabled,
        backgroundColor: theme.palette.action.disabledBackground
    },

});
  


class Calendar extends React.Component {


    renderDay(x,idx) {
        const { classes } = this.props;

        const className = classNames([
            classes.dayCell,
            { [classes.disabled]: ((idx %2)!==0) }
        ]);

        return (
            <div className={classes.dayCellWrapper} key={idx}> 
            <div className={className}>{x}</div>
            </div>
        )
    }
    render() {
        const days = [1,2,3,4,5,6,7,8,9,10].map((x,idx)=>this.renderDay(x,idx));
        return (
            <div>
            <GridList cellHeight={40} cols={5}>
            {days}
            </GridList>
            </div>
        )
    }
}

Calendar.propTypes = {
    disabled: PropTypes.bool,
};

Calendar.defaultProps = {
   disabled:false,
    
}


export default compose(
    withStyles(styles),
)(Calendar)