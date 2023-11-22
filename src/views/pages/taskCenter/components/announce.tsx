import { Modal, IconButton, CardContent, Divider, CardActions, Grid } from '@mui/material';
import { Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { singlePage } from 'api/redBook/task';
const Announce = ({ open, setOpen, notificationUid }: { open: boolean; setOpen: (data: boolean) => void; notificationUid: string }) => {
    const columns: ColumnsType<any> = [
        {
            title: '任务编码',
            dataIndex: 'encoding'
        },
        {
            title: '任务文案',
            dataIndex: 'copywriting'
        },
        {
            title: '任务图片',
            dataIndex: 'copyImage'
        },
        {
            title: '创作计划',
            dataIndex: 'plan'
        },
        {
            title: '状态',
            dataIndex: 'status'
        },
        {
            title: '认领人',
            dataIndex: 'peoper'
        },
        {
            title: '认领时间',
            dataIndex: 'claimTime'
        },
        {
            title: '提交时间',
            dataIndex: 'submitTime'
        },
        {
            title: '发布链接',
            dataIndex: 'link'
        },
        {
            title: '预结算时间',
            dataIndex: 'lementTime'
        },
        {
            title: '预结花费',
            dataIndex: 'lementPrice'
        },
        {
            title: '结算时间',
            dataIndex: 'lementsTime'
        },
        {
            title: '支付订单号',
            dataIndex: 'payOrder'
        },
        {
            title: '操作',
            render: (_, row, index) => (
                <div className="whitespace-nowrap">
                    <Button type="text" onClick={() => {}}>
                        编辑
                    </Button>
                    <Button onClick={() => {}} danger type="text">
                        删除
                    </Button>
                </div>
            )
        }
    ];
    const [tableData, setTableData] = useState<any[]>([]);
    const [query, setQuery] = useState({
        pageNo: 1,
        pageSize: 10
    });
    const [total, setTotal] = useState(0);
    const handleSave = () => {};
    const getList = async () => {
        const result = await singlePage(query);
    };
    useEffect(() => {
        getList();
    }, []);
    return (
        <Modal open={open} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, -10%)',
                    maxHeight: '90%',
                    overflow: 'auto'
                }}
                title={'通告任务'}
                content={false}
                className="w-[80%] max-w-[1000px]"
                secondary={
                    <IconButton onClick={() => setOpen(false)} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <div className="flex justify-between items-center mt-[20px]">
                        <div className="text-[18px] font-[600]">参考账号</div>
                        <Button onClick={() => {}} className="mb-[20px]" type="primary" icon={<PlusOutlined rev={undefined} />}>
                            新增
                        </Button>
                    </div>
                    <Table
                        scroll={{ y: 200 }}
                        size="small"
                        columns={columns}
                        dataSource={tableData}
                        pagination={{ total: total, current: query.pageNo, pageSize: query.pageSize }}
                    />
                    <Divider />
                    <CardActions>
                        <Grid container justifyContent="flex-end">
                            <Button type="primary" onClick={handleSave}>
                                保存
                            </Button>
                        </Grid>
                    </CardActions>
                </CardContent>
            </MainCard>
        </Modal>
    );
};
export default Announce;
