import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import Typography from 'material-ui/Typography';
//import DateField from './DateField';
//import RoleField from './RoleField';
//import ClientLookup from './ClientLookup2';
//import Divider from 'material-ui/Divider';
//import ClientView from './ClientView';
//import ClientField from './ClientField';
//import PdfView from './PdfView';
//import  loremIpsum from 'lorem-ipsum';


//const czechText = "Daleko, za Slovnímy horami, vzdálené od země samohlásek a souhlásek žijí Smyšlené texty. Opuštěné žijí v Písmenkově na pobřeží Sémantiky, velkého Jazykooceánu. Místem protéká potůček zvaný Ottův slovník naučný a zásobuje ho potřebnými pravidly. Je to rajská země, ve které létají pečené části vět do úst. A ani od mocné Interpunkce nemohou být Smyšlené texty ovládány – takřka nepravopisný život. Jednoho dne se jeden malý řádek smyšleného textu rozhodl, jmenoval se Lorem Ipsum, vyjít si do rozlehlé gramatiky. Velký Oxmox mu to rozmlouval, jelikož se to tam hemží zlými Čárkami, divokými Otazníky a lstivými Středníky, ale Smyšlený textík se nenechal zmátnout. Zbalil si jeho Verzálky (Velká písmena), strčil si jeho Iniciály za opasek a dal se na cestu. Jakmile se vyšplhal na první pahorek Kurziva pohoří, podíval se naposledy na siluetu rodného města Písmenkova, nápisu Abecedyves a řádku jeho vlastní ulice, uličky Řádková. Lítostně mu tekla rétorická Otázka po tváři, pak pokračoval v cestě. Po cestě potkal Průklep. Průklep varoval Smyšlený textík že tam, odkud on přichází, by byl nekonečně opisován a vše co by z jeho původu zbylo, by bylo slovo „a“ a tak se má Smyšlený textík otočit a opět se vrátit do vlastní, bezpečné země. Ale všechny";

//import Paper from 'material-ui/Paper';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      paddingLeft: theme.spacing.unit * 3,
      width: '100%',
    },

    title: {
        marginBottom: theme.spacing.unit * 2
    },

  
});

const bugs = [
    "po pridani klienta do evidence se neukaze v prehledu, reload nepomaha, zahledani ano",
    "cca po hodine necinnosti dojde k odhlaseni, ktere neni videt a nejde nic menit. staci prenacist stranku",
];

const todos = [

    "ucty - kazda lokalita svuj jeden login",
    "umoznit prime pridani do evidence z zahledani masaze a ucastnika lekce",
    "nove masaze umoznit ukladani na vice dnu",
   
];
const changes = [
    "oprava, nefunguje mazani prodeje",
    "testovaci lokalita - misto kde si muzu vyzkouset upravy bez ohrozeni zivych dat",
    "ucastnik lekce, umoznit editaci platby a poznamky",
    "vsichni klienti vsude z evidence",
    'k masazi dat "Platba" roletku: ["darkovy poukaz","faktura","neplaceno","placeno"] je povinna',  
    'v denim prehledu masazi polozky: Prijmeni, Telefon, Typ masaze, Platba, Poznamka',
    "cas od 7:00 az 20:30",
    "tisk masazniho dne",
    "reporty masazi: mistnot, mesic, a pocty typu masazi",
    "pridani prodeje, clovek nejde z evidence",
    "do prodeje dat hledani dle jmena",
    "u klientu evidovat: prijmeni, jmeni, telefon, poznamka",
    "u klientu hledani dle prijmeni, jmena",
    "lekce - prehled zapsany: prijmeni, jmeni, telefon, roletka (placeno, neplaceno)",
    "lekce -  ucast klikat primo do radku",
    "lekce tisk ucastniku lekce",
    "kalendar lekci - cervene/zelene  v kalendari", 
    "lekce neprihlasovast pri plne kapacite",
    "uzivatel recepce vidi jen jednu lokalitu",
    "hromadne planovani - lekce (dam denni dobu, dam kapacitu, a vyberu prvni den, a posledni den, a je to vzdy po tydnu)",
    "hromadne planovani - masaze, vemu jeden den, a ten se nakopiruje zase po tydnu",
    "editace lokalit",
    "robots.txt",
    'cudlik "editace lekci" presunout jako u masazi - horni pravy roh',
    "zalohovani databaze",
    'login ma "progress bar',
    'version info',
    "clientfield - jen z aktualni lokality!",
    "u uzivatelu se da nastavit vynucena lokalita"


];




class AboutComponent extends React.Component {

    renderItems(items)  {
        return (
            <ul>
                {items.map((i,idx)=>{
                    return (
                        <li key={idx}>
                        <Typography>{i}</Typography>
                        </li>
                    )
                })}
            </ul>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Typography className={classes.title} variant="title">Přehled úprav systému evidence</Typography>

                <Typography>Zatím neopravené chyby</Typography>
                {this.renderItems(bugs)}
                <Typography>Věci k dodělání</Typography>
                {this.renderItems(todos)}
                <Typography>Hotové opravy a úpravy</Typography>
                {this.renderItems(changes)}
           </div>
        )
    }
}




export default compose(
    withStyles(styles),
)(AboutComponent)