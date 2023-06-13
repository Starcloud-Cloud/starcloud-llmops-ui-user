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

import { useFormik } from 'formik';
import * as yup from 'yup';
const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    topics: yup.string().required('Topics is required')
});

function Basis() {
    const formik = useFormik({
        initialValues: {
            name: '',
            desc: '',
            topics: ''
        },
        validationSchema,
        onSubmit: () => {
            console.log(111);
        }
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
            {tabValue === 0 && (
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ' '}
                        label="Template Name"
                        id="name"
                        placeholder="Please enter template name"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="Template Description"
                        id="desc"
                        value={formik.values.desc}
                        onChange={formik.handleChange}
                        placeholder="Please enter template description"
                        helperText={' '}
                        variant="outlined"
                    />
                    <TextField
                        value={formik.values.topics}
                        InputLabelProps={{ shrink: true }}
                        select
                        required
                        name="topics"
                        error={formik.touched.topics && Boolean(formik.errors.topics)}
                        helperText={formik.touched.topics && formik.errors.topics ? formik.errors.topics : ' '}
                        onChange={formik.handleChange}
                        fullWidth
                    >
                        {/* {item.options.map((el: any) => ( */}
                        <MenuItem value={1}>2</MenuItem>
                        <MenuItem value={2}>3</MenuItem>
                        {/* ))} */}
                    </TextField>
                    <button
                        onClick={() => {
                            formik.handleSubmit();
                            console.log(formik);
                        }}
                    >
                        1111
                    </button>
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
