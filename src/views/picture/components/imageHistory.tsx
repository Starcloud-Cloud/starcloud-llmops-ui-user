import { Modal, IconButton, CardContent, Grid, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import { useState, useEffect } from 'react';
import { Table, Space, Image, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { history } from 'api/picture/images';
import downLoadImages from 'hooks/useDownLoadImage';
import ImageDetail from './detail';

const ImageHistory = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const columns: ColumnsType<any> = [
        { title: '类型', dataIndex: 'type' },
        {
            title: '状态',
            render: (_, record) => (
                <Space size="middle">
                    <Tag color="success">成功</Tag>
                </Space>
            )
        },
        {
            title: '生成结果',
            render: (_, record) => (
                <Space size="middle">
                    {record.images.map((item: any) => (
                        <Image key={item.url} preview={false} width={50} src={item.url} />
                    ))}
                </Space>
            )
        },
        { title: '创建时间', dataIndex: 'type' },
        {
            title: '操作',
            width: '170px',
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            setDetailData(record);
                            setDetailOpen(true);
                        }}
                        color="secondary"
                    >
                        详情
                    </Button>
                    <Button onClick={() => downLoad(record)} color="secondary">
                        下载
                    </Button>
                </>
            )
        }
    ];
    const [tableData, setTableData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };
    const getList = async () => {
        const res = await history({ pageNo: 1, pageSize: 1000 });
        setTableData(res.list);
    };
    useEffect(() => {
        getList();
    }, []);
    //下载图片
    const downLoad = (row: any) => {
        downLoadImages(row.images[0].url, row.images[0].mediaType.split('/')[1]);
    };

    //图片详情
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>({});
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '80%',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    maxHeight: '80%',
                    maxWidth: '1000px',
                    overflow: 'auto'
                }}
                title="图片历史记录"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    {/* <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                        </Grid>
                    </Grid> */}
                    <Table rowSelection={rowSelection} columns={columns} dataSource={tableData} />
                    {detailOpen && <ImageDetail detailOpen={detailOpen} detailData={detailData} handleClose={() => setDetailOpen(false)} />}
                </CardContent>
            </MainCard>
        </Modal>
    );
};
export default ImageHistory;
