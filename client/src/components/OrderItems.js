import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TextField from 'material-ui/TextField';
import StatusField from './StatusField';
import StatusView from './StatusView';

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
        return (
            <TableRow>
                <TableCell padding={"dense"} style={{width:"0px"}}>Stav</TableCell>
                <TableCell padding={"dense"}>Název</TableCell>
                <TableCell padding={"dense"}></TableCell>
            </TableRow>
        )
    }

    renderTableBodyRow(doc,idx) {
        const { classes } = this.props;
        const toolbar = this.renderTableBodyRowToolbar(doc,idx);
        return (

            <TableRow hover key={doc.id}>
            <TableCell padding={"dense"} style={{width:"0px"}}><StatusView status={doc.status}/></TableCell>
            <TableCell padding={"dense"}>{doc.name}</TableCell>
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

)(OrderItems)