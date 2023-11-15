import {
    Modal as Modals,
    IconButton,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CardActions,
    Grid,
    Switch,
    Autocomplete,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import { UploadProps, Upload, Table, Button, Divider, Tabs, Popover, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import { imageTemplates } from 'api/template';
import { schemeCreate, schemeGet, schemeModify } from 'api/redBook/copywriting';
import StyleTabs from './styleTabs';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const AddModal = ({
    detailOpen,
    title,
    uid,
    setDetailOpen
}: {
    detailOpen: boolean;
    title: string;
    uid: string;
    setDetailOpen: (data: boolean) => void;
}) => {
    // 1.模板名称
    const [params, setParams] = useState<any>({});
    const [titleOpen, setTitleOpen] = useState(false);
    const [tagOpen, setTagOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const changeParams = (data: any) => {
        setParams({
            ...params,
            [data.name]: data.value
        });
    };
    //文案列表
    const [styleList, setStyleList] = useState<any[]>([]);
    //风格类型
    const [typeList, setTypeList] = useState<any[]>([]);
    const columns: ColumnsType<any> = [
        {
            title: '序号',
            render: (_, row, index) => <span>{index}</span>
        },
        {
            title: '参考标题',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: '参考内容',
            dataIndex: 'content',
            key: 'content'
        },
        {
            title: '参考图片',
            key: 'images',
            render: (_, row) => (
                <div className="flex wrap gap-2">
                    {row.images?.map((item: string, index: number) => (
                        <Image className="mr-[5px]" key={index} width={50} height={50} preview={false} src={item} />
                    ))}
                </div>
            )
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account'
        },
        {
            title: '账号链接',
            dataIndex: 'link',
            key: 'link'
        },
        {
            title: 'Action',

            key: 'action',
            render: (_, row, index) => (
                <div className="w-[150px]">
                    <Button
                        type="text"
                        onClick={() => {
                            setRowIndex(index);
                            setAccoutQuery({
                                ...row,
                                fileList: row?.images?.map((item: any) => {
                                    return {
                                        uid: uuidv4(),
                                        thumbUrl: item,
                                        response: {
                                            data: {
                                                url: item
                                            }
                                        }
                                    };
                                })
                            });
                            setAddTitle('编辑参考账号');
                            setAddOpen(true);
                        }}
                    >
                        编辑
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        onClick={() => {
                            const newList = JSON.parse(JSON.stringify(tableData));
                            newList.splice(rowIndex, 1);
                            setTableData(newList);
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
    const [addOpen, setAddOpen] = useState(false);
    const [rowIndex, setRowIndex] = useState(-1);
    const [tableData, setTableData] = useState<any[]>([]);
    //新增文案与风格
    const [activeKey, setActiveKey] = useState('1');
    const [focuActive, setFocuActive] = useState<any[]>([]);
    const [imageStyleData, setImageStyleData] = useState<any[]>([
        {
            name: '风格 1',
            key: '1',
            id: '1',
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

    //文案生成模板
    const [copyWritingTemplate, setCopyWritingTemplate] = useState<any>({});
    //modal
    const [addTitle, setAddTitle] = useState('');
    const [accoutQuery, setAccoutQuery] = useState<any>({});
    const [valueOpen, setValueOpen] = useState(false);
    const [contentOpen, setContentOpen] = useState(false);
    const props: UploadProps = {
        name: 'image',
        listType: 'picture-card',
        multiple: true,
        fileList: accoutQuery.fileList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/uploadLimitPixel`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange(info) {
            setAccoutQuery({
                ...accoutQuery,
                fileList: info.fileList
            });
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    useEffect(() => {
        imageTemplates().then((res) => {
            setTypeList(res);
        });
    }, []);
    useEffect(() => {
        if (!addOpen) {
            setValueOpen(false);
            setContentOpen(false);
            setAccoutQuery({});
        }
    }, [addOpen]);
    //改变值
    const changeAccoutQuery = (data: { name: string; value: number | string }) => {
        setAccoutQuery({
            ...accoutQuery,
            [data.name]: data.value
        });
    };
    useEffect(() => {
        if (uid) {
            schemeGet(uid).then((res) => {
                if (res) {
                    console.log(res);

                    setParams({
                        name: res.name,
                        category: res.category,
                        tags: res.tags,
                        type: res.type === 'USER' ? true : false,
                        description: res.description
                    });
                    setTableData(res.refers);
                    setCopyWritingTemplate(res.configuration.copyWritingTemplate);
                    setImageStyleData(res.configuration.imageTemplate.styleList);
                }
            });
        }
    }, [uid]);
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
                title={title}
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
                        <Grid md={12} sm={12}>
                            <TextField
                                sx={{ width: '300px', mt: 2 }}
                                size="small"
                                color="secondary"
                                InputLabelProps={{ shrink: true }}
                                label="方案名称"
                                name="name"
                                value={params.name}
                                error={!params.name && titleOpen}
                                helperText={!params.name && titleOpen ? '方案名称必填' : ''}
                                onChange={(e: any) => {
                                    setTitleOpen(true);
                                    changeParams(e.target);
                                }}
                            />
                        </Grid>
                        <Grid md={12} sm={12}>
                            <FormControl
                                key={params.category}
                                error={!params.category && categoryOpen}
                                sx={{ mt: 2 }}
                                color="secondary"
                                size="small"
                                fullWidth
                            >
                                <InputLabel id="categorys">类目</InputLabel>
                                <Select
                                    name="category"
                                    value={params.category}
                                    onChange={(e: any) => {
                                        setCategoryOpen(true);
                                        changeParams(e.target);
                                    }}
                                    labelId="categorys"
                                    label="类目"
                                >
                                    <MenuItem value={'类目 1'}>类目 1</MenuItem>
                                    <MenuItem value={'类目 2'}>类目 2</MenuItem>
                                    {/* {styleList?.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))} */}
                                </Select>
                                <FormHelperText>{!params.category && categoryOpen ? '类目必选' : ''}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid md={12} sm={12}>
                            <FormControl
                                key={params.tags}
                                error={(!params.tags || params.tags.length === 0) && categoryOpen}
                                sx={{ mt: 2 }}
                                color="secondary"
                                size="small"
                                fullWidth
                            >
                                <Autocomplete
                                    sx={{ mt: 2 }}
                                    multiple
                                    size="small"
                                    id="tags-filled"
                                    color="secondary"
                                    options={[]}
                                    defaultValue={params.tags}
                                    freeSolo
                                    renderTags={(value: readonly string[], getTagProps) =>
                                        value.map((option: string, index: number) => (
                                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
                                    }
                                    onChange={(e: any, newValue) => {
                                        changeParams({
                                            name: 'tags',
                                            value: newValue
                                        });
                                    }}
                                    renderInput={(param) => (
                                        <TextField
                                            error={(!params.tags || params.tags.length === 0) && categoryOpen}
                                            color="secondary"
                                            {...param}
                                            label="标签"
                                            placeholder="请输入标签然后回车"
                                        />
                                    )}
                                />
                                <FormHelperText>
                                    {(!params.tags || params.tags.length === 0) && tagOpen ? '标签最少输入一个' : ''}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid md={12} sm={12}>
                            <div className="flex items-center mt-[16px]">
                                <Switch
                                    color={'secondary'}
                                    checked={params.type}
                                    onClick={() => setParams({ ...params, type: !params.type })}
                                />{' '}
                                公开
                            </div>
                        </Grid>
                    </Grid>
                    <TextField
                        sx={{ mt: 2 }}
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={6}
                        size="small"
                        color="secondary"
                        InputLabelProps={{ shrink: true }}
                        label="备注"
                        name="description"
                        value={params.description}
                        onChange={(e: any) => {
                            changeParams(e.target);
                        }}
                    />
                    <div className="flex justify-between items-center mt-[20px]">
                        <div className="text-[18px] font-[600]">参考账号</div>
                        <Button
                            onClick={() => {
                                setAddTitle('新增参考账号');
                                setAddOpen(true);
                            }}
                            className="mb-[20px]"
                            type="primary"
                            icon={<PlusOutlined rev={undefined} />}
                        >
                            新增
                        </Button>
                    </div>
                    <Table scroll={{ y: 200 }} size="small" columns={columns} dataSource={tableData} />
                    <div className="text-[18px] font-[600] my-[20px]">生成配置</div>
                    <Tabs
                        activeKey={activeKey}
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
                                                checked={copyWritingTemplate.isPromoteMp}
                                                onClick={() =>
                                                    setCopyWritingTemplate({
                                                        ...copyWritingTemplate,
                                                        isPromoteMp: !copyWritingTemplate.isPromoteMp
                                                    })
                                                }
                                            />
                                            <TextField
                                                sx={{ width: '300px' }}
                                                size="small"
                                                color="secondary"
                                                InputLabelProps={{ shrink: true }}
                                                placeholder="请输入"
                                                name="mpCode"
                                                value={copyWritingTemplate.mpCode}
                                                onChange={(e: any) => {
                                                    setCopyWritingTemplate({
                                                        ...copyWritingTemplate,
                                                        mpCode: e.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center my-[20px]">
                                            <div className="text-[14px] font-[600]">文案生成要求</div>
                                            <Button onClick={() => {}} type="primary">
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
                                            name="demand"
                                            value={copyWritingTemplate.demand}
                                            onChange={(e: any) => {
                                                setCopyWritingTemplate({
                                                    ...copyWritingTemplate,
                                                    demand: e.target.value
                                                });
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
                                                    key: digui().toString(),
                                                    id: digui().toString(),
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
                                                    key: item.id,
                                                    children: (
                                                        <div>
                                                            <div className="bg-[#edf0f2]/80 rounded py-[12px] px-[16px] flex justify-between items-center">
                                                                {!focuActive[i] ? (
                                                                    <div
                                                                        className="cursor-pointer"
                                                                        onClick={() => {
                                                                            const newData = _.cloneDeep(focuActive);
                                                                            newData[i] = true;
                                                                            setFocuActive(newData);
                                                                        }}
                                                                    >
                                                                        {item.name}
                                                                    </div>
                                                                ) : (
                                                                    <TextField
                                                                        onBlur={(e) => {
                                                                            const newList = _.cloneDeep(focuActive);
                                                                            newList[i] = false;
                                                                            setFocuActive(newList);
                                                                            if (e.target.value) {
                                                                                const newData = _.cloneDeep(imageStyleData);
                                                                                newData[i].name = e.target.value;
                                                                                setImageStyleData(newData);
                                                                            }
                                                                        }}
                                                                        color="secondary"
                                                                        variant="standard"
                                                                    />
                                                                )}

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
                            title={addTitle}
                            content={false}
                            className="w-[80%] max-w-[700px]"
                            secondary={
                                <IconButton onClick={() => setAddOpen(false)} size="large" aria-label="close modal">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            }
                        >
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item md={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            label="参考标题"
                                            name="title"
                                            error={!accoutQuery.title && valueOpen}
                                            helperText={!accoutQuery.title && valueOpen ? '参考标题必填' : ''}
                                            value={accoutQuery.title}
                                            onChange={(e: any) => {
                                                setValueOpen(true);
                                                changeAccoutQuery(e.target);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            label="参考内容"
                                            name="content"
                                            error={!accoutQuery.content && contentOpen}
                                            helperText={!accoutQuery.content && contentOpen ? '参考标题必填' : ''}
                                            value={accoutQuery.content}
                                            onChange={(e: any) => {
                                                setContentOpen(true);
                                                changeAccoutQuery(e.target);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            label="小红书账号"
                                            name="account"
                                            value={accoutQuery.account}
                                            onChange={(e: any) => {
                                                changeAccoutQuery(e.target);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            label="小红书账号链接"
                                            name="link"
                                            value={accoutQuery.link}
                                            onChange={(e: any) => {
                                                changeAccoutQuery(e.target);
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Upload className="mt-[20px]" {...props}>
                                    <div>
                                        <PlusOutlined rev={undefined} />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Grid container justifyContent="flex-end">
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            if (!accoutQuery.title || !accoutQuery.content) {
                                                setValueOpen(true);
                                                setContentOpen(true);
                                            } else {
                                                console.log(accoutQuery.fileList);

                                                const newList = _.cloneDeep(tableData);
                                                const obj = {
                                                    ...accoutQuery,
                                                    images:
                                                        accoutQuery.fileList
                                                            ?.map((item: any) => item?.response?.data?.url)
                                                            ?.filter((el: any) => el !== undefined) || []
                                                };
                                                if (addTitle === '新增参考账号') {
                                                    newList.push(obj);
                                                    setTableData(newList);
                                                    setAddOpen(false);
                                                } else {
                                                    newList.splice(rowIndex, 1, obj);
                                                    setTableData(newList);
                                                    setAddOpen(false);
                                                }
                                            }
                                        }}
                                    >
                                        保存
                                    </Button>
                                </Grid>
                            </CardActions>
                        </MainCard>
                    </Modals>
                    <Divider />
                    <CardActions>
                        <Grid container justifyContent="flex-end">
                            <Button
                                type="primary"
                                onClick={() => {
                                    if (!params.name) {
                                        setTitleOpen(true);
                                        setCategoryOpen(true);
                                        setTagOpen(true);
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '方案名称必填',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'error'
                                                },
                                                close: false
                                            })
                                        );
                                        return false;
                                    }
                                    if (!params.category) {
                                        setTitleOpen(true);
                                        setCategoryOpen(true);
                                        setTagOpen(true);
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '类目必选',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'error'
                                                },
                                                close: false
                                            })
                                        );
                                        return false;
                                    }
                                    if (!params.tags || params.tags?.length === 0) {
                                        setTitleOpen(true);
                                        setCategoryOpen(true);
                                        setTagOpen(true);
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '标签最少输入一个',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'error'
                                                },
                                                close: false
                                            })
                                        );
                                        return false;
                                    }
                                    if (uid) {
                                        schemeModify({
                                            uid,
                                            ...params,
                                            type: params ? 'USER' : 'SYSTEM',
                                            refers: tableData,
                                            configuration: {
                                                copyWritingTemplate,
                                                imageTemplate: {
                                                    styleList: imageStyleData
                                                }
                                            }
                                        }).then((res) => {
                                            if (res) {
                                                setDetailOpen(false);
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: ' 编辑成功',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'success'
                                                        },
                                                        close: false
                                                    })
                                                );
                                            }
                                        });
                                        return false;
                                    }
                                    schemeCreate({
                                        ...params,
                                        type: params ? 'USER' : 'SYSTEM',
                                        refers: tableData,
                                        configuration: {
                                            copyWritingTemplate,
                                            imageTemplate: {
                                                styleList: imageStyleData
                                            }
                                        }
                                    }).then((res) => {
                                        if (res) {
                                            setDetailOpen(false);
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: ' 创建成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    close: false
                                                })
                                            );
                                        }
                                    });
                                }}
                            >
                                保存
                            </Button>
                        </Grid>
                    </CardActions>
                </CardContent>
            </MainCard>
        </Modals>
    );
};
export default AddModal;
