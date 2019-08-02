import Arweave from 'arweave/web';

const arweaveInstance = Arweave.init({
    host: 'arweave.net',// Hostname or IP address for a Arweave node
    port: 80,           // Port, defaults to 1984
    protocol: 'https',  // Network protocol http or https, defaults to http
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
})

const getMyQuestions = async(arweaveAddress) => {
    try{
      const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: arweaveAddress
        },
        expr2:{
            op: 'equals',
            expr1: 'type',
            expr2: 'question'
        },
        expr3: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'testi-38737282736@#!'
      },    
      }
      let data = []
      const list = await arweaveInstance.arql(query);
      if(list.length === 0){
        return []
      }else{
        list.map(txId => data.push(getQuestionId(txId)))
        const resultData = await Promise.all(data)       
        return resultData
      }
    }catch(err){
      console.log(err)
      return []
    }  
  }

  const getMyResponses = async(arweaveAddress) => {
    try{
      const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: arweaveAddress
        },
        expr2:{
            op: 'equals',
            expr1: 'type',
            expr2: 'response'
        },
        expr3: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'testi-38737282736@#!'
      },    
      }
      let data = []
      const list = await arweaveInstance.arql(query);
      if(list.length === 0){
        return []
      }else{
        list.map(txId => data.push(getQuestionId(txId)))
        const resultData = await Promise.all(data)
        return {questionId:resultData, txId:list}
      }
    }catch(err){
      console.log(err)
      return []
    }  
  }


  const getTxData = async(txId) => {
    return new Promise(async function(resolve, reject){
      try{
        const tx = await arweaveInstance.transactions.get(txId)
        let data = await JSON.parse( tx.get('data', {decode: true, string: true}) )
        resolve(data)
      }catch(err){
        resolve({error:true, err})
      }
    })
}


const getQuestionId = async(txId) => {
  return new Promise(async function(resolve, reject){
    try{
      const tx = await arweaveInstance.transactions.get(txId)
      let tags =  await tx.get('tags')
      const id = await Buffer.from(tags[1].value, 'base64').toString('ascii')
      resolve(id)
    }catch(err){
      resolve({error:true, err})
    }
  })
}

const getQuestion = async(questionId) => {
  try{
    const query = {
      op: 'and',
      expr1: {
          op: 'equals',
          expr1: 'question-id',
          expr2: questionId
      },
      expr2:{
          op: 'equals',
          expr1: 'type',
          expr2: 'question'
      },
      expr3: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'testi-38737282736@#!'
      }
    }
    let data = []
    const list = await arweaveInstance.arql(query);
    if(list.length === 0){
      return []
    }else{
      list.map(txId => data.push(getTxData(txId)))
      const resultData = await Promise.all(data)
      return resultData[0]
    }
  }catch(err){
    console.log(err)
    return []
  }  
}

const getResponses = async(questionId) => {
  try{
    const query = {
      op: 'and',
      expr1: {
          op: 'equals',
          expr1: 'question-id',
          expr2: questionId
      },
      expr2:{
        op: 'equals',
        expr1: 'type',
        expr2: 'response'
    },
      expr3: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'testi-38737282736@#!'
      },
         
    }
    let data = []
    const list = await arweaveInstance.arql(query);
    if(list.length === 0){
      return []
    }else{
      list.map(txId => data.push(getTxData(txId)))
      const resultData = await Promise.all(data)
      return resultData
    }
  }catch(err){
    console.log(err)
    return []
  }  
}

const getResponseByUser = async(questionId, arweaveAddress) => {
  try{
    const query = {
      op: 'and',
      expr1: {
          op: 'equals',
          expr1: 'question-id',
          expr2: questionId
      },
      expr2:{
          op: 'equals',
          expr1: 'type',
          expr2: 'response'
        },
        expr3: {
          op: 'equals',
          expr1: 'from',
          expr2: arweaveAddress
          }
    }
    let data = []
    const list = await arweaveInstance.arql(query);
    if(list.length === 0){
      return []
    }else{
      list.map(txId => data.push(getTxData(txId)))
      console.log(list)
      const resultData = await Promise.all(data)
      return resultData
    }
  }catch(err){
    console.log(err)
    return []
  }  
}


export{
    arweaveInstance,
    getMyQuestions,
    getQuestion,
    getResponses,
    getMyResponses,
    getResponseByUser 
}