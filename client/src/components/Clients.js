import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import { connect } from 'react-redux'
import gql from 'graphql-tag';
import { setClientPageNo, setClientPageLength } from './../actions'
import DateTimeView from './DateTimeView';
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
    TableFooter,
    TableHead,
    TablePagination,
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
  
const CurrentClients = gql`
  query Clients($pageNo: Int!, $pageLength: Int!) {
    clients_pages(pagination:{pageNo:$pageNo,pageLength:$pageLength}) {
      items {
        id
        no
        name
        surname
        email
        phone
        year
        created_at
      }

      paginationInfo {
        pageNo
        pageLength
        totalPages
        totalCount
      }
    }
  }
`;


const UpdateClient = gql`
    mutation UpdateClient($id: ID!, $surname: String!, $name: String, $phone: String, $email: String, $year: Int) {
        updateClient(id:$id,surname:$surname,name:$name,phone:$phone,email:$email,year:$year) {
            id
        }
    }
`;

const AddClient = gql`
    mutation AddClient($surname: String!, $name: String, $phone: String, $email: String, $year: Int) {
        addClient(surname:$surname,name:$name,phone:$phone,email:$email,year:$year) {
            id
        }
    }
`;


const HideClient = gql`
    mutation HideClient($id: ID!) {
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

class Clients extends React.Component {

    state = {
        editOpen:false,
        addOpen:false,
        delOpen:false,
        client: {},
        client_err: {},
        client_error_msg:null
    }

    handleChangePage = (event, page) => {
        this.props.onSelectPageNo(page)
    };
    
    handleChangeRowsPerPage = event => {
        this.props.onSelectPageLength(event.target.value);
    };

    handleCancelDialog = () => {
        this.setState({ editOpen: false, addOpen:false, client:{},client_err:{} });
    };

    handleCancelDelDialog = () => {
        this.setState({ delOpen: false, client:{},client_err:{} });
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
            this.setState({ client_error_msg:"Chyba mazání: "+e})
        })     
       
    };
    

    handleSaveAndCloseDialog = () => {
        const {client} = this.state;
        this.setState({client_error_msg:null});
        if (client.id) {
            this.props.updateClient({
                variables: {
                    id:client.id,
                    surname:client.surname,
                    name:client.name,
                    phone:client.phone,
                    email:client.email,
                    year:client.year
                },
            }).then(r=>{
                console.log(r);
                this.setState({ editOpen: false, addOpen:false });
            }).catch(e=>{
                console.error(e);
                this.setState({ client_error_msg:"Chyba ukládání: "+e})
            })
        } else {
            this.props.addClient({
                variables: {
                    surname:client.surname,
                    name:client.name,
                    phone:client.phone,
                    email:client.email,
                    year:client.year
                },
            }).then(r=>{
                console.log(r);
                this.setState({ editOpen: false, addOpen:false });
            }).catch(e=>{
                console.error(e);
                this.setState({ client_error_msg:"Chyba ukládání: "+e})
            })
        }


      
    };
    
    onOpenEditDialog(client) {
        const cl = {
            id: client.id,
            surname: client.surname,
            name: client.name,
            phone: client.phone,
            email: client.email,
            year: client.year,
        };
      
        this.setState({editOpen:true,addOpen:false,client:cl,client_error_msg:null})
    }

    onOpenDeleteDialog(client) {
        const cl = {
            id: client.id,
            no: client.no,
            surname: client.surname,
            name: client.name,
            phone: client.phone,
            email: client.email,
            year: client.year,
        };
      
        this.setState({editOpen:false,addOpen:false,delOpen:true,client:cl,client_error_msg:null})
    }
 
    onOpenAddDialog() {
        this.setState({addOpen:true,editOpen:false,client:{},client_error_msg:null})
    }
   
    checkClientField(name,value) {
        switch(name) {
        case 'surname': return ((value!==null) && (value!==undefined));
        default: return true;
        }
    }

    checkClient() {
        return this.checkClientField('surname',this.state.client.surname);
    }

    handleClientChange(name,value){
        let { client, client_err } = this.state;
        client[name]=value;
        client_err[name]=!this.checkClientField(name,value);
        this.setState({
          client:client,
          client_err:client_err
        });
    }

/*
    componentWillReceiveProps(nextProps) {
        if (nextProps.clients) {
            console.log("clients")
            console.log("loading",nextProps.clients.loading)
            console.log("data",nextProps.clients.clients_pages)
        } else {
            console.log("no")
        }
    }
*/
    renderAskDialog() {
        //const { classes } = this.props;
        return (
            <Dialog open={this.state.delOpen} onClose={this.handleCancelDelDialog}  aria-labelledby="del-dialog-title">
                <DialogTitle id="del-dialog-title">Opravdu smazat klienta z evidence?</DialogTitle>
                <DialogContent>
                    Klient číslo {this.state.client.no} - {this.state.client.surname} {this.state.client.name} bude odstranen
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
        const dialogCaption = this.state.addOpen?"Zaevidování nového klienta":"Editace klienta";
        const dialogDesc = this.state.addOpen?"Nový záznam klienta":"Úprava záznamu klienta";
        return (
        <Dialog
            open={this.state.editOpen || this.state.addOpen}
            onClose={this.handleCancelDialog}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">{dialogCaption}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {dialogDesc}, musí byt vyplňeno alespoň přijmení
                </DialogContentText>
                <form className={classes.form}  noValidate autoComplete="off">
                    
                    <TextField className={classes.textfield}
                        autoFocus
                        error={this.state.client_err.surname}
                        margin="dense"
                        id="surname"
                        label="Přijmení"
                        type="text"
                        value={null2empty(this.state.client.surname)}
                        onChange={(e)=>this.handleClientChange("surname",empty2null(e.target.value))}
                    />
                    <TextField className={classes.textfield}
                        margin="dense"
                        id="name"
                        label="Jméno"
                        type="text"
                        value={null2empty(this.state.client.name)}
                        onChange={(e)=>this.handleClientChange("name",empty2null(e.target.value))}
                    />
                    <TextField className={classes.textfield}
                        margin="dense"
                        id="phone"
                        label="Telefon"
                        type="text"
                        value={null2empty(this.state.client.phone)}
                        onChange={(e)=>this.handleClientChange("phone",empty2null(e.target.value))}
                    />
                    <TextField className={classes.textfield} 
                        margin="dense"
                        id="email"
                        label="Emailová adresa"
                        type="text"
                        value={null2empty(this.state.client.email)}
                        onChange={(e)=>this.handleClientChange("email",empty2null(e.target.value))}
                        InputProps={{style:{width:350}}}
                    />

                    <TextField className={classes.textfield} 
                        margin="dense"
                        id="year"
                        label="Ročník"
                        type="number"
                        value={null2empty(this.state.client.year)}
                        onChange={(e)=>this.handleClientChange("year",empty2null(e.target.value))}
                        InputProps={{style:{width:100}}}
                    />
                </form>
                {this.state.client_error_msg && <SnackbarContent message={this.state.client_error_msg}/>}
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleCancelDialog} color="primary">
                Neukládat
                </Button>
                <Button disabled={!this.checkClient()} onClick={this.handleSaveAndCloseDialog} color="primary">
                Uložit
                </Button>
            </DialogActions>

        </Dialog>
        );
    }

    renderClients(clients) {
        const { classes } = this.props;
        return clients.map(user=> (
          <TableRow key={user.id}>
             <TableCell padding={"dense"} style={{width:"0px"}}>{user.no}</TableCell>
             <TableCell padding={"dense"}>{user.surname}</TableCell>
             <TableCell padding={"dense"}>{user.name}</TableCell>
             <TableCell padding={"dense"}>{user.phone}</TableCell>
             <TableCell padding={"dense"} style={{width:"0px"}}>{user.year}</TableCell>
             <TableCell padding={"dense"}>{user.email}</TableCell>
             <TableCell padding={"dense"}><DateTimeView date={user.created_at} format="LLL"/></TableCell>
             <TableCell padding={"dense"} classes={{root:classes.cell}}>
                <Toolbar disableGutters={true} classes={{root:classes.toolbar}} >
                    <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenEditDialog(user)}> <EditIcon/>  </Button>
                    <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenDeleteDialog(user)}> <DeleteIcon/>  </Button>
                </Toolbar>
            </TableCell>

          </TableRow>
        ));
    }
    renderPaginator(pi) {
        //const { classes } = this.props;
        return (
            <TablePagination
            count={pi.totalCount}
            rowsPerPage={pi.pageLength}
            page={pi.pageNo}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            /> 
        )
    }

    render() {
        const { classes } = this.props;
        const rows = !this.props.clients.clients_pages ?[]:this.renderClients(this.props.clients.clients_pages.items);
        const paginator = !this.props.clients.clients_pages ?null:this.renderPaginator(this.props.clients.clients_pages.paginationInfo);
        const dialog = this.renderDialog();
        const dialogDel = this.renderAskDialog();
        return (
            <div>
            {dialog} {dialogDel}
            <Typography> I Am Clients page {this.props.current_page_no} </Typography>
            <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenAddDialog()}> <AddIcon/>  </Button>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell padding={"dense"} style={{width:"0px"}}>Ev.č.</TableCell>
                        <TableCell padding={"dense"}>Přijmení</TableCell>
                        <TableCell padding={"dense"}>Jméno</TableCell>
                        <TableCell padding={"dense"}>Telefon</TableCell>
                        <TableCell padding={"dense"} style={{width:"0px"}}>Ročník</TableCell>
                        <TableCell padding={"dense"}>Email</TableCell>
                        <TableCell padding={"dense"}>Zaevidován</TableCell>
                        <TableCell padding={"dense"}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        {paginator}
                    </TableRow>
                </TableFooter>
            </Table>
           
            </div>
        )
    }
}


Clients.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

function mapStateToProps(state) {
    return { 
        current_page_no: state.clientPage.pageNo,
        current_page_length: state.clientPage.pageLength
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
      onSelectPageNo: no => {
        dispatch(setClientPageNo(no))
      },
      onSelectPageLength: no => {
        dispatch(setClientPageLength(no))
      }
    }
}
  
export default compose(
    withStyles(styles),
    connect(mapStateToProps,mapDispatchToProps),
    graphql(CurrentClients,{
        name: "clients",
        options: ({current_page_no,current_page_length})=>({variables:{pageNo:current_page_no,pageLength:current_page_length}})
    }),
    graphql(UpdateClient,{
        name:"updateClient",
        options: {
            refetchQueries: [
                'Clients',
              ],
        }
    }),
    graphql(AddClient,{
        name:"addClient",
        options: {
            refetchQueries: [
                'Clients',
              ],
        }
    }),
    graphql(HideClient,{
        name:"hideClient",
        options: {
            refetchQueries: [
                'Clients',
              ],
        }
    }),

)(Clients)