import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { InputBase, Grid, Chip, Paper, Button, Typography } from '@material-ui/core';


const BoxViewFullQuestion = (props) => {
    const {questionDescription, typeQuestion, optionsArray } = props.data
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
        <Grid container direction="column" style={{maxWidth:350, margin:10}}>
        <Typography style={{marginTop:15}} variant="overline">Question</Typography>
        <Typography>{questionDescription}</Typography>
        <Typography style={{marginTop:15}} variant="overline">Answers</Typography>
        {(options === 4) ? 
            <Typography>The user will write the answer</Typography>
            :
            <Grid>
                {options.map((item) =>  <Chip
              label={item}
              style={{ margin:2 }}
            />)}
            </Grid>
        }
        <Button variant="contained" color="secondary" onClick={() => props.removeQuestion(props.data)}>Remove</Button>
        </Grid>
    )
}


export default BoxViewFullQuestion