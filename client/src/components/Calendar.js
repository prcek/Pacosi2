import React from 'react';
import { withStyles } from 'material-ui/styles';
//import { fade } from 'material-ui/styles/colorManipulator';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import classNames from 'classnames'
import GridList /*, { GridListTile }  */ from 'material-ui/GridList';
import Divider from 'material-ui/Divider';
import Moment from 'moment';
//import Lodash from 'lodash';
//import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import ForwardIcon from 'material-ui-icons/FastForward';
import RewindIcon from 'material-ui-icons/FastRewind';
import * as colors from 'material-ui/colors';

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
        cursor: "pointer",
        padding:0,
        borderRadius: '50%',
       // borderStyle: 'solid',
       // borderColor: 'red',
       // borderWidth: 'thin',
       '&$disabled': {
        boxShadow: theme.shadows[6],
       },
        '&:hover': {
            //backgroundColor: theme.palette.primary.main,
            //color: theme.palette.primary.contrastText,
            boxShadow: theme.shadows[6],
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

    header: {
       // backgroundColor: theme.palette.action.disabledBackground,
       //color:theme.palette.divider
    },

    selected: {
        //boxShadow: theme.shadows[6] 
           backgroundColor: theme.palette.primary.main,
           color: theme.palette.primary.contrastText,
         
    },

    colorClassNone:{

    },
    colorClass0: {
        backgroundColor: 'gray'
    },
    colorClass1: {
        backgroundColor: colors['green'][500]
    },
    colorClass2: {
        backgroundColor: colors['red'][500]
    },

    disabled: {
        color: theme.palette.action.disabled,
        backgroundColor: theme.palette.action.disabledBackground
    },

});
  


class Calendar extends React.Component {


    handleSelect = (day) => {
        this.props.onSelect(day);
    }


    getDayColorIndex(day) {
        const di = this.props.daysInfo.find((x)=>{return x.day.isSame(day,'day')});
        if (di) {
            return di.colorIndex;
        }
        return null;
    }
    isSelectedDay(day) {
        return this.props.selectedDay?day.isSame(this.props.selectedDay,"day"):false;
    }

    renderDay(x,key) {
        const { classes } = this.props;
        const colorIndex = this.getDayColorIndex(x);
        const selected = this.isSelectedDay(x);
        const colorClasses = [classes.colorClass0,classes.colorClass1,classes.colorClass2]
        const colorClass = colorIndex?colorClasses[colorIndex]:classes.colorClassNone;
      //  console.log(colorIndex)
        const className = classNames([
            classes.dayCell,
            { [classes.selected]: selected },
            { [colorClass]: !selected}
        ]);

        return (
            <div className={classes.wrapper} key={key} onClick={()=>this.handleSelect(x)}> 
            <div className={className}><Typography type="body2" color="inherit">{x.format("DD")}</Typography></div>
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

    renderHeader(name,key) {
        const { classes } = this.props;
        const className = classNames([
            classes.wrapper,
            classes.header
        ]);
        return (
            <div className={className} key={key}> 
            <div className={classes.blankCell}><Typography type="caption" >{name}</Typography></div>
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
                return this.renderDay(d,key+"d"+idx);
            } else {
                return this.renderBlank(key+"d"+idx);
            }
        })
    }



    render() {
        
        const { classes } = this.props;
      
        let current = moment(this.props.startDay).startOf('week');
        const dhs=["Po","Út","St","Čt","Pá","So","Ne"].map((n,idx)=>{return this.renderHeader(n,"h"+idx)});
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

            <div className={classes.wrapper}>
                <Button color={"primary"} onClick={this.props.onBackward}><RewindIcon/></Button>  
                <Button color={"primary"} onClick={this.props.onToday}>dnes</Button>
                <Button color={"primary"} onClick={this.props.onForward}><ForwardIcon/></Button>  
            </div>
            <GridList cellHeight={30} cols={7}>
            {dhs}
            </GridList>
            <Divider/>

            <GridList cellHeight={40} cols={7}>
            {rd}
            </GridList>
            </div>
        )
    }
}

Calendar.propTypes = {
    classes: PropTypes.object.isRequired,
    startDay: PropTypes.objectOf(moment),
    selectedDay: PropTypes.objectOf(moment),
    onBackward: PropTypes.func,
    onForward: PropTypes.func,
    onToday: PropTypes.func,
    onSelect: PropTypes.func,
    daysInfo: PropTypes.array
};

Calendar.defaultProps = {
   startDay: moment()
}


export default compose(
    withStyles(styles),
)(Calendar)