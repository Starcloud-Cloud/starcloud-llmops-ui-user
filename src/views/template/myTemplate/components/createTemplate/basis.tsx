import { useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import {
    Card,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    Chip,
    OutlinedInput,
    Box,
    Stack,
    FormHelperText
} from '@mui/material';
import { categoryTree } from 'api/template';
import { Tree, Popover, TreeSelect } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { t } from 'hooks/web/useI18n';
import { Anyevent } from 'types/template';
import { useFormik } from 'formik';
import marketStore from 'store/market';
import * as yup from 'yup';
import _ from 'lodash-es';
const validationSchema = yup.object({
    name: yup.string().required(t('myApp.isrequire')),
    category: yup.string().required(t('myApp.isrequire'))
});

const Basis = forwardRef(({ initialValues, setValues }: Anyevent, ref) => {
    const categoryList = marketStore((state) => state.categoryList);
    useImperativeHandle(ref, () => ({
        submit: () => {
            formik.handleSubmit();
            return Object.values(formik.errors).length > 0;
        }
    }));
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {}
    });
    const [cateTree, setCateTree] = useState<any[]>([]);
    useEffect(() => {
        //类别树
        categoryTree().then((res) => {
            const newData = _.cloneDeep(res);
            newData.forEach((item: any) => {
                item.disabled = true;
            });
            setCateTree(newData);
        });
    }, []);
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
                    name="description"
                    value={formik.values.description}
                    onChange={(e) => {
                        formik.handleChange(e);
                        setValues({ name: e.target.name, value: e.target.value });
                    }}
                    variant="outlined"
                />
                <div className=" relative mt-[16px]">
                    <TreeSelect
                        status={!formik.values.category ? 'error' : ''}
                        className="bg-[#f8fafc]  h-[51px] border border-solid border-[#697586ad] rounded-[6px]"
                        showSearch
                        style={{ width: '100%' }}
                        value={formik.values.category}
                        dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                        placeholder="Please select"
                        allowClear
                        treeCheckable={false}
                        treeDefaultExpandAll
                        onChange={(e) => {
                            formik.setFieldValue('category', e);
                            setValues({ name: 'category', value: e });
                        }}
                        onClear={() => {
                            formik.setFieldValue('category', '');
                            setValues({ name: 'category', value: '' });
                        }}
                        fieldNames={{
                            label: 'name',
                            value: 'code'
                        }}
                        treeData={cateTree}
                    />
                    <span
                        className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-5 text-[12px]"
                        style={{ color: !formik.values.category ? 'red' : '#697586' }}
                    >
                        类目*
                    </span>
                </div>
                <Stack sx={{ mt: 2 }}>
                    <Autocomplete
                        multiple
                        id="tags-filled"
                        options={[]}
                        defaultValue={formik.values.tags}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                            value.map((option: string, index: number) => (
                                <Chip key={index} label={option} onDelete={getTagProps({ index }).onDelete} />
                            ))
                        }
                        onChange={(e: any, newValue) => {
                            setValues({ name: 'tags', value: newValue });
                        }}
                        renderInput={(params: any) => <TextField name="tags" color="secondary" {...params} label={t('myApp.scense')} />}
                    />
                </Stack>
            </form>
        </Card>
    );
});
export default Basis;
