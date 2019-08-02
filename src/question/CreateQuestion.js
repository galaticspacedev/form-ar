import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { InputBase, Grid, Chip, Paper, Button } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

class CreateQuestion extends React.Component {
  state = {
    questionArray: [],
    questionText:''
  };

  changeState = e => this.setState({[e.target.name]: e.target.value})

  addResponse = () => {
      const dataArray = this.props.data
      dataArray.push(this.state.questionText)
      this.setState({questionText:''})
      this.props.updateResponse(dataArray)

  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Grid container>
        <InputBase
                      style={{backgroundColor:'#dfe6e9', padding:5}}
                      multiline
                      rows="2"
                      rowsMax="4"
                      id="questionText"
                      name="questionText"
                      onChange={e => this.changeState(e)}
                      value={this.state.questionText}                
                />
            <Button onClick={this.addResponse}>Add Response</Button>
        </Grid>
        <Grid container direction="column">
        {this.props.data.map(data => {
          let icon = null;

        //   if (data.label === 'React') {
        //     icon = <TagFacesIcon />;
        //   }

          return (
            <Chip
            //   key={data.key}
              icon={icon}
              label={data}
              onDelete={() => this.props.deleteResponse(data)}
              className={classes.chip}
            />
          );
        })}

</Grid>
        
      </Paper>
    );
  }
}

CreateQuestion.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateQuestion);