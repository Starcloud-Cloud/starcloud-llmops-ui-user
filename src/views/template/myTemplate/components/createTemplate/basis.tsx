import { useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import { Card, TextField, Autocomplete, Chip, Stack, FormControl, InputLabel, Select as Selects, MenuItem, Divider } from '@mui/material';
import { Select, Image } from 'antd';
import { categoryTree } from 'api/template';
import { TreeSelect } from 'antd';
import { t } from 'hooks/web/useI18n';
import { Anyevent } from 'types/template';
import { useFormik } from 'formik';
import marketStore from 'store/market';
import useUserStore from 'store/user';
import * as yup from 'yup';
import _ from 'lodash-es';
import '../../index.css';
import { getTenant, ENUM_TENANT } from '../../../../../utils/permission';
const validationSchema = yup.object({
    name: yup.string().required(t('myApp.isrequire')),
    category: yup.string().required(t('myApp.isrequire'))
});

const Basis = forwardRef(({ basisPre, initialValues, appModel, sort, type, setValues, setDetail_icon }: Anyevent, ref) => {
    const { Option } = Select;
    const permissions = useUserStore((state) => state.permissions);
    useImperativeHandle(ref, () => ({
        submit: () => {
            formik.handleSubmit();
            const obj = {
                category: _.cloneDeep(formik.values).category,
                name: _.cloneDeep(formik.values).name,
                tags: _.cloneDeep(formik.values).tags,
                example: _.cloneDeep(formik.values).example
            };
            return Object.values(obj).some((value) => !value);
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
                if (getTenant() === ENUM_TENANT.AI) {
                    item.disabled = true;
                }
            });
            setCateTree(newData);
        });
    }, []);
    //选择icon
    const [icons, setIcon] = useState<string | undefined>('');
    useEffect(() => {
        setDetail_icon(icons);
    }, [icons]);
    useEffect(() => {
        if (formik.values.category) {
            const data = categoryIcon.find((item) => {
                const newData = formik.values.category.slice(0, formik.values.category?.lastIndexOf('_'));
                return item.code === newData;
            })?.icon;
            setIcon(data);
        }
    }, [formik.values.category]);
    const categoryIcon = [
        { icon: 'hot', name: '热门', code: 'HOT' },
        { icon: 'amazon', name: '亚马逊', code: 'AMAZON' },
        { icon: 'wal-mart', name: '沃尔玛', code: 'WAL_MART' },
        { icon: 'ebay', name: 'eBay', code: 'EBAY' },
        { icon: 'aliexpress', name: '速卖通', code: 'ALI_EXPRESS' },
        { icon: 'website', name: '独立站', code: 'WEBSITE' },
        { icon: 'social-media', name: '社交媒体', code: 'SOCIAL_MEDIA' },
        { icon: 'email', name: '邮件营销', code: 'EMAIL' },
        { icon: 'seo', name: 'SEO写作', code: 'SEO_WRITING' },
        { icon: 'other', name: '其他应用', code: 'OTHER' }
    ];
    useEffect(() => {
        formik.handleSubmit();
    }, [basisPre]);
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
                <div className="relative mt-[16px]">
                    <TreeSelect
                        className="bg-[#f8fafc]  h-[51px] border border-solid rounded-[6px] antdSel"
                        showSearch
                        style={{ width: '100%', borderColor: !formik.values.category ? '#f44336' : '#697586ad' }}
                        value={formik.values.category}
                        dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
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
                        className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-2 text-[12px]"
                        style={{ color: !formik.values.category ? '#f44336' : '#697586' }}
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
                {permissions.includes('app:operate:icon') && (
                    <div>
                        <Divider sx={{ mt: 2 }} />
                        <FormControl color="secondary" fullWidth className="mt-[16px]">
                            <InputLabel id="type">类型</InputLabel>
                            <Selects
                                value={type}
                                onChange={(e: any) => {
                                    setValues({ name: 'type', value: e.target.value });
                                }}
                                labelId="type"
                                label="类型"
                            >
                                {appModel?.map((item) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Selects>
                        </FormControl>
                        <TextField
                            color="secondary"
                            fullWidth
                            // required
                            sx={{ mt: 2 }}
                            InputLabelProps={{ shrink: true }}
                            // error={formik?.touched.name && Boolean(formik?.errors.name)}
                            // helperText={formik?.touched.name && formik?.errors.name ? formik?.errors.name : ''}
                            label="应用市场排序"
                            value={sort}
                            type="number"
                            onChange={(e: any) => {
                                setValues({ name: 'sort', value: e.target.value });
                            }}
                            variant="outlined"
                        />
                        <div className="relative">
                            <Select
                                onChange={(e) => {
                                    setIcon(e);
                                }}
                                value={icons}
                                className="h-[51px] mt-[16px] w-[100%] bg-[#f8fafc] border border-solid border-[#697586ad] rounded-[6px] antdSel"
                            >
                                {categoryIcon.map((item) => (
                                    <Option value={item.icon} label="China">
                                        <Image width={20} src={require('../../../../../assets/images/category/' + item.icon + '.svg')} />
                                        <span className="ml-[10px]">{item.name}</span>
                                    </Option>
                                ))}
                            </Select>
                            <span className=" block bg-[#fff] px-[5px] absolute top-[8px] left-2 text-[12px] text-[#697586]">图标*</span>
                        </div>
                    </div>
                )}
                <TextField
                    sx={{ mt: 2 }}
                    color="secondary"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    minRows={6}
                    label="示例"
                    name="example"
                    value={formik.values.example}
                    onChange={(e) => {
                        formik.handleChange(e);
                        setValues({ name: e.target.name, value: e.target.value });
                    }}
                    variant="outlined"
                />
            </form>
        </Card>
    );
});
export default Basis;
