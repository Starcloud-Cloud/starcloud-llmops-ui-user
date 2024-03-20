import { Table, Button, Form, Image, Upload, UploadProps, Input } from 'antd';
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
import { materialTemplate } from 'api/redBook/batchIndex';
import FormModal from 'views/pages/batchSmallRedBooks/components/formModal';
interface Table {
    code?: string;
    materialType?: string;
    tableData: any[];
    sourceList: any[];
    setTableData: (data: any) => void;
    //弹框
    params: any;
}
const CreateTable = ({ code, materialType, tableData, sourceList, setTableData, params }: Table) => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const tableRef = useRef<any>(tableData);
    const [columns, setColumns] = useState<ColumnsType<any>>([]);
    const [rowIndex, setRowIndex] = useState(0);
    //获取表头数据
    const getHeader = async () => {
        const result = await materialTemplate(materialType);
        const newList = result?.fieldDefine?.map((item: any) => ({
            title: item.desc,
            align: 'center',
            minWidth: 200,
            dataIndex: item.fieldName,
            render: (_: any, row: any) => (
                <div className="flex justify-center items-center flex-wrap break-all gap-2">
                    {item.type === 'image' ? (
                        <Image width={50} height={50} preview={false} src={row[item.fieldName]} />
                    ) : item.fieldName === 'source' ? (
                        row[item.fieldName] === 'OTHER' ? (
                            sourceList?.find((item) => item.value === 'OTHER')?.label
                        ) : (
                            sourceList?.find((item) => item.value === 'SMALL_RED_BOOK')?.label
                        )
                    ) : (
                        row[item.fieldName]
                    )}
                </div>
            ),
            type: item.type
        }));
        setColumns([
            ...newList,
            {
                title: '操作',
                align: 'center',
                width: 140,
                dataIndex: 'action',
                key: 'action',
                render: (_, row, index) => (
                    <div className="whitespace-nowrap">
                        <Buttons
                            color="secondary"
                            size="small"
                            onClick={() => {
                                setTitle('编辑');
                                form.setFieldsValue(row);
                                setRowIndex(index);
                                setAddOpen(true);
                            }}
                        >
                            编辑
                        </Buttons>
                        <Buttons
                            onClick={() => {
                                const newList = JSON.parse(JSON.stringify(tableRef.current));
                                newList.splice(index, 1);
                                tableRef.current = newList;
                                setTableData(tableRef.current);
                            }}
                            color="error"
                            size="small"
                        >
                            删除
                        </Buttons>
                    </div>
                )
            }
        ]);
    };
    //弹框
    const [addOpen, setAddOpen] = useState(false);
    const [title, setTitle] = useState('');
    //form 表单
    const [form] = Form.useForm();
    const formOk = (data: any) => {
        data.type = materialType;
        const newList = _.cloneDeep(tableData || []);
        if (title === '新增') {
            newList.push(data);
            tableRef.current = newList;
            setTableData(tableRef.current);
            setAddOpen(false);
        } else {
            newList.splice(rowIndex, 1, data);
            tableRef.current = newList;
            setTableData(tableRef.current);
            setAddOpen(false);
        }
    };
    useEffect(() => {
        getHeader();
    }, []);
    return (
        <>
            <div className="flex justify-end">
                <Button
                    onClick={() => {
                        setTitle('新增');
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
                columns={columns}
                dataSource={tableData}
            />
            {addOpen && (
                <FormModal
                    title={title}
                    editOpen={addOpen}
                    setEditOpen={setAddOpen}
                    columns={columns}
                    form={form}
                    formOk={formOk}
                    sourceList={sourceList}
                    materialType={materialType}
                />
            )}
        </>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return JSON.stringify(prevProps?.tableData) === JSON.stringify(nextProps?.tableData);
};
export default memo(CreateTable, arePropsEqual);
