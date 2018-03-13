import React from 'react';
//import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import Paper from 'material-ui/Paper';
//import Moment from 'moment';
import { SnackbarContent } from 'material-ui/Snackbar';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import AddIcon from 'material-ui-icons/Add';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import LeftIcon from 'material-ui-icons/ChevronLeft';
import RightIcon from 'material-ui-icons/ChevronRight';
import FirstPageIcon from 'material-ui-icons/FirstPage';
import LastPageIcon from 'material-ui-icons/LastPage';

import Input from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';




import Table, {
    TableBody,
  //  TableCell,
 //   TableFooter,
    TableHead,
//    TablePagination,
//    TableRow,
} from 'material-ui/Table'

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import DebugInfo from '../DebugInfo';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class TableEditor extends React.Component {


    state = {
        docOpen: false,
        addMode: false,
        delAsk: false,
        doc: {},
        doc_err: {},
        doc_error_msg:null
    }

    static empty2nullC(v) {
        if (v === "") { return null} 
        return capitalizeFirstLetter(v);
    }

    static null2empty(v) {
        if ((v === null) || (v === undefined)) {return ""}
        return v;
    }
    static empty2null(v) {
        if (v === "") { return null} 
        return v;
    }

    static null2zero(v) {
        if ((v === null) || (v === undefined)) {return 0}
        return v;
    }
    static zero2null(v) {
        if (v === 0) { return null} 
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
 
    newDocTemplate() {
        return {};
    }

    onOpenAddDialog() {
        this.setState({docOpen:true,addMode:true,doc:this.newDocTemplate(),doc_error_msg:null})
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
                <DebugInfo>{"id: "+this.state.doc.id}</DebugInfo>
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
        const dt = this.state.doc.id?this.renderAskDialogTitle(this.state.doc):"";
        const dc = this.state.doc.id?this.renderAskDialogContent(this.state.doc):"";
        return (
            <Dialog open={this.state.delAsk} onClose={this.handleCancelDelDialog}  aria-labelledby="del-dialog-title">
                <DialogTitle id="del-dialog-title">{dt}</DialogTitle>
                <DialogContent>
                    {dc}
                    <DebugInfo>{"id: "+this.state.doc.id}</DebugInfo>
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

    renderTableBodyRowToolbarExtra(doc,idx) {
        return null;
    }

    renderTableBodyRowToolbar(doc,idx) {
        const { classes } = this.props;
        const extra = this.renderTableBodyRowToolbarExtra(doc,idx);
        return (
            <Toolbar disableGutters={true} classes={{root:classes.toolbar}} >
                {extra}
                <Button variant="raised" key="rt_edit" style={{minWidth:"38px"}} onClick={()=>this.onOpenEditDialog(doc)}> <EditIcon/>  </Button>
                <Button variant="raised" key="rt_del" style={{minWidth:"38px"}} onClick={()=>this.onOpenDeleteDialog(doc)}> <DeleteIcon/>  </Button>
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
        } else if (this.props.docs.docs) { 
            return this.props.docs.docs.map((doc,idx)=>{return this.renderTableBodyRow(doc,idx)});
        } else {
            return this.renderTableBodyLoadingRow();
        }
    }


    renderPageInfo = ({ from, to, count }) => `záznamy ${from}-${to} z ${count}` 
       
    renderHeaderLabel() {
        return "no label";
    }

    renderFilterField(value) {
        return null;
    }
 
    renderHeader() {
        const { classes } = this.props;
        if (this.props.docs.docs_pages) {
            const pi = this.props.docs.docs_pages.paginationInfo;
            const filterField = this.renderFilterField(this.props.current_filter);
            return (
                <Toolbar>
                    <Typography variant="title">
                        {this.renderHeaderLabel()}
                    </Typography>
                    <Button variant="raised" className={classes.button} style={{minWidth:"38px"}} onClick={()=>this.onOpenAddDialog()}> <AddIcon/>  </Button>
                    {filterField}
                    <div className={classes.spacer} />
                    <Typography component="div" type="caption">
                        Délka stránky:
                        <Select
                            classes={{
                                root: classes.selectRoot,
                                select: classes.select,
                                icon: classes.selectIcon,
                            }}
                            input={
                                <Input
                                classes={{
                                    root: classes.input,
                                }}
                                disableUnderline
                                />
                            }
                            value={pi.pageLength}
                            onChange={(event)=>this.props.onSelectPageLength(event.target.value)}
                        >
                            <MenuItem key={5} value={5}>
                                {5}
                            </MenuItem>
                            <MenuItem key={10} value={10}>
                                {10}
                            </MenuItem>
                            <MenuItem key={25} value={25}>
                                {25}
                            </MenuItem>
                        </Select>
                    </Typography>
                    <Typography variant="caption">
                        {this.renderPageInfo({
                            from: pi.totalCount === 0 ? 0 : pi.pageNo * pi.pageLength + 1,
                            to: Math.min(pi.totalCount, (pi.pageNo + 1) * pi.pageLength),
                            count: pi.totalCount,
                            current: pi.pageNo,
                        })}
                    </Typography>
                    <IconButton
                        onClick={(event)=>this.handleChangePage(event, 0)}
                        disabled={pi.pageNo === 0}
                    >
                        <FirstPageIcon/>
                    </IconButton>
                    <IconButton
                        onClick={(event)=>this.handleChangePage(event, pi.pageNo - 1)}
                        disabled={pi.pageNo === 0}
                    >
                        <LeftIcon/>
                    </IconButton>
                    <IconButton
                        onClick={(event)=>this.handleChangePage(event, pi.pageNo + 1)}
                        disabled={pi.pageNo >= Math.ceil(pi.totalCount / pi.pageLength) - 1}
                    >
                        <RightIcon/>
                    </IconButton>
                    <IconButton
                        onClick={(event)=>this.handleChangePage(event, Math.ceil(pi.totalCount / pi.pageLength)-1 )}
                        disabled={pi.pageNo >= Math.ceil(pi.totalCount / pi.pageLength) - 1}
                    >
                        <LastPageIcon/>
                    </IconButton>

                </Toolbar>
            )
        } else if (this.props.docs.docs) {
            return (
                <Toolbar>
                    <Typography variant="title">
                        {this.renderHeaderLabel()}
                    </Typography>
                    <Button variant="raised" className={classes.button} style={{minWidth:"38px"}} onClick={()=>this.onOpenAddDialog()}> <AddIcon/>  </Button>
                </Toolbar>
            )
        }else {
            return null;
        }
    }

    renderTable() {
        const { classes } = this.props;
        const headrow = this.renderTableHeadRow();
        const rows = this.renderTableBodyRows();
        return (
            <Table className={classes.table}>
                <TableHead>
                    {headrow}
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
               </Table>

        )
    }

    renderExtraDialogs() {
        return null;
    }

    render() {
        const { classes } = this.props;
        const dialogDel = this.renderAskDialog();
        const dialogEdit = this.renderEditDialog();
        const header = this.renderHeader();
        const extraDlgs = this.renderExtraDialogs();
        return (
            <div className={classes.root}>
            {dialogDel} {dialogEdit} {extraDlgs}
            {header}
            <Paper>
            {this.renderTable()}
            </Paper>
            </div>
        )
    }
}

  

export default compose(
  //  withStyles(styles),
)(TableEditor)

