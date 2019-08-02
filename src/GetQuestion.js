import React from 'react'
import { Grid, Typography, InputBase, Button, Dialog, DialogContent, CircularProgress } from '@material-ui/core';
import { getQuestion, arweaveInstance, getResponses, getResponseByUser } from './ar';
import BoxResponseQuestion from './BoxResponseQuestion';
import CanvasJSReact from './canvasjs.react'
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
//Question: jyjlomnb
const compressArrayBool = (original) => { 
	var compressed = [];
	// make a copy of the input array
	var copy = original.slice(0); 
	// first loop goes over every element
	for (var i = 0; i < original.length; i++) { 
		var myCount = 0;	
		for (var w = 0; w < copy.length; w++) {
			if (original[i] == copy[w]) {
				myCount++;
				delete copy[w];
			}
		}
 
		if (myCount > 0) {
      var a = new Object();
      if(parseInt(original[i]) === 1){
        a.label = 'True'
      }else{
        a.label = 'False'
      }
			a.y = parseInt(myCount)
			compressed.push(a);
		}
  } 
	return{ 
  data: [
  {
    // Change type to "doughnut", "line", "splineArea", etc.
    type: "bar",
    dataPoints:compressed
  }
  ]
}}

const compressArray = (original) => { 
	var compressed = [];
	// make a copy of the input array
	var copy = original.slice(0); 
	// first loop goes over every element
	for (var i = 0; i < original.length; i++) { 
		var myCount = 0;	
		for (var w = 0; w < copy.length; w++) {
			if (original[i] == copy[w]) {
				myCount++;
				delete copy[w];
			}
		}
 
		if (myCount > 0) {
			var a = new Object();
			a.label = original[i]
			a.y = parseInt(myCount)
			compressed.push(a);
		}
  } 
	return{ 
  data: [
  {
    // Change type to "doughnut", "line", "splineArea", etc.
    type: "bar",
    dataPoints:compressed
  }
  ]
}
 
};

const ViewQuestion = props => {
  const {questionDescription, typeQuestion, optionsArray } = props.questionData
  console.log(props.responseData)
  let compress = compressArray(props.responseData)
  if(typeQuestion === 3){
    compress = compressArrayBool(props.responseData)
  }

  if(typeQuestion === 5){

  }

  // console.log(compress)
  // console.log(optionsArray)

  return(
    <Grid container direction="column">
      <Typography style={{marginTop:15}} variant="overline">Question</Typography>
      <Typography>{questionDescription}</Typography>
      <Typography style={{marginTop:15}} variant="overline">Answers</Typography>
      {typeQuestion === 5 && optionsArray.map((option, index) => (
          <Typography>{index} - {option}</Typography>
      ))}
      {typeQuestion === 4 &&
      props.responseData.map((text) => (<Typography style={{padding:10}}>"{text}"</Typography>))
      }
      {(typeQuestion === 1 || typeQuestion === 2 || typeQuestion === 3 || typeQuestion === 5)  &&
        <Grid container>
          			<CanvasJSChart options={compress}/>
        </Grid>
      }

    </Grid>
  )
}

class GetQuestion extends React.Component{
    state = {
        questionId:'',
        formData:[],
        fetchQuestionId:'',
        showForm:false,
        responseData:[],
        formResponse:false,

        transactionResponse:'',
        txFeeRawResponse:'',
        txFeeResponse:'',
        modalTransactionResponse:false,

        showGetResposta:false,
        questionIdGetResposta:[],
        questionsGetResposta:[],
        responsesGetResposta:[],
        valuesGetResposta:[]

    }

    handleCloseTxModal = () => this.setState({modalTransactionResponse:false})

    handleCloseViewModal = () => this.setState({showGetResposta:false})

    

    changeState = e => this.setState({[e.target.name]: e.target.value})

    getRespostas = async(questionId) => {
      try{
        this.setState({loading:true})
        const responses = await getResponses(questionId)
        const questions = await getQuestion(questionId)
        const myRes = await getResponseByUser(questionId)
        console.log(myRes)
        if(!responses[0]){
          this.setState({loading:false})
          alert("None Anwsers")
          return
        }
        console.log(questions)
        console.log(responses)
        let extra = []
        for (var d = 0; d <= responses[0].length-1; d++) {
          let helper =  []
          for (var i = 0; i <= responses.length-1; i++) {
              helper.push(responses[i][d])
          }      
          extra.push(helper)
        }
        this.setState({
          questionIdGetResposta:questionId,
          questionsGetResposta: questions,
          responsesGetResposta: responses,
          valuesGetResposta:extra,
          showGetResposta:true,
          loading:false
        })
      }catch(err){
        console.log(err)
        this.setState({loading:false})
      }
    }

    searchForm = async() => {
        try{
          this.setState({loading:true})
            const { questionId } = this.state
            const formData = await getQuestion(questionId)
            const formResponse = await getResponses(questionId)
            if(formData.length===0){
              this.setState({loading:false})
                alert("Not Found")
                return
            }else{
                let ar = Array(formData.length)
                this.setState({formData,formResponse, showForm:true, responseData:ar, fetchQuestionId:questionId, loading: false})
            }
        }catch(err){
            console.log(err)
            this.setState({loading:false})
            alert('Error')
        }
    }

    setResponse = (index, value) => {
        try{
            //console.log(index, value)
            let responseData = this.state.responseData
            responseData[index] = value
            this.setState({responseData})
        }catch(err){
            console.log(err)
        }
    }

    generateNewResponse = async() => {
        const { arweaveWallet } = this.props.data
        try{
          if(!arweaveWallet){
            alert('Please load an Arweave Wallet')
            return
          }
          this.setState({loading:true})
          //console.log(this.state.responseData)
          const data = await JSON.stringify(this.state.responseData)
          let transactionResponse = await arweaveInstance.createTransaction({
            data
        }, arweaveWallet);
        transactionResponse.addTag('App-Name', 'testi-38737282736@#!');
        transactionResponse.addTag('question-id', this.state.fetchQuestionId);
        transactionResponse.addTag('type', 'response');
        const txFee = await arweaveInstance.ar.winstonToAr(transactionResponse.reward)
        this.setState({transactionResponse, txFeeResponse:txFee, txFeeRawResponse:transactionResponse.reward, modalTransactionResponse:true, loading:false})
        }catch(err){
          console.log(err)
          this.setState({loading:false})
        }
      }

      confirmNewResponse = async() => {
        const { arweaveWallet } = this.props.data
        try{
          this.setState({loading:true})
          const transaction = this.state.transactionResponse
          await arweaveInstance.transactions.sign(transaction, arweaveWallet);
          const response = await arweaveInstance.transactions.post(transaction);
          this.setState({modalTransactionResponse:false, loading:false,
            questionId:'',
            formData:[],
            fetchQuestionId:'',
            showForm:false,
            responseData:[],
            transactionResponse:'',
            txFeeRawResponse:'',
            txFeeResponse:''
      })
          alert('Transaction Send!, wait the confirmation to view that on permaweb')
        }catch(err){
          console.log(err)
          this.setState({loading:false})
          alert('Error Send Transaction')
        }    
      }
    
    

    render(){
        return(
            <Grid container justify="center" alignItems="center" alignContent="center" direction="column">
                <Typography>Question Code</Typography>
                <Grid container direction="row" justify="center" alignItems="center" alignContent="center" >
                <InputBase
                    style={{backgroundColor:'#dfe6e9', padding:5}}
                    multiline
                    rows="2"
                    rowsMax="4"
                    id="questionId"
                    name="questionId"
                    onChange={e => this.changeState(e)}
                    value={this.state.questionId}                
                />
                <Button onClick={this.searchForm} variant="contained">Search</Button>
                </Grid>
                {this.state.showForm &&
                  <Grid style={{padding:10}} container direction="column" justify="center" alignItems="center" alignContent="center">
                    <Typography>Form ID: {this.state.fetchQuestionId}</Typography>
                    <Typography>{this.state.formResponse.length} Already awnser this form</Typography>
                  </Grid>
                }
                {this.state.showForm && this.state.formData.map((item, index) => {
                    return(
                    <BoxResponseQuestion value={this.state.responseData[index]} setResponse={this.setResponse} index={index} data={item}/>)
                }
                )}
                {this.state.showForm && <Button variant="contained" onClick={this.generateNewResponse}>Respond Form</Button>}
                <Grid container direction="row" justify="center" alignContent="center">
                  <Grid item  md={6} direction="column">
                    {(this.props.data.listQuestions.length>=1) &&
                    <Typography align="center" style={{margin:20, fontSize:16}}>My Forms</Typography>
                    }
                    {(this.props.data.listQuestions.length===0) &&
                    <Typography align="center" style={{margin:5}}>You Dont have forms</Typography>
                    }
                    {(this.props.data.listQuestions.length>=1) &&
                    this.props.data.listQuestions.map((id) => (
                      <Grid container style={{margin:5, marginBottom:10}} direction="row" justify="center" alignItems="center" alignContent="center">
                      <Typography style={{fontSize:14, marginLeft:5}}>Form ID: {id}</Typography>
                      <Button variant="contained" style={{fontSize:10, textTransform:'none'}} onClick={() => this.getRespostas(id)}>View Details ->></Button>
                      </Grid>
                    )) 
                    }               
                  </Grid>
                {(this.props.data.listResponse.txId) &&
                  <Grid item  md={6} direction="column">
                    {(this.props.data.listResponse.txId.length>=1) &&
                    <Typography align="center" style={{margin:20, fontSize:16}}>My Anwsers</Typography>
                    }
                    {(this.props.data.listResponse.txId.length===0) &&
                    <Typography align="center" style={{margin:5}}>You Dont have awnser any form</Typography>
                    }
                    {(this.props.data.listResponse.txId.length>=1) &&
                    this.props.data.listResponse.txId.map((txId, index) => (
                      <Grid container justify="center" alignItems="center"  alignContent="center" style={{margin:5, marginBottom:10}} direction="column" >                  
                      <Grid item direction="column" >
                        <Typography style={{fontSize:14}}>Form ID: {this.props.data.listResponse.questionId[index]}</Typography>
                        <Typography style={{fontSize:9}}> TXID: {txId}</Typography>
                      </Grid>
                      <Grid item justify="center" alignItems="center" alignContent="center">                    
                        <Button onClick={() => this.getRespostas(this.props.data.listResponse.questionId[index])} variant="contained" style={{fontSize:10, textTransform:'none'}} >View Details ->></Button>
                      </Grid>
                      </Grid>
                    )) 
                    }               
                  </Grid>
                }
                </Grid>
          <Dialog open={this.state.modalTransactionResponse} onClose={this.handleCloseTxModal}>
            <DialogContent>
            <Typography>Form ID: {this.state.fetchQuestionId}</Typography>
              <Typography>Transaction Fee: {this.state.txFeeResponse}</Typography>
              {(parseInt(this.props.data.rawBalance)>=parseInt(this.state.txFeeRawResponse)) ?
                <Button onClick={this.confirmNewResponse} variant="contained" color="primary">Confirm Transaction</Button>
                :
                <Typography>Insuficient Funds</Typography>
              }
              {this.state.formData.map((item, index) => {
                return(
                  <Grid style={{margin:5}}>
                    <Typography>Question {1+index}:</Typography>
                    <Typography>{item.questionDescription}</Typography>
                    <Typography>R:{this.state.responseData[index]}</Typography>
                  </Grid>
                )
              })}
            </DialogContent>
          </Dialog>
          <Dialog open={this.state.loading}><DialogContent><CircularProgress/></DialogContent></Dialog> 
          <Dialog open={this.state.showGetResposta} onClose={this.handleCloseViewModal}>
            <DialogContent>
              {this.state.questionsGetResposta.map((item, index) => (
              <ViewQuestion questionData={item} responseData={this.state.valuesGetResposta[index]} />
              ))}
            </DialogContent>
          </Dialog>
            </Grid>
        )
    }
}

export default GetQuestion