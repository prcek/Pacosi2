import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Table, {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from 'material-ui/Table'


const Moment = require('moment');


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
});
  
const CurrentOrdersReport = gql`
  query OrderReport($user_id: ID!, $begin_date: Date!, $end_date: Date!) {
    orderReport(user_id:$user_id,begin_date:$begin_date,end_date:$end_date) {
        user { name id role status} user_id order_item {name id status} order_item_id count price
    }
  }
`;


class OrdersReportTable extends React.Component {
    render() {
        return (
            <div>
            <Typography> report table </Typography>
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
        options: ({user_id,month})=>({variables:{
            user_id:user_id,
            begin_date:Moment(month).startOf('month').format("YYYY-MM-DD"),
            end_date:Moment(month).startOf('month').add(1,'month').format("YYYY-MM-DD")
        }})
    }),

)(OrdersReportTable)