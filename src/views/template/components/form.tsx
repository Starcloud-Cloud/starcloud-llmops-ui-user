import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function FormExecute({ form }: any) {
    console.log(form);

    return (
        <Box>
            <TextField
                value={form.value}
                label="Name"
                InputLabelProps={{ shrink: true }}
                helperText={form.des}
                placeholder={form.default ? form.default.toString() : form.default}
                fullWidth
            />
            <TextField
                value={form.value}
                select
                label={form.label}
                helperText={form.des}
                placeholder={form.default ? form.default.toString() : form.default}
                fullWidth
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </TextField>
        </Box>
    );
}
export default FormExecute;
