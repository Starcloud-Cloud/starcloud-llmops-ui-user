import { Grid, Box, Button, FormControl, OutlinedInput, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Space, Image, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { history } from 'api/picture/images';
import downLoadImages from 'hooks/useDownLoadImage';
import formatDate from 'hooks/useDate';
import ImageDetail from './detail';
import JSZip from 'jszip';

const ImageHistory = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [query, setQuery] = useState<{ scenes: any[]; status?: string | undefined }>({
        scenes: [searchParams.get('scene')]
    });
    const sceneList = [
        { label: '去除图片背景', value: 'IMAGE_REMOVE_BACKGROUND' },
        { label: '去除图片背景文字', value: 'IMAGE_REMOVE_TEXT' },
        { label: '图片质量提升', value: 'IMAGE_UPSCALING' },
        { label: '轮廓出图', value: 'IMAGE_SKETCH' },
        { label: '图片裂变', value: 'IMAGE_VARIANTS' }
    ];
    const columns: ColumnsType<any> = [
        {
            title: '类型',
            render: (_, row) => (
                <span>
                    {row.fromScene === 'IMAGE_REMOVE_BACKGROUND'
                        ? '去除图片背景'
                        : row.fromScene === 'IMAGE_REMOVE_TEXT'
                        ? '去除图片背景文字'
                        : row.fromScene === 'IMAGE_UPSCALING'
                        ? '图片质量提升'
                        : ''}
                </span>
            )
        },
        {
            title: '状态',
            render: (_, record) => (
                <Space size="middle">
                    <Tag color={record.status === 'SUCCESS' ? 'success' : 'error'}>{record.status === 'SUCCESS' ? '成功' : '失败'}</Tag>
                </Space>
            )
        },
        {
            title: '生成结果',
            render: (_, record) => (
                <Space size="middle">
                    {record?.imageInfo?.images?.map((item: any) => (
                        <Image
                            className="cursor-pointer"
                            onClick={() => {
                                setDetailData(record.imageInfo);
                                setDetailOpen(true);
                            }}
                            key={item.url}
                            preview={false}
                            width={50}
                            height={50}
                            src={item.url}
                        />
                    ))}
                </Space>
            )
        },
        { title: '创建时间', render: (_, row) => <span>{formatDate(row.createTime)}</span> },
        {
            title: '操作',
            width: '170px',
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            setDetailData(record.imageInfo);
                            setDetailOpen(true);
                        }}
                        disabled={record.status === 'ERROR'}
                        color="secondary"
                    >
                        详情
                    </Button>
                    <Button disabled={record.status === 'ERROR'} onClick={() => downLoad(record)} color="secondary">
                        下载
                    </Button>
                </>
            )
        }
    ];
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const onSelectChange = (newSelectedRowKeys: React.Key[], selected: any) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record: any) => ({
            disabled: record.status === 'ERROR' // Column configuration not to be checked
        })
    };
    const getList = async () => {
        setLoading(true);
        const res = await history({ pageNo: 1, pageSize: 1000, ...query });
        setLoading(false);
        setTableData(res.list);
    };
    useEffect(() => {
        getList();
    }, [query]);
    //下载图片
    const downLoad = (row: any) => {
        if (row?.imageInfo?.images?.length > 1) {
            const zip = new JSZip();
            const imageUrls = row?.imageInfo?.images.map((item: any) => item.url);
            console.log(imageUrls);

            // 异步加载图片并添加到压缩包
            const promises = imageUrls.map(async (imageUrl: string, index: number) => {
                const response = await fetch(imageUrl);
                const arrayBuffer = await response.arrayBuffer();
                zip.file(`下载${index + 1}.jpg`, arrayBuffer);
            });
            // 等待所有图片添加完成后创建压缩包并下载
            Promise.all(promises)
                .then(() => {
                    zip.generateAsync({ type: 'blob' }).then((content) => {
                        const url = window.URL.createObjectURL(content);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'images.zip'; // 设置下载的文件名
                        a.click();
                        window.URL.revokeObjectURL(url);
                    });
                })
                .catch((error) => {
                    console.error('Error downloading images:', error);
                });
        } else {
            downLoadImages(row?.imageInfo?.images[0].url, row?.imageInfo?.images[0].mediaType.split('/')[1]);
        }
    };
    const download = () => {
        const zip = new JSZip();
        const newData = tableData
            .filter((item: any) => {
                return selectedRowKeys.includes(item.uid);
            })
            .map((item: any) => item?.imageInfo?.images[0]?.url);
        // 异步加载图片并添加到压缩包
        const promises = newData.map(async (imageUrl, index) => {
            const response = await fetch(imageUrl);
            const arrayBuffer = await response.arrayBuffer();
            zip.file(`下载${index + 1}.jpg`, arrayBuffer);
        });
        // 等待所有图片添加完成后创建压缩包并下载
        Promise.all(promises)
            .then(() => {
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    const url = window.URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'images.zip'; // 设置下载的文件名
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            })
            .catch((error) => {
                console.error('Error downloading images:', error);
            });
    };
    //图片详情
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>({});
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                    <FormControl color="secondary" fullWidth>
                        <InputLabel id="demo-multiple-chip-label">类型</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            label="类型"
                            value={query.scenes}
                            onChange={(e: any) => {
                                setQuery({
                                    ...query,
                                    scenes: e.target.value
                                });
                            }}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip size="small" key={value} label={sceneList.filter((item) => item.value === value)[0]?.label} />
                                    ))}
                                </Box>
                            )}
                        >
                            {sceneList.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={3} xs={12}>
                    <FormControl color="secondary" fullWidth>
                        <InputLabel id="status">状态</InputLabel>
                        <Select
                            color="secondary"
                            labelId="status"
                            value={query.status}
                            label="状态"
                            onChange={(e: any) => {
                                setQuery({
                                    ...query,
                                    status: e.target.value
                                });
                            }}
                        >
                            <MenuItem value="SUCCESS">成功</MenuItem>
                            <MenuItem value="ERROR">失败</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Button
                onClick={download}
                disabled={selectedRowKeys.length === 0}
                sx={{ my: 1 }}
                size="small"
                variant="outlined"
                color="secondary"
            >
                批量下载
            </Button>
            <Table rowKey={'uid'} loading={loading} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
            {detailOpen && <ImageDetail detailOpen={detailOpen} detailData={detailData} handleClose={() => setDetailOpen(false)} />}
        </div>
    );
};
export default ImageHistory;
