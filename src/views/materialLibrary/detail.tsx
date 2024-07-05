import {
    AntDesignOutlined,
    CloudUploadOutlined,
    DownOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Button, Space, Input, Tag, Dropdown, Avatar, Popconfirm, Upload, Image, Tooltip } from 'antd';
import { getMaterialLibraryDataList, getMaterialLibraryTitleList } from 'api/material';
import { dictData } from 'api/template';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TablePro from 'views/pages/batchSmallRedBooks/components/components/antdProTable';
import { propShow } from 'views/pages/batchSmallRedBooks/components/formModal';
import { v4 as uuidv4 } from 'uuid';
const { Search } = Input;

const MaterialLibraryDetail = () => {
    const [columns, setColumns] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    const [selectedRowKeys, setSelectRowKeys] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [typeList, setTypeList] = useState<any[]>([]);
    const [canUpload, setCanUpload] = useState(true);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const tableRef = useRef<any[]>([]);

    useEffect(() => {
        dictData('', 'material_format_type').then((res) => {
            setTypeList(res.list);
        });
    }, []);

    useEffect(() => {
        getMaterialLibraryTitleList({ id }).then((data) => {
            const list = data.tableMeta.map((item: any) => ({
                desc: item.columnName,
                fieldName: item.columnCode
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
                    valueType: item.type === 'textBox' ? 'textarea' : 'text',
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
            setColumns([
                {
                    title: '序号',
                    align: 'center',
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
                    valueType: 'option',
                    width: 200,
                    fixed: 'right',
                    render: (text: any, record: any, index: number, action: any) => (
                        <div className="flex items-center justify-center h-[102px]">
                            <Button
                                type="link"
                                onClick={() => {
                                    action?.startEditable?.(record.uuid);
                                }}
                            >
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
            ]);
        });
    }, []);

    useEffect(() => {
        getMaterialLibraryDataList({ libraryId: id }).then((data) => {
            let newList: any = [];
            data.map((item: any) => item.content).map((v: any) => {
                let obj: any = {
                    uuid: uuidv4()
                };
                v.forEach((item: any) => {
                    obj[item['columnCode']] = item['value'];
                });
                newList.push(obj);
            });
            setTableData(newList);
            tableRef.current = newList;
        });
    }, []);

    const items: any = [];

    const handleDel = (index: number) => {
        const newList = JSON.parse(JSON.stringify(tableRef.current));
        newList.splice(index, 1);
        tableRef.current = newList;
        setTableData(tableRef.current);
    };
    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center mb-2">
                    <div>
                        <Avatar shape="square" icon={<AntDesignOutlined />} size={48} />
                    </div>
                    <div className="flex flex-col ml-2">
                        <div className="cursor-pointer flex items-center">
                            <span className="text-[20px] font-semibold">测试</span>
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
                        <Search
                            placeholder="搜索"
                            style={{ width: 200 }}
                            allowClear
                            onSearch={(value) => {
                                // setQuery({ name: value });
                                // actionRef.current?.reload();
                            }}
                        />
                        <Dropdown menu={{ items }}>
                            <Button>
                                <Space>
                                    <SettingOutlined className="p-1 cursor-pointer" />
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                        <Button type="primary">添加内容</Button>
                    </Space>
                </div>
            </div>
            <div>
                <TablePro
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
