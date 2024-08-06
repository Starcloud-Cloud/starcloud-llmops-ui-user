import { Select, Input, Row, Col, Tabs, Space, Button, Modal, Form, message, Popconfirm, Dropdown, Avatar, Switch, Empty } from 'antd';
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
import { ActionType, CheckCard, ModalForm, ProColumns, ProFormText, ProTable } from '@ant-design/pro-components';
import {
    addMaterial,
    copyMaterialLibrary,
    delMaterial,
    getMaterialBindPage,
    getMaterialPage,
    getSelectSysMaterialPage,
    updateMaterial
} from 'api/material';
import dayjs from 'dayjs';
import { dictData } from 'api/template';
import { useNavigate } from 'react-router-dom';
import HeaderField from '../pages/batchSmallRedBooks/components/components/headerField';
const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;
import './index.scss';
import MaterialLibraryDetail from './detail';

export const IconRenderer = ({ value }: { value: string }) => {
    let SelectedIcon = value.includes('http') ? AppstoreOutlined : allIcons['AppstoreAddOutlined'];
    return <SelectedIcon />;
};

const MaterialLibrary = ({
    mode = 'page',
    setSelectedRowKeys,
    bizUid,
    appUid,
    libraryId
}: {
    mode: 'select' | 'page';
    setSelectedRowKeys: (keys: React.Key[]) => void;
    bizUid?: string;
    appUid?: string;
    libraryId?: string;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectIcon, setSelectIcon] = useState('');
    const [typeList, setTypeList] = useState<any[]>([]);
    const [sourceList, setSourceList] = useState<any[]>([]);
    const [record, setRecord] = useState<any>(null);
    const [query, setQuery] = useState<{
        name: string;
    } | null>(null);
    const [activeKey, setActiveKey] = useState<string>('20');
    const [copyLibraryOpen, setCopyLibraryOpen] = useState(false);
    const [copyType, setCopyType] = useState(0);
    const [current, setCurrent] = useState(1);
    const [openPreview, setOpenPreview] = useState(false);

    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const formCopyLibrary = useRef<any>(null);

    useEffect(() => {
        dictData('', 'material_format_type').then((res) => {
            setTypeList(res.list);
        });
    }, []);

    useEffect(() => {
        dictData('', 'material_create_source').then((res) => {
            setSourceList(res.list);
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
            key: 'copy_filed',
            label: '复制字段'
        },
        {
            key: 'copy_filed_data',
            label: '复制字段和数据'
        },
        {
            key: '2',
            label: '删除',
            danger: true
        }
    ];

    const itemsSys: any = [
        {
            key: 'copy_filed',
            label: '复制字段'
        },
        {
            key: 'copy_filed_data',
            label: '复制字段和数据'
        }
    ];

    const onClick: MenuProps['onClick'] = async ({ key, domEvent }) => {
        domEvent.stopPropagation();
        if (key === '1') {
            setRecord(record);
            form.setFieldsValue(record);
            setIsModalOpen(true);
        } else if (key === '2') {
            await showConfirm();
        } else if (key === 'copy_filed') {
            setRecord(record);
            setCopyLibraryOpen(true);
            setCopyType(0);
        } else {
            setRecord(record);
            setCopyLibraryOpen(true);
            setCopyType(1);
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
                            <span
                                onClick={
                                    mode === 'select'
                                        ? (e) => {
                                              e.stopPropagation();
                                              window.open(`/material/detail?id=${record.id}`);
                                          }
                                        : () => null
                                }
                                className="font-extrabold cursor-pointer"
                            >
                                {record.name}
                            </span>

                            <div className="text-[12px] h-[18px] text-[#06070980] line-clamp-1">{record.description}</div>
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
        },
        {
            title: '更新时间',
            align: 'center',
            dataIndex: 'updateTime',
            defaultSortOrder: 'descend',
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

    if (activeKey !== '20') {
        columns.splice(1, 0, {
            title: '来源',
            dataIndex: 'createSource',
            search: false,
            width: 80,
            align: 'center',
            renderText: (text) => {
                return sourceList.find((v) => +v.value === text)?.label || '未知';
            }
        });
    }

    // if (mode === 'page' && activeKey === '1') {
    columns.push({
        title: '操作',
        width: 50,
        search: false,
        align: 'right',
        render: (_, row) => (
            <Dropdown
                menu={activeKey === '20' ? { items, onClick } : { items: itemsSys, onClick }}
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
    // }

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
        const data = record ? await updateMaterial({ ...values, id: record.id, status: 1 }) : await addMaterial({ ...values, status: 1 });
        if (data) {
            record ? message.success('修改成功!') : message.success('添加成功!');
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
                        创建素材库
                    </Button>
                </div>
            )}
            <ProTable
                locale={
                    mode === 'select'
                        ? {
                              emptyText: (
                                  <Empty
                                      className="mt-[10%]"
                                      description={
                                          <div className="flex flex-col">
                                              <p>暂未配置素材库</p>
                                              <a onClick={() => navigate('/material')}>去创建</a>
                                          </div>
                                      }
                                  />
                              )
                          }
                        : { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }
                }
                toolbar={{
                    menu: {
                        type: 'tab',
                        activeKey: activeKey,
                        items:
                            mode === 'select'
                                ? [
                                      {
                                          key: '20',
                                          label: <span>我的素材库</span>
                                      },
                                      {
                                          key: '0',
                                          label: <span>绑定记录</span>
                                      }
                                  ]
                                : [
                                      {
                                          key: '20',
                                          label: <span>我的素材库</span>
                                      },
                                      {
                                          key: '10',
                                          label: <span>系统素材库</span>
                                      }
                                  ],
                        onChange: (key) => {
                            setCurrent(1);
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
                pagination={{
                    current: current
                }}
                request={async (params, sort) => {
                    setCurrent(params.current as number);
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
                        } else if (key === 'fileCount') {
                            sortingFields.push({
                                field: 'file_count',
                                order: sort[key] === 'ascend' ? 'asc' : 'desc'
                            });
                        } else {
                            sortingFields.push({
                                field: 'update_time',
                                order: sort[key] === 'ascend' ? 'asc' : 'desc'
                            });
                        }
                    } else {
                        sortingFields = [];
                    }

                    let data: any = {};
                    if (mode === 'select' && +activeKey === 0) {
                        data = await getSelectSysMaterialPage({ ...params, sortingFields, appUid: appUid });
                    } else {
                        data = await getMaterialPage({ ...params, sortingFields });
                    }
                    return {
                        data: data.list,
                        success: true,
                        total: data.total
                    };
                }}
                onRow={(record: any) => {
                    const handleOpenPreview = () => {
                        setRecord(record);
                        setOpenPreview(true);
                    };

                    return {
                        onClick: () => (mode === 'page' ? navigate(`/material/detail?id=${record.id}`) : handleOpenPreview())
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
                            <Input placeholder="填写名称" maxLength={100} showCount />
                        </Form.Item>
                        <Form.Item label="描述" name={'description'}>
                            <Input.TextArea placeholder="填写描述" showCount maxLength={500} rows={3} />
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

            {copyLibraryOpen && (
                <ModalForm
                    width={600}
                    open={copyLibraryOpen}
                    onInit={() => {
                        formCopyLibrary.current.setFieldsValue({ name: `${record?.name}-复制` });
                    }}
                    formRef={formCopyLibrary}
                    onOpenChange={setCopyLibraryOpen}
                    title="复制素材库"
                    onFinish={async (value) => {
                        const result = await copyMaterialLibrary({ ...value, id: record.id, copyAll: !!copyType });
                        if (result) {
                            // 回到我的素材
                            setActiveKey('20');
                            actionRef.current?.reload();
                            setCopyLibraryOpen(false);
                        }
                    }}
                >
                    <ProFormText required name="name" label="输入素材库名称" />
                </ModalForm>
            )}

            {openPreview && (
                <ModalForm submitter={false} width={1000} open={openPreview} onOpenChange={setOpenPreview} title={record.name}>
                    <MaterialLibraryDetail materialId={record?.id} mode={'preview'} isSelection={true} />
                </ModalForm>
            )}
        </div>
    );
};
export default MaterialLibrary;
