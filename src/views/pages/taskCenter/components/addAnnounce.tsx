import { Modal, Select, Table, Button, Image } from 'antd';
import formatDate from 'hooks/useDate';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { planList, contentPage, singleAdd } from 'api/redBook/task';
import { DetailModal } from '../../redBookContentList/component/detailModal';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { batchPages } from 'api/redBook/batchIndex';
import dayjs from 'dayjs';

const AddAnnounce = ({ addOpen, setAddOpen }: { addOpen: boolean; setAddOpen: (data: boolean) => void }) => {
    const { Option } = Select;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [detailOpen, setDetailOpen] = useState(false);
    const [uid, setUid] = useState('');
    const addColumn: ColumnsType<any> = [
        {
            title: '文案标题',
            width: '30%',
            align: 'center',
            render: (_, row) => (
                <span
                // className="hover:text-[#673ab7] cursor-pointer"
                // onClick={() => {
                //     setUid(row.businessUid);
                //     setDetailOpen(true);
                // }}
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
            width: 300,
            dataIndex: 'pictureContent',
            render: (_, row) => (
                <div className="w-[300px] overflow-x-auto flex justify-center gap-2">
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
            align: 'center',
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
    const [source, setSource] = useState<string | undefined>('MARKET');
    const [values, setValue] = useState<string | undefined>('');
    const [batch, setBatch] = useState<string | undefined>('');
    const [valueList, setValueList] = useState<any[]>([]);
    const [batchList, setBatchList] = useState<any[]>([]);
    const [addCurrent, setAddCurrent] = useState(1);
    const [addPageSize, setAddPageSize] = useState(10);
    const [addTotal, setAddTotal] = useState(0);
    //获取创作计划列表
    const getExePlan = async () => {
        const res = await planList({ source });
        setValueList(res);
    };
    //获取创作批次列表
    const getBatchList = async () => {
        const res = await batchPages({ pageNo: 1, pageSize: 100, planUid: values });
        setBatchList(res.list);
        if (res?.list?.length > 0) {
            setBatch(res?.list[0]?.uid);
        }
    };
    //获取表格
    const getAddList = async () => {
        setLoading(true);
        const result = await contentPage({
            pageNo: addCurrent,
            pageSize: addPageSize,
            batchUid: batch,
            status: 'success',
            claim: false,
            desc: true,
            planUid: values
        });
        setLoading(false);
        setAddTable(result.list);
        setAddTotal(result.total);
    };
    useEffect(() => {
        if (source) {
            setValue(undefined);
            setBatch(undefined);
            setAddTotal(0);
            setAddTable([]);
            getExePlan();
        }
    }, [source]);
    useEffect(() => {
        setBatch(undefined);
        setAddTotal(0);
        setAddTable([]);
        getBatchList();
    }, [values]);
    useEffect(() => {
        if (batch) {
            getAddList();
        }
    }, [batch]);

    const handleSave = async () => {
        const result = await singleAdd(searchParams.get('notificationUid'), businessUid);
        if (result) {
            setAddOpen(false);
        }
    };
    return (
        <Modal width="80%" open={addOpen} onCancel={() => setAddOpen(false)} footer={false} title={'通告任务'}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center">
                        <div>创作来源：</div>
                        <Select className="w-[200px]" placeholder="请选择" allowClear onChange={(value) => setSource(value)} value={source}>
                            <Option value={'APP'}>我的应用</Option>
                            <Option value={'MARKET'}>应用市场</Option>
                        </Select>
                    </div>
                    <div className="flex items-center">
                        <div>创作计划：</div>
                        <Select className="w-[200px]" placeholder="请选择" allowClear onChange={(value) => setValue(value)} value={values}>
                            {valueList?.map((item) => (
                                <Option key={item.uid} value={item.uid}>
                                    {item?.configuration?.appInformation?.name}（{item?.creatorName}）
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex items-center">
                        <div>创作批次：</div>
                        <Select className="w-[200px]" placeholder="请选择" allowClear onChange={(value) => setBatch(value)} value={batch}>
                            {batchList?.map((item) => (
                                <Option key={item.uid} value={item.uid}>
                                    {dayjs(item.startTime).format('YYYY-MM-DD hh:mm:ss')}
                                    &nbsp;&nbsp;{item.id}&nbsp;&nbsp;（
                                    {item.totalCount}）
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="flex items-center gap-2">
                        <div className="text-[12px]">
                            选中的数量：<span className="text-[#673ab7] font-bold">{businessUid?.length}</span>
                        </div>
                        <Button onClick={handleSave} disabled={businessUid?.length === 0} type="primary">
                            确认选择
                        </Button>
                    </div>
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
                rowKey={'uid'}
            />
            {detailOpen && <DetailModal open={detailOpen} handleClose={() => setDetailOpen(false)} businessUid={uid} />}
        </Modal>
    );
};
export default AddAnnounce;
