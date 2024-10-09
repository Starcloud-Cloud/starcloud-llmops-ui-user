import { Menu, MenuProps, Empty, Spin, Modal, Checkbox, Tag, Image } from 'antd';
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
                value: item.id?.toString(),
                key: item.id?.toString(),
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
        console.log(templates, menuList, [item?.props?.value]);
        setType([item?.props?.value]);
        setTemplateList(templates);
    };

    //组内容
    const [groupOpen, setGroupOpen] = useState(false);
    const [groupLoading, setGroupLoading] = useState(false);
    const [boxValue, setBoxValue] = useState<any[]>([]);
    const [groupList, setGroupList] = useState<any[]>([]);
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
                                    <div key={i} className="relative group">
                                        <img
                                            className={`w-full rounded-lg cursor-pointer aspect-[199/265] object-cover`}
                                            // preview={false}
                                            loading="lazy"
                                            src={v.example + '?x-oss-process=image/resize,w_280/quality,q_60'}
                                            onClick={async () => {
                                                setGroupLoading(true);
                                                const result = await materialGroup_detail({ uid: v.uid });
                                                setGroupLoading(false);
                                                if (result?.length === 1) {
                                                    handleOk(result);
                                                } else {
                                                    setGroupList(result);
                                                    setGroupOpen(true);
                                                }
                                            }}
                                        />
                                        <div className="text-sm font-bold text-center">{v?.name}</div>
                                        <Tag color="processing" className="group-hover:block hidden absolute top-0 left-0">
                                            组合 {v?.materialCount}
                                        </Tag>
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
                                        <Image
                                            className={`rounded-lg cursor-pointer aspect-[199/265] object-cover`}
                                            preview={false}
                                            src={v.example + '?x-oss-process=image/resize,w_280/quality,q_60'}
                                            onClick={async () => {
                                                setGroupLoading(true);
                                                const result = await materialGroup_detail({ uid: v.uid });
                                                setGroupLoading(false);
                                                if (result?.length === 1) {
                                                    handleOk(result);
                                                } else {
                                                    setGroupList(result);
                                                    setGroupOpen(true);
                                                }
                                            }}
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
