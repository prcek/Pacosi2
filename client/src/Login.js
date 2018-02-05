import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import { connect } from 'react-redux'
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import { setAuthToken } from './actions'

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    wrapper: {
        display: "flex",
        justifyContent: "center", /* align horizontal */
        alignItems: "center",
        //borderStyle: 'solid',
        //borderColor: 'green',
        //borderWidth: 'thin',
    },
    paper: {
        padding: theme.spacing.unit * 3,
        width: '400px',
      },
      
    textfield: {
        //margin: theme.spacing.unit
    },

});


class Login extends React.Component {
 
    state = {
        form: { 
            login:"",
            password:""
        },
        wrong:false,
        wait:false
    }
    handleChange = (k,v) => {
        let { form } = this.state;
        form[k]=v;
        this.setState({form:form,wrong:false});
    }

    isFormValid() {
        return this.state.form.login!=="" && this.state.form.password!=="";
    }

    checkPassword(l,p) {
        return p === "nimda" && l === "admin";
    }

    handleLogin = () => {
        let { form } = this.state;
        fetch("/auth/login",{
            method:'POST',
            body:JSON.stringify({login:form.login,password:form.password}), 
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((resp) => resp.json()).then(data=>{
            console.log("data:",data);
            if (data.auth_ok) {
                this.setState({wrong:false,form:form});
                this.props.onSetAuthToken("yes"); 
            } else {
                form["password"] = "";
                this.setState({wrong:true,form:form});
            }
        }).catch(err=>{
            console.error("do login",err);
        })
        //this.setState({wait:true})
        /*
        if (this.checkPassword(this.state.form.login,this.state.form.password)) {
            form["password"] = "";
            this.setState({wrong:false,form:form});
            this.props.onSetAuthToken("yes"); 
        } else {
            form["password"] = "";
            this.setState({wrong:true,form:form});
        }
       */
    }
    handleLogout = () => {
        this.props.onSetAuthToken("");
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}> 
                <div className={classes.wrapper}>
                    <Paper className={classes.paper}>
                    <Typography variant="title"> Přihlášení do evidence </Typography>
                    <Divider/>
                    <form className={classes.form}  noValidate autoComplete="off">  
                        <TextField className={classes.textfield}
                            autoFocus
                            margin="dense"
                            id="login"
                            label="Přihlašovací jméno"
                            type="text"
                            value={this.state.form.login}
                            onChange={(e)=>this.handleChange("login",e.target.value)}
                            fullWidth
                        />
                        <TextField className={classes.textfield}
                            margin="dense"
                            id="password"
                            label="Heslo"
                            type="password"
                            value={this.state.form.password}
                            onChange={(e)=>this.handleChange("password",e.target.value)}
                            fullWidth
                        />
                    </form>
                    {this.state.wrong && (<Typography color="error"> špatné přihlašovací jméno nebo heslo </Typography>)}
                    <Button  disabled={(!this.isFormValid())|| this.state.wait} className={classes.button} variant="raised" onClick={this.handleLogin}> přihlásit </Button>
                    </Paper>
                </div>
           </div>
        )
    }
}


function mapStateToProps(state) {
    return { 
        auth_token: state.auth.token,
    }
}

const mapDispatchToProps = dispatch => {
    return {
      onSetAuthToken: token => {
        dispatch(setAuthToken(token))
      },
    }
}


export default compose(
    withStyles(styles),
    connect(mapStateToProps,mapDispatchToProps),
)(Login)