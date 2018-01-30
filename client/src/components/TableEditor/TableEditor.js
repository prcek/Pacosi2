import React from 'react';
//import { withStyles } from 'material-ui/styles';
//import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
//import Paper from 'material-ui/Paper';
//import Moment from 'moment';
import { SnackbarContent } from 'material-ui/Snackbar';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import AddIcon from 'material-ui-icons/Add';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';

import Table, {
    TableBody,
  //  TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from 'material-ui/Table'

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';


class TableEditor extends React.Component {

    state = {
        docOpen: false,
        addMode: false,
        delAsk: false,
        doc: {},
        doc_err: {},
        doc_error_msg:null
    }


    static null2empty(v) {
        if ((v === null) || (v === undefined)) {return ""}
        return v;
    }
    static empty2null(v) {
        if (v === "") { return null} 
        return v;
    }
       
    handleChangePage = (event, page) => {
        this.props.onSelectPageNo(page)
    };
    
    handleChangeRowsPerPage = event => {
        this.props.onSelectPageLength(event.target.value);
    };

    handleCancelDialog = () => {
        this.setState({ docOpen: false, doc:{},doc_err:{} });
    };

    handleCancelDelDialog = () => {
        this.setState({ delAsk: false, doc:{},doc_err:{} });
    };

    onOpenEditDialog(doc) {
        let nd = {}
        Object.assign(nd,doc);
        this.setState({docOpen:true,addMode:false,doc:nd,doc_error_msg:null})
    }

    onOpenDeleteDialog(doc) {
        this.setState({docOpen:false,delAsk:true,doc:doc,doc_error_msg:null})
    }
 
    onOpenAddDialog() {
        this.setState({docOpen:true,addMode:true,doc:{},doc_error_msg:null})
    }


    checkDocField(name,value) {
        return true;
    }

    checkDoc(doc) {
        return true;
    }

    handleDocChange(name,value){
        let { doc, doc_err } = this.state;
        doc[name]=value;
        doc_err[name]=!this.checkDocField(name,value);
        this.setState({
          doc:doc,
          doc_err:doc_err
        });
    }

    handleCancelOkDialog = () => {
        const {doc} = this.state;
        this.setState({doc_error_msg:null});
        this.props.removeDoc({
            variables: doc
        }).then(r=>{
            this.setState({ delAsk: false, doc:{},doc_err:{} });
        }).catch(e=>{
            console.error(e);
            this.setState({ doc_error_msg:"Chyba mazání: "+e})
        })     
       
    };


    handleSaveAndCloseDialog = () => {
        const {doc} = this.state;
        this.setState({doc_error_msg:null});
        if (!this.state.addMode) {
            this.props.updateDoc({
                variables: doc,
            }).then(r=>{
                console.log(r);
                this.setState({ docOpen: false, });
            }).catch(e=>{
                console.error(e);
                this.setState({ doc_error_msg:"Chyba ukládání: "+e})
            })
        } else {
            this.props.addDoc({
                variables: doc,
            }).then(r=>{
                console.log(r);
                this.setState({ docOpen: false });
            }).catch(e=>{
                console.error(e);
                this.setState({ doc_error_msg:"Chyba ukládání: "+e})
            })
        }
      
    };

    renderAskDialogTitle(doc) {
        return "Opravdu smazat?";
    }
    renderAskDialogContent(doc) {
        return (
            <div>
            Doc id: {doc.id}
            </div>
        )
    }

    renderEditDialogContentText(doc,addMode) {
        return "content text";
    }
    renderEditDialogTitle(doc,addMode) {
        return "Edit/Add title"
    }
    renderEditDialogContent(doc,addMode) {
        return "edit form";
    }

    renderEditDialog() {
       // const { classes } = this.props;
        const dialogTitle = this.renderEditDialogTitle(this.state.doc,this.state.addMode);
        const dialogContentText = this.renderEditDialogContentText(this.state.doc,this.state.addMode);
        const dialogContent = this.renderEditDialogContent(this.state.doc,this.state.doc_err,this.state.addMode);

        return (
        <Dialog
            open={this.state.docOpen}
            onClose={this.handleCancelDialog}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {dialogContentText}
                </DialogContentText>
                {dialogContent}
                {this.state.doc_error_msg && <SnackbarContent message={this.state.doc_error_msg}/>}
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleCancelDialog} color="primary">
                Neukládat
                </Button>
                <Button disabled={!this.checkDoc(this.state.doc)} onClick={this.handleSaveAndCloseDialog} color="primary">
                Uložit
                </Button>
            </DialogActions>

        </Dialog>
        );
    }

    renderAskDialog() {
        //const { classes } = this.props;
        const dt = this.renderAskDialogTitle(this.state.doc);
        const dc = this.renderAskDialogContent(this.state.doc);
        return (
            <Dialog open={this.state.delAsk} onClose={this.handleCancelDelDialog}  aria-labelledby="del-dialog-title">
                <DialogTitle id="del-dialog-title">{dt}</DialogTitle>
                <DialogContent>
                    {dc}
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


    renderTableHeadRow() {
        return null;
    }

    renderTableBodyRowToolbar(doc,idx) {
        const { classes } = this.props;
        return (
            <Toolbar disableGutters={true} classes={{root:classes.toolbar}} >
                <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenEditDialog(doc)}> <EditIcon/>  </Button>
                <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenDeleteDialog(doc)}> <DeleteIcon/>  </Button>
            </Toolbar>
        )
    }

    renderTableBodyRow(doc,idx) {
        return null;
    }
    renderTableBodyLoadingRow() {
        return null;
    }

    renderTableBodyRows() {

        if (this.props.docs.docs_pages) {
            return this.props.docs.docs_pages.items.map((doc,idx)=>{return this.renderTableBodyRow(doc,idx)});
        } else {
            return this.renderTableBodyLoadingRow();
        }
    }

    renderTablePaginator() {
        if (this.props.docs.docs_pages) {
            const pi = this.props.docs.docs_pages.paginationInfo;
            return (
                <TablePagination
                count={pi.totalCount}
                rowsPerPage={pi.pageLength}
                page={pi.pageNo}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                /> 
            )
        }else {
            return null;
        }
    }

    renderTable() {
        const { classes } = this.props;
        const headrow = this.renderTableHeadRow();
        const rows = this.renderTableBodyRows();
        const paginator = this.renderTablePaginator();
        return (
            <Table className={classes.table}>
                <TableHead>
                    {headrow}
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

        )
    }
    render() {
        const { classes } = this.props;
        const dialogDel = this.renderAskDialog();
        const dialogEdit = this.renderEditDialog();
        return (
            <div className={classes.root}>
            {dialogDel} {dialogEdit}
            <Button raised style={{minWidth:"38px"}} onClick={()=>this.onOpenAddDialog()}> <AddIcon/>  </Button>
            {this.renderTable()}
            </div>
        )
    }
}

  

export default compose(
  //  withStyles(styles),
)(TableEditor)

