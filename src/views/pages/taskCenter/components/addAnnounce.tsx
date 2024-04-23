import { Modal, IconButton, CardContent, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Table, Tag, Popover, Button, Image } from 'antd';
import formatDate from 'hooks/useDate';
import type { ColumnsType } from 'antd/es/table';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { planPage } from 'api/redBook/batchIndex';
import { contentPage, singleAdd } from 'api/redBook/task';
import { DetailModal } from '../../redBookContentList/component/detailModal';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { batchPages } from 'api/redBook/batchIndex';
import dayjs from 'dayjs';

const AddAnnounce = ({ addOpen, setAddOpen }: { addOpen: boolean; setAddOpen: (data: boolean) => void }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [detailOpen, setDetailOpen] = useState(false);
    const [uid, setUid] = useState('');
    const addColumn: ColumnsType<any> = [
        {
            title: '文案标题',
            width: '30%',
            render: (_, row) => (
                <span
                    className="hover:text-[#673ab7] cursor-pointer"
                    onClick={() => {
                        setUid(row.businessUid);
                        setDetailOpen(true);
                    }}
                >
                    {row?.executeResult?.copyWriting?.title}
                </span>
            )
        },
        {
            title: '喜欢',
            width: 100,
            align: 'center',
            render: (_, row) => (
                <div className="line-clamp-3">
                    {row.liked ? <GradeIcon sx={{ color: '#ecc94b99' }} /> : <GradeOutlinedIcon sx={{ color: '#0003' }} />}
                </div>
            )
        },
        {
            title: '图片数量',
            align: 'center',
            width: 100,
            render: (_, row) => <div>{row?.executeResult?.imageList?.length}</div>
        },
        {
            title: '图片内容',
            align: 'center',
            dataIndex: 'pictureContent',
            render: (_, row) => (
                <div className="w-[200px] overflow-x-auto flex gap-2">
                    {row?.executeResult?.imageList?.map((item: any) => (
                        <div className="w-[50px] h-[50px]">
                            <Image width={50} height={50} preview={false} src={item.url} />
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: '生成时间',
            render: (_, row) => <div>{formatDate(row.startTime)}</div>
        }
    ];
    const [addTable, setAddTable] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [businessUid, setBusinessUid] = useState<React.Key[]>([]);
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setBusinessUid(selectedRowKeys);
        }
    };
    const [valueList, setValueList] = useState<any[]>([]);
    const [values, setValue] = useState<string | null[]>([]);
    const [batch, setBatch] = useState('');
    const [batchList, setBatchList] = useState<any[]>([]);
    const [addCurrent, setAddCurrent] = useState(1);
    const [addPageSize, setAddPageSize] = useState(10);
    const [addTotal, setAddTotal] = useState(0);
    const getAddList = async () => {
        setLoading(true);
        const result = await contentPage({
            pageNo: addCurrent,
            pageSize: addPageSize,
            batchUid: batch,
            status: 'success',
            claim: false,
            planUid: values
        });
        setLoading(false);
        setAddTable(result.list);
        setAddTotal(result.total);
        batchPages({ pageNo: 1, pageSize: 100, planUid: values }).then((res) => {
            setBatchList(res.list);
        });
    };
    useEffect(() => {
        setBatch('');
    }, [values]);
    useEffect(() => {
        if (addOpen) {
            getAddList();
        }
    }, [addOpen, addCurrent, addPageSize, values, batch]);
    useEffect(() => {
        planPage({ pageNo: 1, pageSize: 10000 }).then((res) => {
            setValueList(res?.list);
        });
    }, []);
    const handleSave = async () => {
        const result = await singleAdd(searchParams.get('notificationUid'), businessUid);
        if (result) {
            setAddOpen(false);
        }
    };
    return (
        <Modal open={addOpen} onClose={() => setAddOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
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
                className="w-[80%]"
                secondary={
                    <IconButton onClick={() => setAddOpen(false)} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <FormControl sx={{ mb: 2, width: '300px' }} color="secondary" size="small">
                        <InputLabel id="plans">创作计划</InputLabel>
                        <Select labelId="plans" value={values} label="创作计划" onChange={(e: any) => setValue(e.target.value)}>
                            {valueList?.map((item: any) => (
                                <MenuItem key={item.uid} value={item.uid}>
                                    {item.uid}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ ml: 2, mb: 2, width: '300px' }} color="secondary" size="small">
                        <InputLabel id="uid">创作批次</InputLabel>
                        <Select labelId="uid" value={batch} label="创作批次" onChange={(e: any) => setBatch(e.target.value)}>
                            {batchList?.map((item: any) => (
                                <MenuItem key={item.uid} value={item.uid}>
                                    {dayjs(item.startTime).format('YYYY-MM-DD hh:mm:ss')}（{item.totalCount}）
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br />
                    <div className="flex justify-end mb-[20px]">
                        <div className="flex items-center gap-2">
                            <div className="text-[12px]">
                                选中的数量：<span className="text-[#673ab7] font-bold">{businessUid?.length}</span>
                            </div>
                            <Button onClick={handleSave} disabled={businessUid?.length === 0} type="primary">
                                确认选择
                            </Button>
                        </div>
                    </div>
                    <Table
                        size="small"
                        columns={addColumn}
                        dataSource={addTable}
                        loading={loading}
                        rowSelection={{
                            ...rowSelection
                        }}
                        pagination={{
                            total: addTotal,
                            current: addCurrent,
                            pageSize: addPageSize,
                            showSizeChanger: true,
                            pageSizeOptions: [10, 20, 50, 100],
                            onChange: (data: number) => setAddCurrent(data),
                            onShowSizeChange: (data: number, pageSize: number) => setAddPageSize(pageSize)
                        }}
                        rowKey={'businessUid'}
                    />
                    {detailOpen && <DetailModal open={detailOpen} handleClose={() => setDetailOpen(false)} businessUid={uid} />}
                </CardContent>
            </MainCard>
        </Modal>
    );
};
export default AddAnnounce;
