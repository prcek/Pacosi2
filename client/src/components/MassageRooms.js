import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TextField from 'material-ui/TextField';
import StatusView from './StatusView';
import LocationField from './LocationField';
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


const CurrentMassageRooms = gql`
  query MassageRooms {
    docs: massageRooms {
      id
      name
      status
      location_id
      location {
          name
      }
    }
  }
`;


const UpdateMassageRoom = gql`
    mutation UpdateMassageRoom($id: ID!, $name: String!, $status: Status, $location_id:ID) {
        update_doc: updateMassageRoom(id:$id,name:$name,status:$status,location_id:$location_id) {
            id
        }
    }
`;

const AddMassageRoom = gql`
    mutation AddMassageRoom($name: String!, $status: Status!, $location_id:ID!) {
        add_doc: addMassageRoom(name:$name,status:$status,location_id:$location_id) {
            id
        }
    }
`;


const HideMassageRoom = gql`
    mutation HideMassageRoom($id: ID!) {
        remove_doc: hideMassageRoom(id:$id) {
            id
        }
    }
`;



class MassageRooms extends TableEditor {
 
    renderAskDialogTitle(doc) {
        return "Opravdu smazat masážní místnost?";
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
            return "Přidání masážní místnosti"
        } else {
            return "Editace masážní místnosti"
        }
    }

    renderEditDialogContentText(doc,addMode) {
        if (addMode) {
            return "Nový masážní místnosti, musí byt vyplňen stav, název a lokalita."
        } else {
            return "Úprava masážní místnosti, musí byt vyplňen stav, název a lokalita."
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

              
                    <LocationField
                        margin="dense"
                        id="lt_location-simple"
                        name="location"
                        label="Lokalita"
                        value={TableEditor.null2empty(doc.location_id)}
                        onChange={(e)=>this.handleDocChange("location_id",TableEditor.empty2null(e.target.value))}
                    />
           
             
            </form>
   
        )
    }

    checkDocField(name,value) {
        switch(name) {
            case 'name': return ((value!==null) && (value!==undefined));
            case 'status': return ((value!==null) && (value!==undefined));
            case 'location_id': return ((value!==null) && (value!==undefined));
            default: return true;
            }
        }

    checkDoc(doc) {
        return this.checkDocField('name',doc.name) && 
            this.checkDocField('status',doc.status)  &&
            this.checkDocField('location_id',doc.location_id)
    }


    newDocTemplate() {
        return {status:"ACTIVE"}
    }

    renderTableHeadRow() {
        return (
            <TableRow>
                <TableCell padding={"dense"} style={{width:"0px"}}>Stav</TableCell>
                <TableCell padding={"dense"}>Název</TableCell>
                <TableCell padding={"dense"}>Lokalita</TableCell>
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
            <TableCell padding={"dense"}>{doc.location.name}</TableCell>
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
        return "Masážní místnosti"
    }
  
}




export default compose(
    withStyles(styles),
    graphql(CurrentMassageRooms,{
        name: "docs",
    }),
    graphql(UpdateMassageRoom,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'MassageRooms',
              ],
        }
    }),

    graphql(AddMassageRoom,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'MassageRooms',
              ],
        }
    }),
    graphql(HideMassageRoom,{
        name:"removeDoc",
        options: {
            refetchQueries: [
                'MassageRooms',
              ],
        }
    }),

)(MassageRooms)