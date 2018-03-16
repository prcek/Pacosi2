import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
//import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Paper from 'material-ui/Paper';

import Table, {
    TableBody,
    TableCell,
 //   TableFooter,
    TableHead,
 //   TablePagination,
    TableRow,
} from 'material-ui/Table'


const Moment = require('moment');


const styles = theme => ({
    root: {
      width: '100%',
      padding: theme.spacing.unit * 3
    },
    table: {
       // padding: theme.spacing.unit * 3
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});
  
const CurrentLessonReport = gql`
  query LessonReport($begin_date: Date!, $end_date: Date!) {
    lessonReport(begin_date:$begin_date,end_date:$end_date) {
        lesson_type { name location {name}} count
    }
  }
`;


class LessonsReportTable extends React.Component {


    renderDocs(docs) {
       // const { classes } = this.props;
        return docs.map((doc,idx)=> (
          <TableRow hover key={idx}>
             <TableCell padding={"dense"}>{doc.lesson_type.location.name}</TableCell>
             <TableCell padding={"dense"}>{doc.lesson_type.name}</TableCell>
             <TableCell padding={"dense"}>{doc.count}</TableCell>
          </TableRow>
        ));
    }


    render() {
        const { classes } = this.props;
        const rows = !this.props.report.lessonReport ?[]:this.renderDocs(this.props.report.lessonReport);

        return (
            <div className={classes.root}>
            <Paper>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell padding={"dense"}>Lokalita</TableCell>
                        <TableCell padding={"dense"}>Lekce</TableCell>
                        <TableCell padding={"dense"}>Počet klientů</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
            </Paper>
            </div>
        )
    }
}

LessonsReportTable.propTypes = {
    classes: PropTypes.object.isRequired,
    month: PropTypes.string.isRequired,
};

  

export default compose(
    withStyles(styles),
    graphql(CurrentLessonReport,{
        name: "report",
        options: ({month})=>({
            variables:{
                begin_date:Moment(month).startOf('month').format("YYYY-MM-DD"),
                end_date:Moment(month).startOf('month').add(1,'month').format("YYYY-MM-DD")
            },
            fetchPolicy:"cache-and-network"
        })
    }),

)(LessonsReportTable)