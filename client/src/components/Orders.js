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

function null2empty(v) {
    if ((v === null) || (v === undefined)) {return ""}
    return v;
}
function empty2null(v) {
    if (v === "") { return null} 
    return v;
}


class Orders extends React.Component {

    state = {
        editOpen:false,
        addOpen:false,
        delOpen:false,
        order: {},
        order_err: {},
        order_error_msg:null
    }


    handleChangePage = (event, page) => {
        this.props.onSelectPageNo(page)
    };
    
    handleChangeRowsPerPage = event => {
        this.props.onSelectPageLength(event.target.value);
    };



    handleCancelDialog = () => {
        this.setState({ editOpen: false, addOpen:false, order:{},order_err:{} });
    };

    handleCancelDelDialog = () => {
        this.setState({ delOpen: false, order:{},order_err:{} });
    };

    handleCancelOkDialog = () => {
        const {order} = this.state;
        this.setState({order_error_msg:null});
        this.props.hideOrder({
            variables: {
                id:order.id,
            }
        }).then(r=>{
            this.setState({ delOpen: false, order:{},order_err:{} });
        }).catch(e=>{
            console.error(e);
            this.setState({ order_error_msg:"Chyba mazání: "+e})
        })     
       
    };

    handleSaveAndCloseDialog = () => {
        const {order} = this.state;
        this.setState({order_error_msg:null});
        if (order.id) {
            this.props.updateOrder({
                variables: {
                    id:order.id,
                    order_item_id:order.order_item_id,
                    user_id: order.user_id,
                    count: order.count,
                    total_price:order.total_price,
                    customer_name:order.customer_name,
                },
            }).then(r=>{
                console.log(r);
                this.setState({ editOpen: false, addOpen:false });
            }).catch(e=>{
                console.error(e);
                this.setState({ order_error_msg:"Chyba ukládání: "+e})
            })
        } else {
            this.props.addOrder({
                variables: {
                    order_item_id:order.order_item_id,
                    user_id: order.user_id,
                    count: order.count,
                    total_price:order.total_price,
                    customer_name:order.customer_name,
                },
            }).then(r=>{
                console.log(r);
                this.setState({ editOpen: false, addOpen:false });
            }).catch(e=>{
                console.error(e);
                this.setState({ order_error_msg:"Chyba ukládání: "+e})
            })
        }
    };

    onOpenEditDialog(order) {
        const cl = {
            id: order.id,
            order_item_id:order.order_item_id,
            user_id: order.user_id,
            count: order.count,
            total_price:order.total_price,
            customer_name:order.customer_name,
        };
      
        this.setState({editOpen:true,addOpen:false,order:cl,order_error_msg:null})
    }
    
    onOpenDeleteDialog(order) {
        const cl = {
            id: order.id,
            order_item:order.order_item,
            order_item_id:order.order_item_id,
            user_id: order.user_id,
            user: order.user,
            count: order.count,
            total_price:order.total_price,
            customer_name:order.customer_name,
        };
      
        this.setState({editOpen:false,addOpen:false,delOpen:true,order:cl,order_error_msg:null})
    }
 
    onOpenAddDialog() {
        this.setState({addOpen:true,editOpen:false,client:{},client_error_msg:null})
    }

    checkOrderField(name,value) {
        switch(name) {
        case 'customer_name': return ((value!==null) && (value!==undefined));
        default: return true;
        }
    }

    checkOrder() {
        return this.checkOrderField('customer_name',this.state.order.customer_name);
    }

    handleOrderChange(name,value){
        let { order, order_err } = this.state;
        order[name]=value;
        order_err[name]=!this.checkOrderField(name,value);
        this.setState({
          order:order,
          order_err:order_err
        });
    }

    renderAskDialog() {
        //const { classes } = this.props;
        return (
            <Dialog open={this.state.delOpen} onClose={this.handleCancelDelDialog}  aria-labelledby="del-dialog-title">
                <DialogTitle id="del-dialog-title">Opravdu smazat prodej z evidence?</DialogTitle>
                <DialogContent>
                    Prodej {this.state.order.id} - {this.state.order.customer_name} bude odstranen
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancelDelDialog} color="primary">
                    Nemazat
                    </Button>
                    <Button  onClick={this.handleCancelOkDialog} color="primary">
                    Opravdu smazat
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
    

    renderDialog() {
        const { classes } = this.props;
        const dialogCaption = this.state.addOpen?"Zaevidování nového prodeje":"Editace prodeje";
        const dialogDesc = this.state.addOpen?"Nový prodej":"Úprava prodeje";
        return (
        <Dialog
            open={this.state.editOpen || this.state.addOpen}
            onClose={this.handleCancelDialog}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">{dialogCaption}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {dialogDesc}, musí byt vyplňeno alespoň kdo, co, cena
                </DialogContentText>
                <form className={classes.form}  noValidate autoComplete="off">  
                    <TextField className={classes.textfield}
                        autoFocus
                        error={this.state.order_err.customer_name}
                        margin="dense"
                        id="customer_name"
                        label="Jmeno klienta"
                        type="text"
                        value={null2empty(this.state.order.customer_name)}
                        onChange={(e)=>this.handleClientChange("customer_name",empty2null(e.target.value))}
                    />
                    <TextField className={classes.textfield} 
                        margin="dense"
                        id="count"
                        label="Pocet"
                        type="number"
                        value={null2empty(this.state.order.count)}
                        onChange={(e)=>this.handleClientChange("count",empty2null(e.target.value))}
                        InputProps={{style:{width:100}}}
                    />
                </form>
                {this.state.order_error_msg && <SnackbarContent message={this.state.order_error_msg}/>}
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleCancelDialog} color="primary">
                Neukládat
                </Button>
                <Button disabled={!this.checkOrder()} onClick={this.handleSaveAndCloseDialog} color="primary">
                Uložit
                </Button>
            </DialogActions>

        </Dialog>
        );
    }
 
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
        const dialog = this.renderDialog();
        const dialogDel = this.renderAskDialog();

        return (
            <div>
            {dialog} {dialogDel}
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