import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
const Form = ({ item, index, changeValue, flag }: { item: any; index: number; changeValue: any; flag?: boolean }) => {
    const mt = {
        marginTop: 2
    };
    const [open, setOpen] = useState(false);
    return (
        <div>
            {item.style === 'INPUT' ? (
                <>
                    <TextField
                        color="secondary"
                        size="small"
                        sx={mt}
                        label={item.label}
                        defaultValue={item.value}
                        placeholder={item.defaultValue}
                        id={item.field}
                        required
                        name={item.field}
                        InputLabelProps={{ shrink: true }}
                        error={!item.value && open && !flag}
                        helperText={!item.value && open && !flag ? `${item.label}是必填项` : ''}
                        onBlur={(e) => {
                            setOpen(true);
                            changeValue({ index, value: e.target.value });
                        }}
                        fullWidth
                    />
                </>
            ) : item.style === 'TEXTAREA' ? (
                <TextField
                    color="secondary"
                    size="small"
                    sx={mt}
                    label={item.label}
                    defaultValue={item.value}
                    placeholder={item.defaultValue}
                    id={item.field}
                    required
                    name={item.field}
                    multiline
                    minRows={3}
                    maxRows={3}
                    InputLabelProps={{ shrink: true }}
                    error={!item.value && open && !flag}
                    helperText={!item.value && open && !flag ? `${item.label}是必填项` : ''}
                    onBlur={(e) => {
                        setOpen(true);
                        changeValue({ index, value: e.target.value });
                    }}
                    fullWidth
                />
            ) : item.style === 'SELECT' ? (
                <TextField
                    sx={mt}
                    size="small"
                    color="secondary"
                    value={item.value}
                    placeholder={item.defaultValue}
                    InputLabelProps={{ shrink: true }}
                    select
                    required
                    id={item.field}
                    name={item.field}
                    label={item.label}
                    error={!item.value && open && !flag}
                    helperText={!item.value && open && !flag ? `${item.label}是必填项` : ''}
                    onChange={(e) => {
                        setOpen(true);
                        changeValue({ index, value: e.target.value });
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
