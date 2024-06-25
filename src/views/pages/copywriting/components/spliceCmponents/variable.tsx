import { Tooltip, Popconfirm, Button, Space, Table } from 'antd';
import { Delete, Settings } from '@mui/icons-material';
import type { TableProps } from 'antd';
import { InfoCircleOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { t } from 'hooks/web/useI18n';
import { useState, memo, useEffect } from 'react';
import _ from 'lodash-es';
import VariableModal from '../variableModal';
import { appFieldCode } from 'api/redBook/batchIndex';
interface Variable {
    rows: any[];
    setRows: (data: any[]) => void;
}

const CreateVariable = ({ rows, setRows }: Variable) => {
    const columns: TableProps<any>['columns'] = [
        {
            title: '变量名称',
            dataIndex: 'label',
            align: 'center'
        },
        {
            title: '类型',
            align: 'center',
            render: (_, row) => <span>{t('myApp.' + row.style?.toLowerCase())}</span>
        },
        {
            title: '操作',
            width: 100,
            align: 'center',
            render: (_, row, i) => (
                <Space>
                    <Button
                        onClick={() => {
                            setVarIndex(i);
                            setItemData(row);
                            setTitle('编辑变量');
                            setVariableOpen(true);
                        }}
                        size="small"
                        shape="circle"
                        icon={<SettingOutlined rev={undefined} />}
                        type="primary"
                    />
                    <Popconfirm
                        title="删除变量"
                        description="是否确认删除这条数据"
                        onConfirm={() => {
                            const newList = _.cloneDeep(tableData);
                            newList?.splice(i, 1);
                            setTableData(newList);
                        }}
                        onCancel={() => {}}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button
                            size="small"
                            shape="circle"
                            icon={<DeleteOutlined rev={undefined} />}
                            disabled={row.group === 'SYSTEM'}
                            danger
                            type="primary"
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const [title, setTitle] = useState('');
    const [variableOpen, setVariableOpen] = useState(false);
    const [varIndex, setVarIndex] = useState(-1);
    const [itemData, setItemData] = useState<any>({});
    const [tableData, setTableData] = useState<any[]>([]);
    const saveContent = (data: any) => {
        if (title === '增加变量') {
            if (tableData) {
                setTableData([data, ...tableData]);
                setVariableOpen(false);
            } else {
                setTableData([data]);
                setVariableOpen(false);
            }
        } else {
            const newList = _.cloneDeep(tableData);
            newList[varIndex] = data;
            setTableData(newList);
            setVariableOpen(false);
        }
    };
    const [saveLoading, setSaveLoading] = useState(false);
    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const result = await appFieldCode({
                variables: tableData
            });
            setSaveLoading(false);
            setRows(result);
        } catch (err) {
            setSaveLoading(false);
        }
    };
    useEffect(() => {
        setTableData(rows);
    }, []);
    useEffect(() => {
        if (!variableOpen) {
            setItemData({});
        }
    }, [variableOpen]);
    return (
        <>
            <div className="w-full flex justify-end mb-4">
                <div className="flex gap-2">
                    <Tooltip title={'变量将以表单形式让用户在执行前填写,用户填写的表单内容将自动替换提示词中的变量	'}>
                        <InfoCircleOutlined className="cursor-pointer" rev={undefined} />
                    </Tooltip>
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            setTitle('增加变量');
                            setVariableOpen(true);
                        }}
                    >
                        新增
                    </Button>
                </div>
            </div>
            <Table columns={columns} dataSource={tableData} pagination={false} />
            <div className="flex justify-center mt-4">
                <Button loading={saveLoading} type="primary" onClick={handleSave}>
                    保存
                </Button>
            </div>
            {variableOpen && (
                <VariableModal title={title} open={variableOpen} setOpen={setVariableOpen} itemData={itemData} saveContent={saveContent} />
            )}
        </>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.pre) === JSON.stringify(nextProps?.pre) &&
        JSON.stringify(prevProps?.model) === JSON.stringify(nextProps?.model) &&
        JSON.stringify(prevProps?.value) === JSON.stringify(nextProps?.value) &&
        JSON.stringify(prevProps?.rows) === JSON.stringify(nextProps?.rows)
    );
};
export default memo(CreateVariable, arePropsEqual);
