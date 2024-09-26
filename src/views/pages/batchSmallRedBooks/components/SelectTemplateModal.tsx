import { Menu, MenuProps, Empty, Spin, Modal, Checkbox } from 'antd';
import { materialGroup_detail } from 'api/template';
import React, { useState, useEffect } from 'react';

export const SelectTemplateModal = ({
    open,
    imageTypeList,
    handleClose,
    handleOk,
    spinLoading
}: {
    open: boolean;
    imageTypeList: any[];
    handleClose: () => void;
    handleOk: (temp: any) => void;
    spinLoading: boolean;
}) => {
    console.log('🚀 ~ imageTypeList:', imageTypeList);
    const [menuList, setMenuList] = React.useState<any[]>([]);
    const [templateList, setTemplateList] = React.useState<any[]>([]);
    const [type, setType] = React.useState<any[]>([]);

    useEffect(() => {
        if (imageTypeList.length) {
            const menus = imageTypeList?.map((item: any) => ({
                label: `${item.name}(${item.list.length})`,
                value: item.id,
                key: item.id,
                // list: item.list,
                list: item.list?.map((i: any) => ({ ...i, example: i.thumbnail, code: i.uid }))
            }));
            setMenuList(menus);
            const firstType = menus?.[0]?.value;
            setType([firstType]);
            setTemplateList(menus?.[0]?.list);
        }
    }, [imageTypeList]);

    const onClick: MenuProps['onClick'] = ({ item }: { item: any }) => {
        console.log('🚀 ~ item:', item);
        const templates = item?.props.list;
        setType([item?.props?.value]);
        setTemplateList(templates);
    };

    //组内容
    const [groupOpen, setGroupOpen] = useState(false);
    const [groupLoading, setGroupLoading] = useState(false);
    const [boxValue, setBoxValue] = useState<any[]>([]);
    const [groupList, setGroupList] = useState<any[]>([
        {
            code: 'clxvkhlb4000120gv45ehtv3e',
            name: '字体测试2',
            totalImageCount: 1,
            example: 'https://service-oss-poster.mofaai.com.cn/mofaai/upload/20240910/1725959382071.png',
            variableList: [
                {
                    uuid: null,
                    label: '背景',
                    field: 'ee929526-afe2-4e1a-a5a4-60b8640c5ebe',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '背景',
                    requirement: null,
                    options: [],
                    count: null
                }
            ]
        },
        {
            code: 'cly6ytap1000111ickp4yvy2t',
            name: '育儿分享',
            totalImageCount: 6,
            example: 'https://service-oss-poster.mofaai.com.cn/mofaai/upload/20240923/1727086473412.png',
            variableList: [
                {
                    uuid: null,
                    label: '背景图片',
                    field: 'fdfe5e64-5a25-49d2-a11a-1642fc49b3e7',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '背景图片',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '页头图片',
                    field: 'e85e91b3-bf74-4d69-a1cd-efec698c57e9',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '页头图片',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '主标题',
                    field: 'f44b1fbc-4c3e-4872-9033-85f608d2e0ee',
                    type: 'TEXT',
                    group: 'PARAMS',
                    style: 'INPUT',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: true,
                    isPoint: true,
                    description: '主标题',
                    requirement: null,
                    options: [],
                    count: 27
                },
                {
                    uuid: null,
                    label: '副标题',
                    field: '68e6b6c8-ab83-4e62-868a-cbce946993ba',
                    type: 'TEXT',
                    group: 'PARAMS',
                    style: 'INPUT',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: true,
                    isPoint: true,
                    description: '副标题',
                    requirement: null,
                    options: [],
                    count: 6
                },
                {
                    uuid: null,
                    label: '页脚图片1',
                    field: 'ad4d9232-425d-4e9c-9870-0d05a8e4f369',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '页脚图片1',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '页脚图片2',
                    field: '07f40b5c-aa1a-4cc2-af6a-9c81c5427af9',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '页脚图片2',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '页脚图片3',
                    field: '68d99083-62a2-4c3d-8f4d-debf3d650f90',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '页脚图片3',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '页脚图片4',
                    field: 'd0fb159a-205f-425a-94e9-f375f411769c',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '页脚图片4',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '页脚',
                    field: '2df64fce-3726-43bc-8ae5-54cff6f3d78d',
                    type: 'TEXT',
                    group: 'PARAMS',
                    style: 'INPUT',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: true,
                    isPoint: true,
                    description: '页脚',
                    requirement: null,
                    options: [],
                    count: 5
                }
            ]
        },
        {
            code: 'cly6zhwnl0001sqol9tkb312b',
            name: '育儿分享',
            totalImageCount: 4,
            example: 'https://service-oss-poster.mofaai.com.cn/mofaai/upload/20240910/1725948596594.png',
            variableList: [
                {
                    uuid: null,
                    label: '背景图片',
                    field: 'fe9f0e5a-efea-4fa9-8508-6ef846393b74',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '背景图片',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '每页标题',
                    field: 'b08b9278-2ae5-495a-9a45-97780ac5dd10',
                    type: 'TEXT',
                    group: 'PARAMS',
                    style: 'INPUT',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: true,
                    isPoint: true,
                    description: '每页标题',
                    requirement: null,
                    options: [],
                    count: 11
                },
                {
                    uuid: null,
                    label: '页头图片',
                    field: '1ae81707-0bac-4532-aa48-861020132e48',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '页头图片',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '每页内容',
                    field: '70972d35-0b2a-4125-95de-22cf642c39fc',
                    type: 'TEXT',
                    group: 'PARAMS',
                    style: 'INPUT',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: true,
                    isPoint: true,
                    description: '每页内容',
                    requirement: null,
                    options: [],
                    count: 78
                },
                {
                    uuid: null,
                    label: '页脚',
                    field: 'bbc2375f-78aa-4faa-814a-28d1db9335b9',
                    type: 'TEXT',
                    group: 'PARAMS',
                    style: 'INPUT',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: true,
                    isPoint: true,
                    description: '页脚',
                    requirement: null,
                    options: [],
                    count: 5
                },
                {
                    uuid: null,
                    label: '页脚图片1',
                    field: 'a6db56c3-83c6-4ba9-9aba-96376680b0ba',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '页脚图片1',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '页脚图片2',
                    field: '0194f4a9-c34d-4507-bf90-240da10edde7',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '页脚图片2',
                    requirement: null,
                    options: [],
                    count: null
                }
            ]
        },
        {
            code: 'cm0gll6gm0001znnifcpmc3ot',
            name: '绘本-内页-睡前',
            totalImageCount: 1,
            example: 'https://service-oss-poster.mofaai.com.cn/mofaai/upload/20240830/1725015365528.png',
            variableList: [
                {
                    uuid: null,
                    label: '标题',
                    field: '96ddfae6-25ab-4778-97e6-cbb2ab65459a',
                    type: 'TEXT',
                    group: 'PARAMS',
                    style: 'INPUT',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: true,
                    isPoint: true,
                    description: '标题',
                    requirement: null,
                    options: [],
                    count: 10
                },
                {
                    uuid: null,
                    label: '正文',
                    field: '4c323246-98a3-4448-b63f-1e055a410703',
                    type: 'TEXT',
                    group: 'PARAMS',
                    style: 'INPUT',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: true,
                    isPoint: true,
                    description: '正文',
                    requirement: null,
                    options: [],
                    count: 133
                },
                {
                    uuid: null,
                    label: '配图',
                    field: '4deecd30-7835-4184-a816-6b5c4b99ce47',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '配图',
                    requirement: null,
                    options: [],
                    count: null
                }
            ]
        },
        {
            code: 'cm0w2shcw0003g8ttegz7klz3',
            name: '为其味无穷',
            totalImageCount: 1,
            example: 'https://service-oss-poster.mofaai.com.cn/mofaai/upload/20240910/1725951215328.png',
            variableList: [
                {
                    uuid: null,
                    label: '标题',
                    field: 'b8e72170-bc62-4099-bca3-b8cf11c338c8',
                    type: 'TEXT',
                    group: 'PARAMS',
                    style: 'INPUT',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: true,
                    isPoint: true,
                    description: '标题',
                    requirement: null,
                    options: [],
                    count: null
                },
                {
                    uuid: null,
                    label: '封面',
                    field: 'b6977cfd-57e2-46fb-9adb-e591b3239f8c',
                    type: 'IMAGE',
                    group: 'PARAMS',
                    style: 'IMAGE',
                    order: 2147483647,
                    defaultValue: null,
                    value: null,
                    isShow: false,
                    isPoint: true,
                    description: '封面',
                    requirement: null,
                    options: [],
                    count: null
                }
            ]
        }
    ]);
    return (
        <Modal open={open} onCancel={handleClose} footer={false} width="70%" className="top-[40px]" title="选择图片模版组">
            <Spin spinning={spinLoading}>
                {/* <Tabs
                    items={[
                        {
                            label: '模版市场',
                            key: '1',
                            children: (
                                <div className="flex">
                                    <div className="w-[145px] overflow-y-auto h-[70vh]">
                                        <Menu onClick={onClick} style={{ width: 140 }} selectedKeys={type} mode="inline" items={menuList} />
                                    </div>
                                    {templateList?.length ? (
                                        <div className="h-[70vh] flex-1">
                                            <div className="grid grid-cols-5 grid-rows-[auto] gap-2 overflow-y-auto p-1">
                                                {templateList.map((v: any, i) => (
                                                    <div key={i} className="relative">
                                                        <img
                                                            className={`h-auto max-w-full rounded-lg cursor-pointer ${
                                                                v.code === current && 'outline outline-offset-2 outline-1 outline-blue-500'
                                                            }`}
                                                            src={v.example + '?x-oss-process=image/resize,w_280/quality,q_60'}
                                                            onClick={() => setCurrent(v.code)}
                                                        />
                                                        <div className="text-sm font-bold text-center">{v?.name}</div>
                                                        <div className="absolute top-2 right-2 text-xs rounded-md bg-black/50 text-white w-[20px] h-[20px] flex justify-center items-center">
                                                            {v?.totalImageCount}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center flex-1">
                                            <Empty />
                                        </div>
                                    )}
                                </div>
                            )
                        },
                        {
                            label: '我的模版',
                            key: '2',
                            children: <div>我的模板</div>
                        }
                    ]}
                /> */}
                <div className="flex">
                    <div className="w-[145px] overflow-y-auto h-[85vh]">
                        <Menu onClick={onClick} style={{ width: 140 }} selectedKeys={type} mode="inline" items={menuList} />
                    </div>
                    {templateList?.length ? (
                        <div className="h-[85vh] overflow-auto flex-1">
                            <div className="grid grid-cols-5 grid-rows-[auto] gap-2 overflow-y-auto p-1">
                                {templateList.map((v: any, i) => (
                                    <div key={i} className="relative">
                                        <img
                                            className={`h-auto w-full rounded-lg cursor-pointer`}
                                            src={v.example + '?x-oss-process=image/resize,w_280/quality,q_60'}
                                            onClick={async () => {
                                                const result = await materialGroup_detail({ group: v.id });
                                                // setGroupList(result);
                                                setGroupOpen(true);
                                            }}
                                        />
                                        <div className="text-sm font-bold text-center">{v?.name}</div>
                                        <div className="absolute top-2 right-2 text-xs rounded-md bg-black/50 text-white w-[20px] h-[20px] flex justify-center items-center">
                                            {v?.totalImageCount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center flex-1">
                            <Empty />
                        </div>
                    )}
                </div>
            </Spin>
            <Modal
                open={groupOpen}
                onCancel={() => setGroupOpen(false)}
                onOk={() => {
                    const newGroupList = groupList?.filter((v: any) => boxValue?.includes(v.code));
                    handleOk(newGroupList);
                }}
                title="选择图片模版"
                width="60%"
            >
                <Spin spinning={groupLoading}>
                    {groupList?.length ? (
                        <Checkbox.Group value={boxValue} onChange={setBoxValue}>
                            <div className="grid grid-cols-5 grid-rows-[auto] gap-2 overflow-y-auto p-1">
                                {groupList.map((v: any, i) => (
                                    <div key={i} className="relative">
                                        <img
                                            className={`h-auto w-full rounded-lg`}
                                            src={v.example + '?x-oss-process=image/resize,w_280/quality,q_60'}
                                        />
                                        <div className="text-sm font-bold text-center">{v?.name}</div>
                                        <Checkbox className="absolute top-2 right-2" value={v?.code} />
                                    </div>
                                ))}
                            </div>
                        </Checkbox.Group>
                    ) : (
                        <div className="flex justify-center items-center flex-1">
                            <Empty />
                        </div>
                    )}
                </Spin>
            </Modal>
        </Modal>
    );
};
