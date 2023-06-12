import { useState } from 'react';
import { Box, Card, Tab, Tabs, TextField, MenuItem } from '@mui/material';

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
            topics: ''
        },
        validationSchema,
        onSubmit: () => {
            console.log(111);
        }
    });
    const [tabValue, setTabValue] = useState(0);
    const changeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    interface TabPanelProps {
        children?: React.ReactNode;
        dir?: string;
        index: number;
        value: number;
    }
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }
    return (
        <Card sx={{ color: '$store.state.card_color', elevation: 5, padding: '10px', margin: '10px' }}>
            <Tabs value={tabValue} onChange={changeTab} aria-label="basic tabs example">
                <Tab label="Foundation" />
                <Tab label="Model" />
                <Tab label="Scene" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
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
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                Item Three
            </TabPanel>
        </Card>
    );
}
export default Basis;
