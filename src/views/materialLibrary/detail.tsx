import {
    AntDesignOutlined,
    CloudUploadOutlined,
    DownOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Button, Space, Input, Tag, Dropdown, Avatar, Popconfirm, Upload, Image, Tooltip, message } from 'antd';
import {
    delMaterialLibrarySlice,
    getMaterialLibraryDataList,
    getMaterialLibraryTitleList,
    updateMaterialLibrarySlice,
    updateMaterialLibraryTitle
} from 'api/material';
import { dictData } from 'api/template';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TablePro from 'views/pages/batchSmallRedBooks/components/components/antdProTable';
import { propShow } from 'views/pages/batchSmallRedBooks/components/formModal';
import { v4 as uuidv4 } from 'uuid';
import { IconRenderer } from './index';
import { ActionType } from '@ant-design/pro-components';
const { Search } = Input;

const MaterialLibraryDetail = () => {
    const [columns, setColumns] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    const [detail, setDetail] = useState<any>(null);
    const [selectedRowKeys, setSelectRowKeys] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [typeList, setTypeList] = useState<any[]>([]);
    const [canUpload, setCanUpload] = useState(true);
    const [forceUpdate, setForceUpdate] = useState(0);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const tableRef = useRef<any[]>([]);
    const actionRef = useRef<ActionType>();
    const tableMetaRef = useRef<any[]>([]);

    useEffect(() => {
        dictData('', 'material_format_type').then((res) => {
            setTypeList(res.list);
        });
    }, []);

    useEffect(() => {
        getMaterialLibraryTitleList({ id }).then((data) => {
            setDetail(data);
            tableMetaRef.current = data.tableMeta;
            const list = data.tableMeta.map((item: any) => ({
                desc: item.columnName,
                fieldName: item.columnCode,
                type: item.columnType,
                required: item.isRequired
            }));

            const newList = list?.map((item: any) => {
                return {
                    title: item.desc,
                    align: 'center',
                    className: 'align-middle',
                    width: item.type === 'textBox' ? 400 : 200,
                    dataIndex: item.fieldName,
                    editable: () => {
                        return item.type === 'image' ? false : true;
                    },
                    valueType: 'textarea',
                    fieldProps: { autoSize: true, maxRows: 5 },
                    render: (_: any, row: any, index: number) => (
                        <div className="flex justify-center items-center gap-2">
                            {item.type === 'image' ? (
                                <div className="relative">
                                    <Upload
                                        className="table_upload"
                                        {...propShow}
                                        showUploadList={false}
                                        listType="picture-card"
                                        maxCount={1}
                                        disabled={!canUpload}
                                        onChange={(info) => {
                                            if (info.file.status === 'done') {
                                                const data = JSON.parse(JSON.stringify(tableRef.current));
                                                data[index][item.fieldName] = info?.file?.response?.data?.url;
                                                tableRef.current = data;
                                                setTableData([...data]);
                                            }
                                        }}
                                    >
                                        {row[item.fieldName] ? (
                                            <div className="relative">
                                                <Image
                                                    onMouseEnter={() => setCanUpload(false)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    width={82}
                                                    height={82}
                                                    preview={{
                                                        src: row[item.fieldName]
                                                    }}
                                                    src={
                                                        row[item.fieldName] + '?x-oss-process=image/resize,w_100/quality,q_80'
                                                        // selectImg?.largeImageURL ||
                                                        // form.getFieldValue(item.dataIndex) + '?x-oss-process=image/resize,w_300/quality,q_80'
                                                    }
                                                />
                                                <div className="bottom-0 z-[1] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.4)]">
                                                    <Tooltip title="上传">
                                                        <div
                                                            className="flex-1 flex justify-center"
                                                            onMouseEnter={() => setCanUpload(true)}
                                                            onMouseLeave={() => setCanUpload(false)}
                                                        >
                                                            <CloudUploadOutlined className="text-white/60 hover:text-white" />
                                                        </div>
                                                    </Tooltip>
                                                    <Tooltip title="搜索">
                                                        <div
                                                            className="flex-1 flex justify-center !cursor-pointer"
                                                            onClick={(e) => {
                                                                // setIsModalOpen(true);
                                                                e.stopPropagation();
                                                                // setImageDataIndex(row.uuid);
                                                                // setFiledName(item.fieldName);
                                                                // setValues(row);
                                                            }}
                                                        >
                                                            <SearchOutlined className="text-white/60 hover:text-white" />
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className=" w-[80px] h-[80px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer relative"
                                                onMouseEnter={() => setCanUpload(true)}
                                            >
                                                <PlusOutlined />
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                                <Tooltip title="搜索">
                                                    <div
                                                        className="bottom-0 z-[1] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.5)]"
                                                        onClick={(e) => {
                                                            // setIsModalOpen(true);
                                                            e.stopPropagation();
                                                            // setImageDataIndex(row.uuid);
                                                            // setFiledName(item.fieldName);
                                                            // setValues(row);
                                                        }}
                                                    >
                                                        <SearchOutlined className="text-white/80 hover:text-white" />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </Upload>
                                </div>
                            ) : item.type === 'listImage' ? (
                                <div className="flex gap-1 flex-wrap">
                                    {row[item.fieldName]?.map((item: any) => (
                                        <Image
                                            width={50}
                                            height={50}
                                            preview={false}
                                            src={item + '?x-oss-process=image/resize,w_100/quality,q_80'}
                                        />
                                    ))}
                                </div>
                            ) : item.type === 'listStr' ? (
                                <div className="flex gap-1 flex-wrap">
                                    {row[item.fieldName]?.map((item: any) => (
                                        <Tag color="processing">{item}</Tag>
                                    ))}
                                </div>
                            ) : (
                                <div className="break-all line-clamp-4">
                                    {item.fieldName === 'source'
                                        ? typeList?.find((i) => i.value === row[item.fieldName])?.label
                                        : row[item.fieldName]}
                                </div>
                            )}
                        </div>
                    ),
                    formItemProps: {
                        rules: [
                            {
                                required: item.required,
                                message: item.desc + '是必填项'
                            }
                        ]
                    },
                    type: item.type
                };
            });
            const columnData = [
                {
                    title: '序号',
                    align: 'center',
                    dataIndex: 'index',
                    editable: () => {
                        return false;
                    },
                    width: 70,
                    fixed: true,
                    render: (_: any, row: any, index: number) => <span>{index + 1}</span>
                },
                ...newList,
                {
                    title: '操作',
                    align: 'center',
                    dataIndex: 'operation',
                    width: 200,
                    fixed: 'right',
                    render: (text: any, record: any, index: number) => (
                        <div className="flex items-center justify-center h-[102px]">
                            <Button type="link" onClick={() => {}}>
                                编辑
                            </Button>
                            <Popconfirm
                                title="提示"
                                description="请再次确认是否要删除"
                                onConfirm={() => handleDel(index)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="link" danger>
                                    删除
                                </Button>
                            </Popconfirm>
                        </div>
                    )
                }
            ];

            setColumns(columnData);
        });
    }, []);

    useEffect(() => {
        getMaterialLibraryDataList({ libraryId: id }).then((data) => {
            let newList: any = [];
            data.map((item: any) => {
                let obj: any = {
                    uuid: uuidv4(),
                    id: item.id
                };
                item.content.forEach((item1: any) => {
                    if (obj?.[item1?.['columnCode']]) {
                        obj[item1['columnCode']] = item1?.['value'];
                    }
                });
                newList.push(obj);
            });

            setTableData(newList);
            tableRef.current = newList;
        });
    }, [forceUpdate]);

    const items: any = [
        {
            key: '1',
            label: '编辑素材字段',
            onClick: () => {}
        },
        {
            key: '2',
            label: '导入素材字段',
            onClick: async () => {}
        }
    ];

    const handleDel = async (index: number) => {
        const newList = JSON.parse(JSON.stringify(tableRef.current));
        // newList.splice(index, 1);
        // tableRef.current = newList;
        // setTableData(tableRef.current);

        const id = newList[index].id;
        const data = await delMaterialLibrarySlice({ id });
        if (data) {
            setForceUpdate(forceUpdate + 1);
            message.success('删除成功');
        }
    };

    const handleUpdateColumn = async (index: number, size: any) => {
        const list = tableMetaRef.current[index];
        console.log('🚀 ~ handleUpdateColumn ~ list:', list);

        await updateMaterialLibraryTitle({
            columnType: list.columnType,
            columnWidth: size.width,
            libraryId: Number(id),
            id: list.id,
            isRequired: list.isRequired,
            sequence: list.sequence,
            columnName: list.columnName,
            description: list.description
        });
    };

    const handleEditColumn = async (dataIndex: number, record: any) => {
        const tableMetaList = tableMetaRef.current;
        console.log('🚀 ~ handleEditColumn ~ tableMetaList:', tableMetaList);
        console.log('🚀 ~ handleEditColumn ~ record:', record);
        const recordKeys = Object.keys(record);
        const content = tableMetaList.map((item) => {
            if (recordKeys.includes(item.columnCode)) {
                return {
                    columnId: item.id,
                    columnName: item.columnName,
                    columnCode: item.columnCode,
                    value: record[item.columnCode]
                };
            }
        });

        const data = {
            libraryId: detail.id,
            id: record.id,
            content: content,
            url: detail.iconUrl,
            status: detail.status
        };
        const result = await updateMaterialLibrarySlice(data);
        if (result) {
            message.success('更新成功');
        }
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center mb-2">
                    <div>{detail?.iconUrl && <Avatar shape="square" icon={<IconRenderer value={detail?.iconUrl} />} size={48} />}</div>
                    <div className="flex flex-col ml-2">
                        <div className="cursor-pointer flex items-center">
                            <span className="text-[20px] font-semibold">{detail?.name}</span>
                            <EditOutlined className="ml-1" />
                        </div>
                        <div className="mt-2">
                            <Space>
                                <Tag bordered={false}>123</Tag>
                                <Tag bordered={false}>123</Tag>
                                <Tag bordered={false}>123</Tag>
                                <Tag bordered={false}>123</Tag>
                            </Space>
                        </div>
                    </div>
                </div>
                <div>
                    <Space>
                        {/* <Search
                            placeholder="搜索"
                            style={{ width: 200 }}
                            allowClear
                            onSearch={(value) => {
                                 setQuery({ name: value });
                                 actionRef.current?.reload();
                            }}
                        /> */}
                        <Dropdown menu={{ items }}>
                            <Button>
                                <Space>
                                    <SettingOutlined className="p-1 cursor-pointer" />
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                        <Button
                            type="primary"
                            onClick={() => {
                                actionRef.current?.addEditRecord?.(
                                    {
                                        uuid: uuidv4()
                                    },
                                    {
                                        position: 'top'
                                    }
                                );
                            }}
                        >
                            添加内容
                        </Button>
                    </Space>
                </div>
            </div>
            <div>
                <TablePro
                    handleEditColumn={handleEditColumn}
                    onUpdateColumn={handleUpdateColumn}
                    actionRef={actionRef}
                    tableData={tableData}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectRowKeys}
                    columns={columns}
                    setPage={setPage}
                    setTableData={setTableData}
                />
            </div>
        </>
    );
};

export default MaterialLibraryDetail;
