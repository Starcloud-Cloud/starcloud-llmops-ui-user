import { Modal, Tabs, Button, Avatar, Divider, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { AppstoreFilled, DeleteOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { getMetadata } from 'api/plug';
const BindPlug = ({ bindPlugOpen, setBindPlugOpen }: { bindPlugOpen: boolean; setBindPlugOpen: (data: boolean) => void }) => {
    //素材库插件
    const [materialPlugList, setMaterialPlugList] = useState<any[]>([{ children: [{}] }]);
    const [open, setOpen] = useState(false);

    //我的插件

    //触发历史
    const [timeExpressionTypeList, settimeExpressionTypeList] = useState<any[]>([]);
    const column: TableColumnsType<any> = [
        {
            title: '触发器时间',
            align: 'center',
            render: (_, row) => <div>{dayjs(row.triggerTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        },
        {
            title: '触发器类型',
            align: 'center',
            render: (_, row) => <div>{timeExpressionTypeList?.find((item) => item.value === row.triggerType)?.label}</div>
        },
        {
            title: '执行插件名称',
            dataIndex: 'pluginName',
            align: 'center'
        },
        {
            title: '触发结果',
            dataIndex: 'executeResult',
            align: 'center'
        },
        {
            title: '耗时(s)',
            dataIndex: 'executeTime',
            align: 'center',
            render: (_, row) => <div>{row.executeTime / 1000}</div>
        },
        {
            title: '状态',
            align: 'center',
            render: (_, row) => <Tag color="processing">{row?.success ? '执行成功' : '执行失败'}</Tag>
        }
    ];
    const [TableData, setTableData] = useState<any[]>([]);
    useEffect(() => {
        getMetadata().then((res) => {
            settimeExpressionTypeList(res.triggerType);
        });
    }, []);
    return (
        <div>
            <Modal width={'80%'} open={bindPlugOpen} onCancel={() => setBindPlugOpen(false)} title="插件配置" footer={false}>
                <Tabs
                    items={[
                        {
                            label: '素材库插件',
                            key: '1',
                            children: (
                                <div>
                                    <div className="flex justify-end mb-4">
                                        <Button type="primary">绑定插件</Button>
                                    </div>
                                    <CheckCard.Group className="w-full" size="small">
                                        {materialPlugList?.map((item) => (
                                            <div key={item.uid}>
                                                <div className="my-4 text-[16px] font-bold">
                                                    aaa
                                                    {/* {sceneList?.find((i) => i.value === item.scene)?.label} */}
                                                </div>
                                                <div className="w-full grid justify-content-center gap-4 responsive-list-container md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
                                                    {item.children?.map((el: any) => {
                                                        return (
                                                            <div
                                                                onClick={() => {}}
                                                                className="p-4 border border-solid border-[#d9d9d9] rounded-lg hover:border-[#673ab7] cursor-pointer hover:shadow-md relative"
                                                                key={el.uid}
                                                            >
                                                                <div className="flex gap-4">
                                                                    {el.avatar ? (
                                                                        <Avatar shape="square" size={64} src={el.avatar} />
                                                                    ) : (
                                                                        <Avatar shape="square" size={64} icon={<AppstoreFilled />} />
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <div className="text-[18px] font-bold">{el.pluginName}</div>
                                                                        <div className="line-clamp-3 h-[66px]">{el.description}</div>
                                                                    </div>
                                                                </div>
                                                                <Divider className="my-2" />
                                                                <div className="flex justify-between text-xs">
                                                                    <div className="flex">
                                                                        qqq
                                                                        {/* {wayList.find((item) => item.value === el.type).label} */}
                                                                    </div>
                                                                    <div className="flex">{el.creator}</div>
                                                                </div>
                                                                <DeleteOutlined
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                    }}
                                                                    className="absolute top-2 right-2 hover:text-[#ff4d4f]"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </CheckCard.Group>
                                </div>
                            )
                        },
                        {
                            label: '我的插件',
                            key: '2',
                            children: <div>插件分析</div>
                        },
                        {
                            label: '触发历史',
                            key: '3',
                            children: <Table columns={column} dataSource={TableData} />
                        }
                    ]}
                />
            </Modal>
        </div>
    );
};
export default BindPlug;
