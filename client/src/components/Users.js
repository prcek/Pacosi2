import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TextField from 'material-ui/TextField';
import StatusView from './StatusView';
import RoleView from './RoleView';
import StatusField from './StatusField';
import RoleField from './RoleField';

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


const CurrentUsers = gql`
  query Users {
    docs: users {
      id
      role
      name
      email
      status
    }
  }
`;


const UpdateUser = gql`
    mutation UpdateUser($id: ID!, $name: String!, $email: String, $role: UserRole, $status: Status) {
        update_doc: updateUser(id:$id,name:$name,email:$email,role:$role, status:$status) {
            id
        }
    }
`;

const AddUser = gql`
    mutation AddUser($name: String!, $email: String, $role: UserRole!, $status: Status!) {
        add_doc: addUser(name:$name,email:$email,role:$role,status:$status) {
            id
        }
    }
`;


const HideUser = gql`
    mutation HideUser($id: ID!) {
        remove_doc: hideUser(id:$id) {
            id
        }
    }
`;


class Users extends TableEditor {
 
    renderAskDialogTitle(doc) {
        return "Opravdu smazat uživatele?";
    }

    renderAskDialogContent(doc) {
        return (
            <div>
            Uživatel {doc.name} bude odstraněn
            </div>
        )
    }
    renderEditDialogTitle(doc,addMode) {
        if (addMode) {
            return "Přidání uživatele"
        } else {
            return "Editace uživatele"
        }
    }

    renderEditDialogContentText(doc,addMode) {
        if (addMode) {
            return "Nový uživatel, musí byt vyplňeno jméno, role a stav."
        } else {
            return "Úprava uživatele, musí byt vyplňen jméno, role a stav."
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

                    <TextField className={classes.textfield}
                        error={err.email}
                        margin="dense"
                        id="email"
                        label="Email"
                        type="text"
                        value={TableEditor.null2empty(doc.email)}
                        onChange={(e)=>this.handleDocChange("email",TableEditor.empty2null(e.target.value))}
                    />

                    <RoleField 
                        error={err.role}
                        margin="dense"
                        id="role"
                        label="Role"
                        value={TableEditor.null2empty(doc.role)}
                        onChange={(e)=>this.handleDocChange("role",TableEditor.empty2null(e.target.value))}
                    />
         
             
            </form>
   
        )
    }

    checkDocField(name,value) {
        switch(name) {
            case 'name': return ((value!==null) && (value!==undefined));
            case 'status': return ((value!==null) && (value!==undefined));
            case 'role': return ((value!==null) && (value!==undefined));
                default: return true;
            }
        }

    checkDoc(doc) {
        return this.checkDocField('name',doc.name) && 
            this.checkDocField('status',doc.status)  &&
            this.checkDocField('role',doc.role)
    }

    newDocTemplate() {
        return {status:"ACTIVE"}
    }
   

    renderTableHeadRow() {
        return (
            <TableRow>
                <TableCell padding={"dense"} style={{width:"0px"}}>Stav</TableCell>
                <TableCell padding={"dense"}>Jméno</TableCell>
                <TableCell padding={"dense"}>Role</TableCell>
                <TableCell padding={"dense"}>Email</TableCell>
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
            <TableCell padding={"dense"}><RoleView role={doc.role}/></TableCell>
            <TableCell padding={"dense"}>{doc.email}</TableCell>
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
        return "Uživatelé"
    }
  
}




export default compose(
    withStyles(styles),
    graphql(CurrentUsers,{
        name: "docs",
    }),
    graphql(UpdateUser,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'Users',
              ],
        }
    }),

    graphql(AddUser,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'Users',
              ],
        }
    }),
    graphql(HideUser,{
        name:"removeDoc",
        options: {
            refetchQueries: [
                'Users',
              ],
        }
    }),

)(Users)