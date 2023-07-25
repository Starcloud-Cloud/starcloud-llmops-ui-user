import { useImperativeHandle, forwardRef } from 'react';
import { Card, TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip } from '@mui/material';
import { t } from 'hooks/web/useI18n';
import { Anyevent } from 'types/template';
import { useFormik } from 'formik';
import marketStore from 'store/market';
import * as yup from 'yup';
const validationSchema = yup.object({
    name: yup.string().required(t('myApp.isrequire')),
    categary: yup.string().required(t('myApp.isrequire'))
});

const Basis = forwardRef(({ initialValues, setValues }: Anyevent, ref) => {
    const categoryList = marketStore((state) => state.categoryList);

    useImperativeHandle(ref, () => ({
        submit: () => {
            formik.handleSubmit();
            return formik.isValid;
        }
    }));
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {}
    });

    return (
        <Card sx={{ overflow: 'visible' }}>
            <form>
                <TextField
                    color="secondary"
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
                    label={t('myApp.appName')}
                    name="name"
                    variant="outlined"
                />
                <TextField
                    sx={{ mt: 2 }}
                    color="secondary"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    minRows={6}
                    label={t('myApp.appDesc')}
                    name="desc"
                    value={formik.values.desc}
                    onChange={(e) => {
                        formik.handleChange(e);
                        setValues({ name: e.target.name, value: e.target.value });
                    }}
                    variant="outlined"
                />
                <FormControl fullWidth sx={{ my: 4 }}>
                    <InputLabel color="secondary" id="categories">
                        {t('myApp.categary')}
                    </InputLabel>
                    <Select
                        labelId="categories"
                        name="categories"
                        multiple
                        color="secondary"
                        value={formik.values.categories}
                        onChange={(e) => {
                            formik.handleChange(e);
                            setValues({ name: e.target.name, value: e.target.value });
                        }}
                        label={t('myApp.categary')}
                    >
                        {categoryList.map((item) => (
                            <MenuItem key={item.code} value={item.code}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Autocomplete
                    multiple
                    id="tags-filled"
                    options={[]}
                    defaultValue={formik.values.tags}
                    freeSolo
                    renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                            <Chip color="secondary" variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params: any) => <TextField color="secondary" {...params} variant="outlined" label={t('myApp.scense')} />}
                />
            </form>
        </Card>
    );
});
export default Basis;
