import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import DeleteIcon from 'material-ui-icons/Delete';
import DateTimeView from './DateTimeView';
import Checkbox from 'material-ui/Checkbox';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');



const LessonInfo = gql`
  query LessonInfo($lesson_id: ID!) {
    lessonInfo(id:$lesson_id) {
        id,datetime,capacity,members {
            id,presence,client {
              id,name,surname,phone
            }
        }
        lesson_type {
            name
            location {
              name
            }
        }
    }
  }
`;




const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
      overflowX: 'auto',
    },
    flex: {
        flex: 1,
    },
    table: {
       
    },
    button: {
        margin: theme.spacing.unit,
    },
    cell: {
        xheight:"28px",
        xcolor:"red"
    },
    row: {
        xheight:"28px"
    },
    celltb: {
        margin:0,
        padding:0
    },
    toolbar: {
        minHeight:0
    }
    
});
  


class LessonTab extends React.Component {

    
    renderMembers(members) {
        const { classes } = this.props;
        return members.map((m,i)=>(
            <TableRow hover key={m.id} classes={{root:classes.row}}>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>{i+1}</TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>12345</TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>{m.client.surname}</TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>{m.client.name}</TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>{m.client.phone}</TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}><DateTimeView date={new Date()} format="LLL"/></TableCell>
                <TableCell padding={"checkbox"} classes={{root:classes.cell}}>
                    <Checkbox checked={m.presence} disabled />
                </TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>
                    <Toolbar disableGutters={true} classes={{root:classes.toolbar}} >
                        <Button raised style={{minWidth:"38px"}}> <DeleteIcon/>  </Button>
                        
                    </Toolbar>
                </TableCell>
            </TableRow>
        ));  
    }

    render() {
        const { classes } = this.props;
        if (!(this.props.lessonInfo && this.props.lessonInfo.lessonInfo)) {
            return null;
        } 
        const members = this.renderMembers(this.props.lessonInfo.lessonInfo.members)
        const lessonInfo = this.props.lessonInfo.lessonInfo;
        return (
            <div className={classes.root}>
            <Toolbar>
                <Typography type="title" className={classes.flex} noWrap> Lekce {lessonInfo.lesson_type.name} - {lessonInfo.lesson_type.location.name}, <DateTimeView date={lessonInfo.datetime} format="LLLL"/> </Typography>
                <Button raised className={classes.button} > přihlásit </Button>
                <Button raised className={classes.button} > docházka </Button>
            </Toolbar>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow classes={{root:classes.row}}>
                        <TableCell padding={"dense"} className={classes.cell}>#</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Číslo</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Přijmení</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Jméno</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Telefon</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Zapsán</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Účast</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{members}</TableBody>
                <TableFooter>
                </TableFooter>
            </Table>
            <Typography type="caption"> Lesson Id: {this.props.lessonId} </Typography>
            </div>
        );
        
    }
}

LessonTab.propTypes = {
    classes: PropTypes.object.isRequired,
    lessonId: PropTypes.string.isRequired,
};
  

export default compose(
    withStyles(styles),
    graphql(LessonInfo,{
        name: "lessonInfo",
        options: ({lessonId})=>({variables:{lesson_id:lessonId}})
    }),

)(LessonTab)