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


const CurrentLessonTypes = gql`
  query LessonTypes {
    docs: lessonTypes {
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


const UpdateLessonType = gql`
    mutation UpdateLessonType($id: ID!, $name: String!, $status: Status, $location_id:ID) {
        update_doc: updateLessonType(id:$id,name:$name,status:$status,location_id:$location_id) {
            id
        }
    }
`;

const AddLessonType = gql`
    mutation AddLessonType($name: String!, $status: Status!, $location_id:ID!) {
        add_doc: addLessonType(name:$name,status:$status,location_id:$location_id) {
            id
        }
    }
`;


const HideLessonType = gql`
    mutation HideLessonType($id: ID!) {
        remove_doc: hideLessonType(id:$id) {
            id
        }
    }
`;





class LessonTypes extends TableEditor {
 
    renderAskDialogTitle(doc) {
        return "Opravdu smazat typ lekce?";
    }

    renderAskDialogContent(doc) {
        return (
            <div>
            Typ lekce {doc.name} bude odstranen
            </div>
        )
    }
    renderEditDialogTitle(doc,addMode) {
        if (addMode) {
            return "Přidání typu lekce"
        } else {
            return "Editace typu lekce"
        }
    }

    renderEditDialogContentText(doc,addMode) {
        if (addMode) {
            return "Nový typ lekce, musí byt vyplňen stav, název a lokalita."
        } else {
            return "Úprava typu lekce, musí byt vyplňen stav, název a lokalita."
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

            <TableRow key={doc.id}>
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
        return "Typy lekcí"
    }
  
}




export default compose(
    withStyles(styles),
    graphql(CurrentLessonTypes,{
        name: "docs",
    }),
    graphql(UpdateLessonType,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'LessonTypes',
              ],
        }
    }),

    graphql(AddLessonType,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'LessonTypes',
              ],
        }
    }),
    graphql(HideLessonType,{
        name:"removeDoc",
        options: {
            refetchQueries: [
                'LessonTypes',
              ],
        }
    }),

)(LessonTypes)