import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import { connect } from 'react-redux'
import gql from 'graphql-tag';
import { setOrderPageNo, setOrderPageLength } from './../actions'
import DateTimeView from './DateTimeView';
import TextField from 'material-ui/TextField';
import UserField from './UserField';
import OrderItemField from './OrderItemField';

import TableEditor, { TableEditorStyles, JoinStyles } from './TableEditor';
import  {
    TableCell,
    TableRow,
} from 'material-ui/Table'



const LocalStyles = (theme) => ({
    xbase: {
        width: 300,
        margin: theme.spacing.unit,
        borderStyle: 'solid',
        borderColor: 'green',
        borderWidth: 'thin',
    }
});
   


const styles = JoinStyles([TableEditorStyles,LocalStyles]);


const CurrentOrders = gql`
  query Orders($pageNo: Int!, $pageLength: Int!) {
    docs_pages: orders_pages(pagination:{pageNo:$pageNo,pageLength:$pageLength}) {
      items {
        id
        user {name} user_id  total_price count order_item {name} order_item_id customer_name
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

const UpdateOrder = gql`
    mutation UpdateOrder($id: ID!, $user_id: ID, $order_item_id:ID, $customer_name: String, $count: Int, $total_price:Int) {
        update_doc: updateOrder(id:$id,user_id:$user_id,order_item_id:$order_item_id,customer_name:$customer_name,count:$count,total_price:$total_price) {
            id
        }
    }
`;

const AddOrder = gql`
    mutation AddOrder($user_id: ID!, $order_item_id:ID!, $customer_name: String, $count: Int!, $total_price:Int!) {
        add_doc: addOrder(user_id:$user_id,order_item_id:$order_item_id,customer_name:$customer_name,count:$count,total_price:$total_price) {
            id
        }
    }
`;


const DeleteOrder = gql`
    mutation DeleteOrder($id: ID!) {
        remove_doc: DeleteOrder(id:$id) {
            id
        }
    }
`;




class TestComponent extends TableEditor {

    renderAskDialogTitle(doc) {
        return "Opravdu smazat prodej z evidence?";
    }

    renderAskDialogContent(doc) {
        return (
            <div>
            Prodej {doc.user.name}, {doc.order_item.name} pro {doc.customer_name} bude odstranen
            </div>
        )
    }
    renderEditDialogTitle(doc,addMode) {
        if (addMode) {
            return "Zaevidování nového prodeje"
        } else {
            return "Editace prodeje"
        }
    }

    renderEditDialogContentText(doc,addMode) {
        if (addMode) {
            return "Nový prodej, musí byt vyplňeno alespoň Doktor, Typ, pocet a celkova cena."
        } else {
            return "Úprava prodeje, musí byt vyplňeno alespoň Doktor, Typ, pocet a celkova cena."
        }  
       
    }

    renderEditDialogContent(doc,err,addMode) {
        const { classes } = this.props;
        return (
            <form className={classes.form}  noValidate autoComplete="off">  

                <UserField 
                    autoFocus
                    error={err.user_id}
                    margin="dense"
                    id="user_id"
                    label="Doktor"
                    value={TableEditor.null2empty(doc.user_id)}
                    onChange={(e)=>this.handleDocChange("user_id",TableEditor.empty2null(e.target.value))}
                />

                <OrderItemField 
                    error={err.order_item_id}
                    margin="dense"
                    id="order_item_id"
                    label="Typ"
                    value={TableEditor.null2empty(doc.order_item_id)}
                    onChange={(e)=>this.handleDocChange("order_item_id",TableEditor.empty2null(e.target.value))}
                />

                <TextField className={classes.textfield}   
                    error={err.customer_name}
                    margin="dense"
                    id="customer_name"
                    label="Jmeno klienta"
                    type="text"
                    value={TableEditor.null2empty(doc.customer_name)}
                    onChange={(e)=>this.handleDocChange("customer_name",TableEditor.empty2null(e.target.value))}
                />
                <TextField className={classes.textfield} 
                    margin="dense"
                    id="count"
                    label="Pocet"
                    type="number"
                    value={TableEditor.null2empty(doc.count)}
                    onChange={(e)=>this.handleDocChange("count",TableEditor.empty2null(e.target.value))}
                    InputProps={{style:{width:100}}}
                />
                <TextField className={classes.textfield} 
                    margin="dense"
                    id="total_price"
                    label="Cena celkem"
                    type="number"
                    value={TableEditor.null2empty(doc.total_price)}
                    onChange={(e)=>this.handleDocChange("total_price",TableEditor.empty2null(e.target.value))}
                    InputProps={{style:{width:100}}}
                />

            </form>
   
        )
    }

    checkDocField(name,value) {
        switch(name) {
            //   case 'customer_name': return ((value!==null) && (value!==undefined));
               case 'order_item_id': return ((value!==null) && (value!==undefined));
               case 'user_id': return ((value!==null) && (value!==undefined));
               case 'count': return ((value!==null) && (value!==undefined));
               case 'total_price': return ((value!==null) && (value!==undefined));
               default: return true;
               }
           }

    checkDoc(doc) {
        return this.checkDocField('customer_name',doc.customer_name) &&
        this.checkDocField('order_item_id',doc.order_item_id) &&
        this.checkDocField('user_id',doc.user_id) &&
        this.checkDocField('count',doc.count) &&
        this.checkDocField('total_price',doc.total_price);

    }


    renderTableHeadRow() {
        return (
            <TableRow>
                  <TableCell padding={"dense"}>Doktor</TableCell>
                  <TableCell padding={"dense"}>Typ</TableCell>
                  <TableCell padding={"dense"}>Klient</TableCell>
                  <TableCell padding={"dense"} style={{width:"0px"}}>Kolik</TableCell>
                  <TableCell padding={"dense"} style={{width:"0px"}}>Cena celkem</TableCell>
                  <TableCell padding={"dense"}>Zaevidováno</TableCell>
                  <TableCell padding={"dense"}></TableCell>
            </TableRow>
        )
    }

    renderTableBodyRow(doc,idx) {
        const { classes } = this.props;
        const toolbar = this.renderTableBodyRowToolbar(doc,idx);
        return (

            <TableRow key={doc.id}>
            <TableCell padding={"dense"}>{doc.user.name}</TableCell>
            <TableCell padding={"dense"}>{doc.order_item.name}</TableCell>
            <TableCell padding={"dense"}>{doc.customer_name}</TableCell>
            <TableCell padding={"dense"} style={{width:"0px"}}>{doc.count}</TableCell>
            <TableCell padding={"dense"} style={{width:"0px"}}>{doc.total_price}</TableCell>
            <TableCell padding={"dense"}><DateTimeView date={doc.created_at} format="LLL"/></TableCell>
            <TableCell padding={"dense"} classes={{root:classes.cell}}>
                {toolbar}
            </TableCell>
            </TableRow>

         
        )
    }

    renderTableBodyLoadingRow() {
        return (
            <TableRow><TableCell> loading </TableCell></TableRow>
        )
    }


    renderHeaderLabel() {
        return "Evidence prodejů"
    }
  
}

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
        name: "docs",
        options: ({current_page_no,current_page_length})=>({variables:{pageNo:current_page_no,pageLength:current_page_length}})
    }),
    graphql(UpdateOrder,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'Orders',
              ],
        }
    }),

    graphql(AddOrder,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'Orders',
              ],
        }
    }),
    graphql(DeleteOrder,{
        name:"removeDoc",
        options: {
            refetchQueries: [
                'Orders',
              ],
        }
    }),

)(TestComponent)