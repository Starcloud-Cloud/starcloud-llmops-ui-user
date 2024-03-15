import { Table, Button, Tag, Image, Upload, UploadProps, Input } from 'antd';
import {
    Button as Buttons,
    Modal as Modals,
    IconButton,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    TextField,
    Autocomplete,
    Chip,
    CardActions,
    Divider
} from '@mui/material';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
import MainCard from 'ui-component/cards/MainCard';
import { Close } from '@mui/icons-material';
import { useState, useEffect, useRef, memo } from 'react';
import imgLoading from 'assets/images/picture/loading.gif';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { noteDetail } from 'api/redBook/copywriting';
import { getAccessToken } from 'utils/auth';
interface Table {
    code?: string;
    tableData: any[];
    sourceList: any[];
    setTableData: (data: any) => void;
    //弹框
    params: any;
}
const CreateTable = ({ code, tableData, sourceList, setTableData, params }: Table) => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const tableRef = useRef<any>(null);
    // const [columns,setColumns] = useState<any[]>([])
    const columns: ColumnsType<any> = [
        {
            title: '参考标题',
            align: 'center',
            dataIndex: 'title'
        },
        {
            title: '参考标签',
            align: 'center',
            render: (_, row) =>
                row?.tagList?.map((item: string) => (
                    <Tag color="blue" key={item}>
                        {item}
                    </Tag>
                ))
        },
        {
            title: '参考内容',
            align: 'center',
            width: '30%',
            dataIndex: 'content',
            render: (_, row) => <div className="line-clamp-3">{row.content}</div>
        },
        {
            title: '参考图片',
            align: 'center',
            render: (_, row) => (
                <div className="flex wrap gap-2">
                    {row.imageList?.map((item: any, index: number) => (
                        <Image className="mr-[5px]" key={index} width={30} height={30} preview={false} src={item.url} />
                    ))}
                </div>
            )
        },
        {
            title: '参考来源',
            align: 'center',
            width: 100,
            render: (_, row) => <div>{sourceList?.filter((item: any) => item.value === row.source)[0]?.label}</div>
        },
        {
            title: '参考链接地址',
            align: 'center',
            dataIndex: 'link',
            key: 'link'
        },
        {
            title: '操作',
            align: 'center',
            width: 140,
            key: 'action',
            render: (_, row, index) => (
                <div className="whitespace-nowrap">
                    <Buttons
                        color="secondary"
                        size="small"
                        onClick={() => {
                            setRowIndex(index);
                            setAccoutQuery({
                                ...row,
                                fileList: row?.imageList?.map((item: any) => {
                                    return {
                                        uid: uuidv4(),
                                        percent: 100,
                                        thumbUrl: item?.url,
                                        response: {
                                            data: {
                                                url: item?.url
                                            }
                                        }
                                    };
                                })
                            });
                            setImageContent(
                                row?.imageList?.map((item: any) => {
                                    return item.title;
                                })
                            );
                            setImageSubContent(
                                row?.imageList?.map((item: any) => {
                                    return item.subTitle;
                                })
                            );
                            setAddTitle(code === 'TitleActionHandler' ? '编辑参考标题' : '编辑参考内容');
                            setAddOpen(true);
                        }}
                    >
                        编辑
                    </Buttons>
                    <Buttons
                        onClick={() => {
                            const newList = JSON.parse(JSON.stringify(tableData));
                            newList.splice(rowIndex, 1);
                            setTableData(newList);
                        }}
                        color="error"
                        size="small"
                    >
                        删除
                    </Buttons>
                </div>
            )
        }
    ];
    const titColumns: ColumnsType<any> = [
        {
            title: '参考标题',
            align: 'center',
            dataIndex: 'title'
        },
        {
            title: '参考来源',
            align: 'center',
            width: '20%',
            render: (_, row) => <div>{sourceList?.filter((item: any) => item.value === row.source)[0]?.label}</div>
        },
        {
            title: '参考链接地址',
            align: 'center',
            width: '30%',
            dataIndex: 'link',
            key: 'link'
        },
        {
            title: '操作',
            width: 140,
            key: 'action',
            render: (_, row, index) => (
                <div className="whitespace-nowrap">
                    <Buttons
                        color="secondary"
                        size="small"
                        onClick={() => {
                            setRowIndex(index);
                            setAccoutQuery({
                                ...row,
                                fileList: row?.imageList?.map((item: any) => {
                                    return {
                                        uid: uuidv4(),
                                        percent: 100,
                                        thumbUrl: item?.url,
                                        response: {
                                            data: {
                                                url: item?.url
                                            }
                                        }
                                    };
                                })
                            });
                            setImageContent(
                                row?.imageList?.map((item: any) => {
                                    return item.title;
                                })
                            );
                            setImageSubContent(
                                row?.imageList?.map((item: any) => {
                                    return item.subTitle;
                                })
                            );
                            setAddTitle(code === 'TitleActionHandler' ? '编辑参考标题' : '编辑参考内容');
                            setAddOpen(true);
                        }}
                    >
                        编辑
                    </Buttons>
                    <Buttons
                        onClick={() => {
                            const newList = JSON.parse(JSON.stringify(tableData));
                            newList.splice(rowIndex, 1);
                            setTableData(newList);
                        }}
                        color="error"
                        size="small"
                    >
                        删除
                    </Buttons>
                </div>
            )
        }
    ];
    const otherColumns: ColumnsType<any> = [
        {
            title: '参考内容',
            align: 'center',
            dataIndex: 'content',
            render: (_, row) => <div className="line-clamp-3">{row.content}</div>
        },
        {
            title: '参考来源',
            width: '20%',
            align: 'center',
            render: (_, row) => <div>{sourceList?.filter((item: any) => item.value === row.source)[0]?.label}</div>
        },
        {
            title: '参考链接地址',
            align: 'center',
            width: '30%',
            dataIndex: 'link',
            key: 'link'
        },
        {
            title: '操作',
            width: 140,
            align: 'center',
            key: 'action',
            render: (_, row, index) => (
                <div className="whitespace-nowrap">
                    <Buttons
                        color="secondary"
                        size="small"
                        onClick={() => {
                            setRowIndex(index);
                            setAccoutQuery({
                                ...row,
                                fileList: row?.imageList?.map((item: any) => {
                                    return {
                                        uid: uuidv4(),
                                        percent: 100,
                                        thumbUrl: item?.url,
                                        response: {
                                            data: {
                                                url: item?.url
                                            }
                                        }
                                    };
                                })
                            });
                            setImageContent(
                                row?.imageList?.map((item: any) => {
                                    return item.title;
                                })
                            );
                            setImageSubContent(
                                row?.imageList?.map((item: any) => {
                                    return item.subTitle;
                                })
                            );
                            setAddTitle(code === 'TitleActionHandler' ? '编辑参考标题' : '编辑参考内容');
                            setAddOpen(true);
                        }}
                    >
                        编辑
                    </Buttons>
                    <Buttons
                        onClick={() => {
                            const newList = JSON.parse(JSON.stringify(tableData));
                            newList.splice(rowIndex, 1);
                            setTableData(newList);
                        }}
                        color="error"
                        size="small"
                    >
                        删除
                    </Buttons>
                </div>
            )
        }
    ];
    const [addOpen, setAddOpen] = useState(false);
    const [addTitle, setAddTitle] = useState('');
    const [rowIndex, setRowIndex] = useState(0);
    const [accoutQuery, setAccoutQuery] = useState<any>({});
    const [tagOpen, setTagOpenOpen] = useState(false);
    const [sourceOpen, setSourceOpen] = useState(false);
    const [valueOpen, setValueOpen] = useState(false);
    const [contentOpen, setContentOpen] = useState(false);
    const [linkLoading, setLinkLoading] = useState(false);
    const [imageConent, setImageContent] = useState<any[]>([]);
    const [imageSubConent, setImageSubContent] = useState<any[]>([]);
    const changeAccoutQuery = (data: { name: string; value: number | string | string[] }) => {
        setAccoutQuery({
            ...accoutQuery,
            [data.name]: data.value
        });
    };
    useEffect(() => {
        if (!addOpen) {
            setValueOpen(false);
            setContentOpen(false);
            setAccoutQuery({
                source: 'SMALL_RED_BOOK'
            });
            setImageContent([]);
            setImageSubContent([]);
        }
    }, [addOpen]);
    const props: UploadProps = {
        name: 'image',
        listType: 'picture-card',
        multiple: true,
        showUploadList: false,
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
    const verify = () => {
        if (code) {
            if (code === 'TitleActionHandler') {
                return !accoutQuery.title || !accoutQuery.source;
            } else {
                return !accoutQuery.content || !accoutQuery.source;
            }
        } else {
            return !accoutQuery.title || !accoutQuery.content || !accoutQuery.source;
        }
    };
    return (
        <>
            <div className="flex justify-end">
                <Button
                    onClick={() => {
                        setAddTitle(code === 'TitleActionHandler' ? '新增参考标题' : '新增参考内容');
                        setAddOpen(true);
                    }}
                    className="mb-[20px]"
                    type="primary"
                    icon={<PlusOutlined rev={undefined} />}
                >
                    新增
                </Button>
            </div>
            <Table
                pagination={{
                    current,
                    pageSize,
                    total: tableData?.length || 0,
                    showSizeChanger: true,
                    pageSizeOptions: [20, 50, 100],
                    onChange: (data) => {
                        setCurrent(data);
                    },
                    onShowSizeChange: (data, size) => {
                        setPageSize(size);
                    }
                }}
                rowKey={'title'}
                scroll={{ y: 500 }}
                size="small"
                columns={!code ? columns : code === 'TitleActionHandler' ? titColumns : otherColumns}
                dataSource={tableData}
            />
            <Modals open={addOpen} onClose={() => setAddOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
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
                            <Close fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item md={12}>
                                <FormControl error={sourceOpen && !accoutQuery.source} size="small" color="secondary" fullWidth>
                                    <InputLabel id="sources">参考来源</InputLabel>
                                    <Select
                                        labelId="sources"
                                        value={accoutQuery.source}
                                        label="参考来源"
                                        name="source"
                                        onChange={(e) => {
                                            setSourceOpen(true);
                                            changeAccoutQuery(e.target);
                                        }}
                                    >
                                        {sourceList.map((item) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{sourceOpen && !accoutQuery.source ? '参考来源必选' : ''}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    InputLabelProps={{ shrink: true }}
                                    label="参考链接地址"
                                    name="link"
                                    value={accoutQuery.link}
                                    onChange={(e: any) => {
                                        changeAccoutQuery(e.target);
                                    }}
                                />
                                {accoutQuery.source === 'SMALL_RED_BOOK' && (
                                    <Button
                                        loading={linkLoading}
                                        onClick={() => {
                                            const str = /^https:\/\/www\.xiaohongshu\.com\/explore\/[a-zA-Z0-9]{24}$/;
                                            if (!str.test(accoutQuery.link)) {
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message:
                                                            '参考链接地址格式错误，请填写https://www.xiaohongshu.com/explore/24位数字或字母',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        },
                                                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                        transition: 'SlideDown',
                                                        close: false
                                                    })
                                                );
                                                return false;
                                            }
                                            setLinkLoading(true);
                                            try {
                                                noteDetail({ noteUrl: accoutQuery.link })
                                                    .then((res) => {
                                                        setLinkLoading(false);
                                                        if (res) {
                                                            if (!code) {
                                                                setAccoutQuery({
                                                                    ...accoutQuery,
                                                                    content: res.desc,
                                                                    title: res.title,
                                                                    tagList: res.tagList?.map((item: any) => item.name)
                                                                });
                                                            } else {
                                                                if (code === 'TitleActionHandler') {
                                                                    setAccoutQuery({
                                                                        ...accoutQuery,
                                                                        title: res.title
                                                                    });
                                                                } else {
                                                                    setAccoutQuery({
                                                                        ...accoutQuery,
                                                                        content: res.desc
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    })
                                                    .catch((err) => {
                                                        setLinkLoading(false);
                                                    });
                                            } catch (err) {
                                                setLinkLoading(false);
                                            }
                                        }}
                                        className="ml-[10px]"
                                        type="primary"
                                    >
                                        {code === 'TitleActionHandler' ? '提取链接标题' : '提取链接内容'}
                                    </Button>
                                )}
                            </Grid>
                            {(!code || (code && code === 'TitleActionHandler')) && (
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
                            )}
                            {!code && (
                                <Grid item md={12}>
                                    <FormControl key={accoutQuery.tagList} color="secondary" fullWidth>
                                        <Autocomplete
                                            multiple
                                            size="small"
                                            id="tags-filled"
                                            color="secondary"
                                            options={[]}
                                            defaultValue={accoutQuery.tagList}
                                            freeSolo
                                            renderTags={(value: readonly string[], getTagProps) =>
                                                value.map((option: string, index: number) => (
                                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                                ))
                                            }
                                            onChange={(e: any, newValue) => {
                                                changeAccoutQuery({
                                                    name: 'tagList',
                                                    value: newValue
                                                });
                                            }}
                                            renderInput={(param) => (
                                                <TextField
                                                    onBlur={(e: any) => {
                                                        if (e.target.value) {
                                                            let newValue = accoutQuery.tagList;
                                                            if (!newValue) {
                                                                newValue = [];
                                                            }
                                                            newValue.push(e.target.value);
                                                            changeAccoutQuery({
                                                                name: 'tagList',
                                                                value: newValue
                                                            });
                                                        }
                                                    }}
                                                    color="secondary"
                                                    {...param}
                                                    label="参考标签"
                                                    placeholder="请输入标签然后回车"
                                                />
                                            )}
                                        />
                                        <FormHelperText>
                                            {(!params.tags || params.tags.length === 0) && tagOpen ? '标签最少输入一个' : ''}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                            )}
                            {(!code || (code && code !== 'TitleActionHandler')) && (
                                <Grid item md={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        sx={{
                                            '& textarea': {
                                                borderRadius: '0 !important'
                                            }
                                        }}
                                        minRows={4}
                                        maxRows={6}
                                        color="secondary"
                                        InputLabelProps={{ shrink: true }}
                                        label="参考内容"
                                        name="content"
                                        error={!accoutQuery.content && contentOpen}
                                        helperText={!accoutQuery.content && contentOpen ? '参考内容必填' : ''}
                                        value={accoutQuery.content}
                                        onChange={(e: any) => {
                                            setContentOpen(true);
                                            changeAccoutQuery(e.target);
                                        }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        {!code && (
                            <div className="flex flex-wrap gap-2 my-[20px]">
                                {accoutQuery.fileList?.map((item: any, index: number) => (
                                    <div key={index}>
                                        <div className="rounded-[8px] border border-solid border-[#d9d9d9] p-[8px]">
                                            <div className="relative w-[160px] h-[160px]">
                                                <Image
                                                    width={160}
                                                    height={160}
                                                    src={item?.response?.data?.url}
                                                    preview={false}
                                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                                />
                                                {item?.percent !== 100 && (
                                                    <div className="absolute bg-[#f3f3f3] top-0 w-full h-full flex justify-center items-center">
                                                        <Image className="!w-[20px] !h-[20px]" src={imgLoading} preview={false} />
                                                    </div>
                                                )}
                                                {item?.percent === 100 && item?.response?.data?.url && (
                                                    <div className="absolute top-0 w-full h-full flex justify-center items-center hover:bg-[#000]/20 text-transparent hover:text-[#ff4d4f]">
                                                        <DeleteOutlined
                                                            onClick={() => {
                                                                const newData = _.cloneDeep(accoutQuery);
                                                                newData.fileList?.splice(index, 1);
                                                                setAccoutQuery(newData);
                                                            }}
                                                            rev={undefined}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {item?.percent === 100 && item?.response?.data?.url && (
                                            <>
                                                <Input
                                                    value={imageConent[index]}
                                                    onChange={(e) => {
                                                        const newList = _.cloneDeep(imageConent);
                                                        newList[index] = e.target.value;
                                                        setImageContent(newList);
                                                    }}
                                                    placeholder="图片标题"
                                                    className="mt-[8px] w-[178px] block"
                                                />
                                                <Input
                                                    value={imageSubConent[index]}
                                                    onChange={(e) => {
                                                        const newList = _.cloneDeep(imageSubConent);
                                                        newList[index] = e.target.value;
                                                        setImageSubContent(newList);
                                                    }}
                                                    placeholder="图片副标题"
                                                    className="mt-[8px] w-[178px]"
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                                <Upload className="inline-block uploads" {...props}>
                                    <div>
                                        <PlusOutlined rev={undefined} />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </div>
                        )}
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Grid container justifyContent="flex-end">
                            <Button
                                type="primary"
                                onClick={() => {
                                    if (verify()) {
                                        setSourceOpen(true);
                                        setValueOpen(true);
                                        setContentOpen(true);
                                    } else {
                                        const newList = _.cloneDeep(tableData);
                                        const obj = {
                                            ...accoutQuery,
                                            fileList: undefined,
                                            imageList:
                                                accoutQuery.fileList
                                                    ?.map((item: any, i: number) => {
                                                        if (item?.response?.data?.url) {
                                                            return {
                                                                url: item?.response?.data?.url,
                                                                title: imageConent[i],
                                                                subTitle: imageSubConent[i]
                                                            };
                                                        } else {
                                                            return undefined;
                                                        }
                                                    })
                                                    ?.filter((el: any) => el !== undefined) || []
                                        };
                                        if (addTitle === '新增参考标题' || addTitle === '新增参考内容') {
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
        </>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return JSON.stringify(prevProps?.tableData) === JSON.stringify(nextProps?.tableData);
};
export default memo(CreateTable, arePropsEqual);
