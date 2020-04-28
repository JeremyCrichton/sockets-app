import React, { useState } from 'react';
import styled from 'styled-components';

import { makeStyles } from '@material-ui/core/styles';
import { FormControl, MenuItem, Select, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(4),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  select: {
    textAlign: 'center',
  },
}));

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-size: 1.8rem;
  font-weight: 300;
  margin-bottom: 1rem;
`;

const TextInput = styled.input`
  border: none;
  outline: none;
  text-align: center;
  border-bottom: 1px solid white;
  font-size: 2rem;
  background: transparent;
  color: white;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 2rem;
`;

const Entrance = ({ submitUserDetails }) => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('anything');

  const handleSubmit = e => {
    e.preventDefault();

    submitUserDetails(username, room);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection>
        <Label htmlFor='username-input'>Hi, what's your name?</Label>
        <TextInput
          id='username-input'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </FormSection>
      <FormControl className={classes.formControl}>
        <Label htmlFor='select-room'>What would you like to talk about?</Label>
        <Select
          id='select-room'
          value={room}
          onChange={e => setRoom(e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          className={classes.select}
        >
          <MenuItem value='anything'>Anything</MenuItem>
          <MenuItem value='javascript'>Javascript</MenuItem>
          <MenuItem value='ruby'>Ruby</MenuItem>
        </Select>
      </FormControl>
      <Button variant='outlined' type='submit'>
        Join
      </Button>
    </Form>
  );
};

export default Entrance;
