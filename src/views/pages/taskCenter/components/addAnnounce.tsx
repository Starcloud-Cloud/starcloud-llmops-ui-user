import { Modal, IconButton, CardContent, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Table, Tag, Popover, Button, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { planPage } from 'api/redBook/batchIndex';
import { contentPage, singleAdd } from 'api/redBook/task';
const AddAnnounce = ({ addOpen, setAddOpen }: { addOpen: boolean; setAddOpen: (data: boolean) => void }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const addColumn: ColumnsType<any> = [
        {
            title: '文案内容',
            dataIndex: 'copyWritingTitle'
        },
        {
            title: '文案内容',
            width: '35%',
            render: (_, row) => <div className="line-clamp-3">{row.copyWritingContent}</div>
        },
        {
            title: '图片数量',
            width: 50,
            dataIndex: 'pictureNum'
        },
        {
            title: '图片内容',
            dataIndex: 'pictureContent',
            render: (_, row) => (
                <div className="flex flex-wrap">
                    {row.pictureContent.map((item: any) => (
                        <div className="w-[50px] h-[50px] mr-[10px]">
                            <Image width={50} height={50} preview={false} src={item.url} />
                        </div>
                    ))}
                </div>
            )
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
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br />
                    <Button onClick={handleSave} className="mb-[20px]" disabled={businessUid?.length === 0} type="primary">
                        确认选择
                    </Button>
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
                </CardContent>
            </MainCard>
        </Modal>
    );
};
export default AddAnnounce;