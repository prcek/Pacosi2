import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PasswordIcon from 'material-ui-icons/Https';
import Button from 'material-ui/Button';
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

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography/Typography';


var taiPasswordStrength = require("tai-password-strength")
var strengthTester = new taiPasswordStrength.PasswordStrength();

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
      login
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

const UpdatePwdUser = gql`
    mutation UpdatePwdUser($id: ID!, $login: String!, $password: String!) {
        update_pwd: updateUser(id:$id,login:$login,password:$password) {
            id
        }
    }
`;


class Users extends TableEditor {
 

    constructor(props) {
        super(props);
        this.state.pwdOpen = false;
        this.state.pwd = {};
        this.state.pwd_err = {};
        this.state.pwd_error_msg = null;
    }


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
                <TableCell padding={"dense"}>Login</TableCell>
                <TableCell padding={"dense"}></TableCell>
            </TableRow>
        )
    }

    renderTableBodyRowToolbarExtra(doc,idx) {
        return (
            <Button variant="raised" key="rt_password" style={{minWidth:"38px"}} onClick={()=>this.onOpenPasswordDialog(doc)}> <PasswordIcon/>  </Button>
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
            <TableCell padding={"dense"}>{doc.login}</TableCell>
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
  

    onOpenPasswordDialog(doc) {
        let nd = {}
        Object.assign(nd,doc);
        this.setState({pwdOpen:true,docOpen:false,delAsk:false,pwd:nd,pwd_error_msg:null})
    }

    handleCancelPwdDialog = () => {
        this.setState({ pwdOpen: false, pwd:{},pwd_err:{} });
    };

    handleSavePwdDialog = () => {

        const {pwd} = this.state;
        this.setState({pwd_error_msg:null});
        
        this.props.updatePwd({
            variables: {
                id:pwd.id,
                login:pwd.login,
                password:pwd.password
            },
        }).then(r=>{
            console.log(r);
            this.setState({ pwdOpen: false, pwd:{},pwd_err:{} });
        }).catch(e=>{
            console.error(e);
            this.setState({ pwd_error_msg:"Chyba ukládání: "+e})
        })



    }

    checkPwdField(name,value) {
        switch(name) {
           // case 'login': return ((value!==null) && (value!==undefined));
            case 'password': return ((value!==null) && (value!==undefined));
            case 'password2': return ((value!==null) && (value!==undefined));
                default: return true;
            }
        }

    getPwdStrength(pwd) {
        var results = strengthTester.check(pwd);
        console.log(results);
        if (results.strengthCode.indexOf('VERY_WEAK') >= 0) {
            return false;
        } else {
            return true;
        }
    }
    weakPwd(pwd) {
        if (this.checkPwdField('password',pwd.password)) {
            return !this.getPwdStrength(pwd.password);
        }   
        return false;
    }

    checkPwd(pwd) {

        if ((pwd.login!==null) && (pwd.login!==undefined)) {
            return this.checkPwdField('password',pwd.password)  &&
            this.checkPwdField('password2',pwd.password2) && (pwd.password === pwd.password2) ;//&& (this.getPwdStrength(pwd.password))
        } else {
            return true;
        }

    }


    handlePwdChange(name,value){
        let { pwd, pwd_err } = this.state;
        pwd[name]=value;
        pwd_err[name]=!this.checkPwdField(name,value);
        this.setState({
          pwd:pwd,
          pwd_err:pwd_err
        });
    }


    renderExtraDialogs() {
        const { classes } = this.props;
        const { pwd , pwd_err} = this.state; 
        return (
            <Dialog open={this.state.pwdOpen} onClose={this.handleCancelPwdDialog}  aria-labelledby="pwd-dialog-title">
                <DialogTitle id="pwd-dialog-title">Nastavení přihlášení</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Nastavení přihlašovacího jména a hesla pro uživatele {pwd.name}
                    </DialogContentText>

                    <form className={classes.form}  noValidate autoComplete="off">  
                        <TextField className={classes.textfield}
                            error={pwd_err.login}
                            margin="dense"
                            id="login"
                            label="Přihlašovací jméno"
                            type="text"
                            value={TableEditor.null2empty(pwd.login)}
                            onChange={(e)=>this.handlePwdChange("login",TableEditor.empty2null(e.target.value))}
                        />
                        <TextField className={classes.textfield}
                            error={pwd_err.password}
                            margin="dense"
                            id="password"
                            label="Heslo"
                            type="password"
                            value={TableEditor.null2empty(pwd.password)}
                            onChange={(e)=>this.handlePwdChange("password",TableEditor.empty2null(e.target.value))}
                        />
                        <TextField className={classes.textfield}
                            error={pwd_err.password2}
                            margin="dense"
                            id="password2"
                            label="Heslo - opakování"
                            type="password"
                            value={TableEditor.null2empty(pwd.password2)}
                            onChange={(e)=>this.handlePwdChange("password2",TableEditor.empty2null(e.target.value))}
                        />
                    </form>
                    {this.weakPwd(pwd) && (<Typography color="error"> slabé heslo </Typography>)}
                    

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancelPwdDialog} color="primary">
                    Neukládat
                    </Button>
                    <Button  disabled={!this.checkPwd(this.state.pwd)} onClick={this.handleSavePwdDialog} color="primary">
                    Uložit
                    </Button>
                </DialogActions>
            </Dialog>
        );

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

    graphql(UpdatePwdUser,{
        name:"updatePwd",
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