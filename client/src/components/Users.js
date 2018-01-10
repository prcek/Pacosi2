import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import AddIcon from 'material-ui-icons/Add';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { SnackbarContent } from 'material-ui/Snackbar';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';


import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from 'material-ui/Table'


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    table: {
        minWidth: 800,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    toolbar: {
        minHeight:0
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textfield: {
        margin: theme.spacing.unit
    }
});
  
const CurrentUsers = gql`
  query Users {
    users {
      id
      role
      name
      email
      status
    }
  }
`;


const UpdateUser = gql`
    mutation UpdateUser($id: ID!, $name: String!, $email: String, $role: UserRole) {
        updateUser(id:$id,name:$name,email:$email,role:$role) {
            id
        }
    }
`;

const AddUser = gql`
    mutation AddUser($name: String!, $email: String, $role: UserRole!) {
        addUser(name:$name,email:$email,role:$role) {
            id
        }
    }
`;


const HideUser = gql`
    mutation HideUser($id: ID!) {
        hideClient(id:$id) {
            id
        }
    }
`;

function null2empty(v) {
    if ((v === null) || (v === undefined)) {return ""}
    return v;
}
function empty2null(v) {
    if (v === "") { return null} 
    return v;
}


class Users extends React.Component {

    state = {
        editOpen:false,
        addOpen:false,
        delOpen:false,
        user: {},
        user_err: {},
        user_error_msg:null
    }

    handleCancelDialog = () => {
        this.setState({ editOpen: false, addOpen:false, user:{},user_err:{} });
    };

    handleCancelDelDialog = () => {
        this.setState({ delOpen: false, user:{},user_err:{} });
    };
    
    handleCancelOkDialog = () => {
        const {client} = this.state;
        this.setState({client_error_msg:null});
        this.props.hideClient({
            variables: {
                id:client.id,
            }
        }).then(r=>{
            this.setState({ delOpen: false, client:{},client_err:{} });
        }).catch(e=>{
            console.error(e);
            this.setState({ user_error_msg:"Chyba mazání: "+e})
        })     
       
    };
    

    handleSaveAndCloseDialog = () => {
        const {user} = this.state;
        this.setState({user_error_msg:null});
        if (user.id) {
            this.props.updateUser({
                variables: {
                    id:user.id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
            }).then(r=>{
                console.log(r);
                this.setState({ editOpen: false, addOpen:false });
            }).catch(e=>{
                console.error(e);
                this.setState({ user_error_msg:"Chyba ukládání: "+e})
            })
        } else {
            this.props.addUser({
                variables: {
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
            }).then(r=>{
                console.log(r);
                this.setState({ editOpen: false, addOpen:false });
            }).catch(e=>{
                console.error(e);
                this.setState({ user_error_msg:"Chyba ukládání: "+e})
            })
        }


      
    };

    onOpenEditDialog(user) {
        const cl = {
            id: user.id,
            name:user.name,
            email:user.email,
            role:user.role
        };
      
        this.setState({editOpen:true,addOpen:false,user:cl,user_error_msg:null})
    }

    onOpenDeleteDialog(user) {
        const cl = {
            id: user.id,
            name:user.name,
            email:user.email,
            role:user.role
        };
      
        this.setState({editOpen:false,addOpen:false,delOpen:true,user:cl,user_error_msg:null})
    }
 
    onOpenAddDialog() {
        this.setState({addOpen:true,editOpen:false,user:{},user_error_msg:null})
    }

    checkUserField(name,value) {
        switch(name) {
        case 'name': return ((value!==null) && (value!==undefined));
        case 'role': return ((value!==null) && (value!==undefined));
        default: return true;
        }
    }

    checkUser() {
        return this.checkUserField('name',this.state.user.name) && this.checkUserField('role',this.state.user.role) 
    }

    handleUserChange(name,value){
        let { user,  user_err } = this.state;
        user[name]=value;
        user_err[name]=!this.checkUserField(name,value);
        this.setState({
          user:user,
          user_err:user_err
        });
    }



    renderAskDialog() {
        const { classes } = this.props;
        return (
            <Dialog open={this.state.delOpen} onClose={this.handleCancelDelDialog}  aria-labelledby="del-dialog-title">
                <DialogTitle id="del-dialog-title">Opravdu smazat uzivatele z evidence?</DialogTitle>
                <DialogContent>
                    Uživatel {this.state.user.name} bude odstranen
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancelDelDialog} color="primary">
                    Nemazat
                    </Button>
                    <Button  onClick={this.handleCancelOkDialog} color="primary">
                    Opravdu smazat
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderDialog() {
        const { classes } = this.props;
        const dialogCaption = this.state.addOpen?"Pridani nove uzivatele":"Editace uzivatele";
        const dialogDesc = this.state.addOpen?"Nový uzivatel":"Úprava uzivatele";
        return (
        <Dialog
            open={this.state.editOpen || this.state.addOpen}
            onClose={this.handleCancelDialog}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">{dialogCaption}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {dialogDesc}, musí byt vyplňeno alespon jmeno a role
                </DialogContentText>
                <form className={classes.form}  noValidate autoComplete="off">
                    
                    <TextField className={classes.textfield}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Jméno"
                        type="text"
                        value={null2empty(this.state.user.name)}
                        onChange={(e)=>this.handleUserChange("name",empty2null(e.target.value))}
                    />
                    <TextField className={classes.textfield}
                        margin="dense"
                        id="role"
                        label="Role"
                        type="text"
                        value={null2empty(this.state.user.role)}
                        onChange={(e)=>this.handleUserChange("role",empty2null(e.target.value))}
                    />
                    <TextField className={classes.textfield} 
                        margin="dense"
                        id="email"
                        label="Emailová adresa"
                        type="text"
                        value={null2empty(this.state.user.email)}
                        onChange={(e)=>this.handleUserChange("email",empty2null(e.target.value))}
                        InputProps={{style:{width:350}}}
                    />

                </form>
                {this.state.user_error_msg && <SnackbarContent message={this.state.user_error_msg}/>}
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleCancelDialog} color="primary">
                Neukládat
                </Button>
                <Button disabled={!this.checkUser()} onClick={this.handleSaveAndCloseDialog} color="primary">
                Uložit
                </Button>
            </DialogActions>

        </Dialog>
        );
    }
    

    renderUsers(users) {
        const { classes } = this.props;
        return users.map(user=> (
          <TableRow key={user.id}>
             <TableCell padding={"dense"} style={{width:"0px"}}>{user.status}</TableCell>
             <TableCell padding={"dense"}>{user.name}</TableCell>
             <TableCell padding={"dense"}>{user.role}</TableCell>
             <TableCell padding={"dense"}>{user.email}</TableCell>
             <TableCell padding={"dense"} classes={{root:classes.cell}}>
                <Toolbar disableGutters={true} classes={{root:classes.toolbar}} >
                    <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenEditDialog(user)}> <EditIcon/>  </Button>
                    <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenDeleteDialog(user)}> <DeleteIcon/>  </Button>
                </Toolbar>
            </TableCell>

          </TableRow>
        ));
    }

    render() {
        const { classes } = this.props;
        const rows = !this.props.users.users ?[]:this.renderUsers(this.props.users.users);
        const dialog = this.renderDialog();
        const dialogDel = this.renderAskDialog();
        return (
            <div>
                {dialog} {dialogDel}

                <Typography> I Am Users page </Typography>

                <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenAddDialog()}> <AddIcon/>  </Button>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding={"dense"} style={{width:"0px"}}>status</TableCell>
                            <TableCell padding={"dense"}>Jméno</TableCell>
                            <TableCell padding={"dense"}>Role</TableCell>
                            <TableCell padding={"dense"}>Email</TableCell>
                            <TableCell padding={"dense"}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>

            </div>
        )
    }
}


Users.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default compose(
    withStyles(styles),
    graphql(CurrentUsers,{
        name: "users",
    }),
    graphql(UpdateUser,{
        name:"updateUser",
        options: {
            refetchQueries: [
                'Users',
              ],
        }
    }),
    graphql(AddUser,{
        name:"addUser",
        options: {
            refetchQueries: [
                'Users',
              ],
        }
    }),
    graphql(HideUser,{
        name:"hideUser",
        options: {
            refetchQueries: [
                'Users',
              ],
        }
    }),

)(Users)