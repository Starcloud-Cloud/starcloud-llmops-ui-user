import { Modal, Tabs, Form, Input, Select, Cascader, Button, Avatar, Divider, Tooltip, Table, Tag, Popover } from 'antd';
import { AppstoreFilled, DeleteOutlined, RetweetOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getPlugConfigInfo, createConfig, getPlugInfo, getMetadata, modifyConfig, pageJob } from 'api/plug';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import PlugAnalysis from './selAnalysis';
import _ from 'lodash-es';
const TriggerModal = ({
    triggerOpen,
    setTriggerOpen,
    definitionList,
    libraryUid,
    metaData,
    name,
    columns,
    rowData,
    selPlug,
    selValue,
    setSelValue
}: {
    triggerOpen: boolean;
    setTriggerOpen: (data: boolean) => void;
    definitionList: any[];
    libraryUid: string;
    metaData: any;
    name: string;
    columns: any[];
    rowData: any;
    selPlug: () => void;
    selValue: any;
    setSelValue: (data: any) => void;
}) => {
    const [form] = Form.useForm();
    const [forms] = Form.useForm();
    const [timeExpressionTypeList, settimeExpressionTypeList] = useState<any[]>([]);
    const timeList = [
        { value: '0 0 0', label: '00:00' },
        { value: '0 0 1', label: '01:00' },
        { value: '0 0 2', label: '02:00' },
        { value: '0 0 3', label: '03:00' },
        { value: '0 0 4', label: '04:00' },
        { value: '0 0 5', label: '05:00' },
        { value: '0 0 6', label: '06:00' },
        { value: '0 0 7', label: '07:00' },
        { value: '0 0 8', label: '08:00' },
        { value: '0 0 9', label: '09:00' },
        { value: '0 0 10', label: '10:00' },
        { value: '0 0 11', label: '11:00' },
        { value: '0 0 12', label: '12:00' },
        { value: '0 0 13', label: '13:00' },
        { value: '0 0 14', label: '14:00' },
        { value: '0 0 15', label: '15:00' },
        { value: '0 0 16', label: '16:00' },
        { value: '0 0 17', label: '17:00' },
        { value: '0 0 18', label: '18:00' },
        { value: '0 0 19', label: '19:00' },
        { value: '0 0 20', label: '20:00' },
        { value: '0 0 21', label: '21:00' },
        { value: '0 0 22', label: '22:00' },
        { value: '0 0 23', label: '23:00' }
    ];
    const timeExpressionList = [
        {
            value: '* * *',
            label: '每日触发',
            children: timeList
        },
        {
            value: '',
            label: '每周触发',
            children: [
                {
                    value: '* * 7',
                    label: '周日',
                    children: timeList
                },
                {
                    value: '* * 1',
                    label: '周一',
                    children: timeList
                },
                {
                    value: '* * 2',
                    label: '周二',
                    children: timeList
                },
                {
                    value: '* * 3',
                    label: '周三',
                    children: timeList
                },
                {
                    value: '* * 4',
                    label: '周四',
                    children: timeList
                },
                {
                    value: '* * 5',
                    label: '周五',
                    children: timeList
                },
                {
                    value: '* * 6',
                    label: '周六',
                    children: timeList
                }
            ]
        },
        {
            value: '* *',
            label: '每月触发',
            children: [
                {
                    value: '1',
                    label: '1 日',
                    children: timeList
                },
                {
                    value: '2',
                    label: '2 日',
                    children: timeList
                },
                {
                    value: '3',
                    label: '3 日',
                    children: timeList
                },
                {
                    value: '4',
                    label: '4 日',
                    children: timeList
                },
                {
                    value: '5',
                    label: '5 日',
                    children: timeList
                },
                {
                    value: '6',
                    label: '6 日',
                    children: timeList
                },
                {
                    value: '7',
                    label: '7 日',
                    children: timeList
                },
                {
                    value: '8',
                    label: '8 日',
                    children: timeList
                },
                {
                    value: '9',
                    label: '9 日',
                    children: timeList
                },
                {
                    value: '10',
                    label: '10 日',
                    children: timeList
                },
                {
                    value: '11',
                    label: '11 日',
                    children: timeList
                },
                {
                    value: '12',
                    label: '12 日',
                    children: timeList
                },
                {
                    value: '13',
                    label: '13 日',
                    children: timeList
                },
                {
                    value: '14',
                    label: '14 日',
                    children: timeList
                },
                {
                    value: '15',
                    label: '15 日',
                    children: timeList
                },
                {
                    value: '16',
                    label: '16 日',
                    children: timeList
                },
                {
                    value: '17',
                    label: '17 日',
                    children: timeList
                },
                {
                    value: '18',
                    label: '18 日',
                    children: timeList
                },
                {
                    value: '19',
                    label: '19 日',
                    children: timeList
                },
                {
                    value: '20',
                    label: '20 日',
                    children: timeList
                },
                {
                    value: '21',
                    label: '21 日',
                    children: timeList
                },
                {
                    value: '22',
                    label: '22 日',
                    children: timeList
                },
                {
                    value: '23',
                    label: '23 日',
                    children: timeList
                },
                {
                    value: '24',
                    label: '24 日',
                    children: timeList
                },
                {
                    value: '25',
                    label: '25 日',
                    children: timeList
                },
                {
                    value: '26',
                    label: '26 日',
                    children: timeList
                },
                {
                    value: '27',
                    label: '27 日',
                    children: timeList
                },
                {
                    value: '28',
                    label: '28 日',
                    children: timeList
                },
                {
                    value: '29',
                    label: '29 日',
                    children: timeList
                },
                {
                    value: '30',
                    label: '30 日',
                    children: timeList
                },
                {
                    value: '31',
                    label: '31 日',
                    children: timeList
                }
            ]
        },
        {
            value: ' ',
            label: '间隔触发',
            children: [
                {
                    value: '*/2 * *',
                    label: '2 日',
                    children: timeList
                },
                {
                    value: '*/3 * *',
                    label: '3 日',
                    children: timeList
                },
                {
                    value: '*/4 * *',
                    label: '4 日',
                    children: timeList
                },
                {
                    value: '*/5 * *',
                    label: '5 日',
                    children: timeList
                },
                {
                    value: '*/6 * *',
                    label: '6 日',
                    children: timeList
                }
            ]
        }
    ];

    const handleSave = async () => {
        const formRes = await form.validateFields();
        if (!selValue) {
            return false;
        }
        const result = await forms.validateFields();
        const newList = redBookData.requirement?.map((item: any) => ({
            ...item,
            variableValue: result[item.variableKey]
        }));
        const data = await getPlugConfigInfo({
            libraryUid,
            pluginUid: selValue.uid
        });
        let params: any = {};
        if (data?.executeParams) {
            JSON.parse(data?.executeParams)?.map((item: any) => {
                params[item.variableKey] = item.variableValue;
            });
        }

        if (rowData) {
            await modifyConfig({
                ...rowData,
                ...formRes,
                foreignKey: libraryUid,
                timeExpression: _.cloneDeep(formRes.timeExpression)?.reverse()?.join(' ')?.trim(),
                businessJobType: 'coze_standalone',
                config: {
                    businessJobType: 'coze_standalone',
                    fieldMap: plugRecord ? JSON.stringify(redBookData.bindFieldData) : data ? data?.fieldMap : null,
                    executeParams: plugRecord ? JSON.stringify(result) : data ? data?.params : null,
                    paramsDefine: plugRecord ? JSON.stringify(newList) : data ? data?.executeParams : null,
                    libraryUid: libraryUid,
                    pluginUid: selValue?.uid,
                    pluginName: selValue.pluginName
                }
            });
        } else {
            await createConfig({
                ...formRes,
                foreignKey: libraryUid,
                timeExpression: _.cloneDeep(formRes.timeExpression)?.reverse()?.join(' ')?.trim(),
                businessJobType: 'coze_standalone',
                config: {
                    businessJobType: 'coze_standalone',
                    fieldMap: plugRecord ? JSON.stringify(redBookData.bindFieldData) : null,
                    executeParams: plugRecord ? JSON.stringify(result) : null,
                    paramsDefine: plugRecord ? JSON.stringify(newList) : null,
                    libraryUid: libraryUid,
                    pluginUid: selValue?.uid,
                    pluginName: selValue.pluginName
                }
            });
        }
        setTriggerOpen(false);
        dispatch(
            openSnackbar({
                open: true,
                message: '保存成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
    };
    const [plugOpen, setPlugOpen] = useState(false);
    const [plugRecord, setPlugRecord] = useState<any>(null);

    const [redBookData, setRedBookData] = useState<any>({});
    const handleOpenPlug = async (record: any) => {
        const plugInfo = await getPlugInfo(record.uid);
        const data = await getPlugConfigInfo({
            libraryUid,
            pluginUid: record.uid
        });
        setPlugOpen(true);
        setPlugRecord({
            ...plugInfo,
            ...data,
            libraryUid,
            pluginUid: record.uid,
            ...(rowData ? rowData?.config : {}),
            executeParams: rowData?.config?.paramsDefine || data?.executeParams || plugInfo?.executeParams
        });
    };
    const getValue = (list: any[], value?: any[]): any => {
        const newValue = value || [];
        for (let i = 0; i < list.length; i++) {
            if ([...newValue, list[i].value].reverse().join(' ')?.trim() === rowData.timeExpression) {
                return [...newValue, list[i].value];
            }
            if (list[i].children) {
                const fundPath = getValue(list[i].children, [...newValue, list[i].value]);
                if (fundPath) {
                    return fundPath;
                }
            }
        }
        return null;
    };

    useEffect(() => {
        getMetadata().then((res) => {
            settimeExpressionTypeList(res.triggerType);
        });
    }, []);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (rowData) {
            form.setFieldsValue(rowData);
            form.setFieldValue('timeExpression', getValue(timeExpressionList));
            setSelValue(definitionList?.find((item) => item.uid === rowData?.config?.pluginUid));
        }
    }, [rowData]);

    //触发历史
    const column: TableColumnsType<any> = [
        {
            title: '触发器时间',
            align: 'center',
            render: (_, row) => <div>{dayjs(row.triggerTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        },
        {
            title: '触发器类型',
            align: 'center',
            render: (_, row) => <div>{timeExpressionTypeList?.find((item) => item.value === row.triggerType)?.label}</div>
        },
        {
            title: '执行插件名称',
            dataIndex: 'pluginName',
            align: 'center'
        },
        {
            title: '触发结果',
            dataIndex: 'executeResult',
            align: 'center'
        },
        {
            title: '耗时(s)',
            dataIndex: 'executeTime',
            align: 'center',
            render: (_, row) => <div>{row.executeTime / 1000}</div>
        },
        {
            title: '状态',
            align: 'center',
            render: (_, row) => <Tag color="processing">{row?.success ? '执行成功' : '执行失败'}</Tag>
        }
    ];
    const [TableData, setTableData] = useState<any[]>([]);

    const getList = async () => {
        const result = await pageJob({
            page: 1,
            size: 10,
            businessJobUid: rowData?.uid
        });
        setTableData(result?.list);
    };
    useEffect(() => {
        getList();
    }, []);
    return (
        <Modal width="60%" open={triggerOpen} onCancel={() => setTriggerOpen(false)} footer={false} title="素材库-触发器">
            <Tabs
                items={[
                    {
                        label: '配置',
                        key: '1',
                        children: (
                            <div>
                                <Form form={form} labelCol={{ span: 4 }}>
                                    <Form.Item
                                        initialValue={name + '(触发器)'}
                                        label="触发器名称"
                                        name="name"
                                        rules={[{ required: true, message: '名称必填' }]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                    <Form.Item
                                        label="触发器类型"
                                        name="timeExpressionType"
                                        rules={[{ required: true, message: '触发器类型必填' }]}
                                    >
                                        <Select options={timeExpressionTypeList} />
                                    </Form.Item>
                                    <Form.Item
                                        label="触发时间"
                                        name="timeExpression"
                                        rules={[{ type: 'array', required: true, message: '触发时间必填' }]}
                                    >
                                        <Cascader displayRender={(label) => label.join(' ')} options={timeExpressionList} />
                                    </Form.Item>
                                    <Form.Item
                                        required
                                        label={
                                            <div className="flex items-center gap-2">
                                                任务执行
                                                <Popover
                                                    placement="top"
                                                    title="插件"
                                                    content="触发时系统将会根据插件设置自动调用插件，插件返回内容将会自动导入到素材库。"
                                                >
                                                    <QuestionCircleOutlined className="cursor-pointer" />
                                                </Popover>
                                            </div>
                                        }
                                        name="config"
                                    >
                                        {!selValue ? (
                                            <div className="flex gap-2 items-center">
                                                <Button type="primary" onClick={() => selPlug()}>
                                                    添加插件
                                                </Button>
                                                <div className="text-xs text-[#ff4d4f]">需要添加一个插件</div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => handleOpenPlug(selValue)}
                                                className="w-[400px] p-4 border border-solid border-[#d9d9d9] rounded-lg hover:border-[#673ab7] cursor-pointer hover:shadow-md relative"
                                            >
                                                <div className="flex gap-4">
                                                    {selValue?.avatar ? (
                                                        <Avatar shape="square" size={64} src={selValue?.avatar} />
                                                    ) : (
                                                        <Avatar shape="square" size={64} icon={<AppstoreFilled />} />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="text-[18px] font-bold">{selValue?.pluginName}</div>
                                                        <div className="line-clamp-3 h-[66px]">{selValue?.description}</div>
                                                    </div>
                                                </div>
                                                <Divider className="my-2" />
                                                <div className="flex justify-between text-xs">
                                                    <Tooltip title="更新时间">
                                                        <div className="flex">
                                                            {dayjs(selValue?.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                                                        </div>
                                                    </Tooltip>
                                                    <div className="flex">{selValue?.creator}</div>
                                                </div>
                                                <div className=" absolute top-4 right-4 flex gap-2">
                                                    <Tooltip title="切换插件">
                                                        <RetweetOutlined
                                                            onClick={(e) => {
                                                                setRedBookData({});
                                                                selPlug();
                                                                e.stopPropagation();
                                                            }}
                                                            className="cursor-pointer hover:text-[#673ab7] text-lg"
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="删除插件">
                                                        <DeleteOutlined
                                                            onClick={(e) => {
                                                                setRedBookData({});
                                                                setSelValue(null);
                                                                e.stopPropagation();
                                                            }}
                                                            className="cursor-pointer hover:text-[#ff4d4f] text-lg"
                                                        />
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        )}
                                    </Form.Item>
                                </Form>
                                <div className="flex mt-4 justify-center">
                                    <Button onClick={handleSave} className="w-[100px]" type="primary">
                                        保存
                                    </Button>
                                </div>
                            </div>
                        )
                    },
                    {
                        label: '触发历史',
                        key: '2',
                        disabled: rowData ? false : true,
                        children: <Table columns={column} dataSource={TableData} />
                    }
                ]}
            ></Tabs>
            <Modal title="选择执行的插件" width={'60%'} open={open} onCancel={() => setOpen(false)} footer={false}>
                <div className="w-full grid justify-content-center gap-4 responsive-list-container md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
                    {definitionList?.map((el: any) => (
                        <div
                            onClick={() => {
                                setSelValue(el);
                                setPlugRecord(null);
                                setOpen(false);
                            }}
                            className="p-4 border border-solid border-[#d9d9d9] rounded-lg hover:border-[#673ab7] cursor-pointer hover:shadow-md relative"
                            key={el.uid}
                        >
                            <div className="flex gap-4">
                                {el.avatar ? (
                                    <Avatar shape="square" size={64} src={el.avatar} />
                                ) : (
                                    <Avatar shape="square" size={64} icon={<AppstoreFilled />} />
                                )}
                                <div className="flex-1">
                                    <div className="text-[18px] font-bold">{el.pluginName}</div>
                                    <div className="line-clamp-3 h-[66px]">{el.description}</div>
                                </div>
                            </div>
                            <Divider className="my-2" />
                            <div className="flex justify-between text-xs">
                                <Tooltip title="更新时间">
                                    <div className="flex">{dayjs(el.updateTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                </Tooltip>
                                <div className="flex">{el.creator}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
            <PlugAnalysis
                metaData={metaData}
                columns={columns}
                onOpenChange={setPlugOpen}
                open={plugOpen}
                record={plugRecord}
                redBookData={redBookData}
                setRedBookData={setRedBookData}
                form={forms}
            />
        </Modal>
    );
};
export default TriggerModal;