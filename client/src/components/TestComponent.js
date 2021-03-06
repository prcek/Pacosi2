import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
//import DateField from './DateField';
//import RoleField from './RoleField';
//import ClientLookup from './ClientLookup2';
//import Divider from 'material-ui/Divider';
//import ClientView from './ClientView';
//import ClientField from './ClientField';
//import PdfView from './PdfView';
//import MassageRoomField from './MassageRoomField';
//import  loremIpsum from 'lorem-ipsum';
import Button from 'material-ui/Button';
import { connect } from 'react-redux'

import { setErrorMessage, setInfoMessage } from './../actions'


//const czechText = "Daleko, za Slovnímy horami, vzdálené od země samohlásek a souhlásek žijí Smyšlené texty. Opuštěné žijí v Písmenkově na pobřeží Sémantiky, velkého Jazykooceánu. Místem protéká potůček zvaný Ottův slovník naučný a zásobuje ho potřebnými pravidly. Je to rajská země, ve které létají pečené části vět do úst. A ani od mocné Interpunkce nemohou být Smyšlené texty ovládány – takřka nepravopisný život. Jednoho dne se jeden malý řádek smyšleného textu rozhodl, jmenoval se Lorem Ipsum, vyjít si do rozlehlé gramatiky. Velký Oxmox mu to rozmlouval, jelikož se to tam hemží zlými Čárkami, divokými Otazníky a lstivými Středníky, ale Smyšlený textík se nenechal zmátnout. Zbalil si jeho Verzálky (Velká písmena), strčil si jeho Iniciály za opasek a dal se na cestu. Jakmile se vyšplhal na první pahorek Kurziva pohoří, podíval se naposledy na siluetu rodného města Písmenkova, nápisu Abecedyves a řádku jeho vlastní ulice, uličky Řádková. Lítostně mu tekla rétorická Otázka po tváři, pak pokračoval v cestě. Po cestě potkal Průklep. Průklep varoval Smyšlený textík že tam, odkud on přichází, by byl nekonečně opisován a vše co by z jeho původu zbylo, by bylo slovo „a“ a tak se má Smyšlený textík otočit a opět se vrátit do vlastní, bezpečné země. Ale všechny";

//import Paper from 'material-ui/Paper';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    textfield: {
        //margin: theme.spacing.unit
    },

});



class TestComponent extends React.Component {
 
    state = {
       
    }

    handleClick = () => {
        this.props.onError("chyba");
        this.props.onInfo("info");
    }

    render() {
       // const { classes } = this.props;
        return (
            <div>
                <Button onClick={this.handleClick}> test </Button>   
            </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
      onError: (message) => {
        dispatch(setErrorMessage(message))
      },
      onInfo: (message) => {
        dispatch(setInfoMessage(message))
      },
    }
  }
  

export default compose(
    connect(null,mapDispatchToProps),
    withStyles(styles),
)(TestComponent)