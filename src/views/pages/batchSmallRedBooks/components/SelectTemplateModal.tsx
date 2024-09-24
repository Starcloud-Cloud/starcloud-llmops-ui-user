import { Menu, MenuProps, Empty, Spin, Modal, Tabs } from 'antd';
import React, { useEffect } from 'react';

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
    const [current, setCurrent] = React.useState('');
    const [type, setType] = React.useState<any[]>([]);

    useEffect(() => {
        if (imageTypeList.length) {
            const menus = imageTypeList?.map((item: any) => ({
                label: `${item.name}(${item.list.length})`,
                value: item.id,
                key: item.id,
                list: item.list
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

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            onOk={() => {
                const temp = templateList.find((v) => v.code === current);
                handleOk(temp);
            }}
            width="70%"
            className="top-[40px]"
            title="选择图片模版"
        >
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
            </Spin>
        </Modal>
    );
};
