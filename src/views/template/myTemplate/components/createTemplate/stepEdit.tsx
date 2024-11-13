import { Tabs, Button, Table, Tooltip, Switch, Popconfirm, Tag, Input, Space } from 'antd';
import type { TableProps } from 'antd';
import { InfoCircleOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ArrangeModal from './arrangeModal';
import FormExecute from 'views/template/components/newValidaForm';
import CreateTab from 'views/pages/copywriting/components/spliceCmponents/tab';
import CreateVariable from 'views/pages/copywriting/components/spliceCmponents/variable';
import NewPrompt from './newPrompt';
import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import _ from 'lodash-es';
import useUserStore from 'store/user';
import HeaderField from 'views/pages/batchSmallRedBooks/components/components/headerField';
import { getMaterialTitle } from 'api/redBook/material';
import { EditType } from 'views/materialLibrary/detail';

import { HolderOutlined } from '@ant-design/icons';
import { Resizable } from 'react-resizable';
import type { DragEndEvent } from '@dnd-kit/core';
import { EditableProTable } from '@ant-design/pro-components';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
const ResizeableTitle = (props: any) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width} height={0} onResize={onResize} draggableOpts={{ enableUserSelectHack: false }}>
            <th {...restProps} />
        </Resizable>
    );
};

interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}
const RowContext = React.createContext<RowContextProps>({});
const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button type="text" size="small" icon={<HolderOutlined />} style={{ cursor: 'move' }} ref={setActivatorNodeRef} {...listeners} />
    );
};
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}
const Row: React.FC<RowProps> = (props) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key']
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
    };

    const contextValue = useMemo<RowContextProps>(() => ({ setActivatorNodeRef, listeners }), [setActivatorNodeRef, listeners]);

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};
const StepEdit = ({
    detail,
    setdetail,
    appUid,
    stepLists,
    variableStyle, //变量类型
    index, //步骤几
    variable, //变量
    setVariable, //改变变量的值
    variables,
    fields, //步骤 field
    handler, //步骤 Code
    upHandler, //图片是否显示
    syszanVariable, //图片生成列表
    basisChange, //改变 prompt
    resReadOnly, //响应类型是否禁用
    resType, //响应类型
    resJsonSchema, //响应数据
    saveImageStyle, //保存图片风格
    setTableTitle,
    detailPre,
    setDetailPre
}: {
    detail: any;
    setdetail: (data: any) => void;
    appUid: string;
    stepLists: any[];
    variableStyle: any[];
    index: number;
    variable: any[];
    setVariable: (data: any, flag?: boolean) => void;
    variables: any[];
    fields: string;
    handler: string;
    upHandler: string;
    syszanVariable: any[];
    basisChange: (data: any) => void;
    resReadOnly: boolean;
    resType: string;
    resJsonSchema: string;
    saveImageStyle: () => void;
    setTableTitle: () => void;
    detailPre: number;
    setDetailPre: (data: number) => void;
}) => {
    const { TextArea } = Input;
    const groupList = [
        { label: '系统变量', value: 'SYSTEM' },
        { label: '通用变量', value: 'PARAMS' },
        { label: '高级变量', value: 'ADVANCED' }
    ];
    const columns: TableProps<any>['columns'] = [
        {
            title: '变量 KEY',
            dataIndex: 'field',
            align: 'center'
        },
        {
            title: '变量名称',
            dataIndex: 'label',
            align: 'center'
        },
        {
            title: '变量默认值',
            align: 'center',
            render: (_, row) => <div className="line-clamp-3">{row?.defaultValue}</div>
        },
        {
            title: '变量状态',
            align: 'center',
            render: (_, row) => <Tag color={row?.isShow ? 'processing' : 'warning'}>{row?.isShow ? '显示' : '隐藏'}</Tag>
        },
        {
            title: '变量类型',
            align: 'center',
            render: (_, row) => <span>{variableStyle?.find((item) => item.value === row.style)?.label}</span>
        },
        {
            title: '变量分组',
            align: 'center',
            render: (_, row) => <span>{groupList?.find((item) => item.value === row.group)?.label}</span>
        },
        {
            title: '操作',
            align: 'center',
            render: (_, row, i) => (
                <Space>
                    <Button
                        onClick={() => {
                            setTitle('编辑');
                            setRowIndex(i);
                            setItemData(row);
                            setOpen(true);
                        }}
                        size="small"
                        shape="circle"
                        icon={<SettingOutlined />}
                        type="primary"
                    />

                    {row.group === 'SYSTEM' ? (
                        <Button
                            size="small"
                            shape="circle"
                            icon={<DeleteOutlined />}
                            disabled={row.group === 'SYSTEM'}
                            danger
                            type="primary"
                        />
                    ) : (
                        <Popconfirm
                            title="删除变量"
                            description="是否确认删除这条数据"
                            onConfirm={() => {
                                const newList = JSON.parse(JSON.stringify(variable));
                                newList.splice(i, 1);
                                setVariable(newList);
                            }}
                            onCancel={() => {}}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button
                                size="small"
                                shape="circle"
                                icon={<DeleteOutlined />}
                                disabled={row.group === 'SYSTEM'}
                                danger
                                type="primary"
                            />
                        </Popconfirm>
                    )}
                </Space>
            )
        }
    ];
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [rowIndex, setRowIndex] = useState<number>(-1);
    const [itemData, setItemData] = useState<any>({});
    const saveContent = ({ values, options }: any) => {
        if (title === '新增') {
            if (variable) {
                setVariable([{ ...values, options }, ...variable]);
                setOpen(false);
            } else {
                setVariable([{ ...values, options }]);
                setOpen(false);
            }
        } else {
            const newList = _.cloneDeep(variable);
            newList[rowIndex] = { ...values, options };
            setVariable(newList);
            setOpen(false);
        }
    };
    //新增文案与风格
    const [focuActive, setFocuActive] = useState<any[]>([]);
    const [titleList, setTitleList] = useState<any[]>([]);
    const materialTypeStatus = useMemo(() => {
        if (handler === 'MaterialActionHandler') {
            return titleList?.length === 1 && titleList[0]?.columnType === EditType.Image ? true : false;
        } else {
            return false;
        }
    }, [titleList]);
    const [libraryId, setLibraryId] = useState('');
    useEffect(() => {
        if (appUid && handler === 'MaterialActionHandler') {
            getMaterialTitle({ appUid }).then((res) => {
                setLibraryId(res.id);
                setTitleList(res.tableMeta);
            });
        }
    }, [appUid]);

    //表格
    const components = {
        header: {
            cell: ResizeableTitle
        },
        body: { row: Row }
    };
    const actionRef = useRef<any>();
    const materialFieldTypeList = [
        { label: 'AI 生成', value: 'AI_CUSTOM' },
        { label: 'AI 仿写', value: 'AI_PARODY' },
        { label: '随机获取', value: 'RANDOM' }
    ];
    const editColumns: any = [
        { key: 'sort', align: 'center', width: 80, render: () => <DragHandle />, editable: false },
        {
            title: '字段名称',
            align: 'center',
            width: 200,
            required: true,
            dataIndex: 'name',
            formItemProps: {
                component: <Input />,
                rules: [
                    {
                        required: true,
                        message: '请输入字段名称'
                    },
                    {
                        max: 20,
                        message: '字段名称不能超过 20 个字'
                    },
                    {
                        validator: (rule: any, value: any) => {
                            if (value && editTableData.some((el) => el.name === value)) {
                                return Promise.reject('字段名称重复');
                            }
                            return Promise.resolve();
                        }
                    }
                ]
            }
        },
        {
            title: '字段描述',
            align: 'center',
            width: 400,
            required: true,
            dataIndex: 'description',
            formItemProps: {
                component: <Input />
            }
        },
        {
            title: '字段类型',
            width: 200,
            required: true,
            align: 'center',
            valueType: 'select',
            dataIndex: 'type',
            fieldProps: {
                options: materialFieldTypeList
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '请选择字段类型'
                    }
                ]
            }
        },
        {
            title: '操作',
            align: 'center',
            valueType: 'option',
            width: 60,
            fixed: 'right',
            render: (text: any, row: any, index: any) => (
                <div className="w-full flex justify-center gap-2">
                    <Popconfirm title="提示" description="请再次确认是否要删除" onConfirm={async () => {}} okText="Yes" cancelText="No">
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
    ];
    const timer = useRef<any>(null);
    const [editableKeys, setEditableKeys] = useState<any[]>([]);
    const [editTableData, setEditTableData] = useState<any[]>([]);
    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const newList = (prevState: any) => {
                const activeIndex = prevState.findIndex((record: any) => record.uuid === active?.id);
                const overIndex = prevState.findIndex((record: any) => record.uuid === over?.id);
                return arrayMove(prevState, activeIndex, overIndex);
            };
            setEditTableData(newList(editTableData));
        }
    };

    const stepEtch = (index: number, name: string, field: string): string => {
        if (editTableData.some((item: any) => item[field] === name + index)) {
            return stepEtch(index + 1, name, field);
        } else {
            return name + index;
        }
    };

    useEffect(() => {
        if (detail && handler === 'AssembleActionHandler' && !detailPre) {
            setDetailPre(1);
            const newList = detail?.workflowConfig?.steps
                ?.filter((item: any) => item?.flowStep?.handler === 'CustomActionHandler')
                ?.map((item: any, index: number) => ({
                    ...item,
                    uuid: item.uuid || uuidv4(),
                    type: item?.variable?.variables?.find((el: any) => el.field === 'GENERATE_MODE')?.value
                }));
            setEditTableData(newList || []);
            setEditableKeys(newList?.map((item: any) => item.uuid) || []);
        }
    }, [detail, detailPre]);
    useEffect(() => {
        if (editTableData) {
            setdetail(editTableData);
        }
    }, [editTableData]);
    return (
        <div>
            <Tabs>
                {handler === 'MaterialActionHandler' && (
                    <Tabs.TabPane tab="素材字段编辑" key="-1">
                        <HeaderField libraryId={libraryId} setPattern={setTitleList} headerSave={setTableTitle} />
                    </Tabs.TabPane>
                )}
                {handler === 'MaterialActionHandler' && (
                    <Tabs.TabPane tab="拼图生成模式" key="0">
                        <div className="flex gap-2 items-center mr-4">
                            <div className="flex gap-1">
                                拼图生成模式
                                <Tooltip title="方便批量上传图片，图片会随机放在 图片风格模版中进行生成(当素材只有一个图片类型的字段的时候可开启此功能)">
                                    <InfoCircleOutlined className="cursor-pointer" />
                                </Tooltip>
                            </div>
                            <Switch
                                checked={upHandler === 'default' ? false : true}
                                disabled={!materialTypeStatus}
                                onChange={(e) => {
                                    const newList = _.cloneDeep(variable);
                                    newList.find((item) => item.field === 'BUSINESS_TYPE').value = e ? 'picture' : 'default';
                                    setVariable(newList);
                                }}
                            />
                        </div>
                    </Tabs.TabPane>
                )}
                {handler === 'PosterActionHandler' && (
                    <Tabs.TabPane tab="系统风格模版配置" key="1">
                        <div className="relative">
                            <Button
                                className="w-[100px] absolute right-[10px]"
                                type="primary"
                                onClick={() => {
                                    setTimeout(() => {
                                        saveImageStyle();
                                    }, 0);
                                }}
                            >
                                保存
                            </Button>
                            <CreateTab
                                materialStatus={upHandler}
                                appData={{ materialType: upHandler, appReqVO: detail }}
                                imageStyleData={syszanVariable}
                                setImageStyleData={(data) => {
                                    const newList = _.cloneDeep(variables);
                                    newList.find((item) => item.field === 'SYSTEM_POSTER_STYLE_CONFIG').value = data;
                                    setVariable(newList, true);
                                }}
                                focuActive={focuActive}
                                setFocuActive={setFocuActive}
                                digui={() => {
                                    const newData = syszanVariable?.map((i: any) => i.name.split(' ')[1]);
                                    if (!newData || newData?.every((i: any) => !i)) {
                                        return 1;
                                    }
                                    return newData?.map((i: any) => Number(i))?.sort((a: any, b: any) => b - a)[0] * 1 + 1;
                                }}
                            />
                        </div>
                    </Tabs.TabPane>
                )}
                {handler === 'VariableActionHandler' && (
                    <Tabs.TabPane tab="变量" key="2">
                        <CreateVariable
                            rows={variable}
                            detail={detail}
                            setRows={(data: any[]) => {
                                const newTable = data?.map((item) => ({
                                    ...item,
                                    isShow: false
                                }));
                                setVariable(newTable);
                            }}
                        />
                    </Tabs.TabPane>
                )}
                {handler === 'AssembleActionHandler' && (
                    <Tabs.TabPane tab="内容生成字段" key="7">
                        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                            <SortableContext items={editTableData.map((i) => i.uuid)} strategy={verticalListSortingStrategy}>
                                <EditableProTable<any>
                                    className="edit-table"
                                    rowKey={'uuid'}
                                    maxLength={50}
                                    tableAlertRender={false}
                                    components={components}
                                    rowSelection={false}
                                    editableFormRef={actionRef}
                                    toolBarRender={false}
                                    columns={editColumns}
                                    value={editTableData}
                                    pagination={false}
                                    recordCreatorProps={{
                                        newRecordType: 'dataSource',
                                        creatorButtonText: '增加字段',
                                        record: () => {
                                            const field = stepEtch(
                                                1,
                                                stepLists?.find((item) => item?.flowStep?.handler === 'CustomActionHandler')?.name,
                                                'name'
                                            );
                                            return {
                                                uuid: uuidv4(),
                                                type: 'AI_CUSTOM',
                                                ...stepLists?.find((item) => item?.flowStep?.handler === 'CustomActionHandler'),
                                                name: field,
                                                field
                                            };
                                        }
                                    }}
                                    editable={{
                                        type: 'multiple',
                                        editableKeys: editableKeys,
                                        actionRender: (row, config, defaultDoms) => {
                                            return [
                                                <Button
                                                    onClick={() => {
                                                        setEditTableData(editTableData.filter((item, index) => index !== row.index));
                                                    }}
                                                    type="link"
                                                    danger
                                                >
                                                    删除
                                                </Button>
                                            ];
                                        },
                                        onValuesChange: (record, recordList) => {
                                            clearTimeout(timer.current);
                                            timer.current = setTimeout(() => {
                                                let newList = _.cloneDeep(recordList);
                                                newList.forEach((item, index) => {
                                                    item.field = item.name;
                                                });
                                                setEditTableData(newList);
                                            }, 500);
                                        },
                                        onChange: setEditableKeys
                                    }}
                                />
                            </SortableContext>
                        </DndContext>
                    </Tabs.TabPane>
                )}
                {handler !== 'MaterialActionHandler' &&
                    handler !== 'VariableActionHandler' &&
                    handler !== 'AssembleActionHandler' &&
                    handler !== 'PosterActionHandler' && (
                        <Tabs.TabPane tab="变量" key="3">
                            {handler === 'OpenAIChatActionHandler' && (
                                <div className="flex justify-end items-center mb-4">
                                    <div className="flex gap-2">
                                        <Tooltip title={'变量将以表单形式让用户在执行前填写,用户填写的表单内容将自动替换提示词中的变量'}>
                                            <InfoCircleOutlined className="cursor-pointer" />
                                        </Tooltip>
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => {
                                                setOpen(true);
                                                setTitle('新增');
                                            }}
                                        >
                                            新增
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <Table rowKey={(record: any) => record.field} columns={columns} dataSource={variable} pagination={false} />
                        </Tabs.TabPane>
                    )}
                {handler !== 'MaterialActionHandler' &&
                    handler !== 'VariableActionHandler' &&
                    handler !== 'AssembleActionHandler' &&
                    handler !== 'PosterActionHandler' &&
                    handler !== 'XhsParseActionHandler' && (
                        <Tabs.TabPane tab="提示词" key="4">
                            {variables?.map(
                                (item, i) =>
                                    item?.field === 'prompt' && (
                                        <NewPrompt
                                            key={item.field}
                                            el={item}
                                            handler={handler}
                                            variable={variable}
                                            fields={fields}
                                            index={index}
                                            i={i}
                                            variables={variables}
                                            basisChange={basisChange}
                                        />
                                    )
                            )}
                        </Tabs.TabPane>
                    )}
                {handler !== 'MaterialActionHandler' &&
                    handler !== 'VariableActionHandler' &&
                    handler !== 'AssembleActionHandler' &&
                    handler !== 'PosterActionHandler' &&
                    handler !== 'XhsParseActionHandler' && (
                        <Tabs.TabPane tab="大模型" key="5">
                            {variables?.map(
                                (item, i) =>
                                    item.field !== 'prompt' &&
                                    item.field !== 'n' &&
                                    item.field !== 'SYSTEM_POSTER_STYLE_CONFIG' && (
                                        <FormExecute
                                            key={item?.field}
                                            item={item}
                                            onChange={(e: any) => basisChange({ e, index, i, flag: false, values: true })}
                                        />
                                    )
                            )}
                        </Tabs.TabPane>
                    )}
                {handler !== 'VariableActionHandler' &&
                    handler !== 'AssembleActionHandler' &&
                    handler !== 'PosterActionHandler' &&
                    handler !== 'MaterialActionHandler' && (
                        <Tabs.TabPane tab="返回结果" key="6">
                            <FormControl fullWidth>
                                <InputLabel color="secondary" id="responent">
                                    响应类型
                                </InputLabel>
                                <Select
                                    disabled={resReadOnly}
                                    color="secondary"
                                    onChange={(e) => {
                                        basisChange({ e: e.target, index, i: 0, flag: false });
                                    }}
                                    name="type"
                                    labelId="responent"
                                    value={resType}
                                    label="响应类型"
                                >
                                    <MenuItem value={'TEXT'}>文本类型</MenuItem>
                                    <MenuItem value={'JSON'}>JSON 类型</MenuItem>
                                </Select>
                            </FormControl>
                            {resType === 'JSON' && (
                                <TextArea
                                    disabled={resReadOnly}
                                    defaultValue={resJsonSchema}
                                    className="mt-[16px]"
                                    style={{ height: '200px' }}
                                    onBlur={(e) => {
                                        basisChange({ e: { name: 'output', value: e.target.value }, index, i: 0, flag: false });
                                    }}
                                />
                            )}
                        </Tabs.TabPane>
                    )}
            </Tabs>
            {open && (
                <ArrangeModal
                    title={title}
                    open={open}
                    setOpen={() => {
                        setRowIndex(-1);
                        setItemData({});
                        setOpen(false);
                    }}
                    detail={{ type: 'MEDIA_MATRIX' }}
                    variableStyle={variableStyle}
                    row={itemData}
                    changevariable={saveContent}
                />
            )}
        </div>
    );
};
export default StepEdit;
