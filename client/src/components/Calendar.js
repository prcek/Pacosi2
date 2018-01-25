import React from 'react';
import { withStyles } from 'material-ui/styles';
//import { fade } from 'material-ui/styles/colorManipulator';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import classNames from 'classnames'
import GridList, { GridListTile } from 'material-ui/GridList';
import Divider from 'material-ui/Divider';
import Moment from 'moment';
import Lodash from 'lodash';

const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
require("moment/min/locales.min");
moment.locale('cs');



const styles = theme => ({
    root: {
      width: '100%',
    },
    wrapper: {
        display: "flex",
        justifyContent: "center", /* align horizontal */
        alignItems: "center",
        //borderStyle: 'solid',
        //borderColor: 'green',
        //borderWidth: 'thin',
    },
    blankCell: {
        height: 35,
        width: 35,
        display: "flex",
        justifyContent: "center", /* align horizontal */
        alignItems: "center",
        padding:0,
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

    monthRow: {
        height: 34,
        width: '100%',
        display: "flex",
        justifyContent: "left", /* align horizontal */
        alignItems: "center",
        paddingLeft:theme.spacing.unit * 2,
        borderTopStyle: 'solid',
        borderColor:theme.palette.divider,
        borderTopWidth: 1,

    },
    disabled: {
        color: theme.palette.action.disabled,
        backgroundColor: theme.palette.action.disabledBackground
    },

});
  


class Calendar extends React.Component {

    state = {
        startDay: moment()
    }

    renderDay(x,key) {
        const { classes } = this.props;

        const className = classNames([
            classes.dayCell,
            { [classes.disabled]: false }
        ]);

        return (
            <div className={classes.wrapper} key={key}> 
            <div className={className}><Typography type="body2">{x}</Typography></div>
            </div>
        )
    }

    renderBlank(key) {
        const { classes } = this.props;

        return (
            <div className={classes.wrapper} key={key}> 
            <div className={classes.blankCell}></div>
            </div>
        )
        
    }

    renderMonth(label,key) {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper} key={key} cols={7}> 
            <div className={classes.monthRow}><Typography type="caption">{label}</Typography></div>
            </div>
            
        )
    }


    renderWeek(day,month,key) {
        const firstDay = moment(day).startOf('week');
        const days = Array.from(moment.range(firstDay,moment(firstDay).add(6,"days")).by("day"));
        return days.map(d=>{
            return d.isSame(month,"month")?d:null;
        }).map((d,idx)=>{
            if (d) {
                return this.renderDay(d.format("DD"),key+"d"+idx);
            } else {
                return this.renderBlank(key+"d"+idx);
            }
        })
    }



    render() {
        

        let current = moment(this.state.startDay).startOf('week');
        const rd = [];
        const rmax = 10;
        for(let r=0; r<rmax; r++ ) {
            const week = this.renderWeek(current,current,"w"+r);
            rd.push(...week);
            const next = moment(current).add(7,"days");
            if (!(next.isSame(current,"month"))) {
                r++;
                if (r<rmax) {

                    const mb = this.renderMonth(next.format('MMMM YYYY'),"w"+r)
                    rd.push(mb);
                    
                    if( !moment(current).add(6,'days').isSame(current,"month")) {
                        r++;
                        if (r<rmax) {
                            const nw = this.renderWeek(current,next,"w"+r);
                            rd.push(...nw);
                        }
                    }
                    
                }
            }
            current = next;
         }
        
        return (
            <div>
            <Typography> start day: {this.state.startDay.toISOString()}</Typography>

            <Divider/>

            <GridList cellHeight={40} cols={7}>
            {rd}
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