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
  
const CurrentOrdersReport = gql`
  query OrderReport($user_id: ID!, $begin_date: Date!, $end_date: Date!) {
    orderReport(user_id:$user_id,begin_date:$begin_date,end_date:$end_date) {
        user { name id role status} user_id order_item {name id status} order_item_id count total_price orders
    }
  }
`;


class OrdersReportTable extends React.Component {


    renderDocs(docs) {
       // const { classes } = this.props;
        return docs.map((doc,idx)=> (
          <TableRow hover key={idx}>
             <TableCell padding={"dense"}>{doc.user.name}</TableCell>
             <TableCell padding={"dense"}>{doc.order_item.name}</TableCell>
             <TableCell padding={"dense"}>{doc.count}</TableCell>
             <TableCell padding={"dense"}>{doc.total_price}</TableCell>
             <TableCell padding={"dense"}>{doc.orders}</TableCell>
          </TableRow>
        ));
    }


    render() {
        const { classes } = this.props;
        const rows = !this.props.report.orderReport ?[]:this.renderDocs(this.props.report.orderReport);

        return (
            <div className={classes.root}>
            <Paper>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell padding={"dense"}>Doktor</TableCell>
                        <TableCell padding={"dense"}>Položka</TableCell>
                        <TableCell padding={"dense"}>Kolik</TableCell>
                        <TableCell padding={"dense"}>Cena celkem</TableCell>
                        <TableCell padding={"dense"}>Počet prodejů</TableCell>
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

OrdersReportTable.propTypes = {
    classes: PropTypes.object.isRequired,
    user_id: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
};

  

export default compose(
    withStyles(styles),
    graphql(CurrentOrdersReport,{
        name: "report",
        options: ({user_id,month})=>({
            variables:{
                user_id:user_id,
                begin_date:Moment(month).startOf('month').format("YYYY-MM-DD"),
                end_date:Moment(month).startOf('month').add(1,'month').format("YYYY-MM-DD")
            },
            fetchPolicy:"cache-and-network"
        })
    }),

)(OrdersReportTable)