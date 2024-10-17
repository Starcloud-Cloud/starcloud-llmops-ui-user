import { Menu, MenuProps, Empty, Spin, Modal, Checkbox, Tag, Image, Tabs, Button } from 'antd';
import { materialGroup_detail } from 'api/template';
import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash-es';

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
    const [myMenuList, setMyMenuList] = React.useState<any[]>([]);
    const [systermMenuList, setSystermMenuList] = React.useState<any[]>([]);

    const [myTemplateList, setMyTemplateList] = React.useState<any[]>([]);
    const [systerTemplateList, setSysterTemplateList] = React.useState<any[]>([]);
    const [myType, setMyType] = React.useState<any[]>([]);
    const [systerType, setSysterType] = React.useState<any[]>([]);

    useEffect(() => {
        if (imageTypeList.length) {
            const myMenus: any[] = [];
            const systerMenus: any[] = [];
            imageTypeList?.map((item: any) => {
                const myList: any[] = [];
                const systerList: any[] = [];
                item?.list?.map((el: any) => {
                    if (el.associatedId && el.overtStatus) {
                        systerList.push({ ...el, example: el.thumbnail, code: el.uid });
                    } else {
                        myList.push({ ...el, example: el.thumbnail, code: el.uid });
                    }
                });
                myMenus.push({
                    label: `${item.name}(${myList.length})`,
                    value: item.id?.toString(),
                    key: item.id?.toString(),
                    list: myList
                });
                systerMenus.push({
                    label: `${item.name}(${systerList.length})`,
                    value: item.id?.toString(),
                    key: item.id?.toString(),
                    list: systerList
                });
            });
            setMyMenuList(myMenus);
            setSystermMenuList(systerMenus);
            setTimeout(() => {
                setMenuHeight(MenuRef?.current?.offsetHeight);
            }, 1);

            setSysterType([systerMenus?.[0]?.value]);
            setMyType([myMenus?.[0]?.value]);
            setMyTemplateList(myMenus?.[0]?.list);
            console.log(systerTemplateList);
            setSysterTemplateList(systerMenus?.[0]?.list);
        }
    }, [imageTypeList]);

    const onClick1: MenuProps['onClick'] = ({ item }: { item: any }) => {
        console.log('🚀 ~ item:', item);
        const templates = item?.props.list;
        setSysterType([item?.props?.value]);
        setSysterTemplateList(templates);
    };
    const onClick2: MenuProps['onClick'] = ({ item }: { item: any }) => {
        console.log('🚀 ~ item:', item);
        const templates = item?.props.list;
        setMyType([item?.props?.value]);
        setMyTemplateList(templates);
    };

    //组内容
    const [groupOpen, setGroupOpen] = useState(false);
    const [groupLoading, setGroupLoading] = useState(false);
    const [boxValue, setBoxValue] = useState<any[]>([]);
    const [groupList, setGroupList] = useState<any[]>([]);
    const MenuRef = useRef<any>(null);
    const [menuHeight, setMenuHeight] = useState(0);
    return (
        <Modal open={open} onCancel={handleClose} footer={false} width="70%" className="top-[40px]" title="选择图片模版组">
            <Spin spinning={spinLoading}>
                <div className="relactive">
                    <Tabs
                        items={[
                            {
                                label: '模版市场',
                                key: '1',
                                children: (
                                    <div className="flex">
                                        <div ref={MenuRef} className="w-[145px] overflow-y-auto max-h-[85vh]">
                                            <Menu
                                                onClick={onClick1}
                                                style={{ width: 140 }}
                                                selectedKeys={systerType}
                                                mode="inline"
                                                items={systermMenuList}
                                            />
                                        </div>
                                        {systerTemplateList?.length ? (
                                            <div
                                                style={{
                                                    height: menuHeight + 'px'
                                                }}
                                                className="overflow-auto flex-1"
                                            >
                                                <div className="grid grid-cols-5 grid-rows-[auto] gap-2 overflow-y-auto p-1">
                                                    {systerTemplateList.map((v: any, i) => (
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
                                                                        setBoxValue(result?.map((item: any) => item.code));
                                                                        setGroupOpen(true);
                                                                    }
                                                                }}
                                                            />
                                                            <div className="text-sm font-bold text-center">{v?.name}</div>
                                                            {v?.materialCount > 1 && (
                                                                <Tag color="processing" className="absolute top-0 left-0">
                                                                    组合
                                                                </Tag>
                                                            )}
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
                                children: (
                                    <div className="flex">
                                        <div className="w-[145px] overflow-y-auto max-h-[85vh]">
                                            <Menu
                                                onClick={onClick2}
                                                style={{ width: 140 }}
                                                selectedKeys={myType}
                                                mode="inline"
                                                items={myMenuList}
                                            />
                                        </div>
                                        {myTemplateList?.length ? (
                                            <div
                                                style={{
                                                    height: menuHeight + 'px'
                                                }}
                                                className="overflow-auto flex-1"
                                            >
                                                <div className="grid grid-cols-5 grid-rows-[auto] gap-2 overflow-y-auto p-1">
                                                    {myTemplateList.map((v: any, i) => (
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
                                                                        setBoxValue(result?.map((item: any) => item.code));
                                                                        setGroupOpen(true);
                                                                    }
                                                                }}
                                                            />
                                                            <div className="text-sm font-bold text-center">{v?.name}</div>
                                                            {v?.materialCount > 1 && (
                                                                <Tag color="processing" className="absolute top-0 left-0">
                                                                    组合
                                                                </Tag>
                                                            )}
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
                            }
                        ]}
                    />
                    <div
                        className="absolute right-2 top-3 font-[600] cursor-pointer text-[12px] text-[#673ab7] border-b border-solid border-[#673ab7]"
                        onClick={() => {
                            window.open(process.env.REACT_APP_POSTER_URL);
                        }}
                    >
                        设计自己的图片模版
                    </div>
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
                                    <div
                                        key={i}
                                        className="relative"
                                        onClick={() => {
                                            const newList = _.cloneDeep(boxValue);
                                            if (newList.includes(v.code)) {
                                                setBoxValue(newList.filter((item) => item !== v.code));
                                            } else {
                                                setBoxValue([...newList, v.code]);
                                            }
                                        }}
                                    >
                                        <Image
                                            className={`rounded-lg cursor-pointer aspect-[199/265] object-cover`}
                                            preview={false}
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
