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
const AddAnnounce = ({ addOpen, setAddOpen }: { addOpen: boolean; setAddOpen: (data: boolean) => void }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [detailOpen, setDetailOpen] = useState(false);
    const [uid, setUid] = useState('');
    const addColumn: ColumnsType<any> = [
        {
            title: '文案标题',
            width: 300,
            render: (_, row) => (
                <span
                    className="hover:text-[#673ab7] cursor-pointer"
                    onClick={() => {
                        setUid(row.businessUid);
                        setDetailOpen(true);
                    }}
                >
                    {row.copyWritingTitle}
                </span>
            )
        },
        {
            title: '喜欢',
            render: (_, row) => (
                <div className="line-clamp-3">
                    {row.liked ? <Tag color="success">已点亮喜欢</Tag> : <Tag color="blue">未点亮为喜欢</Tag>}
                </div>
            )
        },
        {
            title: '图片数量',
            align: 'center',
            width: 100,
            dataIndex: 'pictureNum'
        },
        {
            title: '图片内容',
            align: 'center',
            dataIndex: 'pictureContent',
            render: (_, row) => (
                <div className="flex justify-center flex-wrap">
                    {row.pictureContent.map((item: any) => (
                        <div className="w-[50px] h-[50px] mr-[10px]">
                            <Image width={50} height={50} preview={false} src={item.url} />
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: '生成时间',
            render: (_, row) => <div>{formatDate(row.pictureStartTime)}</div>
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
    const [addCurrent, setAddCurrent] = useState(1);
    const [addPageSize, setAddPageSize] = useState(10);
    const [addTotal, setAddTotal] = useState(0);
    const getAddList = async () => {
        setLoading(true);
        const result = await contentPage({
            pageNo: addCurrent,
            pageSize: addPageSize,
            status: 'execute_success',
            claim: false,
            planUid: values
        });
        setLoading(false);
        setAddTable(result.list);
        setAddTotal(result.total);
    };
    useEffect(() => {
        if (addOpen) {
            getAddList();
        }
    }, [addOpen, addCurrent, addPageSize, values]);
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
                                    {item.name}（{item.successCount}）
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
