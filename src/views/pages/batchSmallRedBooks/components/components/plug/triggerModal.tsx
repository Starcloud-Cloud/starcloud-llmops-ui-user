import { Modal, Tabs, Form, Input, Select, Cascader, Button, Collapse, Table, Tag, Popover, Switch } from 'antd';
import { AppstoreFilled, DeleteOutlined, RetweetOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import { getPlugConfigInfo, createConfig, getPlugInfo, getMetadata, modifyConfig, pageJob } from 'api/plug';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import ChatMarkdown from 'ui-component/Markdown';
import Editor, { loader } from '@monaco-editor/react';
const { Option } = Select;
const TriggerModal = ({
    triggerOpen,
    setTriggerOpen,
    libraryUid,
    foreignKey,
    rowData,
    record,
    columns,
    setRowPre
}: {
    triggerOpen: boolean;
    setTriggerOpen: (data: boolean) => void;
    libraryUid: string;
    foreignKey: string;
    rowData: any;
    record: any;
    columns: any[];
    setRowPre: () => void;
}) => {
    const value2JsonMd = (value: any) => `
~~~json
${JSON.stringify(value, null, 2)}
~~~
`;
    const [form] = Form.useForm();
    const [timeExpressionTypeList, settimeExpressionTypeList] = useState<any[]>([]);
    const timeList = [
        { value: '0 0 0', label: '00:00' },
        { value: '0 30 0', label: '00:30' },
        { value: '0 0 1', label: '01:00' },
        { value: '0 30 1', label: '01:30' },
        { value: '0 0 2', label: '02:00' },
        { value: '0 30 2', label: '02:30' },
        { value: '0 0 3', label: '03:00' },
        { value: '0 30 3', label: '03:30' },
        { value: '0 0 4', label: '04:00' },
        { value: '0 30 4', label: '04:30' },
        { value: '0 0 5', label: '05:00' },
        { value: '0 30 5', label: '05:30' },
        { value: '0 0 6', label: '06:00' },
        { value: '0 30 6', label: '06:30' },
        { value: '0 0 7', label: '07:00' },
        { value: '0 30 7', label: '07:30' },
        { value: '0 0 8', label: '08:00' },
        { value: '0 30 8', label: '08:30' },
        { value: '0 0 9', label: '09:00' },
        { value: '0 30 9', label: '09:30' },
        { value: '0 0 10', label: '10:00' },
        { value: '0 30 10', label: '10:30' },
        { value: '0 0 11', label: '11:00' },
        { value: '0 30 11', label: '11:30' },
        { value: '0 0 12', label: '12:00' },
        { value: '0 30 12', label: '12:30' },
        { value: '0 0 13', label: '13:00' },
        { value: '0 30 13', label: '13:30' },
        { value: '0 0 14', label: '14:00' },
        { value: '0 30 14', label: '14:30' },
        { value: '0 0 15', label: '15:00' },
        { value: '0 30 15', label: '15:30' },
        { value: '0 0 16', label: '16:00' },
        { value: '0 30 16', label: '16:30' },
        { value: '0 0 17', label: '17:00' },
        { value: '0 30 17', label: '17:30' },
        { value: '0 0 18', label: '18:00' },
        { value: '0 30 18', label: '18:30' },
        { value: '0 0 19', label: '19:00' },
        { value: '0 30 19', label: '19:30' },
        { value: '0 0 20', label: '20:00' },
        { value: '0 30 20', label: '20:30' },
        { value: '0 0 21', label: '21:00' },
        { value: '0 30 21', label: '21:30' },
        { value: '0 0 22', label: '22:00' },
        { value: '0 30 22', label: '22:30' },
        { value: '0 0 23', label: '23:00' },
        { value: '0 30 23', label: '23:30' }
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
        const newList = redBookData.requirement?.map((item: any) => ({
            ...item,
            variableValue: formRes[item.variableKey]
        }));
        if (rowData) {
            await modifyConfig({
                ...rowData,
                timeExpressionType: formRes.timeExpressionType,
                foreignKey,
                enable: formRes.enable,
                timeExpression: _.cloneDeep(formRes.timeExpression)?.reverse()?.join(' ')?.trim(),
                businessJobType: 'coze_standalone',
                config: {
                    executeParams: JSON.stringify({
                        ...formRes,
                        timeExpressionType: undefined,
                        timeExpression: undefined
                    }),
                    businessJobType: 'coze_standalone',
                    fieldMap: JSON.stringify(redBookData.bindFieldData) || null,
                    paramsDefine: JSON.stringify(newList) || null,
                    libraryUid: libraryUid,
                    pluginUid: record?.pluginUid,
                    pluginName: record.pluginName
                }
            });
        } else {
            await createConfig({
                name: record.pluginName + '触发器',
                timeExpressionType: formRes.timeExpressionType,
                foreignKey,
                enable: formRes.enable,
                timeExpression: _.cloneDeep(formRes.timeExpression)?.reverse()?.join(' ')?.trim(),
                businessJobType: 'coze_standalone',
                config: {
                    executeParams: JSON.stringify({
                        ...formRes,
                        timeExpressionType: undefined,
                        timeExpression: undefined
                    }),
                    businessJobType: 'coze_standalone',
                    fieldMap: JSON.stringify(redBookData.bindFieldData) || null,
                    paramsDefine: JSON.stringify(newList) || null,
                    libraryUid: libraryUid,
                    pluginUid: record?.pluginUid,
                    pluginName: record.pluginName
                }
            });
        }
        setRowPre();
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

    const [redBookData, setRedBookData] = useState<any>({});
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

    useEffect(() => {
        if (rowData) {
            let data: any[] = [];
            console.log(redList);
            const fielfMap = JSON.parse(rowData?.config?.fieldMap || '{}');
            const obj = JSON.parse(rowData?.config?.executeParams || '{}');
            const bindFieldData: any = {};
            redList.forEach((redItem: any) => {
                const value = fielfMap[redItem?.value];
                data.push({
                    label: redItem.label,
                    label_key: redItem.value,
                    des: redItem.des,
                    value: value
                });
            });
            console.log(data);
            const filterData = data.filter((item: any) => item.value);
            const fieldList = filterData.map((item: any) => item.label_key);
            filterData.forEach((item: any) => {
                bindFieldData[item.label_key] = item.value;
            });
            setRedBookData((pre: any) => ({
                ...pre,
                requirement: JSON.parse(rowData?.config?.paramsDefine || '[]'),
                fieldList: fieldList,
                bindFieldData
            }));
            setData(data);
            form.setFieldsValue({
                timeExpressionType: rowData?.timeExpressionType,
                enable: rowData?.enable,
                timeExpression: getValue(timeExpressionList),
                ...obj
            });
        }
    }, [rowData]);

    const [data, setData] = useState<any[]>([]);
    const redList = useMemo(() => {
        const outputFormart = JSON.parse(record?.outputFormart) || [];
        return (
            outputFormart?.map((item: any) => ({
                label: item.variableKey,
                des: item.variableDesc,
                value: item.variableKey,
                tip: item.variableValue
            })) || []
        );
    }, [record]);
    useEffect(() => {
        if (!record?.fieldMap && !rowData) {
            let data: any[] = [];
            redList.forEach((redItem: any) => {
                const value =
                    columns
                        .filter((item) => !item.isDefault)
                        .filter((item) => item.type !== 5) // 只有文本
                        .find((item) => item.titleText === redItem.des)?.dataIndex ||
                    columns
                        .filter((item) => !item.isDefault)
                        .filter((item) => item.type !== 5) // 只有文本
                        .find((item) => item.dataIndex === redItem.value)?.dataIndex;
                data.push({
                    label: redItem.label,
                    label_key: redItem.value,
                    des: redItem.des,
                    value: value
                });
            });

            const filterData = data.filter((item: any) => item.value);
            const fieldList = filterData.map((item: any) => item.label_key);
            console.log(fieldList);

            const obj: any = {};
            filterData.forEach((item: any) => {
                obj[item.label_key] = item.value;
            });

            setRedBookData((pre: any) => ({
                ...pre,
                requirement: JSON.parse(record.inputFormart || '[]')?.map((item: any, index: number) => ({
                    ...item,
                    variableDesc:
                        JSON.parse(record.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableDesc ||
                        item?.variableDesc,
                    variableValue:
                        JSON.parse(record.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableValue ||
                        item?.variableValue
                })),
                fieldList: fieldList,
                bindFieldData: obj
            }));
            setData(data);
        }
    }, [columns, record]);
    useEffect(() => {
        if (record.fieldMap && !rowData) {
            const fieldMap = JSON.parse(record.fieldMap || '{}');

            const data = redList.map((redItem: any, index: number) => {
                return {
                    label: redItem.label,
                    label_key: redItem.value,
                    des: redItem.des,
                    value: columns.map((item) => item.dataIndex).includes(fieldMap?.[redItem.value]) ? fieldMap?.[redItem.value] : ''
                };
            });

            const filterData = data.filter((item: any) => item.value);
            const fieldList = filterData.map((item: any) => item.label_key);
            console.log(fieldList);

            const obj: any = {};
            filterData.forEach((item: any) => {
                obj[item.label_key] = item.value;
            });

            setRedBookData((pre: any) => ({
                ...pre,
                requirement: JSON.parse(record.inputFormart || '[]')?.map((item: any, index: number) => ({
                    ...item,
                    variableDesc:
                        JSON.parse(record.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableDesc ||
                        item?.variableDesc ||
                        '',
                    variableValue:
                        JSON.parse(record.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableValue ||
                        item?.variableValue
                })),
                fieldList: fieldList,
                bindFieldData: obj
            }));

            setData(data);
        }
    }, [columns, record]);

    //触发历史
    const column: TableColumnsType<any> = [
        {
            title: '插件名称',
            dataIndex: 'pluginName',
            width: 200,
            align: 'center'
        },
        {
            title: '触发器类型',
            align: 'center',
            width: 200,
            render: (_, row) => <div>{timeExpressionTypeList?.find((item) => item.value === row.triggerType)?.label}</div>
        },
        {
            title: '执行状态',
            align: 'center',
            width: 100,
            render: (_, row) => <Tag color={row?.success ? 'success' : 'error'}>{row?.success ? '执行成功' : '执行失败'}</Tag>
        },
        {
            title: '执行数量',
            align: 'center',
            width: 100,
            dataIndex: 'count'
        },
        {
            title: '执行结果',
            align: 'center',
            width: 400,
            render: (_, row) => (
                <Popover content={row.executeResult}>
                    <div className="line-clamp-4">{row.executeResult}</div>
                </Popover>
            )
        },
        {
            title: '总耗时(s)',
            dataIndex: 'executeTime',
            align: 'center',
            width: 100,
            render: (_, row) => <div>{row.executeTime / 1000}</div>
        },
        {
            title: '触发时间',
            align: 'center',
            width: 200,
            render: (_, row) => <div>{dayjs(row.triggerTime).format('YYYY-MM-DD HH:mm:ss')}</div>
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
    //form 表单校验
    const parseInputToArray = (input: any) => {
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
                return parsed;
            }
        } catch (e) {
            return input;
        }
    };
    const isArrayString = (value: any) => {
        return Array.isArray(value) && value.every((item) => typeof item === 'string');
    };
    useEffect(() => {
        getList();
    }, []);
    useEffect(() => {
        loader.config({
            paths: {
                vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs'
            }
        });
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
                                <Form form={form} layout={'vertical'} labelCol={{ span: 12 }}>
                                    <Form.Item required label="是否启用" name="enable" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item
                                        label="触发器类型"
                                        name="timeExpressionType"
                                        initialValue={2}
                                        rules={[{ required: true, message: '触发器类型必填' }]}
                                    >
                                        <Select disabled options={timeExpressionTypeList} />
                                    </Form.Item>
                                    <Form.Item
                                        label="触发时间"
                                        name="timeExpression"
                                        rules={[{ type: 'array', required: true, message: '触发时间必填' }]}
                                    >
                                        <Cascader displayRender={(label) => label.join(' ')} options={timeExpressionList} />
                                    </Form.Item>
                                    <Collapse
                                        defaultActiveKey={['1']}
                                        items={[
                                            {
                                                key: '1',
                                                label: '参数设置',
                                                children: (
                                                    <div className="flex justify-center">
                                                        <div className="w-[70%]">
                                                            <div className="text-[16px] font-bold mb-4">
                                                                1.输入参数
                                                                <Popover
                                                                    content={
                                                                        <div className="w-[500px] max-h-[300px] overflow-auto">
                                                                            <ChatMarkdown
                                                                                textContent={value2JsonMd(JSON.parse(record.input))}
                                                                            />
                                                                        </div>
                                                                    }
                                                                    title="参数示例"
                                                                >
                                                                    <QuestionCircleOutlined className="ml-1 cursor-pointer" />
                                                                </Popover>
                                                            </div>
                                                            {redBookData.requirement?.map((item: any) =>
                                                                item.variableType === 'String' ? (
                                                                    <Form.Item
                                                                        initialValue={item.variableValue}
                                                                        key={item.uuid}
                                                                        label={
                                                                            item.variableKey +
                                                                            (item.variableDesc ? `(${item.variableDesc})` : '')
                                                                        }
                                                                        name={item.variableKey}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: item.variableKey + '是必填项'
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Input />
                                                                    </Form.Item>
                                                                ) : item.variableType === 'Array<String>' ? (
                                                                    <Form.Item
                                                                        required
                                                                        label={
                                                                            item.variableKey +
                                                                            (item.variableDesc ? `(${item.variableDesc})` : '')
                                                                        }
                                                                    >
                                                                        <div className="flex items-center relative bg-[#F4F4F6] px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                                                            <span>json</span>
                                                                        </div>
                                                                        <Form.Item
                                                                            initialValue={item.variableValue || '[]'}
                                                                            name={item.variableKey}
                                                                            rules={[
                                                                                { required: true, message: item.variableKey + '是必填项' },
                                                                                {
                                                                                    validator: (_, value) => {
                                                                                        if (!value) {
                                                                                            return Promise.resolve();
                                                                                        }
                                                                                        const parsedValue = parseInputToArray(value);
                                                                                        if (isArrayString(parsedValue)) {
                                                                                            return Promise.resolve();
                                                                                        }
                                                                                        return Promise.reject(
                                                                                            new Error('请输入正确的JSON结构')
                                                                                        );
                                                                                    }
                                                                                }
                                                                            ]}
                                                                        >
                                                                            <Editor
                                                                                className="border border-solid border-[#e1e1e4] rounded-b-md overflow-hidden border-t-transparent"
                                                                                height="200px"
                                                                                defaultLanguage="json"
                                                                                options={{
                                                                                    minimap: { enabled: false }
                                                                                }}
                                                                                onChange={(value: any) => {}}
                                                                            />
                                                                        </Form.Item>
                                                                    </Form.Item>
                                                                ) : item.variableType === 'Boolean' ? (
                                                                    <Form.Item
                                                                        valuePropName="checked"
                                                                        initialValue={item.variableValue}
                                                                        key={item.uuid}
                                                                        label={
                                                                            item.variableKey +
                                                                            (item.variableDesc ? `(${item.variableDesc})` : '')
                                                                        }
                                                                        name={item.variableKey}
                                                                        rules={[{ required: true, message: item.variableKey + '是必填项' }]}
                                                                    >
                                                                        <Switch />
                                                                    </Form.Item>
                                                                ) : null
                                                            )}
                                                            <div className="text-[16px] font-bold my-4 flex">
                                                                2.输出字段绑定
                                                                <Popover
                                                                    content={
                                                                        <div className="w-[500px] max-h-[300px] overflow-auto">
                                                                            <ChatMarkdown
                                                                                textContent={value2JsonMd(JSON.parse(record.output))}
                                                                            />
                                                                        </div>
                                                                    }
                                                                    title="参数示例"
                                                                >
                                                                    <QuestionCircleOutlined className="ml-1 cursor-pointer" />
                                                                </Popover>
                                                            </div>
                                                            <Table
                                                                pagination={false}
                                                                bordered
                                                                size="small"
                                                                columns={[
                                                                    {
                                                                        title: '字段',
                                                                        dataIndex: 'des',
                                                                        align: 'center',
                                                                        width: '40%',
                                                                        render: (_, record) => record.des || record.label
                                                                    },
                                                                    {
                                                                        title: '绑定到',
                                                                        align: 'center',
                                                                        width: '20%',
                                                                        render: () => (
                                                                            <svg
                                                                                viewBox="0 0 1024 1024"
                                                                                version="1.1"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                p-id="7263"
                                                                                width="20"
                                                                                height="20"
                                                                            >
                                                                                <path
                                                                                    d="M170.666667 426.666667v170.666666h384l-149.333334 149.333334 103.253334 103.253333L846.506667 512l-337.92-337.92L405.333333 277.333333 554.666667 426.666667H170.666667z"
                                                                                    fill="#8a8a8a"
                                                                                    p-id="7264"
                                                                                ></path>
                                                                            </svg>
                                                                        )
                                                                    },
                                                                    {
                                                                        title: '素材字段',
                                                                        dataIndex: 'value',
                                                                        align: 'center',
                                                                        width: '40%',
                                                                        render: (_, record) => {
                                                                            return (
                                                                                data.length > 0 && (
                                                                                    <Select
                                                                                        style={{ width: 160 }}
                                                                                        allowClear
                                                                                        value={record.value}
                                                                                        onChange={(value) => {
                                                                                            let fieldList = redBookData.fieldList || [];
                                                                                            console.log(fieldList);

                                                                                            let bindFieldData = redBookData.bindFieldData;
                                                                                            if (value) {
                                                                                                fieldList = [
                                                                                                    ...fieldList,
                                                                                                    record.label_key
                                                                                                ];
                                                                                                bindFieldData[record.label_key] = value;
                                                                                            } else {
                                                                                                fieldList = fieldList.filter(
                                                                                                    (item: any) => item !== record.label_key
                                                                                                );
                                                                                                delete bindFieldData[record.label_key];
                                                                                            }

                                                                                            const copyData = [...data];
                                                                                            const index = copyData.findIndex(
                                                                                                (item) =>
                                                                                                    item.label_key === record.label_key
                                                                                            );
                                                                                            copyData[index].value = value;
                                                                                            setData(copyData);

                                                                                            setRedBookData((pre: any) => {
                                                                                                return {
                                                                                                    ...pre,
                                                                                                    fieldList,
                                                                                                    bindFieldData
                                                                                                };
                                                                                            });
                                                                                        }}
                                                                                    >
                                                                                        {columns
                                                                                            .filter((item) => !item.isDefault)
                                                                                            ?.map((item) => {
                                                                                                return (
                                                                                                    <Option
                                                                                                        key={item.dataIndex}
                                                                                                        value={item.dataIndex}
                                                                                                        disabled={Object.values(
                                                                                                            redBookData.bindFieldData || {}
                                                                                                        ).includes(item.dataIndex)}
                                                                                                    >
                                                                                                        {item.title}
                                                                                                    </Option>
                                                                                                );
                                                                                            })}
                                                                                    </Select>
                                                                                )
                                                                            );
                                                                        }
                                                                    }
                                                                ]}
                                                                dataSource={data}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        ]}
                                    />
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
                        children: <Table columns={column} virtual dataSource={TableData} />
                    }
                ]}
            ></Tabs>
        </Modal>
    );
};
export default TriggerModal;
