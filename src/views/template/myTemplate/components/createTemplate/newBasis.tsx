import { memo, useEffect, useState } from 'react';
import { Card, TextField, Autocomplete, Chip, Stack, FormControl, InputLabel, Select as Selects, MenuItem, Divider } from '@mui/material';
import { Select, Image } from 'antd';
import { categoryTree } from 'api/template';
import { TreeSelect } from 'antd';
import { t } from 'hooks/web/useI18n';
import useUserStore from 'store/user';
import _ from 'lodash-es';
import '../../index.css';
import { getTenant, ENUM_TENANT } from 'utils/permission';
export interface Anyevent {
    basisPre?: number;
    detail?: {
        name?: string;
        description?: string;
        category?: string;
        tags?: string[];
        example?: string;
        sort?: string;
        type?: string;
        icon?: string;
    };
    appModel: { label: string; value: string }[] | undefined;
    setValues: (data: { name: string; value: any }) => void;
}
const Basis = ({ basisPre, detail, appModel, setValues }: Anyevent) => {
    console.log(appModel);
    const { Option } = Select;
    const permissions = useUserStore((state) => state.permissions);
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
        setValues({ name: 'icon', value: icons });
    }, [icons]);
    useEffect(() => {
        if (detail?.category) {
            const data = categoryIcon.find((item) => {
                const newData = detail?.category?.slice(0, detail.category?.lastIndexOf('_'));
                if (getTenant() === ENUM_TENANT.AI) {
                    return item.code === newData;
                } else {
                    return item.icon === detail?.icon;
                }
            })?.icon;
            setIcon(data);
        }
    }, [detail?.category]);
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
    const [appNameOpen, setAppNameOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    useEffect(() => {
        if (basisPre) {
            setAppNameOpen(true);
            setCategoryOpen(true);
        }
    }, [basisPre]);
    return (
        <div className="h-[calc(100vh-325px)] overflow-y-auto mt-[-16px] pt-4">
            <TextField
                color="secondary"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={detail?.name}
                onChange={(e) => {
                    setAppNameOpen(true);
                    setValues({ name: e.target.name, value: e.target.value });
                }}
                error={!detail?.name && appNameOpen}
                helperText={!detail?.name && appNameOpen ? '应用名称必填' : ''}
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
                value={detail?.description}
                onChange={(e) => {
                    setValues({ name: e.target.name, value: e.target.value });
                }}
                variant="outlined"
            />
            <div className="relative mt-[16px]">
                <TreeSelect
                    className="bg-[#f8fafc]  h-[51px] border border-solid rounded-[6px] antdSel"
                    showSearch
                    style={{ width: '100%', borderColor: !detail?.category && categoryOpen ? '#f44336' : '#697586ad' }}
                    value={detail?.category}
                    dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                    allowClear
                    treeCheckable={false}
                    treeDefaultExpandAll
                    onChange={(e) => {
                        setCategoryOpen(true);
                        setValues({ name: 'category', value: e });
                    }}
                    onClear={() => {
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
                    style={{ color: !detail?.category && categoryOpen ? '#f44336' : '#697586' }}
                >
                    类目*
                </span>
            </div>
            <Stack sx={{ mt: 2 }}>
                <Autocomplete
                    multiple
                    id="tags-filled"
                    key={detail?.tags?.toString()}
                    options={[]}
                    defaultValue={detail?.tags}
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
                    <FormControl key={detail?.type} color="secondary" fullWidth className="mt-[16px]">
                        <InputLabel id="type">类型</InputLabel>
                        <Selects
                            value={detail?.type}
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
                        value={detail?.sort}
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
                value={detail?.example}
                onChange={(e) => {
                    setValues({ name: e.target.name, value: e.target.value });
                }}
                variant="outlined"
            />
        </div>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.basisPre) === JSON.stringify(nextProps?.basisPre) &&
        JSON.stringify(prevProps?.detail) === JSON.stringify(nextProps?.detail) &&
        JSON.stringify(prevProps?.appModel) === JSON.stringify(nextProps?.appModel)
    );
};
export default memo(Basis, arePropsEqual);
