import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import { connect } from 'react-redux'
import gql from 'graphql-tag';
import { setOrderPageNo, setOrderPageLength } from './../actions'
import DateTimeView from './DateTimeView';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import AddIcon from 'material-ui-icons/Add';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { SnackbarContent } from 'material-ui/Snackbar';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';


import Table, {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from 'material-ui/Table'





const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    table: {
        minWidth: 800,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    toolbar: {
        minHeight:0
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textfield: {
        margin: theme.spacing.unit
    }
});

const CurrentOrders = gql`
  query Orders($pageNo: Int!, $pageLength: Int!) {
    orders_pages(pagination:{pageNo:$pageNo,pageLength:$pageLength}) {
      items {
        id
        user {name} user_id price total_price count order_item {name} order_item_id customer_name
        created_at
      }

      paginationInfo {
        pageNo
        pageLength
        totalPages
        totalCount
      }
    }
  }
`;



class Orders extends React.Component {


    handleChangePage = (event, page) => {
        this.props.onSelectPageNo(page)
    };
    
    handleChangeRowsPerPage = event => {
        this.props.onSelectPageLength(event.target.value);
    };

    renderOrders(orders) {
        const { classes } = this.props;
        return orders.map(order=> (
          <TableRow key={order.id}>
             <TableCell padding={"dense"}>{order.user.name}</TableCell>
             <TableCell padding={"dense"}>{order.order_item.name}</TableCell>
             <TableCell padding={"dense"}>{order.customer_name}</TableCell>
             <TableCell padding={"dense"} style={{width:"0px"}}>{order.count}</TableCell>
             <TableCell padding={"dense"} style={{width:"0px"}}>{order.total_price}</TableCell>
             <TableCell padding={"dense"}><DateTimeView date={order.created_at} format="LLL"/></TableCell>
             <TableCell padding={"dense"} classes={{root:classes.cell}}>
                <Toolbar disableGutters={true} classes={{root:classes.toolbar}} >
                    <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenEditDialog(order)}> <EditIcon/>  </Button>
                    <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenDeleteDialog(order)}> <DeleteIcon/>  </Button>
                </Toolbar>
            </TableCell>

          </TableRow>
        ));
    }
    renderPaginator(pi) {
        //const { classes } = this.props;
        return (
            <TablePagination
            count={pi.totalCount}
            rowsPerPage={pi.pageLength}
            page={pi.pageNo}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            /> 
        )
    }

    render() {
        const { classes } = this.props;
        const rows = !this.props.orders.orders_pages ?[]:this.renderOrders(this.props.orders.orders_pages.items);
        const paginator = !this.props.orders.orders_pages ?null:this.renderPaginator(this.props.orders.orders_pages.paginationInfo);
        return (
            <div>
            <Typography> I Am TestComponent </Typography>
            <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenAddDialog()}> <AddIcon/>  </Button>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell padding={"dense"}>Doktor</TableCell>
                        <TableCell padding={"dense"}>Typ</TableCell>
                        <TableCell padding={"dense"}>Klient</TableCell>
                        <TableCell padding={"dense"} style={{width:"0px"}}>Kolik</TableCell>
                        <TableCell padding={"dense"} style={{width:"0px"}}>Cena</TableCell>
                        <TableCell padding={"dense"}>Zaevidováno</TableCell>
                        <TableCell padding={"dense"}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        {paginator}
                    </TableRow>
                </TableFooter>
            </Table>
    
            </div>
        )
    }
}


Orders.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return { 
        current_page_no: state.orderPage.pageNo,
        current_page_length: state.orderPage.pageLength
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
      onSelectPageNo: no => {
        dispatch(setOrderPageNo(no))
      },
      onSelectPageLength: no => {
        dispatch(setOrderPageLength(no))
      }
    }
}
  

export default compose(
    withStyles(styles),
    connect(mapStateToProps,mapDispatchToProps),
    graphql(CurrentOrders,{
        name: "orders",
        options: ({current_page_no,current_page_length})=>({variables:{pageNo:current_page_no,pageLength:current_page_length}})
    }),


)(Orders)