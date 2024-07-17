import { Select, Input, Row, Col, Tabs, Space, Button, Modal, Form, message, Popconfirm, Dropdown, Avatar, Switch } from 'antd';
import type { MenuProps, TabsProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import IconSelect, { allIcons } from 'ui-component/IconSelect';
import Icon, {
    ApiOutlined,
    AppstoreOutlined,
    ExclamationCircleFilled,
    MoreOutlined,
    PlusOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { ActionType, CheckCard, ProColumns, ProTable } from '@ant-design/pro-components';
import { addMaterial, delMaterial, getMaterialBindPage, getMaterialPage, updateMaterial } from 'api/material';
import dayjs from 'dayjs';
import { dictData } from 'api/template';
import { useNavigate } from 'react-router-dom';
import HeaderField from '../pages/batchSmallRedBooks/components/components/headerField';
const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;
import './index.scss';

export const IconRenderer = ({ value }: { value: string }) => {
    let SelectedIcon = value.includes('http') ? AppstoreOutlined : allIcons['AppstoreAddOutlined'];
    return <SelectedIcon />;
};

const MaterialLibrary = ({
    mode = 'page',
    setSelectedRowKeys,
    appUid,
    libraryId
}: {
    mode: 'select' | 'page';
    setSelectedRowKeys: (keys: React.Key[]) => void;
    appUid?: string;
    libraryId?: string;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectIcon, setSelectIcon] = useState('');
    const [typeList, setTypeList] = useState<any[]>([]);
    const [record, setRecord] = useState<any>(null);
    const [query, setQuery] = useState<{
        name: string;
    } | null>(null);
    const [activeKey, setActiveKey] = useState<string>('1');

    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();

    useEffect(() => {
        dictData('', 'material_format_type').then((res) => {
            setTypeList(res.list);
        });
    }, []);

    const handleTypeLabel = (value: string) => {
        return typeList.find((v) => v.value === value.toString())?.label || '未知';
    };

    const showConfirm = () => {
        confirm({
            title: '确认',
            icon: <ExclamationCircleFilled />,
            content: '确认删除该条记录?',
            onOk: async () => {
                const data = await delMaterial({ id: record?.id });
                if (data) {
                    message.success('删除成功');
                    actionRef.current?.reload();
                }
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    const items: any = [
        {
            key: '1',
            label: '编辑'
        },
        {
            key: '2',
            label: '删除',
            danger: true
        }
    ];

    const onClick: MenuProps['onClick'] = async ({ key, domEvent }) => {
        domEvent.stopPropagation();
        if (key === '1') {
            setRecord(record);
            form.setFieldsValue(record);
            setIsModalOpen(true);
        } else {
            await showConfirm();
        }
    };

    const columns: ProColumns<any>[] = [
        {
            title: '名称',
            align: 'left',
            dataIndex: 'name',
            renderText: (_, record) => {
                return (
                    <div className="flex items-center">
                        <div className="w-[56px]">
                            <Avatar shape="square" icon={<IconRenderer value={record.iconUrl || 'AreaChartOutlined'} />} size={54} />
                        </div>
                        <div className="ml-2 flex flex-col">
                            <span className="font-extrabold">{record.name}</span>
                            <span className="text-[12px] text-[#06070980]">{record.description}</span>
                        </div>
                    </div>
                );
            }
        },
        // {
        //     title: '描述',
        //     dataIndex: 'description',
        //     search: false,
        //     ellipsis: true
        // },
        // {
        //     title: '类型',
        //     dataIndex: 'formatType',
        //     search: false,
        //     width: 100,
        //     align: 'center',
        //     renderText: (text) => handleTypeLabel(text)
        // },
        {
            title: '数据量',
            dataIndex: 'fileCount',
            search: false,
            width: 80,
            align: 'center',
            renderText: (text) => text || 0,
            sorter: (a, b) => a.fileCount - b.fileCount
        },
        {
            title: '创作者',
            align: 'center',
            dataIndex: 'createName',
            width: 120,
            search: false
        },
        {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            search: false,
            width: 150,
            sorter: (a, b) => a.createTime - b.createTime,
            renderText: (text) => text && dayjs(text).format('YYYY-MM-DD HH:mm')
        }
        // {
        //     title: '启用',
        //     align: 'center',
        //     dataIndex: 'status',
        //     search: false,
        //     width: 80,
        //     renderText: (text, record) => (
        //         <Switch
        //             value={!!text}
        //             onChange={(value, e) => {
        //                 e.stopPropagation();
        //                 handleStatus({ ...record, status: value ? 1 : 0 });
        //             }}
        //         />
        //     )
        // },
    ];

    if (mode === 'page' && activeKey === '1') {
        columns.push({
            title: '操作',
            width: 50,
            search: false,
            align: 'right',
            render: (_, row) => (
                <Dropdown
                    menu={{ items, onClick }}
                    onOpenChange={() => {
                        setRecord(row);
                    }}
                >
                    <MoreOutlined
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="cursor-pointer p-1"
                    />
                </Dropdown>
            )
        });
    }

    const handleStatus = async (record: any) => {
        const data = await updateMaterial(record);
        if (data) {
            message.success('修改成功!');
            setIsModalOpen(false);
            actionRef.current?.reload();
        }
    };

    const handleOk = async () => {
        const values = await form.validateFields();
        const data = record ? await updateMaterial({ ...values, id: record.id }) : await addMaterial({ ...values, status: 1 });
        if (data) {
            message.success('添加成功!');
            setIsModalOpen(false);
            actionRef.current?.reload();
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [form] = Form.useForm();

    return (
        <div className="h-full material-index bg-white">
            {mode === 'page' && (
                <div className="px-6 pt-2">
                    <Button
                        type={'primary'}
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setRecord(null);
                            setIsModalOpen(true);
                        }}
                    >
                        创建知识库
                    </Button>
                </div>
            )}
            <ProTable
                toolbar={{
                    menu: {
                        type: 'tab',
                        items: [
                            {
                                key: '1',
                                label: <span>我的素材库</span>
                            },
                            {
                                key: '0',
                                label: <span>系统素材库</span>
                            }
                        ],
                        onChange: (key) => {
                            setActiveKey(key as string);
                            actionRef.current?.reload();
                        }
                    }
                }}
                rowSelection={
                    mode === 'select' && {
                        onChange(selectedRowKeys, selectedRows, info) {
                            setSelectedRowKeys(selectedRowKeys);
                        },
                        type: 'radio'
                    }
                }
                actionRef={actionRef}
                columns={columns}
                search={false}
                rowKey={'id'}
                request={async (params, sort) => {
                    params.pageNo = params.current;
                    params.name = query?.name;
                    params.libraryType = +activeKey;
                    let sortingFields = [];

                    const key = Object.keys(sort)?.[0];
                    if (sort[key]) {
                        if (key === 'createTime') {
                            sortingFields.push({
                                field: 'create_time',
                                order: sort[key] === 'ascend' ? 'asc' : 'desc'
                            });
                        } else {
                            sortingFields.push({
                                field: 'file_count',
                                order: sort[key] === 'ascend' ? 'asc' : 'desc'
                            });
                        }
                    } else {
                        sortingFields = [];
                    }

                    const data =
                        mode === 'page'
                            ? await getMaterialPage({ ...params, sortingFields })
                            : await getMaterialBindPage({ ...params, sortingFields, appUid, libraryId });
                    return {
                        data: data.list,
                        success: true,
                        total: data.total
                    };
                }}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            navigate(`/material/detail?id=${record.id}`);
                        }
                    };
                }}
                options={false}
                toolBarRender={() => [
                    <Search
                        placeholder="搜索"
                        style={{ width: 200 }}
                        allowClear
                        onSearch={(value) => {
                            setQuery({ name: value });
                            actionRef.current?.reload();
                        }}
                    />
                    // <Select placeholder="请选择分类" value={''} style={{ width: 100 }}>
                    //     <Option value={''}>全部</Option>
                    //     {typeList.map((item, index) => (
                    //         <Option key={index} value={item.value}>
                    //             {item.label}
                    //         </Option>
                    //     ))}
                    // </Select>
                ]}
            />
            {isModalOpen && (
                <Modal width={580} title={record ? '修改知识库' : '新增知识库'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Form layout="vertical" form={form}>
                        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
                            <Input placeholder="填写名称" />
                        </Form.Item>
                        <Form.Item label="描述" name={'description'}>
                            <Input.TextArea placeholder="填写描述" />
                        </Form.Item>
                        {/* <Form.Item label="分类" name="formatType" rules={[{ required: true }]}>
                            <Select placeholder="请选择分类">
                                {typeList.map((item, index) => (
                                    <Option key={index} value={item.value}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item> */}

                        {/* <Icon component={selectIcon as any} />
                        <Form.Item label="图标" name="iconUrl">
                            <IconSelect
                                onChange={(value) => {
                                    setSelectIcon(value);
                                }}
                                value={selectIcon}
                            />
                        </Form.Item> */}
                        <Form.Item name="importType" className="w-full" label="导入类型">
                            {/* <CheckCard.Group style={{ width: '100%' }}> */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <CheckCard
                                        checked
                                        className="w-[100%]"
                                        title="本地文档"
                                        avatar={<UploadOutlined />}
                                        description="上传Excel或者CSV格式的文档"
                                    />
                                </Col>
                                <Col span={12}>
                                    <CheckCard
                                        disabled
                                        className="w-[100%]"
                                        title="API"
                                        avatar={<ApiOutlined />}
                                        description="获取JSON格式API内容(开发中)"
                                    />
                                </Col>
                            </Row>
                            {/* </CheckCard.Group> */}
                        </Form.Item>
                        {/* <Form.Item label="是否系统库" rules={[{ required: true }]}>
                        <Switch />
                    </Form.Item>
                    <Form.Item label="是否分享给团队" rules={[{ required: true }]}>
                        <Switch />
                    </Form.Item> */}
                    </Form>
                </Modal>
            )}
        </div>
    );
};
export default MaterialLibrary;
