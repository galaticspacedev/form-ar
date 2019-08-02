import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const TrueOrFalse = props => (
    <FormControl component="fieldset" >
    <FormLabel component="legend">0 -- 10</FormLabel>
    <RadioGroup
      value={parseInt(props.value)}
      onChange={(e) => props.handleChange(e.target.value)}
    >
      <FormControlLabel value={0} control={<Radio />} label="False" />
      <FormControlLabel value={1} control={<Radio />} label="True" />
    </RadioGroup>
  </FormControl>
)

export default TrueOrFalse