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

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');



const LessonInfo = gql`
  query LessonInfo($lesson_id: ID!) {
    lessonInfo(id:$lesson_id) {
        id,datetime,capacity,members {
            id,presence,client {
              id,name,surname
            }
        }
    }
  }
`;




const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    table: {
        minWidth: 500,
        margin: theme.spacing.unit*3
    },
});
  


class LessonTab extends React.Component {

    
    renderMembers(members) {
        console.log(members)
        return members.map((m,i)=>(
            <TableRow key={m.id}>
                <TableCell>{i+1}</TableCell>
                <TableCell>12345</TableCell>
                <TableCell>{m.client.surname}</TableCell>
                <TableCell>{m.client.name}</TableCell>
                <TableCell>{m.client.phone}</TableCell>
                <TableCell>2017-12-12 13:34</TableCell>
                <TableCell>checkbox</TableCell>

            </TableRow>
        ));  
    }

    render() {
        const { classes } = this.props;
        if (!(this.props.lessonInfo && this.props.lessonInfo.lessonInfo)) {
            return null;
        } 
        const members = this.renderMembers(this.props.lessonInfo.lessonInfo.members)
        return (
            <div>
            <Toolbar>
                <Typography> lekce xyz </Typography>
                <Button > zapsat </Button>
            </Toolbar>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Číslo</TableCell>
                        <TableCell>Přijmení</TableCell>
                        <TableCell>Jméno</TableCell>
                        <TableCell>Telefon</TableCell>
                        <TableCell>Zapsán</TableCell>
                        <TableCell>Účast</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{members}</TableBody>
                <TableFooter>
                </TableFooter>
                
            </Table>
          
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