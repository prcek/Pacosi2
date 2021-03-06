import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TextField from 'material-ui/TextField';
import StatusField from './StatusField';
//import StatusView from './StatusView';

import TableEditor, { TableEditorStyles, JoinStyles } from './TableEditor';
import  {
    TableCell,
    TableRow,
} from 'material-ui/Table'

//import HTML5Backend from 'react-dnd-html5-backend';
//import { DragDropContext } from 'react-dnd';
//import Lodash from 'lodash';
import OrderItemsRow from './OrderItemsRow';


const LocalStyles = (theme) => ({
    xbase: {
        width: 300,
        margin: theme.spacing.unit,
        borderStyle: 'solid',
        borderColor: 'green',
        borderWidth: 'thin',
    },
    cell: {
        height:30,
        paddingTop:1,
        paddingBottom:1,
        paddingLeft:2,
        paddingRight:2,
      },
    row: {
        height:24,
      }
    
});
   


const styles = JoinStyles([TableEditorStyles,LocalStyles]);


const CurrentOrderItems = gql`
  query OrderItems {
    docs: orderItems {
      id
      name
      status
    }
  }
`;


const UpdateOrderItem = gql`
    mutation UpdateOrderItem($id: ID!, $name: String!, $status: Status) {
        update_doc: updateOrderItem(id:$id,name:$name,status:$status) {
            id
        }
    }
`;

const AddOrderItem = gql`
    mutation AddOrderItem($name: String!, $status: Status!) {
        add_doc: addOrderItem(name:$name,status:$status) {
            id
        }
    }
`;


const HideOrderItem = gql`
    mutation HideOrderItem($id: ID!) {
        remove_doc: hideOrderItem(id:$id) {
            id
        }
    }
`;

const SaveOrdering = gql`
    mutation OrderItemsOrdering($ids: [ID]!) {
        orderItemsOrdering(ids:$ids) 
    }
`;



class OrderItems extends TableEditor {

    renderAskDialogTitle(doc) {
        return "Opravdu smazat položku prodeje?";
    }

    renderAskDialogContent(doc) {
        return (
            <div>
            Položka prodeje {doc.name} bude odstranena
            </div>
        )
    }
    renderEditDialogTitle(doc,addMode) {
        if (addMode) {
            return "Přidání položky prodeje"
        } else {
            return "Editace položky prodeje"
        }
    }

    renderEditDialogContentText(doc,addMode) {
        if (addMode) {
            return "Nová položka prodeje, musí byt vyplňen alespoň název."
        } else {
            return "Úprava položky prodeje, musí byt vyplňen alespoň název."
        }  
       
    }

    renderEditDialogContent(doc,err,addMode) {
        const { classes } = this.props;
        return (
            <form className={classes.form}  noValidate autoComplete="off">  

                    <StatusField 
                        error={err.status}
                        margin="dense"
                        id="status"
                        label="Stav"
                        value={TableEditor.null2empty(doc.status)}
                        onChange={(e)=>this.handleDocChange("status",TableEditor.empty2null(e.target.value))}
                    />


                    <TextField className={classes.textfield}
                        autoFocus
                        error={err.name}
                        margin="dense"
                        id="name"
                        label="Název"
                        type="text"
                        value={TableEditor.null2empty(doc.name)}
                        onChange={(e)=>this.handleDocChange("name",TableEditor.empty2null(e.target.value))}
                    />

              
 
             
            </form>
   
        )
    }

    checkDocField(name,value) {
        switch(name) {
            case 'name': return ((value!==null) && (value!==undefined));
            case 'status': return ((value!==null) && (value!==undefined));
            default: return true;
        }
    }

    checkDoc(doc) {
        return this.checkDocField('name',doc.name) && this.checkDocField('status',doc.status) 
    }


    newDocTemplate() {
        return {status:"ACTIVE"}
    }

    renderTableHeadRow() {
        const { classes } = this.props;
        return (
            <TableRow className={classes.row}>
                <TableCell className={classes.cell}>Řazení</TableCell>
                <TableCell className={classes.cell}>Název</TableCell>
                <TableCell className={classes.cell} style={{width:"0px"}}>Stav</TableCell>
                <TableCell className={classes.cell}></TableCell>
            </TableRow>
        )
    }

    saveOrder() {
        
        console.log("saveOrder");
        this.props.saveOrdering({
        variables: {
            ids:this.state.order,
        }
        }).then(res=>{
        console.log("order save ok",res);
        }).catch(err=>{
        console.error(err);
        })
        
    }

    renderTableBodyRow(doc,idx) {
   //     const { classes } = this.props;
        const toolbar = this.renderTableBodyRowToolbar(doc,idx);
        return (
            <OrderItemsRow 
                save={()=>this.saveOrder()} 
                moveRow={(k,at)=>this.moveRow(k,at)} 
                findRow={(k)=>this.findRow(k)} 
                activeDrag={this.state.activeDrag} 
                id={doc.id} 
                key={doc.id} 
                doc={doc} 
                toolbar={toolbar}
                onDrag={(active)=>this.onDrag(active)} 
            />
        )
/*
        return (


            
            <TableRow hover key={doc.id}>
            <TableCell padding={"dense"} style={{width:"0px"}}><StatusView status={doc.status}/></TableCell>
            <TableCell padding={"dense"}>{doc.name}</TableCell>
            <TableCell padding={"dense"} classes={{root:classes.cell}}>
                {toolbar}
            </TableCell>
            </TableRow>

         
        )
        */
    }

    renderTableBodyLoadingRow() {
        return (
            <TableRow><TableCell> loading </TableCell></TableRow>
        )
    }


    renderHeaderLabel() {
        return "Položky prodeje"
    }
  
}




export default compose(
    withStyles(styles),
    graphql(CurrentOrderItems,{
        name: "docs",
    }),
    graphql(UpdateOrderItem,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'OrderItems',
              ],
        }
    }),

    graphql(AddOrderItem,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'OrderItems',
              ],
        }
    }),
    graphql(HideOrderItem,{
        name:"removeDoc",
        options: {
            refetchQueries: [
                'OrderItems',
              ],
        }
    }),
    graphql(SaveOrdering,{
        name: "saveOrdering",
        options: {
            refetchQueries: [
                'OrderItems',
              ],
        }
    }),
  //  DragDropContext(HTML5Backend)
)(OrderItems)