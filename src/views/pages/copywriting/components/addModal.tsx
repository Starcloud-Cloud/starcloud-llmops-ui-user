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
    Grid,
    Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import { UploadProps, Image, Upload, Table, Button, Divider, Row, Col, Tabs, Popover } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import { listMarketAppOption, xhsApp, imageTemplates } from 'api/template';
import EditStyle from '../../batchSmallRedBooks/components/EditStyle';
import Form from '../../smallRedBook/components/form';
import StyleTabs from './styleTabs';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const AddModal = ({ detailOpen, setDetailOpen }: { detailOpen: boolean; setDetailOpen: (data: boolean) => void }) => {
    // 1.模板名称
    const [params, setParams] = useState<any>({});
    const changeParams = (data: any) => {
        setParams({
            ...params,
            [data.name]: data.value
        });
    };

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
            title: '序号',
            render: (_, row, index) => <span>{index}</span>
        },
        {
            title: '参考标题',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '参考内容',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: '参考图片',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: '账号',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: '账号链接',
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
            const res = await imageTemplates();
            setTypeList(res);
        }
    };
    useEffect(() => {
        if (style) {
            xhsApp(style).then((res) => {
                setVariable(res);
            });
        }
    }, [style]);
    // useEffect(() => {
    //     if (addOpen) {
    //         getList();
    //     } else {
    //         setStyle('');
    //         setActiveKey('0');
    //         setVariable(null);
    //         setImageStyleData([
    //             {
    //                 id: '',
    //                 name: '首图',
    //                 variables: []
    //             }
    //         ]);
    //     }
    // }, [addOpen]);

    //新增文案与风格
    const [activeKey, setActiveKey] = useState('1');

    const [imageStyleData, setImageStyleData] = useState<any[]>([
        {
            name: '风格 1',
            key: '1',
            templateList: [
                {
                    key: '1',
                    name: '首图',
                    variables: []
                }
            ]
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
        newPanes.push({ name: `图片 ${digui()}`, key: digui(), variables: [] });
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
                    <Grid sx={{ ml: 0 }} container spacing={2}>
                        <Grid md={4} sm={12}>
                            <TextField
                                sx={{ width: '300px', mt: 2 }}
                                size="small"
                                color="secondary"
                                InputLabelProps={{ shrink: true }}
                                label="方案名称"
                                name="name"
                                value={params.value}
                                onChange={(e: any) => {
                                    changeParams(e.target);
                                }}
                            />
                        </Grid>
                        <Grid md={4} sm={12}>
                            <FormControl sx={{ mt: 2, width: '300px' }} color="secondary" size="small" fullWidth>
                                <InputLabel id="category">类目</InputLabel>
                                <Select
                                    name="category"
                                    value={params.category}
                                    onChange={(e: any) => changeParams(e.target)}
                                    labelId="category"
                                    label="类目"
                                >
                                    {styleList?.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid md={4} sm={12}>
                            <TextField
                                sx={{ width: '300px', mt: 2 }}
                                size="small"
                                color="secondary"
                                InputLabelProps={{ shrink: true }}
                                label="标签"
                                name="tag"
                                value={params.tag}
                                onChange={(e: any) => {
                                    changeParams(e.target);
                                }}
                            />
                        </Grid>
                        <Grid md={4} sm={12}>
                            <div className="flex items-center mt-[16px]">
                                <Switch
                                    color={'secondary'}
                                    checked={params.all}
                                    onClick={() => setParams({ ...params, all: !params.all })}
                                />{' '}
                                公开
                            </div>
                        </Grid>
                    </Grid>
                    <TextField
                        sx={{ width: '300px', mt: 2 }}
                        multiline
                        minRows={4}
                        maxRows={6}
                        size="small"
                        color="secondary"
                        InputLabelProps={{ shrink: true }}
                        label="备注"
                        name="desc"
                        value={params.desc}
                        onChange={(e: any) => {
                            changeParams(e.target);
                        }}
                    />
                    <div className="flex justify-between items-center">
                        <div className="text-[18px] font-[600] my-[20px]">参考账号</div>
                        <Button
                            onClick={() => {
                                setEditOpen(-1);
                                setAddOpen(true);
                            }}
                            className="mb-[20px]"
                            type="primary"
                            icon={<PlusOutlined rev={undefined} />}
                        >
                            新增
                        </Button>
                    </div>
                    <Table size="small" columns={columns} dataSource={data} />
                    <div className="text-[18px] font-[600] my-[20px]">生成配置</div>
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: '1',
                                label: '文案生成模板',
                                children: (
                                    <div>
                                        <div className="text-[14px] font-[600] mb-[20px]">是否推广微信公众号</div>
                                        <div className="flex items-center">
                                            <Switch
                                                color={'secondary'}
                                                checked={params.all}
                                                onClick={() => setParams({ ...params, all: !params.all })}
                                            />
                                            <TextField
                                                sx={{ width: '300px' }}
                                                size="small"
                                                color="secondary"
                                                InputLabelProps={{ shrink: true }}
                                                placeholder="请输入"
                                                name="desc"
                                                value={params.desc}
                                                onChange={(e: any) => {
                                                    changeParams(e.target);
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-[14px] font-[600] my-[20px]">文案生成要求</div>
                                            <Button
                                                onClick={() => {}}
                                                className="mb-[20px]"
                                                type="primary"
                                                icon={<PlusOutlined rev={undefined} />}
                                            >
                                                自动分析，生成要求
                                            </Button>
                                        </div>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            maxRows={6}
                                            size="small"
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            name="desc"
                                            value={params.desc}
                                            onChange={(e: any) => {
                                                changeParams(e.target);
                                            }}
                                        />
                                        <div className="text-[14px] font-[600] my-[20px]">文案生成参数</div>
                                        <Grid container spacing={2}>
                                            <Grid item md={4}>
                                                <TextField
                                                    sx={{ mb: 2 }}
                                                    fullWidth
                                                    size="small"
                                                    color="secondary"
                                                    InputLabelProps={{ shrink: true }}
                                                    name="desc"
                                                    label="参数1"
                                                    value={params.desc}
                                                    onChange={(e: any) => {}}
                                                />
                                            </Grid>
                                            <Grid item md={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    color="secondary"
                                                    InputLabelProps={{ shrink: true }}
                                                    name="desc"
                                                    label="参数2"
                                                    value={params.desc}
                                                    onChange={(e: any) => {}}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Button
                                            onClick={() => {}}
                                            className="mb-[20px]"
                                            type="primary"
                                            icon={<PlusOutlined rev={undefined} />}
                                        >
                                            测试生成
                                        </Button>
                                    </div>
                                )
                            },
                            {
                                key: '2',
                                label: '图片生成模板',
                                children: (
                                    <div>
                                        <Button
                                            className="mb-[20px]"
                                            onClick={() => {
                                                const newData = _.cloneDeep(imageStyleData);
                                                newData.push({
                                                    name: `风格 ${digui()}`,
                                                    key: digui(),
                                                    templateList: [
                                                        {
                                                            key: '1',
                                                            name: '首图',
                                                            variables: []
                                                        }
                                                    ]
                                                });
                                                setImageStyleData(newData);
                                            }}
                                            type="primary"
                                            icon={<PlusOutlined rev={undefined} />}
                                        >
                                            增加风格
                                        </Button>
                                        <Tabs
                                            tabPosition="left"
                                            items={imageStyleData.map((item, i) => {
                                                return {
                                                    label: item.name,
                                                    key: item.key,
                                                    children: (
                                                        <div>
                                                            <div className="bg-[#edf0f2]/80 rounded py-[12px] px-[16px] flex justify-between items-center">
                                                                <div className="cursor-pointer">{item.name}</div>
                                                                <div>
                                                                    <Popover
                                                                        zIndex={9999}
                                                                        content={
                                                                            <Button
                                                                                onClick={(e: any) => {
                                                                                    const newData = _.cloneDeep(imageStyleData);
                                                                                    newData.splice(i, 1);
                                                                                    setImageStyleData(newData);
                                                                                    e.stopPropagation();
                                                                                }}
                                                                                danger
                                                                                icon={<DeleteOutlined rev={undefined} />}
                                                                            >
                                                                                删除
                                                                            </Button>
                                                                        }
                                                                        trigger="click"
                                                                    >
                                                                        <IconButton size="small" onClick={(e: any) => e.stopPropagation()}>
                                                                            <MoreVertIcon />
                                                                        </IconButton>
                                                                    </Popover>
                                                                </div>
                                                            </div>
                                                            <StyleTabs
                                                                imageStyleData={item?.templateList}
                                                                typeList={typeList}
                                                                setDetailData={(data: any) => {
                                                                    const newData = _.cloneDeep(imageStyleData);
                                                                    newData[i].templateList = data;
                                                                    setImageStyleData(newData);
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                };
                                            })}
                                        />
                                    </div>
                                )
                            }
                        ]}
                        onChange={onChange}
                    />
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
                </CardContent>
            </MainCard>
        </Modals>
    );
};
export default AddModal;
