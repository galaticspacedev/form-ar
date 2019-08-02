import React from 'react'
import { InputBase, Grid, Typography, Button, Dialog, DialogContent, CircularProgress, AppBar, Toolbar } from '@material-ui/core';
import { HashRouter, Route, Link } from 'react-router-dom'
import Dapp from './Dapp'
import GetQuestion from './GetQuestion';
import { getMyQuestions, arweaveInstance, getMyResponses } from './ar';

class App extends React.Component{
    state = {
      //user data
      loading:false,
      arweaveWallet:false,
      arweaveAddress:false,
      arweaveBalance:false,
      rawBalance:false,
      listQuestions:false,
      listResponse:false
    }

    readFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => {
          reader.abort()
          reject()
        }
        reader.addEventListener("load", () => {resolve(reader.result)}, false)
        reader.readAsText(file)
      })
    }
  
    openFileReader = () => document.getElementById('loadAccount').click()
  
    loadArweaveAccount = async(e) => {
      try{
        this.setState({loading:true})
        const raw = await this.readFile(e.target.files[0])
        const arweaveWallet = JSON.parse(raw)
        const arweaveAddress = await arweaveInstance.wallets.jwkToAddress(arweaveWallet)
        const rawBalance =  await arweaveInstance.wallets.getBalance(arweaveAddress)
        const arweaveBalance = await arweaveInstance.ar.winstonToAr(rawBalance)
        const listQuestions = await getMyQuestions(arweaveAddress)
        const listResponse = await getMyResponses(arweaveAddress)
        this.setState({listResponse, arweaveAddress, arweaveBalance, rawBalance, arweaveWallet, loading:false, listQuestions})
      }catch(err){
        console.log(err)
        this.setState({loading:false})
        alert('Error Loading Wallet')
        return
      }
    }
  

    render(){
        return(
        <HashRouter basename="/">
        <Grid container>
          <AppBar position="fixed" style={{backgroundColor:'grey'}}>
            <Toolbar>
              <div style={{ flex: 1 }}>
                <Typography align="center" variant="h6">Perma Form</Typography>
              </div>
              <div style={{marginRight:0}}>
              {this.state.arweaveWallet ?
                <Link to="/newQuestion">
                  <Button variant="contained" color="primary">Create New Form</Button>
                </Link>
              :
                <React.Fragment>
                  <Button variant="contained" onClick={this.openFileReader} color="primary">Load Arweave Wallet</Button>
                  <input type="file" onChange={ e => this.loadArweaveAccount(e)} id="loadAccount" style={{display: "none"}}/>
                </React.Fragment>
              }
              </div>
            </Toolbar>

          </AppBar> 
          <Grid container style={{marginTop:60}}>
          {this.state.arweaveWallet &&
          <Grid container  direction="column">
            <Typography  style={{wordBreak:'break-all', padding:5}} variant="h6" align="center">{this.state.arweaveAddress}</Typography>
            <Typography variant="h6" align="center">{this.state.arweaveBalance} AR</Typography>
          </Grid>
         }
       
            <Route exact path="/" render={() => <GetQuestion data={this.state} />} />
            <Route exact path="/newQuestion" render={() => <Dapp data={this.state}/>} />
          </Grid>

          <Dialog open={this.state.loading}><DialogContent><CircularProgress/></DialogContent></Dialog> 
        </Grid>
        </HashRouter>

        )
    }
}

export default App