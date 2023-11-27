import { Button as Buttons, Modal, IconButton, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import { Table, Button, Image, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { singlePage, singleModify } from 'api/redBook/task';
import { useLocation } from 'react-router-dom';
import AddAnnounce from './addAnnounce';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { singleDelete } from 'api/redBook/task';
const Announce = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const handleTransfer = (key: string) => {
        switch (key) {
            case 'init':
                return (
                    <Tag className="!mr-0" color="processing">
                        代发布
                    </Tag>
                );
            case 'stay_claim':
                return (
                    <Tag className="!mr-0" color="processing">
                        待认领
                    </Tag>
                );
            case 'claimed':
                return (
                    <Tag className="!mr-0" color="processing">
                        已认领
                    </Tag>
                );
            case 'published':
                return (
                    <Tag className="!mr-0" color="processing">
                        用户已发布
                    </Tag>
                );
            case 'pre_settlement':
                return (
                    <Tag className="!mr-0" color="processing">
                        预结算
                    </Tag>
                );
            case 'settlement':
                return (
                    <Tag className="!mr-0" color="processing">
                        结算
                    </Tag>
                );
            case 'close':
                return (
                    <Tag className="!mr-0" color="processing">
                        关闭
                    </Tag>
                );
            case 'settlement_error':
                return (
                    <Tag className="!mr-0" color="error">
                        结算异常
                    </Tag>
                );
        }
    };
    const columns: ColumnsType<any> = [
        {
            title: '发帖标题',
            dataIndex: 'copywriting',
            render: (_, row) => <div>{row?.content?.title}</div>
        },
        {
            title: '任务图片',
            width: 170,
            render: (_, row) => (
                <div className="flex flex-wrap">
                    {row?.content?.picture?.map((item: any) => (
                        <Image className="mr-[5px]" width={50} height={50} key={item.index} src={item.url} preview={false} />
                    ))}
                </div>
            )
        },
        {
            title: '创作计划',
            dataIndex: 'plan'
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (_, row) => <div>{handleTransfer(row.status)}</div>
        },
        {
            title: '认领人',
            dataIndex: 'claimUsername'
        },
        {
            title: '发布时间',
            dataIndex: 'publishTime'
        },
        {
            title: '预结算时间',
            dataIndex: 'preSettlementTime'
        },
        {
            title: '预估花费',
            dataIndex: 'estimatedAmount'
        },
        {
            title: '结算时间',
            dataIndex: 'settlementTime'
        },
        {
            title: '结算金额',
            dataIndex: 'settlementAmount'
        },
        {
            title: '支付订单号',
            dataIndex: 'paymentOrder'
        },
        {
            title: '操作',
            width: 140,
            align: 'center',
            render: (_, row, index) => (
                <div className="whitespace-nowrap">
                    <Buttons size="small" color="secondary" onClick={() => setEditOpen(true)}>
                        编辑
                    </Buttons>
                    <Buttons
                        onClick={() => {
                            setUid(row.uid);
                            setExecuteOpen(true);
                        }}
                        size="small"
                        color="error"
                    >
                        删除
                    </Buttons>
                </div>
            )
        }
    ];
    const [tableData, setTableData] = useState<any[]>([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const getList = async () => {
        const result = await singlePage({ pageNo, pageSize, notificationUid: searchParams.get('notificationUid') });
        setTableData(result.list);
        setTotal(result.total);
    };
    useEffect(() => {
        if (!addOpen) {
            getList();
        }
    }, [addOpen, pageNo, pageSize]);

    //删除
    const [uid, setUid] = useState('');
    const [executeOpen, setExecuteOpen] = useState(false);
    const Execute = async () => {
        const result = await singleDelete(uid);
        if (result) {
            setExecuteOpen(false);
            getList();
            dispatch(
                openSnackbar({
                    open: true,
                    message: '删除成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        }
    };
    return (
        <div>
            <div className="flex justify-right items-center mb-[20px]">
                <Button
                    disabled={!searchParams.get('notificationUid')}
                    onClick={() => {
                        setAddOpen(true);
                    }}
                    type="primary"
                    icon={<PlusOutlined rev={undefined} />}
                >
                    绑定创作计划
                </Button>
            </div>
            <Table
                size="small"
                columns={columns}
                dataSource={tableData}
                pagination={{
                    total: total,
                    current: pageNo,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100],
                    onChange: (data: number) => setPageNo(data),
                    onShowSizeChange: (data: number, pageSize: number) => setPageSize(pageSize)
                }}
            />
            <Modal open={editOpen} onClose={() => setEditOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
                <MainCard
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '50%',
                        transform: 'translate(-50%, -10%)',
                        maxHeight: '90%',
                        overflow: 'auto'
                    }}
                    title={'编辑单条任务'}
                    content={false}
                    className="w-[80%] max-w-[1000px]"
                    secondary={
                        <IconButton onClick={() => setEditOpen(false)} size="large" aria-label="close modal">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent></CardContent>
                </MainCard>
            </Modal>
            {addOpen && <AddAnnounce addOpen={addOpen} setAddOpen={setAddOpen} />}
            <Confirm open={executeOpen} handleClose={() => setExecuteOpen(false)} handleOk={Execute} />
        </div>
    );
};
export default Announce;
