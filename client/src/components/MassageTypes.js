import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TextField from 'material-ui/TextField';
//import StatusView from './StatusView';
import MassageLengthField from './MassageLengthField';
import StatusField from './StatusField';

import TableEditor, { TableEditorStyles, JoinStyles } from './TableEditor';
import  {
    TableCell,
    TableRow,
} from 'material-ui/Table'

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
//import Lodash from 'lodash';
import MassageTypesRow from './MassageTypesRow';

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


const SaveOrdering = gql`
    mutation MassageTypesOrdering($ids: [ID]!) {
        massageTypesOrdering(ids:$ids) 
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
        const { classes } = this.props;
        return (
            <TableRow className={classes.row}>
                <TableCell className={classes.cell}>Řazení</TableCell>
                <TableCell className={classes.cell}>Název</TableCell>
                <TableCell className={classes.cell} style={{width:"0px"}}>Stav</TableCell>
                <TableCell className={classes.cell}>Délka</TableCell>
                <TableCell className={classes.cell}></TableCell>
            </TableRow>
        )
    }

//    return  this.reorder(items).map((i,idx)=>{
//        return  (<CoursesRow save={()=>this.saveOrder()} moveRow={(k,at)=>this.moveRow(k,at)} findRow={(k)=>this.findRow(k)}activeDrag={this.state.activeDrag} id={i.key} key={i.key} course={i} onDrag={(active)=>this.onDrag(active)} />)
//  });
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
            <MassageTypesRow 
                save={()=>this.saveOrder()} 
                moveRow={(k,at)=>this.moveRow(k,at)} 
                findRow={(k)=>this.findRow(k)} 
                activeDrag={this.state.activeDrag} 
                id={doc.id} 
                key={doc.id} 
                massageType={doc} 
                toolbar={toolbar}
                onDrag={(active)=>this.onDrag(active)} 
            />
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
    graphql(SaveOrdering,{
        name: "saveOrdering",
        options: {
            refetchQueries: [
                'MassageTypes',
              ],
        }
    }),
    DragDropContext(HTML5Backend)
)(MassageTypes)