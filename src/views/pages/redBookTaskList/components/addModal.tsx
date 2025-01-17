import {
    Modal as Modals,
    IconButton,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CardActions,
    Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect, useState } from 'react';
import { UploadProps, Image, Upload, Table, Button, Divider, Row, Col, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import { listMarketAppOption, xhsApp, imageTemplates } from 'api/template';
import EditStyle from '../../batchSmallRedBooks/components/EditStyle';
import Form from '../../smallRedBook/components/form';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import { origin_url } from 'utils/axios/config';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const AddModal = ({ detailOpen, setDetailOpen }: { detailOpen: boolean; setDetailOpen: (data: boolean) => void }) => {
    // 1.模板名称
    const [valueOpen, setValueOpen] = useState(false);
    const [value, setValue] = useState('');

    // 2.批量上传图片
    const [open, setOpen] = useState(false);
    const [previewImage, setpreviewImage] = useState('');
    const [imageList, setImageList] = useState<any[]>([]);
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        fileList: imageList,
        action: `${origin_url}${process.env.REACT_APP_API_URL}/llm/image/upload`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 500,
        onChange(info) {
            console.log(info);

            setImageList(info.fileList);
        },
        onPreview: (file) => {
            setpreviewImage(file?.response?.data?.url);
            setOpen(true);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    //3
    const [addOpen, setAddOpen] = useState(false);
    //文案
    const [style, setStyle] = useState('');
    //文案列表
    const [styleList, setStyleList] = useState<any[]>([]);
    //文案变量
    const [variable, setVariable] = useState<any>(null);
    //修改文案变量
    const changeDetail = (data: any) => {
        const newData = _.cloneDeep(variable);
        newData.variables[data.index].value = data.value;
        setVariable(newData);
    };
    //风格类型
    const [typeList, setTypeList] = useState<any[]>([]);
    const columns: ColumnsType<any> = [
        {
            title: '文案名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '文案描述',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: 'Action',

            key: 'action',
            render: (_, row, index) => (
                <div className="w-[150px]">
                    <Button
                        type="text"
                        onClick={() => {
                            setEditOpen(index);
                            setAddOpen(true);
                            setStyle(row.id);
                            setVariable(row.variable);
                            setImageStyleData(row.config);
                        }}
                    >
                        编辑
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        onClick={() => {
                            const newList = JSON.parse(JSON.stringify(data));

                            newList.splice(index, 1);
                            setData(newList);
                        }}
                        danger
                        type="text"
                    >
                        删除
                    </Button>
                </div>
            )
        }
    ];
    const [data, setData] = useState<any[]>([]);
    const [editOpen, setEditOpen] = useState(-1);
    const getList = async () => {
        if (editOpen === -1) {
            const result = await listMarketAppOption({ tagType: 'XIAO_HONG_SHU_WRITING' });
            setStyle(result[0]?.value);
            setStyleList(result);
            // const res = await imageTemplates();
            // setTypeList(res);
        }
    };
    useEffect(() => {
        if (style) {
            xhsApp(style).then((res) => {
                setVariable(res);
            });
        }
    }, [style]);
    useEffect(() => {
        if (addOpen) {
            getList();
        } else {
            setStyle('');
            setActiveKey('0');
            setVariable(null);
            setImageStyleData([
                {
                    id: '',
                    name: '首图',
                    variables: []
                }
            ]);
        }
    }, [addOpen]);

    //新增文案与风格
    const [activeKey, setActiveKey] = useState('0');
    const [imageStyleData, setImageStyleData] = useState<any[]>([
        {
            id: '',
            name: '首图',
            variables: []
        }
    ]);
    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };
    const digui = () => {
        const newData = imageStyleData.map((item) => item.name.split(' ')[1]);
        if (newData.every((item) => !item)) {
            return 1;
        }
        return newData?.sort((a, b) => b - a)[0] * 1 + 1;
    };
    const add = () => {
        let newPanes = _.cloneDeep(imageStyleData);
        if (!newPanes) {
            newPanes = [];
        }
        newPanes.push({ id: '', name: `图片 ${digui()}`, key: digui(), variables: [] });
        setImageStyleData(newPanes);
    };
    const remove = (targetKey: TargetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        imageStyleData.forEach((item, i) => {
            if (i.toString() === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = imageStyleData.filter((item, i) => i.toString() !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = lastIndex.toString();
            } else {
                newActiveKey = '0';
            }
        }
        setImageStyleData(newPanes);
        setActiveKey(newActiveKey);
    };
    const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
    return (
        <Modals open={detailOpen} onClose={() => setDetailOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, -10%)',
                    maxHeight: '90%',
                    overflow: 'auto'
                }}
                title={'创建'}
                content={false}
                className="w-[80%] max-w-[1000px]"
                secondary={
                    <IconButton onClick={() => setDetailOpen(false)} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <div className="text-[18px] font-[600] my-[20px]">1. 模板名称</div>
                    <TextField
                        sx={{ width: '300px', mb: 2 }}
                        size="small"
                        color="secondary"
                        InputLabelProps={{ shrink: true }}
                        error={valueOpen && !value}
                        helperText={valueOpen && !value ? '模板名称必填' : ' '}
                        label="模板名称"
                        value={value}
                        onChange={(e: any) => {
                            setValueOpen(true);
                            setValue(e.target.value);
                        }}
                    />
                    <div className="text-[18px] font-[600] my-[20px]">2. 批量上传图片</div>
                    <div className="flex flex-wrap gap-[10px] h-[200px] overflow-y-auto shadow">
                        <Modals open={open} onClose={() => setOpen(false)}>
                            <MainCard
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    maxHeight: '80%',
                                    overflow: 'auto'
                                }}
                                content={false}
                                className="max-w-[900px]"
                                secondary={
                                    <IconButton onClick={() => setDetailOpen(false)} size="large" aria-label="close modal">
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <Image preview={false} alt="example" src={previewImage} />
                            </MainCard>
                        </Modals>
                        <div>
                            <Upload {...props}>
                                <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </div>
                    </div>
                    <div className="text-[18px] font-[600] my-[20px]">3.文案与风格</div>
                    <Modals
                        open={addOpen}
                        onClose={() => setAddOpen(false)}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <MainCard
                            style={{
                                position: 'absolute',
                                top: '10%',
                                left: '50%',
                                transform: 'translate(-50%, -10%)',
                                maxHeight: '80%',
                                overflow: 'auto'
                            }}
                            title={'创建'}
                            content={false}
                            className="w-[80%] max-w-[800px]"
                            secondary={
                                <IconButton onClick={() => setAddOpen(false)} size="large" aria-label="close modal">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            }
                        >
                            <CardContent>
                                <div className="text-[18px] font-[600] my-[20px]">1. 选择文案类型</div>
                                <FormControl color="secondary" size="small" fullWidth>
                                    <InputLabel id="wenan">选择文案</InputLabel>
                                    <Select value={style} labelId="wenan" label="选择文案">
                                        {styleList?.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <div className="mt-[20px]">
                                    <Row gutter={20}>
                                        {variable?.variables?.map((item: any, index: number) => (
                                            <Col key={index} sm={12} xs={24} md={6}>
                                                <Form changeValue={changeDetail} item={item} index={index} />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                                <div className="text-[18px] font-[600] my-[20px]">2. 图片风格选择</div>
                                <Tabs
                                    type="editable-card"
                                    onChange={onChange}
                                    activeKey={activeKey}
                                    onEdit={onEdit}
                                    items={imageStyleData.map((item: any, i: number) => {
                                        return {
                                            label: item.name,
                                            key: i.toString(),
                                            closable: i === 0 ? false : true,
                                            children: (
                                                <EditStyle
                                                    imageStyleData={item}
                                                    setData={(data: any) => {
                                                        const newData = _.cloneDeep(imageStyleData);
                                                        newData[i] = data;
                                                        setImageStyleData(newData);
                                                    }}
                                                    setCopyData={() => {}}
                                                    typeList={typeList}
                                                />
                                            )
                                        };
                                    })}
                                />
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Grid container justifyContent="flex-end">
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            if (variable?.variables.length > 0 && variable?.variables?.some((item: any) => !item.value)) {
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '文案变量必填',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        },
                                                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                        close: false
                                                    })
                                                );
                                                return false;
                                            }
                                            if (imageStyleData.some((item: any) => !item.id)) {
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '有风格未选择',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        },
                                                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                        close: false
                                                    })
                                                );
                                                return false;
                                            }
                                            const newList = _.cloneDeep(data);
                                            if (editOpen === -1) {
                                                newList.push({
                                                    id: style,
                                                    name: variable.name,
                                                    desc: variable.description,
                                                    variable: variable,
                                                    variables: variable.variables,
                                                    config: imageStyleData
                                                });
                                                setData(newList);
                                                setAddOpen(false);
                                            } else {
                                                newList[editOpen] = {
                                                    id: style,
                                                    name: variable.name,
                                                    desc: variable.description,
                                                    variable: variable,
                                                    variables: variable.variables,
                                                    config: imageStyleData
                                                };
                                                setData(newList);
                                                setAddOpen(false);
                                            }
                                        }}
                                    >
                                        保存
                                    </Button>
                                </Grid>
                            </CardActions>
                        </MainCard>
                    </Modals>
                    <Button
                        onClick={() => {
                            setEditOpen(-1);
                            setAddOpen(true);
                        }}
                        className="mb-[20px]"
                        type="primary"
                        icon={<PlusOutlined />}
                    >
                        新增
                    </Button>
                    <Table size="small" columns={columns} dataSource={data} />
                </CardContent>
            </MainCard>
        </Modals>
    );
};
export default AddModal;
