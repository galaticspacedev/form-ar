import React from 'react';
import './App.css';
import { InputBase, Grid, Typography, Button, Dialog, DialogContent, CircularProgress, Tabs, Tab } from '@material-ui/core';

import ZeroTen from './question/ZeroTen';
import CreateQuestion from './question/CreateQuestion';
import BoxViewFullQuestion from './BoxViewFullQuestion';
import Arweave from 'arweave/web';
import uniqid from 'uniqid'
import { getMyQuestions } from './ar';

const arweaveInstance = Arweave.init({
    host: 'arweave.net',// Hostname or IP address for a Arweave node
    port: 80,           // Port, defaults to 1984
    protocol: 'https',  // Network protocol http or https, defaults to http
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
})


// CRIAR OPCAO PARA GERAR PAGINA DIRETO PARA O FORM
class Dapp extends React.Component{
  state = {
    typeQuestion:1,
    //Already created questions
    questionArray:[],
    //Response
    questionDescription:'',
    questionResponse:[],
    uid:'',
    //user data
    loading:false,
    arweaveWallet:false,
    arweaveAddress:false,
    arweaveBalance:false,
    rawBalance:false,
    transaction:'',
    fee:'',
    txFeeRaw:'',
    modalTransaction:false
  }

  
  generateNewQuestionTx = async() => {
    const { arweaveWallet } = this.props.data
    try{
      if(!arweaveWallet){
        alert('Please load an Arweave Wallet')
        return
      }
      this.setState({loading:true})
      const data = await JSON.stringify(this.state.questionArray)
      let transaction = await arweaveInstance.createTransaction({
        data
    }, arweaveWallet);
    const uid = await uniqid()
    console.log(uid)
    transaction.addTag('App-Name', 'testi-38737282736@#!');
    transaction.addTag('question-id', uid);
    transaction.addTag('type', 'question');
    const txFee = await arweaveInstance.ar.winstonToAr(transaction.reward)
    this.setState({transaction, txFee, uid, txFeeRaw:transaction.reward, modalTransaction:true, loading:false})
    }catch(err){
      console.log(err)
      this.setState({loading:false})
    }
  }

  confirmNewQuestion = async() => {
    const { arweaveWallet } = this.props.data
    try{
      this.setState({loading:true})
      const transaction = this.state.transaction
      await arweaveInstance.transactions.sign(transaction, arweaveWallet);
      const response = await arweaveInstance.transactions.post(transaction);
      this.setState({modalTransaction:false, loading:false, questionArray:[],
        questionDescription:'',
        questionResponse:[],uid:''})
      alert('Transaction Send!, wait the confirmation to view that on permaweb')
    }catch(err){
      console.log(err)
      this.setState({loading:false})
      alert('Error Send Transaction')
    }    
  }

  // generateNewResponse = async(responseData, uid) => {
  //   try{
  //     if(!this.state.arweaveWallet){
  //       alert('Please load an Arweave Wallet')
  //       return
  //     }
  //     this.setState({loading:true})
  //     const data = await JSON.stringify(responseData)
  //     let transactionResponse = await arweaveInstance.createTransaction({
  //       data
  //   }, this.state.arweaveWallet);
  //   transactionResponse.addTag('App-Name', 'testi-38737282736@#!');
  //   transactionResponse.addTag('question-id', uid);
  //   transactionResponse.addTag('type', 'response');
  //   const txFee = await arweaveInstance.ar.winstonToAr(transactionResponse.reward)
  //   this.setState({transactionResponse, txFeeResponse:txFee, txFeeRawResponse:transactionResponse.reward, modalTransactionResponse:true, loading:false})
  //   }catch(err){
  //     console.log(err)
  //     this.setState({loading:false})
  //   }
  // }






  onChangeTab = (e, value) => {
    this.setState({typeQuestion: value})
  }

  
  
  addQuestion = () => {
    const { typeQuestion, questionArray, questionResponse, questionDescription } = this.state
    let result ={questionDescription, typeQuestion, optionsArray:[]}
    if(typeQuestion === 5){
      result.optionsArray = questionResponse    
    }
    questionArray.push(result)
    this.setState({questionArray, questionDescription:'', questionResponse:[]})

  }

  deleteQuestion = (data) => {
    this.setState(state => {
      const questionArray = [...state.questionArray];
      const chipToDelete = questionArray.indexOf(data);
      questionArray.splice(chipToDelete, 1);
      return { questionArray };
    });
  };


  deleteResponse = (data) => {
    this.setState(state => {
      const questionResponse = [...state.questionResponse];
      const chipToDelete = questionResponse.indexOf(data);
      questionResponse.splice(chipToDelete, 1);
      return { questionResponse };
    });
  };

  changeState = e => this.setState({[e.target.name]: e.target.value})

  updateResponse = data => {
    this.setState({questionResponse:data})
  }

  closeModal = () => this.setState({modalTransaction:false})

  render(){
    const { typeQuestion, questionArray, questionResponse } = this.state
    return(
      <Grid container justify="center" alignContent="center" alignItems="center" direction="column">
    <Typography>Question Description</Typography>
        <InputBase
            style={{backgroundColor:'#dfe6e9', padding:5}}
            multiline
            rows="2"
            rowsMax="4"
            id="questionDescription"
            name="questionDescription"
            onChange={e => this.changeState(e)}
            value={this.state.questionDescription}                
        />
        <Grid>
      <Tabs onChange={this.onChangeTab} centered value={typeQuestion}>
        <Tab value={1} label="0 a 10" />
        <Tab value={2} label="0 a 5"/>
        <Tab value={3} label="True or False" />
        <Tab value={4} label="User Text" />
        <Tab value={5} label="Custom Answers" />
      </Tabs>
      </Grid>
      {(typeQuestion === 1) && <Typography>The user will response between 0 and 10</Typography>}
      {(typeQuestion === 2) && <Typography>The user will response between 0 and 5</Typography>}
      {(typeQuestion === 3) && <Typography>The user will responde true or false</Typography>}
      {(typeQuestion === 4) && <Typography>The user will wirte the response</Typography>}
      {(typeQuestion === 5) && <CreateQuestion updateResponse={this.updateResponse} data={questionResponse} deleteResponse={this.deleteResponse}/>}
      <Button variant="contained" onClick={this.addQuestion}>Add Question</Button>
      {(questionArray.length>0) && <Typography>Questions({questionArray.length})</Typography>}
      {questionArray.map((item) => (
        <BoxViewFullQuestion removeQuestion={this.deleteQuestion} data={item}/>
      ))}

      <Button variant="contained" onClick={this.generateNewQuestionTx}>Advance</Button>
          <Dialog open={this.state.modalTransaction}><DialogContent>
            <Grid container justify="center" alignContent="center" alignItems="center" direction="column">
              <Dialog open={this.state.loading}><DialogContent><CircularProgress/></DialogContent></Dialog>  
              <Typography>Form ID: {this.state.uid}</Typography>
              <Typography>Transaction Fee: {this.state.txFee}</Typography>
              {(parseInt(this.props.data.rawBalance)>=parseInt(this.state.txFeeRaw)) ?
                <Button onClick={this.confirmNewQuestion} variant="contained" color="primary">Confirm Transaction</Button>
                :
                <Typography>Insuficient Funds</Typography>
              }
              <Button onClick={this.closeModal} variant="contained" color="secondary">Cancel</Button>   
              <Typography variant="h6">Questions:</Typography>
              {questionArray.map((item) => (
                <BoxViewFullQuestion removeQuestion={this.deleteQuestion} data={item}/>
              ))}
             
            </Grid>
            </DialogContent></Dialog>
          <Dialog open={this.state.loading}><DialogContent><CircularProgress/></DialogContent></Dialog> 
    </Grid>
    )
  }

}

export default Dapp;
