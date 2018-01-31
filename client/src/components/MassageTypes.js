import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TextField from 'material-ui/TextField';
import StatusView from './StatusView';
import MassageLengthField from './MassageLengthField';
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


const CurrentMassageTypes = gql`
  query MassageTypes {
    docs: massageTypes {
      id
      name
      status
      length
    }
  }
`;


const UpdateMassageType = gql`
    mutation UpdateMassageType($id: ID!, $name: String!, $status: Status, $length: Int) {
        update_doc: updateMassageType(id:$id,name:$name,status:$status,length:$length) {
            id
        }
    }
`;

const AddMassageType = gql`
    mutation AddMassageType($name: String!, $status: Status!, $length: Int!) {
        add_doc: addMassageType(name:$name,status:$status,length:$length) {
            id
        }
    }
`;


const HideMassageType = gql`
    mutation HideMassageType($id: ID!) {
        remove_doc: hideMassageType(id:$id) {
            id
        }
    }
`;



class MassageTypes extends TableEditor {
 
    renderAskDialogTitle(doc) {
        return "Opravdu smazat typ masáže?";
    }

    renderAskDialogContent(doc) {
        return (
            <div>
            Typ masáže {doc.name} bude odstraněn
            </div>
        )
    }
    renderEditDialogTitle(doc,addMode) {
        if (addMode) {
            return "Přidání typu masáže"
        } else {
            return "Editace typu masáže"
        }
    }

    renderEditDialogContentText(doc,addMode) {
        if (addMode) {
            return "Nový typu masáže, musí byt vyplňen stav, název a délka."
        } else {
            return "Úprava typu masáže, musí byt vyplňen stav, název a délka."
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

              
                    <MassageLengthField
                        margin="dense"
                        id="lt_len-simple"
                        name="length"
                        label="Delka"
                        value={TableEditor.null2zero(doc.length)}
                        onChange={(e)=>this.handleDocChange("length",TableEditor.zero2null(e.target.value))}
                    />
         
             
            </form>
   
        )
    }

    checkDocField(name,value) {
        switch(name) {
            case 'name': return ((value!==null) && (value!==undefined));
            case 'status': return ((value!==null) && (value!==undefined));
            case 'length': return ((value!==null) && (value!==undefined));
                default: return true;
            }
        }

    checkDoc(doc) {
        return this.checkDocField('name',doc.name) && 
            this.checkDocField('status',doc.status)  &&
            this.checkDocField('length',doc.length)
    }

    newDocTemplate() {
        return {status:"ACTIVE"}
    }
   

    renderTableHeadRow() {
        return (
            <TableRow>
                <TableCell padding={"dense"} style={{width:"0px"}}>Stav</TableCell>
                <TableCell padding={"dense"}>Název</TableCell>
                <TableCell padding={"dense"}>Délka</TableCell>
                <TableCell padding={"dense"}></TableCell>
            </TableRow>
        )
    }

    renderTableBodyRow(doc,idx) {
        const { classes } = this.props;
        const toolbar = this.renderTableBodyRowToolbar(doc,idx);
        return (

            <TableRow key={doc.id}>
            <TableCell padding={"dense"} style={{width:"0px"}}><StatusView status={doc.status}/></TableCell>
            <TableCell padding={"dense"}>{doc.name}</TableCell>
            <TableCell padding={"dense"}>{doc.length}</TableCell>
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
        return "Typy masáží"
    }
  
}




export default compose(
    withStyles(styles),
    graphql(CurrentMassageTypes,{
        name: "docs",
    }),
    graphql(UpdateMassageType,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'MassageTypes',
              ],
        }
    }),

    graphql(AddMassageType,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'MassageTypes',
              ],
        }
    }),
    graphql(HideMassageType,{
        name:"removeDoc",
        options: {
            refetchQueries: [
                'MassageTypes',
              ],
        }
    }),

)(MassageTypes)