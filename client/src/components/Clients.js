import React from 'react';
import { withStyles } from 'material-ui/styles';
//import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
//import Calendar from './Calendar';
//import Paper from 'material-ui/Paper';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux'
import gql from 'graphql-tag';
import { setClientPageNo, setClientPageLength, setClientFilter } from './../actions'
import DateTimeView from './DateTimeView';
import TextField from 'material-ui/TextField';

import TableEditor, { TableEditorStyles, JoinStyles } from './TableEditor';
import  {
//    TableBody,
    TableCell,
//    TableFooter,
//    TableHead,
//    TablePagination,
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

const CurrentClients = gql`
  query Clients($pageNo: Int!, $pageLength: Int!, $filter: String) {
    docs_pages: clients_pages(pagination:{pageNo:$pageNo,pageLength:$pageLength},filter:$filter) {
      items {
        id
        no
        name
        surname
        comment
        phone
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
    mutation UpdateClient($id: ID!, $surname: String!, $name: String, $phone: String, $comment: String) {
        update_doc: updateClient(id:$id,surname:$surname,name:$name,phone:$phone,comment:$comment) {
            id
        }
    }
`;

const AddClient = gql`
    mutation AddClient($surname: String!, $name: String, $phone: String, $comment: String) {
        add_doc: addClient(surname:$surname,name:$name,phone:$phone,comment:$comment) {
            id
        }
    }
`;


const HideClient = gql`
    mutation HideClient($id: ID!) {
        remove_doc: hideClient(id:$id) {
            id
        }
    }
`;


class Clients extends TableEditor {

    renderAskDialogTitle(doc) {
        return "Opravdu smazat klienta z evidence?";
    }

    renderAskDialogContent(doc) {
        return (
            <div>
            Klient číslo {doc.no} - "{doc.surname} {doc.name}" bude odstranen
            </div>
        )
    }
    renderEditDialogTitle(doc,addMode) {
        if (addMode) {
            return "Zaevidování nového klienta"
        } else {
            return "Editace klienta"
        }
    }

    renderEditDialogContentText(doc,addMode) {
        if (addMode) {
            return "Nový záznam klienta, musí byt vyplňeno alespoň přijmení."
        } else {
            return "Úprava záznamu klienta, musí byt vyplňeno alespoň přijmení."
        }  
       
    }

    renderEditDialogContent(doc,err,addMode) {
        const { classes } = this.props;
        return (
            <form className={classes.form}  noValidate autoComplete="off">
                    
            <TextField className={classes.textfield}
                autoFocus
                error={err.surname}
                margin="dense"
                id="surname"
                label="Přijmení"
                type="text"
                value={TableEditor.null2empty(doc.surname)}
                onChange={(e)=>this.handleDocChange("surname",TableEditor.empty2null(e.target.value))}
            />
            <TextField className={classes.textfield}
                margin="dense"
                id="name"
                label="Jméno"
                type="text"
                value={TableEditor.null2empty(doc.name)}
                onChange={(e)=>this.handleDocChange("name",TableEditor.empty2null(e.target.value))}
            />
            <TextField className={classes.textfield}
                margin="dense"
                id="phone"
                label="Telefon"
                type="text"
                value={TableEditor.null2empty(doc.phone)}
                onChange={(e)=>this.handleDocChange("phone",TableEditor.empty2null(e.target.value))}
            />
            <TextField className={classes.textfield} 
                margin="dense"
                id="comment"
                label="Poznámka"
                type="text"
                value={TableEditor.null2empty(doc.comment)}
                onChange={(e)=>this.handleDocChange("comment",TableEditor.empty2null(e.target.value))}
                InputProps={{style:{width:350}}}
            />

        </form>

        )
    }

    checkDocField(name,value) {
        switch(name) {
            case 'surname': return ((value!==null) && (value!==undefined));
            default: return true;
            }
    }

    checkDoc(doc) {
        return this.checkDocField('surname',doc.surname);
    }


    renderTableHeadRow() {
        return (
            <TableRow>
                <TableCell padding={"dense"} style={{width:"0px"}}>Ev.č.</TableCell>
                <TableCell padding={"dense"}>Přijmení</TableCell>
                <TableCell padding={"dense"}>Jméno</TableCell>
                <TableCell padding={"dense"}>Telefon</TableCell>
                <TableCell padding={"dense"}>Poznámka</TableCell>
                <TableCell padding={"dense"}>Zaevidován</TableCell>
                <TableCell padding={"dense"}></TableCell>
            </TableRow>
        )
    }

    renderTableBodyRow(doc,idx) {
        const { classes } = this.props;
        const toolbar = this.renderTableBodyRowToolbar(doc,idx);
        return (
            <TableRow hover key={doc.id}>
            <TableCell padding={"dense"} style={{width:"0px"}}>{doc.no}</TableCell>
            <TableCell padding={"dense"}>{doc.surname}</TableCell>
            <TableCell padding={"dense"}>{doc.name}</TableCell>
            <TableCell padding={"dense"}>{doc.phone}</TableCell>
            <TableCell padding={"dense"}>{doc.comment}</TableCell>
            <TableCell padding={"dense"}><DateTimeView date={doc.created_at} format="LLL"/></TableCell>
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

    onFilter = (val) => {
        this.props.onSetFilter(val);
        this.props.onSelectPageNo(0); 
    }

    renderFilterField(value) {
        const { classes } = this.props;
        return (
            <TextField className={classes.filterfield}
            id="filter"
            label="Hledání"
            type="search"
            value={TableEditor.null2empty(value)}
            onChange={(e)=>this.onFilter(TableEditor.empty2null(e.target.value))}
        />
        )
    }

    renderHeaderLabel() {
        return "Evidence klientů"
    }
  
}


function mapStateToProps(state) {
    return { 
        current_page_no: state.clientPage.pageNo,
        current_page_length: state.clientPage.pageLength,
        current_filter: state.clientPage.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
      onSelectPageNo: no => {
        dispatch(setClientPageNo(no))
      },
      onSelectPageLength: no => {
        dispatch(setClientPageLength(no))
      },
      onSetFilter: filter => {
        dispatch(setClientFilter(filter))
      },
    }
}


export default compose(
    withStyles(styles),
    connect(mapStateToProps,mapDispatchToProps),
    graphql(CurrentClients,{
        name: "docs",
        options: ({current_page_no,current_page_length,current_filter})=>({variables:{pageNo:current_page_no,pageLength:current_page_length,filter:current_filter}})
    }),
    graphql(UpdateClient,{
        name:"updateDoc",
        options: {
            refetchQueries: [
                'Clients',
                'Client'
              ],
        }
    }),

    graphql(AddClient,{
        name:"addDoc",
        options: {
            refetchQueries: [
                'Clients',
                'Client'
              ],
        }
    }),
    graphql(HideClient,{
        name:"removeDoc",
        options: {
            refetchQueries: [
                'Clients',
                'Client'
              ],
        }
    }),

)(Clients)