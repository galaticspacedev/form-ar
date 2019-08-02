import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { InputBase, Grid, RadioGroup, Radio, FormControlLabel, Paper, Button, Typography } from '@material-ui/core';
import ZeroTen from './question/ZeroTen';
import ZeroFive from './question/ZeroFive';
import TrueOrFalse from './question/TrueOrFalse';


class BoxResponseQuestion extends React.Component{
    state = {

    }

    setResponse = async(value) => {
        this.props.setResponse(this.props.index, value)
    }

    render(){
           
    const {questionDescription, typeQuestion, optionsArray } = this.props.data
    const { index, value } = this.props
    let options
    if(typeQuestion === 1){
        options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
    if(typeQuestion === 2){
        options = [0, 1, 2, 3, 4, 5]
    }
    if(typeQuestion === 3){
        options=["True", "False"]
    }
    if(typeQuestion === 4){
        options= 4
    }
    if(typeQuestion === 5){
        options = optionsArray
    }


    return(
        <Grid container style={{maxWidth:300}} justify="center" alignContent="center"  direction="column">
        <Typography style={{marginTop:15}} variant="overline">Question {this.props.index}</Typography>
        <Typography>{questionDescription}</Typography>
        <Grid container style={{backgroundColor:'#EEEEEC'}} justify="center" alignContent="center" alignItems="center">
        {(typeQuestion === 1) &&
            <ZeroTen value={value} handleChange={this.setResponse}/>
        }
          {(typeQuestion === 2) &&
            <ZeroFive value={value} handleChange={this.setResponse}/>
        }
          {(typeQuestion === 3) &&
            <TrueOrFalse value={value} handleChange={this.setResponse}/>
        }
        {(typeQuestion === 4) &&
             <InputBase
             style={{backgroundColor:'#dfe6e9', padding:5}}
             multiline
             rows="8"
             rowsMax="18"
             onChange={e => this.setResponse(e.target.value)}
             value={value}                
       />
        }
          {(typeQuestion === 5) &&
            <RadioGroup
            aria-label="Gender"
            name="gender1"
            onChange={e => this.setResponse(e.target.value)}
            value={parseInt(value)} 
            >
            {optionsArray.map((item, index) => 
                <FormControlLabel value={index} control={<Radio />} label={item} />
            )}
            </RadioGroup>
        }
        </Grid>
        </Grid>
    )
}
}


export default BoxResponseQuestion