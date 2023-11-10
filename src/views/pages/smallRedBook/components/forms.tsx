import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
const Form = ({ item, values, changeValue }: { item: any; values: any; changeValue: any }) => {
    const mt = {
        marginTop: 2
    };
    const [open, setOpen] = useState(false);
    return (
        <div>
            {item.style === 'INPUT' ? (
                <TextField
                    color="secondary"
                    size="small"
                    sx={mt}
                    label={item.label}
                    value={values}
                    id={item.field}
                    required
                    name={item.field}
                    InputLabelProps={{ shrink: true }}
                    error={!item.field && open}
                    helperText={!item.field && open ? `${item.label}是必填项` : ' '}
                    onChange={(e) => {
                        setOpen(true);
                        changeValue({ value: e.target.value });
                    }}
                    fullWidth
                />
            ) : item.style === 'TEXTAREA' ? (
                <TextField
                    color="secondary"
                    size="small"
                    sx={mt}
                    label={item.label}
                    value={values}
                    id={item.field}
                    required
                    name={item.field}
                    multiline
                    minRows={3}
                    maxRows={3}
                    InputLabelProps={{ shrink: true }}
                    error={!item.field && open}
                    helperText={!item.field && open ? `${item.label}是必填项` : ' '}
                    onChange={(e) => {
                        setOpen(true);
                        changeValue({ value: e.target.value });
                    }}
                    fullWidth
                />
            ) : item.style === 'SELECT' ? (
                <TextField
                    sx={mt}
                    size="small"
                    color="secondary"
                    value={values}
                    InputLabelProps={{ shrink: true }}
                    select
                    required
                    id={item.field}
                    name={item.field}
                    label={item.label}
                    error={!item.field && open}
                    helperText={!item.field && open ? `${item.label}是必填项` : ' '}
                    onChange={(e) => {
                        setOpen(true);
                        changeValue({ value: e.target.value });
                    }}
                    fullWidth
                >
                    {item.options.map((el: any) => (
                        <MenuItem key={el.value} value={el.value}>
                            {el.label}
                        </MenuItem>
                    ))}
                </TextField>
            ) : null}
        </div>
    );
};
export default Form;
