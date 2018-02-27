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
  
const CurrentMassageOrderReport = gql`
  query MassageOrderReport($massage_room_id: ID!, $begin_date: Date!, $end_date: Date!) {
    massageOrderReport(massage_room_id:$massage_room_id,begin_date:$begin_date,end_date:$end_date) {
        massage_room_id massage_room { name location {name}} massage_type_id massage_type {name} count
    }
  }
`;


class MassagesReportTable extends React.Component {


    renderDocs(docs) {
       // const { classes } = this.props;
        return docs.map((doc,idx)=> (
          <TableRow hover key={idx}>
             <TableCell padding={"dense"}>{doc.massage_room.location.name}</TableCell>
             <TableCell padding={"dense"}>{doc.massage_room.name}</TableCell>
             <TableCell padding={"dense"}>{doc.massage_type.name}</TableCell>
             <TableCell padding={"dense"}>{doc.count}</TableCell>
          </TableRow>
        ));
    }


    render() {
        const { classes } = this.props;
        const rows = !this.props.report.massageOrderReport ?[]:this.renderDocs(this.props.report.massageOrderReport);

        return (
            <div className={classes.root}>
            <Paper>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell padding={"dense"}>Lokalita</TableCell>
                        <TableCell padding={"dense"}>Místnost</TableCell>
                        <TableCell padding={"dense"}>Typ masáže</TableCell>
                        <TableCell padding={"dense"}>Počet</TableCell>
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

MassagesReportTable.propTypes = {
    classes: PropTypes.object.isRequired,
    massage_room_id: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
};

  

export default compose(
    withStyles(styles),
    graphql(CurrentMassageOrderReport,{
        name: "report",
        options: ({massage_room_id,month})=>({variables:{
            massage_room_id:massage_room_id,
            begin_date:Moment(month).startOf('month').format("YYYY-MM-DD"),
            end_date:Moment(month).startOf('month').add(1,'month').format("YYYY-MM-DD")
        }})
    }),

)(MassagesReportTable)