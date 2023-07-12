import { useState } from 'react';
import {
    Box,
    Card,
    TextField,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    FormControl,
    InputLabel,
    Select,
    Chip,
    OutlinedInput,
    Typography
} from '@mui/material';
import { Anyevent } from 'types/template';
import { useFormik } from 'formik';
import * as yup from 'yup';
const validationSchema = yup.object({
    name: yup.string().required('Name is required')
});
function Basis({ initialValues, setValues }: Anyevent) {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {}
    });
    const [tabValue] = useState(0);
    // const changeTab = (event: React.SyntheticEvent, newValue: number) => {
    //     setTabValue(newValue);
    // };

    //场景
    const [personName, setPersonName] = useState([]);
    const names = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder'
    ];
    const handleChange = (event: any) => {
        const {
            target: { value }
        } = event;
        setPersonName(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <Card sx={{ padding: '16px 0' }}>
            {/* <Tabs sx={{ marginBottom: 2 }} value={tabValue} onChange={changeTab} aria-label="basic tabs example">
                <Tab label="Foundation" />
                <Tab label="Model" />
                <Tab label="Scene" />
            </Tabs> */}
            {tabValue === 0 && formik && (
                <form>
                    <TextField
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        value={formik?.values.name}
                        onChange={(e) => {
                            formik.handleChange(e);
                            setValues({ name: e.target.name, value: e.target.value });
                        }}
                        error={formik?.touched.name && Boolean(formik?.errors.name)}
                        helperText={formik?.touched.name && formik?.errors.name ? formik?.errors.name : ' '}
                        label="Template Name"
                        name="name"
                        placeholder="Please enter template name"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Template Description"
                        name="desc"
                        value={formik.values.desc}
                        onChange={(e) => {
                            formik.handleChange(e);
                            setValues({ name: e.target.name, value: e.target.value });
                        }}
                        placeholder="Please enter template description"
                        helperText={' '}
                        variant="outlined"
                    />
                </form>
            )}
            {tabValue === 1 && (
                <List>
                    <ListItem>
                        <ListItemText>模板版本号</ListItemText>
                        <ListItemSecondaryAction>1</ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemText>模板key</ListItemText>
                        <ListItemSecondaryAction>2</ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemText>模板Id</ListItemText>
                        <ListItemSecondaryAction>mubanId</ListItemSecondaryAction>
                    </ListItem>
                </List>
            )}
            {tabValue === 2 && (
                <FormControl fullWidth>
                    <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {names.map((item) => (
                            <MenuItem key={item} value={item} sx={{ display: 'block' }}>
                                <Typography variant="h4">{item}</Typography>
                                <Typography variant="body1">{item}111</Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Card>
    );
}
export default Basis;
