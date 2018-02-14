import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TextField from 'material-ui/TextField';
import StatusView from './StatusView';
import StatusField from './StatusField';

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


const CurrentLocations = gql`
  query Locations {
    docs: locations {
      id
      name
      status
    }
  }
`;


const UpdateLocation = gql`
    mutation UpdateLocation($id: ID!, $name: String!, $status: Status) {
        update_doc: updateLocation(id:$id,name:$name,status:$status) {
            id
        }
    }
`;

const AddLocation = gql`
    mutation AddLocation($name: String!, $status: Status!) {
        add_doc: addLocation(name:$name,status:$status) {
            id
        }
    }
`;


const HideLocation = gql`
    mutation HideLocation($id: ID!) {
        remove_doc: hideLocation(id:$id) {
            id
        }
    }
`;



class Locations extends TableEditor {
 
    renderAskDialogTitle(doc) {
        return "Opravdu smazat lokalitu?";
    }

    renderAskDialogContent(doc) {
        return (
            <div>
            Masážní místnost {doc.name} bude odstraněna
            </div>
        )
    }
    renderEditDialogTitle(doc,addMode) {
        if (addMode) {
            return "Přidání lokality"
        } else {
            return "Editace lokality"
        }
    }

    renderEditDialogContentText(doc,addMode) {
        if (addMode) {
            return "Nová lokalita, musí byt vyplňen stav a název."
        } else {
            return "Úprava lokality, musí byt vyplňen stav a název."
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
        return this.checkDocField('name',doc.name) && 
            this.checkDocField('status',doc.status) 
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
        return "Lokality"
    }
  
}




export default compose(
    withStyles(styles),
    graphql(CurrentLocations,{
        name: "docs",
    }),
    graphql(UpdateLocation,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'Locations',
              ],
        }
    }),

    graphql(AddLocation,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'Locations',
              ],
        }
    }),
    graphql(HideLocation,{
        name:"removeDoc",
        options: {
            refetchQueries: [
                'Locations',
              ],
        }
    }),

)(Locations)