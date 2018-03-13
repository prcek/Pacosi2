import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import PrintIcon from 'material-ui-icons/Print';
import AddIcon from 'material-ui-icons/PersonAdd';
import EditIcon from 'material-ui-icons/Edit';
import DateTimeView from './DateTimeView';
import PaymentView from './PaymentView';
import Checkbox from 'material-ui/Checkbox';
import ClientField from './ClientField';
import TextField from 'material-ui/TextField';
import PaymentField from './PaymentField';
import TableEditor from './TableEditor';
import AppBar from 'material-ui/AppBar';
import CloseIcon from 'material-ui-icons/Close';
import PdfView from './PdfView';
import { setLessonMemberClipboard, clearLessonMemberClipboard } from './../actions'
import { connect } from 'react-redux'


import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import DebugInfo from './DebugInfo';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');



const LessonInfo = gql`
  query LessonInfo($lesson_id: ID!) {
    lessonInfo(id:$lesson_id) {
        id,datetime,capacity,members {
            id,presence,comment,payment,client {
              id,name,surname,phone,no
            } client_id created_at
        }
        lesson_type {
            name
            location {
              name
            }
        }
    }
  }
`;


const AddLessonMember = gql`
    mutation AddLessonMember($lesson_id: ID!, $client_id: ID!, $payment: Payment!, $comment:String) {
        add_doc: addLessonMember(lesson_id:$lesson_id,client_id:$client_id,payment:$payment, comment:$comment) {
            id
        }
    }
`;

const DeleteLessonMember = gql`
    mutation DeleteLessonMember($id: ID!) {
        remove_doc: deleteLessonMember(id:$id) {
            id
        }
    }
`;



const UpdateLessonMember = gql`
    mutation UpdateLessonMember($id: ID!, $client_id:ID, $payment: Payment,$comment: String, $presence: Boolean ) {
        update_doc: updateLessonMember(id:$id,presence:$presence,client_id:$client_id,payment:$payment,comment:$comment) {
            id
        }
    }
`;


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
      overflowX: 'auto',
    },
    flex: {
        flex: 1,
    },
    table: {
       
    },
    button: {
        margin: theme.spacing.unit,
    },
    cell: {
        xheight:"28px",
        xcolor:"red"
    },
    row: {
        xheight:"28px"
    },
    celltb: {
        margin:0,
        padding:0
    },
    toolbar: {
        minHeight:0
    },
    panel: {
        padding: theme.spacing.unit*2
    },
    desc: {
        margin: theme.spacing.unit
    },
    textfield: {
        margin: theme.spacing.unit
    },

});
  

function payment2str(p) {
    let s;
    switch(p) {
    case "NOT_PAID": s = "neplaceno"; break;
    case "VOUCHER": s ="dárkový poukaz"; break;
    case "INVOICE": s ="faktura"; break;
    case "PAID": s ="placeno"; break;
    default : s="";
    }
    return s;
}


class LessonTab extends React.Component {


    state = {
        addMode:false,
        doc: {},
        doc_err: {},
        doc_error_msg:null,
        todel: {},
        delAsk:false,
        editMode:false,
        print:false
    }
    handleAdd = () => {

        if (this.props.clipboard_lesson_member) {
            this.setState({addMode:true,doc:{
                client_id:this.props.clipboard_lesson_member.client_id,
                payment:this.props.clipboard_lesson_member.payment,
                comment:this.props.clipboard_lesson_member.comment
            }});
        } else {
            this.setState({addMode:true,doc:{}});
        }
    }

    handlePrint = () => {
        this.setState({print:true});
    }

    handlePrintClose = () => {
        this.setState({print:false});
    }

    handleCancelAdd = () => {
        this.setState({addMode:false});
    }
    handleCancelEdit = () => {
        this.setState({editMode:false});
    }

    handleDoSave = () => {

        this.props.updateDoc({
            variables: {
                id: this.state.doc.id,
                client_id:this.state.doc.client_id,
                payment:this.state.doc.payment,
                comment:this.state.doc.comment
            },
        }).then(r=>{
            console.log(r);
            this.setState({ editMode: false, doc:{} , doc_err:{}});
        }).catch(e=>{
            console.error(e);
            this.setState({ doc_error_msg:"Chyba ukládání: "+e})
        })


    }

    handleCancelClipboard = () => {
        this.props.onClearLessonMemberClipboard();
    }

    handleDoAdd = () => {
        this.props.onClearLessonMemberClipboard();
        this.doAdd();
    }
    handleDoAddAndCopy = () => {
        this.props.onSetLessonMemberClipboard(this.state.doc);
        this.doAdd();
    }


    doAdd = () => {

        this.props.addDoc({
            variables: {
                lesson_id:this.props.lessonId,
                client_id:this.state.doc.client_id,
                payment:this.state.doc.payment,
                comment:this.state.doc.comment
            },
        }).then(r=>{
            console.log(r);
            this.setState({ addMode: false, doc:{} , doc_err:{}});
        }).catch(e=>{
            console.error(e);
            this.setState({ doc_error_msg:"Chyba ukládání: "+e})
        })


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

    handleOpenEditDialog = (m) => {
        let nd = {}
        Object.assign(nd,m);
        this.setState({editMode:true,doc:nd});
    }


    handleOpenDeleteDialog = (m) => {
        this.setState({delAsk:true,todel:m});
    }
    handleCloseDeleteDialog = () => {
        this.setState({delAsk:false,todel:{}});
    }

    handleDoDelete = () => {

        this.props.removeDoc({
            variables: {
                id:this.state.todel.id,
            },
        }).then(r=>{
            console.log(r);
            this.setState({delAsk:false,todel:{}});
        }).catch(e=>{
            console.error(e);
            this.setState({ doc_error_msg:"Chyba ukládání: "+e})
        })
       
    }

    checkDocField(name,value) {
        switch(name) {
            case 'client_id': return ((value!==null) && (value!==undefined));
            case 'payment': return ((value!==null) && (value!==undefined));
            default: return true;
            }
        }

    checkDoc(doc) {
        return  this.checkDocField('client_id',this.state.doc.client_id) && this.checkDocField('payment',this.state.doc.payment);
    }


    renderDelAskDialog() {
        //const { classes } = this.props;
        return (
            <Dialog open={this.state.delAsk} onClose={this.handleCancelDelDialog}  aria-labelledby="del-dialog-title">
                <DialogTitle id="del-dialog-title">Odhlášení</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Opravdu odhlásit klienta {this.state.todel.client && this.state.todel.client.surname}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseDeleteDialog} color="primary">
                    Neodhlásit
                    </Button>
                    <Button  onClick={this.handleDoDelete} color="primary">
                    Odhlásit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


    renderAddPanel() {
        const { classes } = this.props;
        const docOk = this.checkDoc(this.state.doc);
        return (
            <div> 
                <Typography className={classes.desc} variant="subheading">Přihlášení klienta na lekci</Typography>
                <form className={classes.form}  noValidate autoComplete="off">  
                    <ClientField className={classes.textfield}
                        error={this.state.doc_err.surname}
                        margin="dense"
                        id="client"
                        label="Klient"
                        value={this.state.doc.client_id}
                        onChange={(cid)=>this.handleDocChange("client_id",cid)}
                    />

                    <TextField className={classes.textfield}
                        margin="dense"
                        id="comment"
                        label="Poznámka"
                        type="text"
                        value={TableEditor.null2empty(this.state.doc.comment)}
                        onChange={(e)=>this.handleDocChange("comment",TableEditor.empty2null(e.target.value))}
                    />

                    <PaymentField 
                        margin="dense"
                        id="payment"
                        label="Platba"
                        value={TableEditor.null2empty(this.state.doc.payment)}
                        onChange={(e)=>this.handleDocChange("payment",TableEditor.empty2null(e.target.value))}
                    />

                </form>

                <Button variant="raised" className={classes.button}  disabled={!docOk} onClick={this.handleDoAdd}> Přihlásit </Button>
                <Button variant="raised" className={classes.button}  disabled={!docOk} onClick={this.handleDoAddAndCopy}> Přihlásit a zapamatovat </Button>
                <Button variant="raised" className={classes.button} onClick={this.handleCancelAdd}> Zrušit </Button>

            </div>

        )
    }


    renderEditPanel() {
        const { classes } = this.props;
        return (
            <div> 
                <Typography className={classes.desc} variant="subheading">Editace klienta lekce</Typography>
                <form className={classes.form}  noValidate autoComplete="off">  
                    <ClientField className={classes.textfield}
                        error={this.state.doc_err.surname}
                        margin="dense"
                        id="client"
                        label="Klient"
                        value={this.state.doc.client_id}
                        onChange={(cid)=>this.handleDocChange("client_id",cid)}
                    />

                    <TextField className={classes.textfield}
                        margin="dense"
                        id="comment"
                        label="Poznámka"
                        type="text"
                        value={TableEditor.null2empty(this.state.doc.comment)}
                        onChange={(e)=>this.handleDocChange("comment",TableEditor.empty2null(e.target.value))}
                    />

                    <PaymentField 
                        margin="dense"
                        id="payment"
                        label="Platba"
                        value={TableEditor.null2empty(this.state.doc.payment)}
                        onChange={(e)=>this.handleDocChange("payment",TableEditor.empty2null(e.target.value))}
                    />

                </form>

                <Button variant="raised" className={classes.button}  disabled={!this.checkDoc(this.state.doc)} onClick={this.handleDoSave}> Uložit změny</Button>
                <Button variant="raised" className={classes.button} onClick={this.handleCancelEdit}> Neukládat </Button>

            </div>

        )
    }

    handleCheckClick = (m) => {
  
        this.props.updateDoc({
            variables: {
                id:m.id,
                presence:!m.presence
            }
        }).then(r=>{
            //this.setState({ delAsk: false, doc:{},doc_err:{} });
        }).catch(e=>{
            console.error(e);
            //this.setState({ doc_error_msg:"Chyba mazání: "+e})
        })     
    }

    renderMembers(members) {
        const { classes } = this.props;
        return members.map((m,i)=>(
            <TableRow hover key={m.id} classes={{root:classes.row}}>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>{i+1}</TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}><DateTimeView date={m.created_at} format="LLL"/></TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>{m.client.surname}</TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>{m.client.name}</TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>{m.client.phone}</TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}><PaymentView payment={m.payment}/></TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>{m.comment}</TableCell>
                <TableCell padding={"checkbox"} classes={{root:classes.cell}}>
                    <Checkbox onClick={(e)=>this.handleCheckClick(m)}checked={m.presence} />
                </TableCell>
                <TableCell padding={"dense"} classes={{root:classes.cell}}>
                    <Toolbar disableGutters={true} classes={{root:classes.toolbar}} >
                        <Button variant="raised" style={{minWidth:"38px"}} onClick={()=>this.handleOpenEditDialog(m)}> <EditIcon/>  </Button>
                        <Button variant="raised" style={{minWidth:"38px"}} onClick={()=>this.handleOpenDeleteDialog(m)}> <DeleteIcon/>  </Button>
                    </Toolbar>
                </TableCell>
            </TableRow>
        ));  
    }

    renderMembersTable() {
        const { classes } = this.props;
        const members = this.renderMembers(this.props.lessonInfo.lessonInfo.members);
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow classes={{root:classes.row}}>
                        <TableCell padding={"dense"} className={classes.cell}>#</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Zapsán</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Přijmení</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Jméno</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Telefon</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Platba</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Poznámka</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}>Účast</TableCell>
                        <TableCell padding={"dense"} className={classes.cell}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{members}</TableBody>
                <TableFooter>
                </TableFooter>
            </Table>
        )
    }

    renderPrintDialog() {
        const { classes } = this.props;
        const lessonInfo = this.props.lessonInfo.lessonInfo;
        const widths = [15,120,100,80,70,100,160,40];
        const cols = ["#","Zapsán","Přijmení","Jméno","Telefon","Platba","Poznámka","Účast"];
        const rows = lessonInfo.members.map((m,i)=>{
            return [i+1,moment(m.created_at).format("LLL"),m.client.surname,m.client.name,m.client.phone,payment2str(m.payment),m.comment,m.presence?"ano":""]
        })
        return (
            <Dialog
                fullScreen
                open={this.state.print}
                onClose={this.handlePrintClose}
             >
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Tisk lekce
                        </Typography>
                        <IconButton color="inherit" onClick={this.handlePrintClose} aria-label="Close">
                            <CloseIcon />
                         </IconButton>
                     </Toolbar>
                </AppBar>
            {this.state.print && (<PdfView landscape title={"Lekce "+lessonInfo.lesson_type.name+" - "+lessonInfo.lesson_type.location.name+", "+moment(lessonInfo.datetime).format("LLL")} description={"Přehled přihlášených klientů na lekci."} cols={cols} rows={rows} widths={widths}/>)}
             </Dialog>
        )
    }

    render() {
        const { classes } = this.props;
        if (!(this.props.lessonInfo && this.props.lessonInfo.lessonInfo)) {
            return null;
        } 
        const lessonInfo = this.props.lessonInfo.lessonInfo;
        const lessonFull = lessonInfo.capacity<=lessonInfo.members.length;


        const panel = this.state.addMode?this.renderAddPanel():(this.state.editMode?this.renderEditPanel():this.renderMembersTable());
        const delAsk= this.renderDelAskDialog();
        const printDlg = this.renderPrintDialog();
        return (
            <div className={classes.root}>
            {delAsk}
            {printDlg}
            <Toolbar>
                <Typography variant="title" className={classes.flex} noWrap> Lekce {lessonInfo.lesson_type.name} - {lessonInfo.lesson_type.location.name}, <DateTimeView date={lessonInfo.datetime} format="LLLL"/> </Typography>
                <Button variant="raised" disabled={this.state.addMode  || this.state.editMode || lessonFull} className={classes.button} onClick={this.handleAdd}> <AddIcon/> </Button>
                <Button variant="raised" disabled={this.state.addMode || this.state.editMode } className={classes.button} onClick={this.handlePrint} > <PrintIcon/> </Button>
            </Toolbar>
            <div className={classes.panel}>
            {panel}
            </div>
            <DebugInfo> Lesson Id: {this.props.lessonId} </DebugInfo>
            </div>
        );
        
    }
}

LessonTab.propTypes = {
    classes: PropTypes.object.isRequired,
    lessonId: PropTypes.string.isRequired,
};
  

function mapStateToProps(state) {
    return { 
        clipboard_lesson_member: state.clipboard.lesson_member,
    }
}

const mapDispatchToProps = dispatch => {
    return {
      onSetLessonMemberClipboard: (lm,expire) => {
        dispatch(setLessonMemberClipboard(lm,expire))
      },
      onClearLessonMemberClipboard: () => {
        dispatch(clearLessonMemberClipboard())
      },
    }
}


export default compose(
    withStyles(styles),
    connect(mapStateToProps,mapDispatchToProps),
    graphql(LessonInfo,{
        name: "lessonInfo",
        options: ({lessonId})=>({variables:{lesson_id:lessonId}})
    }),
    graphql(AddLessonMember,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'LessonInfo',
                'LessonsInfo',
                'LessonTypeDayInfos',
              ],
        }
    }),

    graphql(UpdateLessonMember,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'LessonInfo',
                'LessonsInfo',
                'LessonTypeDayInfos',
              ],
        }
    }),

    graphql(DeleteLessonMember,{
        name:"removeDoc",
        options: {
            refetchQueries: [
                'LessonInfo',
                'LessonsInfo',
                'LessonTypeDayInfos'
              ],
        }
    }),

)(LessonTab)