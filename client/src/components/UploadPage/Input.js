import React from 'react'
import { TextField, Grid } from '@material-ui/core';

const Input = ({ name, handleChange, label, required, value }) => (
    <Grid item xs={12} sm={12}>
        <TextField 
            value={value}
            name={name}
            onChange={handleChange}
            variant="filled"
            required={required}
            fullWidth
            label={label}
        />
    </Grid>
);

export default Input