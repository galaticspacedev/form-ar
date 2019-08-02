import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const ZeroTen = props => {
  console.log(props.value)
  return(
    <FormControl component="fieldset" >
    <FormLabel component="legend">0 -- 10</FormLabel>
    <RadioGroup
      value={parseInt(props.value)}
      onChange={(e) => props.handleChange(e.target.value)}
    >
      <FormControlLabel value={0} control={<Radio />} label="0" />
      <FormControlLabel value={1} control={<Radio />} label="1" />
      <FormControlLabel value={2} control={<Radio />} label="2" />
      <FormControlLabel value={3} control={<Radio />} label="3" />
      <FormControlLabel value={4} control={<Radio />} label="4" />
      <FormControlLabel value={5} control={<Radio />} label="5" />
      <FormControlLabel value={6} control={<Radio />} label="6" />
      <FormControlLabel value={7} control={<Radio />} label="7" />
      <FormControlLabel value={8} control={<Radio />} label="8" />
      <FormControlLabel value={9} control={<Radio />} label="9" />
      <FormControlLabel value={10} control={<Radio />} label="10" />
    </RadioGroup>
  </FormControl>
)
}

export default ZeroTen