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
import StatusView from './StatusView';
import LocationField from './LocationField';
import StatusField from './StatusField';

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
  
const CurrentMassageRooms = gql`
  query MassageRooms {
    massageRooms {
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
        updateMassageRoom(id:$id,name:$name,status:$status,location_id:$location_id) {
            id
        }
    }
`;

const AddMassageRoom = gql`
    mutation AddMassageRoom($name: String!, $status: Status!, $location_id:ID!) {
        addMassageRoom(name:$name,status:$status,location_id:$location_id) {
            id
        }
    }
`;


const HideMassageRoom = gql`
    mutation HideMassageRoom($id: ID!) {
        hideMassageRoom(id:$id) {
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


class MassageRooms extends React.Component {

    state = {
        editOpen:false,
        addOpen:false,
        delOpen:false,
        doc: {},
        doc_err: {},
        doc_error_msg:null
    }

    handleCancelDialog = () => {
        this.setState({ editOpen: false, addOpen:false, doc:{},doc_err:{} });
    };

    handleCancelDelDialog = () => {
        this.setState({ delOpen: false, doc:{},doc_err:{} });
    };
    
    handleCancelOkDialog = () => {
        const {doc} = this.state;
        this.setState({doc_error_msg:null});
        this.props.hideDoc({
            variables: {
                id:doc.id,
            }
        }).then(r=>{
            this.setState({ delOpen: false, doc:{},doc_err:{} });
        }).catch(e=>{
            console.error(e);
            this.setState({ doc_error_msg:"Chyba mazání: "+e})
        })     
       
    };
    

    handleSaveAndCloseDialog = () => {
        const {doc} = this.state;
        this.setState({doc_error_msg:null});
        if (doc.id) {
            this.props.updateDoc({
                variables: {
                    id:doc.id,
                    name:doc.name,
                    status:doc.status,
                    location_id: doc.location_id
                },
            }).then(r=>{
                console.log(r);
                this.setState({ editOpen: false, addOpen:false });
            }).catch(e=>{
                console.error(e);
                this.setState({ doc_error_msg:"Chyba ukládání: "+e})
            })
        } else {
            this.props.addDoc({
                variables: {
                    name:doc.name,
                    status:doc.status,
                    location_id: doc.location_id
                },
            }).then(r=>{
                console.log(r);
                this.setState({ editOpen: false, addOpen:false });
            }).catch(e=>{
                console.error(e);
                this.setState({ doc_error_msg:"Chyba ukládání: "+e})
            })
        }


      
    };

    onOpenEditDialog(doc) {
        const cl = {
            id: doc.id,
            name:doc.name,
            status:doc.status,
            location_id:doc.location_id
        };
      
        this.setState({editOpen:true,addOpen:false,doc:cl,doc_error_msg:null})
    }

    onOpenDeleteDialog(doc) {
        const cl = {
            id: doc.id,
            name:doc.name,
            status:doc.status,
            location_id:doc.location_id
        };
      
        this.setState({editOpen:false,addOpen:false,delOpen:true,doc:cl,doc_error_msg:null})
    }
 
    onOpenAddDialog() {
        this.setState({addOpen:true,editOpen:false,doc:{status:"ACTIVE"},doc_error_msg:null})
    }

    checkDocField(name,value) {
        switch(name) {
        case 'name': return ((value!==null) && (value!==undefined));
        case 'status': return ((value!==null) && (value!==undefined));
        case 'location_id': return ((value!==null) && (value!==undefined));
        default: return true;
        }
    }

    checkDoc() {
        return this.checkDocField('name',this.state.doc.name) && this.checkDocField('status',this.state.doc.status) && this.checkDocField('location_id',this.state.doc.location_id)
    }

    handleDocChange(name,value){
        let { doc,  doc_err } = this.state;
        doc[name]=value;
        doc_err[name]=!this.checkDocField(name,value);
        this.setState({
          doc:doc,
          doc_err:doc_err
        });
    }



    renderAskDialog() {
        const { classes } = this.props;
        return (
            <Dialog open={this.state.delOpen} onClose={this.handleCancelDelDialog}  aria-labelledby="del-dialog-title">
                <DialogTitle id="del-dialog-title">Opravdu smazat masazni mistnost z evidence?</DialogTitle>
                <DialogContent>
                    Masazni mistnost {this.state.doc.name} bude odstraněna
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
        const dialogCaption = this.state.addOpen?"Přidání nové masazeni mistnosti":"Editace masazni mistnosti";
        const dialogDesc = this.state.addOpen?"Nova masazni mistnost":"Úprava masazni mistnosti";
        return (
        <Dialog
            open={this.state.editOpen || this.state.addOpen}
            onClose={this.handleCancelDialog}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">{dialogCaption}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {dialogDesc}, musí byt vyplňen alespoň název a lokalita
                </DialogContentText>
                <form className={classes.form}  noValidate autoComplete="off">
                    

                    <StatusField
                        margin="dense"
                        id="lt_status-simple"
                        name="status"
                        label="Stav"
                        value={this.state.doc.status?this.state.doc.status:""}
                        onChange={(e)=>this.handleDocChange("status",empty2null(e.target.value))}
                    />


                    <TextField className={classes.textfield}
                        autoFocus
                        margin="dense"
                        id="lt_name"
                        label="Název"
                        type="text"
                        value={null2empty(this.state.doc.name)}
                        onChange={(e)=>this.handleDocChange("name",empty2null(e.target.value))}
                    />

                    <LocationField
                        margin="dense"
                        id="lt_location-simple"
                        name="location"
                        label="Lokalita"
                        value={this.state.doc.location_id?this.state.doc.location_id:""}
                        onChange={(e)=>this.handleDocChange("location_id",empty2null(e.target.value))}
                    />
           

                </form>
                {this.state.doc_error_msg && <SnackbarContent message={this.state.doc_error_msg}/>}
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleCancelDialog} color="primary">
                Neukládat
                </Button>
                <Button disabled={!this.checkDoc()} onClick={this.handleSaveAndCloseDialog} color="primary">
                Uložit
                </Button>
            </DialogActions>

        </Dialog>
        );
    }
    

    renderDocs(docs) {
        const { classes } = this.props;
        return docs.map(doc=> (
          <TableRow key={doc.id}>
             <TableCell padding={"dense"} style={{width:"0px"}}><StatusView status={doc.status}/></TableCell>
             <TableCell padding={"dense"}>{doc.name}</TableCell>
             <TableCell padding={"dense"}>{doc.location.name}</TableCell>
             <TableCell padding={"dense"} classes={{root:classes.cell}}>
                <Toolbar disableGutters={true} classes={{root:classes.toolbar}} >
                    <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenEditDialog(doc)}> <EditIcon/>  </Button>
                    <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenDeleteDialog(doc)}> <DeleteIcon/>  </Button>
                </Toolbar>
            </TableCell>

          </TableRow>
        ));
    }

    render() {
        const { classes } = this.props;
        const rows = !this.props.docs.massageRooms ?[]:this.renderDocs(this.props.docs.massageRooms);
        const dialog = this.renderDialog();
        const dialogDel = this.renderAskDialog();
        return (
            <div>
                {dialog} {dialogDel}

                <Typography> I Am MassageRooms page </Typography>

                <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenAddDialog()}> <AddIcon/>  </Button>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding={"dense"} style={{width:"0px"}}>Stav</TableCell>
                            <TableCell padding={"dense"}>Název</TableCell>
                            <TableCell padding={"dense"}>Lokalita</TableCell>
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


MassageRooms.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default compose(
    withStyles(styles),
    graphql(CurrentMassageRooms,{
        name: "docs",
    }),
    graphql(UpdateMassageRoom,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'MassageRooms','LocationInfo'
              ],
        }
    }),
    graphql(AddMassageRoom,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'MassageRooms','LocationInfo'
              ],
        }
    }),
    graphql(HideMassageRoom,{
        name:"hideDoc",
        options: {
            refetchQueries: [
                'MassageRooms','LocationInfo'
              ],
        }
    }),

)(MassageRooms)