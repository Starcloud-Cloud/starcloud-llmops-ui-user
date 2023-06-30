import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

function Form({ item, onChange }: any) {
    const mt = {
        marginTop: 2
    };
    return (
        <Box>
            {item.style === 'INPUT' ? (
                <TextField
                    sx={mt}
                    label={item.label}
                    value={item.value || ''}
                    id={item.field}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => onChange(e.target)}
                    fullWidth
                />
            ) : item.style === 'TEXTAREA' ? (
                <TextField
                    sx={mt}
                    label={item.label}
                    value={item.value || ''}
                    id={item.field}
                    multiline
                    maxRows={4}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => onChange(e.target)}
                    fullWidth
                />
            ) : item.style === 'SELECT' ? (
                <TextField
                    sx={mt}
                    value={item.value || ''}
                    InputLabelProps={{ shrink: true }}
                    select
                    id={item.field}
                    name={item.field}
                    label={item.label}
                    onChange={(e) => onChange(e.target)}
                    fullWidth
                >
                    {item.options.map((el: any) => (
                        <MenuItem key={el.value} value={el.value}>
                            {el.label}
                        </MenuItem>
                    ))}
                </TextField>
            ) : null}
        </Box>
    );
}
export default Form;
