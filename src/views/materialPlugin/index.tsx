import { Tabs, Avatar, Tag, Popconfirm, Divider, Tooltip, Popover, Table, Button } from 'antd';
import type { TableColumnsType } from 'antd';
import { AppstoreFilled, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { detailPlug, delOwner, ownerListList, metadataData } from 'api/redBook/plug';
import { pageLibrary } from 'api/plug/index';
import { getMetadata } from 'api/plug/index';
import AddPlug from 'views/materialLibrary/components/addplug';
import dayjs from 'dayjs';
const MaterialPlugin = () => {
    const navigate = useNavigate();
    const [accessKey, setAccessKey] = useState('1');

    //我的插件数据
    const [sceneList, setSceneList] = useState<any[]>([]);
    const [rows, setRows] = useState<any>(null);
    const [plugTableData, setPlugTableData] = useState<any[]>([]);
    const grupList = (list: any) => {
        const groupedByType = list.reduce((acc: any, item: any) => {
            const { scene } = item;
            if (!acc[scene]) {
                acc[scene] = { scene, children: [] };
            }
            acc[scene].children.push(item);
            return acc;
        }, {});
        return Object.values(groupedByType);
    };
    const getTablePlugList = async () => {
        const result = await ownerListList();
        const newRes = grupList(result);
        setPlugTableData(newRes);
    };

    //触发历史数据
    const [timeExpressionTypeList, settimeExpressionTypeList] = useState<any[]>([]);
    const column: TableColumnsType<any> = [
        {
            title: '插件名称',
            dataIndex: 'pluginName',
            width: 200,
            align: 'center'
        },
        {
            title: '素材库名称',
            width: 200,
            align: 'center',
            render: (_, row) => (
                <Button type="link" onClick={() => navigate('/material')}>
                    {row?.libraryName}
                </Button>
            )
        },
        {
            title: '触发器类型',
            align: 'center',
            width: 200,
            render: (_, row) => <div>{timeExpressionTypeList?.find((item) => item.value === row.triggerType)?.label}</div>
        },
        {
            title: '执行状态',
            align: 'center',
            width: 100,
            render: (_, row) => <Tag color={row?.success ? 'success' : 'error'}>{row?.success ? '执行成功' : '执行失败'}</Tag>
        },
        {
            title: '执行数量',
            align: 'center',
            width: 100,
            dataIndex: 'count'
        },
        {
            title: '执行结果',
            align: 'center',
            width: 400,
            render: (_, row) => (
                <Popover content={row.executeResult}>
                    <div className="line-clamp-4">{row.executeResult}</div>
                </Popover>
            )
        },
        {
            title: '总耗时(s)',
            dataIndex: 'executeTime',
            align: 'center',
            width: 100,
            render: (_, row) => <div>{row.executeTime / 1000}</div>
        },
        {
            title: '触发时间',
            align: 'center',
            width: 200,
            render: (_, row) => <div>{dayjs(row.triggerTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        }
    ];
    const [TableData, setTableData] = useState<any[]>([]);
    const getTableData = async () => {
        const result = await pageLibrary({
            pageNo: 1,
            pageSize: 100
            // libraryUid
        });
        setTableData(result.list);
    };
    useEffect(() => {
        metadataData().then((res: any) => {
            setSceneList(res.scene);
            setWayList(res.platform);
        });
        getTablePlugList();
    }, []);
    useEffect(() => {
        getTableData();
    }, []);
    useEffect(() => {
        getMetadata().then((res) => {
            settimeExpressionTypeList(res.triggerType);
        });
    }, []);

    //弹窗
    const [addOpen, setAddOpen] = useState(false);
    const [wayList, setWayList] = useState<any[]>([]);
    return (
        <div>
            <Tabs
                activeKey={accessKey}
                onChange={setAccessKey}
                items={[
                    {
                        label: '我的插件',
                        key: '1',
                        children: (
                            <div>
                                <div className="flex justify-end mb-4">
                                    <div className="flex gap-2 items-end">
                                        <div
                                            onClick={() =>
                                                window.open(
                                                    'https://alidocs.dingtalk.com/i/nodes/N7dx2rn0JbnvRDXjfKqqejY0JMGjLRb3?cid=1295141077%3A2819738279&iframeQuery=utm_medium%3Dim_card%26utm_source%3Dim&utm_medium=im_card&utm_source=im&utm_scene=team_space&corpId=ding788f55f6087ac568f2c783f7214b6d69'
                                                )
                                            }
                                            className="text-[#673ab7] hover:underline cursor-pointer text-xs"
                                        >
                                            插件使用手册
                                        </div>
                                        <Button onClick={() => setAddOpen(true)} type="primary">
                                            创建插件
                                        </Button>
                                    </div>
                                </div>
                                {plugTableData?.map((item) => (
                                    <div key={item.uid}>
                                        <div className="my-4 text-[16px] font-bold">
                                            {sceneList?.find((i) => i.value === item.scene)?.label}
                                        </div>
                                        <div className="w-full grid justify-content-center gap-4 responsive-list-container md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6">
                                            {item?.children?.map((el: any) => (
                                                <div
                                                    onClick={async () => {
                                                        const res = await detailPlug(el.uid);
                                                        setRows(res);
                                                        setAddOpen(true);
                                                    }}
                                                    className="p-4 border border-solid border-[#d9d9d9] rounded-lg hover:border-[#673ab7] cursor-pointer hover:shadow-md relative"
                                                    key={el.uid}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {el.avatar ? (
                                                            <Avatar shape="square" size={64} src={el.avatar} />
                                                        ) : (
                                                            <Avatar shape="square" size={64} icon={<AppstoreFilled />} />
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="text-[18px] font-bold">{el.pluginName}</div>
                                                            <div className="line-clamp-2 h-[44px]">{el.description}</div>
                                                        </div>
                                                    </div>
                                                    <Tag color="processing">扣子机器人：{el?.accountName}</Tag>
                                                    <Divider className="my-2" />
                                                    <div className="flex justify-between text-xs">
                                                        <Tooltip title="更新时间">
                                                            <div className="flex">{dayjs(el.updateTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                        </Tooltip>
                                                        <div className="flex">{el.creator}</div>
                                                    </div>
                                                    <Popconfirm
                                                        title="提示"
                                                        description="请再次确认是否删除？"
                                                        onConfirm={async (e: any) => {
                                                            e.stopPropagation();
                                                            await delOwner(el.uid);
                                                            getTablePlugList();
                                                        }}
                                                        onCancel={(e) => e?.stopPropagation()}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <DeleteOutlined
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                            className="absolute top-[16px] right-[8px] hover:text-[#ff4d4f]"
                                                        />
                                                    </Popconfirm>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    },
                    {
                        label: '触发历史',
                        key: '2',
                        children: <Table columns={column} virtual dataSource={TableData} />
                    }
                ]}
            />
            {addOpen && (
                <AddPlug
                    open={addOpen}
                    setOpen={setAddOpen}
                    wayList={wayList}
                    sceneList={sceneList}
                    rows={rows}
                    setRows={setRows}
                    getTablePlugList={() => {
                        getTablePlugList();
                    }}
                    getDefinitionList={() => {}}
                />
            )}
        </div>
    );
};
export default MaterialPlugin;
