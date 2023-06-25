import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

function FormExecute({ formik, item }: any) {
    const mt = {
        marginTop: 2
    };
    return (
        <Box>
            {item.style === 'INPUT' ? (
                <TextField
                    sx={mt}
                    label={item.label}
                    value={formik.values[item.field]}
                    id={item.field}
                    required
                    InputLabelProps={{ shrink: true }}
                    placeholder={item.defaultValue !== undefined ? String(item.defaultValue) : ''}
                    error={formik.touched[item.field] && Boolean(formik.errors[item.field])}
                    helperText={
                        formik.touched[item.field] && formik.errors[item.field] ? String(formik.errors[item.field]) : item.description
                    }
                    onChange={formik.handleChange}
                    fullWidth
                />
            ) : item.style === '"TEXTAREA"' ? (
                <TextField
                    sx={mt}
                    label={item.label}
                    value={formik.values[item.field]}
                    id={item.field}
                    required
                    multiline
                    maxRows={4}
                    InputLabelProps={{ shrink: true }}
                    error={formik.touched[item.field] && Boolean(formik.errors[item.field])}
                    helperText={
                        formik.touched[item.field] && formik.errors[item.field] ? String(formik.errors[item.field]) : item.description
                    }
                    onChange={formik.handleChange}
                    fullWidth
                />
            ) : item.style === 'SELECT' ? (
                <TextField
                    sx={mt}
                    value={formik.values[item.field]}
                    InputLabelProps={{ shrink: true }}
                    select
                    required
                    id={item.field}
                    name={item.field}
                    label={item.label}
                    error={formik.touched[item.field] && Boolean(formik.errors[item.field])}
                    helperText={
                        formik.touched[item.field] && formik.errors[item.field] ? String(formik.errors[item.field]) : item.description
                    }
                    placeholder={item.defaultValue !== undefined ? String(item.defaultValue) : ''}
                    onChange={formik.handleChange}
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
export default FormExecute;
