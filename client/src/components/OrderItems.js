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
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

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
  
const CurrentOrderItems = gql`
  query OrderItems {
    orderItems {
      id
      name
      status
    }
  }
`;


const UpdateOrderItem = gql`
    mutation UpdateOrderItem($id: ID!, $name: String!, $status: Status) {
        updateOrderItem(id:$id,name:$name,status:$status) {
            id
        }
    }
`;

const AddOrderItem = gql`
    mutation AddOrderItem($name: String!, $status: Status!) {
        addOrderItem(name:$name,status:$status) {
            id
        }
    }
`;


const HideOrderItem = gql`
    mutation HideOrderItem($id: ID!) {
        hideOrderItem(id:$id) {
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


class OrderItems extends React.Component {

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
                    status:doc.status
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
                    status:doc.status
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
            status:doc.status
        };
      
        this.setState({editOpen:true,addOpen:false,doc:cl,doc_error_msg:null})
    }

    onOpenDeleteDialog(doc) {
        const cl = {
            id: doc.id,
            name:doc.name,
            status:doc.status
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
        default: return true;
        }
    }

    checkDoc() {
        return this.checkDocField('name',this.state.doc.name) && this.checkDocField('status',this.state.doc.status) 
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
                <DialogTitle id="del-dialog-title">Opravdu smazat typ prodeje z evidence?</DialogTitle>
                <DialogContent>
                    Typ prodeje {this.state.doc.name} bude odstraněn
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
        const dialogCaption = this.state.addOpen?"Přidání nového typu prodeje":"Editace typu prodeje";
        const dialogDesc = this.state.addOpen?"Nový typ prodeje":"Úprava typu prodeje";
        return (
        <Dialog
            open={this.state.editOpen || this.state.addOpen}
            onClose={this.handleCancelDialog}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">{dialogCaption}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {dialogDesc}, musí byt vyplňen alespoň název
                </DialogContentText>
                <form className={classes.form}  noValidate autoComplete="off">
                    

                    <FormControl className={classes.textfield}>
                    <InputLabel htmlFor="oi_status-simple">stav</InputLabel>
                    <Select
                        value={this.state.doc.status?this.state.doc.status:""}
                        onChange={(e)=>this.handleDocChange("status",empty2null(e.target.value))}
                        input={<Input name="status" id="oi_status-simple" />}
                    >
                        <MenuItem value={"ACTIVE"}>aktivní</MenuItem>
                        <MenuItem value={"DISABLED"}>neaktivní</MenuItem>
                    </Select>
                    </FormControl>


                    <TextField className={classes.textfield}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Název"
                        type="text"
                        value={null2empty(this.state.doc.name)}
                        onChange={(e)=>this.handleDocChange("name",empty2null(e.target.value))}
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
        const rows = !this.props.docs.orderItems ?[]:this.renderDocs(this.props.docs.orderItems);
        const dialog = this.renderDialog();
        const dialogDel = this.renderAskDialog();
        return (
            <div>
                {dialog} {dialogDel}

                <Typography> I Am OrderItem page </Typography>

                <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenAddDialog()}> <AddIcon/>  </Button>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding={"dense"} style={{width:"0px"}}>Stav</TableCell>
                            <TableCell padding={"dense"}>Název</TableCell>
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


OrderItems.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default compose(
    withStyles(styles),
    graphql(CurrentOrderItems,{
        name: "docs",
    }),
    graphql(UpdateOrderItem,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'OrderItems',
              ],
        }
    }),
    graphql(AddOrderItem,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'OrderItems',
              ],
        }
    }),
    graphql(HideOrderItem,{
        name:"hideDoc",
        options: {
            refetchQueries: [
                'OrderItems',
              ],
        }
    }),

)(OrderItems)