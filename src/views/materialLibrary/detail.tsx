import {
    CloudUploadOutlined,
    DownOutlined,
    EyeOutlined,
    PlusOutlined,
    SearchOutlined,
    SettingOutlined,
    FileImageOutlined,
    FileTextOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import {
    Button,
    Space,
    Tag,
    Dropdown,
    Avatar,
    Popconfirm,
    Upload,
    Image,
    Tooltip,
    message,
    Form,
    Modal,
    Empty,
    Tabs,
    Divider,
    Spin,
    Table,
    Switch
} from 'antd';
import type { TableProps } from 'antd';
import {
    checkMaterialLibrary,
    createMaterialLibraryAppBind,
    createMaterialLibrarySlice,
    delBatchMaterialLibrarySlice,
    delMaterialLibrarySlice,
    getMaterialLibraryDataList,
    getMaterialLibraryDataPage,
    getMaterialLibraryTitleList,
    updateMaterialLibrarySlice,
    updateMaterialLibraryTitle
} from 'api/material';
import { delOwner, publishedList, ownerListList, detailPlug, metadataData } from 'api/redBook/plug';
import { createBatchMaterial, updateBatchMaterial } from 'api/redBook/material';
import { dictData } from 'api/template';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TablePro from 'views/pages/batchSmallRedBooks/components/components/antdProTable';
import { propShow } from 'views/pages/batchSmallRedBooks/components/formModal';
import { IconRenderer } from './index';
import { ActionType, ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import FormModal from './components/formModal';
import './edit-table.css';
import { PicImagePick } from 'ui-component/PicImagePick';
import HeaderField from '../pages/batchSmallRedBooks/components/components/headerField';
import _ from 'lodash';
import SubCard from 'ui-component/cards/SubCard';
import { IconButton } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import MaterialLibrary from './index';
import AiCreate from '../pages/batchSmallRedBooks/components/newAI';
import React from 'react';
import { imageOcr } from 'api/redBook/batchIndex';
import DownMaterial from './components/downMaterial';
import AddPlug from './components/addplug';
import { CheckCard } from '@ant-design/pro-components';
import { getPlugConfigInfo, getPlugInfo } from 'api/plug';
import PlugAnalysis from 'views/pages/batchSmallRedBooks/components/components/plug/Analysis';
import dayjs from 'dayjs';

export enum EditType {
    String = 0,
    Int = 1,
    Time = 2,
    Num = 3,
    Boolean = 4,
    Image = 5
}

export const TableHeader = ({
    isShowField,
    iconUrl,
    name,
    setEditOpen,
    setColOpen,
    setTitle,
    selectedRowKeys,
    handleBatchDel,
    libraryId,
    bizUid,
    bizType,
    pluginConfig,
    columns,
    tableMeta,
    tableData,
    setSelectedRowKeys,
    getTitleList,
    getList,
    libraryType, // 实际值为createSource
    appUid,
    canSwitch,
    canExecute,
    handleExecute
}: {
    isShowField?: boolean;
    // 图标
    iconUrl?: string;
    // 素材库名称
    name: string;
    //编辑|新增素材名称
    setTitle: (title: string) => void;
    // 编辑|新增素材
    setEditOpen: (open: boolean) => void;
    // 编辑素材字段
    setColOpen: (open: boolean) => void;
    // 批量删除
    handleBatchDel: () => void;
    // 选中的行
    selectedRowKeys: React.Key[];
    libraryId: string;
    bizUid: string;
    bizType: string;
    //存储的配置
    pluginConfig: string | null;
    //表头
    columns: any[];
    tableMeta: any[];
    //表格
    tableData: any[];
    //选中的行保存配置之后更新的数据
    setSelectedRowKeys: (data: any) => void;
    //刷新表头数据
    getTitleList: () => void;
    //刷新表格数据
    getList: () => void;
    // 素材类型
    libraryType: number;
    // 应用appUid
    appUid?: string;
    // 可否切换
    canSwitch: boolean;
    // 可否执行
    canExecute: boolean;
    // 执行
    handleExecute?: (data: any[]) => void;
}) => {
    const [plugOpen, setPlugOpen] = useState(false);
    const [plugTitle, setPlugTitle] = useState('插件市场');
    const [plugValue, setPlugValue] = useState<null | string>(null);
    const [openSwitchMaterial, setOpenSwitchMaterial] = React.useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectSwitchRowKeys, setSelectSwitchRowKeys] = React.useState<any[]>([]);
    const [sourceList, setSourceList] = useState<any[]>([]);
    const [addOpen, setAddOpen] = useState(false);

    useEffect(() => {
        dictData('', 'material_create_source').then((res) => {
            setSourceList(res.list);
        });
    }, []);

    const items: any = [
        {
            key: '1',
            label: '编辑素材字段',
            onClick: () => setColOpen(true)
        },
        {
            key: '2',
            label: '导入数据',
            onClick: async () => setUploadOpen(true)
        }
    ];

    useEffect(() => {
        if (!plugOpen) {
            setPlugValue(null);
            setPlugTitle('插件市场');
        }
    }, [plugOpen]);

    const downTableData = async (data: any[], num: number) => {
        const tableMetaList = _.cloneDeep(tableMeta);

        const newData = data.map((record) => {
            console.log(record);
            const recordKeys = Object.keys(record);
            const content = tableMetaList.map((item) => {
                // if (recordKeys.includes(item.columnCode)) {
                if (item.columnType === EditType.Image) {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode] || '',
                        description: record[item.columnCode + '_description'],
                        tags: record[item.columnCode + '_tags'],
                        extend: record[item.columnCode + '_extend']
                    };
                } else {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode],
                        extend: record[item.columnCode + '_extend']
                    };
                }
                // }
            });
            console.log(content);

            return {
                libraryId: record.libraryId || libraryId,
                id: record.id,
                content: content
            };
        });
        if (num === 1) {
            await createBatchMaterial({ saveReqVOS: newData });
            getList();
        } else {
            await updateBatchMaterial({ saveReqVOS: newData });
            getList();
        }
    };

    const [plugMarketList, setPlugMarketList] = useState<any[]>([]);
    const [rows, setRows] = useState<any>(null);
    const PlugColumns: TableProps<any>['columns'] = [
        {
            title: '插件名称',
            width: 200,
            dataIndex: 'pluginName',
            align: 'center'
        },
        {
            title: '使用场景',
            align: 'center',
            render: (_, row) => <Tag color="processing">{sceneList?.find((i) => i.value === row.scene)?.label}</Tag>
        },
        {
            title: '发布到应用市场',
            align: 'center',
            render: (_, row) => <Tag color="processing">{row.published ? '是' : '否'}</Tag>
        },
        {
            title: '创建时间',
            align: 'center',
            render: (_, row) => dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '创建人',
            align: 'center',
            dataIndex: 'creator'
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            render: (_, record, index) => (
                <Space>
                    <Button
                        onClick={async () => {
                            const res = await detailPlug(record.uid);
                            setRows(res);
                            setAddOpen(true);
                        }}
                        type="link"
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="提示"
                        description="请再次确认是否删除"
                        onConfirm={async () => {
                            await delOwner(record.uid);
                            getTablePlugList();
                        }}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button danger type="link">
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const [plugMarketOpen, setPlugMarketOpen] = useState(false);
    const [plugTableData, setPlugTableData] = useState<any[]>([]);

    const [sceneList, setSceneList] = useState<any[]>([]);
    const [wayList, setWayList] = useState<any[]>([]);

    const [plugUid, setPlugUid] = useState('');
    const [plugRecord, setPlugRecord] = useState<any>(null);
    const [plugConfigOpen, setPlugConfigOpen] = useState(false);

    const handleOpenPlug = async (record: any) => {
        const data = await getPlugConfigInfo({
            libraryUid: '140573430966447ca7dfeb422c259128',
            pluginUid: record.uid
        });
        setPlugUid(record.uid);
        setPlugConfigOpen(record);
        console.log(data, 'data');
        setPlugRecord({
            ...record,
            ...data
        });
    };

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
    const getPlugList = async () => {
        // await metadataData();
        const res = await publishedList();
        const newRes = grupList(res);
        console.log(newRes);
        setPlugMarketList(newRes);
    };
    const getTablePlugList = async () => {
        const result = await ownerListList();
        setPlugTableData(result);
    };
    useEffect(() => {
        metadataData().then((res: any) => {
            setSceneList(res.scene);
            setWayList(res.platform);
        });
        getPlugList();
        getTablePlugList();
    }, []);
    return (
        <div>
            <div className="flex  mb-4">
                <Avatar shape="square" icon={<IconRenderer value={iconUrl || 'AreaChartOutlined'} />} size={48} />
                <div className="flex flex-col ml-3 justify-between">
                    <div className="cursor-pointer flex items-center ">
                        <span className="text-[20px] font-semibold mr-1">{name}</span>
                        {canSwitch && (
                            <Tooltip title="切换素材库">
                                <svg
                                    onClick={() => setOpenSwitchMaterial(true)}
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="4263"
                                    width="20"
                                    height="20"
                                >
                                    <path
                                        d="M810.752 205.397333a213.333333 213.333333 0 0 1 213.333333 213.333334v128h-85.333333v-128a128 128 0 0 0-128-128h-768a42.666667 42.666667 0 0 1-24.746667-77.397334L316.586667 0l49.493333 69.461333-190.293333 135.936h634.88z m-597.333333 597.333334a213.333333 213.333333 0 0 1-213.333334-213.333334v-128h85.333334v128a128 128 0 0 0 128 128h768a42.666667 42.666667 0 0 1 24.746666 77.397334l-298.666666 213.333333-49.493334-69.461333 190.293334-135.936H213.333333z"
                                        fill="#333333"
                                        p-id="4264"
                                    ></path>
                                </svg>
                            </Tooltip>
                        )}
                    </div>
                    <div>
                        <Space size={4}>
                            <Tag bordered={false}>{sourceList?.find((v) => +v.value === libraryType)?.label || '未知'}</Tag>
                        </Space>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-md border flex justify-between mb-3 ">
                <div className="flex items-end w-[210px]">
                    <Space>
                        <Popconfirm title="确认删除?" onConfirm={handleBatchDel}>
                            <Button disabled={selectedRowKeys.length === 0} danger>
                                批量删除({selectedRowKeys.length})
                            </Button>
                        </Popconfirm>
                        {canExecute && (
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                type="primary"
                                onClick={() => handleExecute && handleExecute(selectedRowKeys)}
                            >
                                选择执行({selectedRowKeys.length})
                            </Button>
                        )}
                    </Space>
                </div>
                <div className="flex border border-solid rounded border-[#f4f6f8] shadow-sm">
                    <Space>
                        <div
                            onClick={() => {
                                setPlugOpen(true);
                                setPlugTitle('小红书分析');
                                setPlugValue('xhsOcr');
                            }}
                            className="flex items-center flex-col cursor-pointer py-2 w-[80px] hover:bg-[#d9d9d9] h-[63px]"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="4316"
                                width="20"
                                height="20"
                            >
                                <path
                                    d="M726.51776 457.45152c-6.70208-0.0768-13.39392 0-20.00384-0.0768-2.37056 0-3.0464 1.05984-3.0464 3.23072 0.0768 5.10976 0.0768 10.13248 0.0768 15.232v0.01024c0.07168 4.87936 0 9.7536 0.07168 14.56128 0 3.90656 0.68096 4.66944 4.45952 4.66944 7.1424 0.0768 14.27456 0 21.41696 0.0768 2.67776 0 3.72736-1.28 3.65056-3.75808-0.08704-9.1648-0.08704-18.31936-0.15872-27.48416a6.7584 6.7584 0 0 0-6.46656-6.46144z"
                                    fill="#FF2E4D"
                                    p-id="4317"
                                ></path>
                                <path
                                    d="M849.92 51.2h-675.84c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.8656 55.0144 122.88 122.88 122.88h675.84c67.8656 0 122.88-55.0144 122.88-122.88V174.08c0-67.8656-55.0144-122.88-122.88-122.88zM250.78784 505.73312c-0.73728 10.59328-1.41312 21.25312-2.60608 31.8464-2.08896 18.39104-6.24128 36.26496-14.6432 52.864-2.16064 4.12672-5.13536 7.79776-8.18176 12.45696-1.85344-3.90656-3.41504-6.97856-4.82816-10.13248a3203.59424 3203.59424 0 0 1-14.79168-33.56672c-0.52736-1.2032-0.896-2.92352-0.36864-3.97824 3.19488-6.83008 3.41504-14.12096 3.85536-21.40672 0.60416-9.15968 1.35168-18.24256 2.01728-27.39712 0.51712-7.00416 0.80896-13.9776 1.39776-20.96128 0.67584-8.10496 1.49504-16.21504 2.16064-24.24832 0.14848-1.96608 1.04448-2.56 2.82624-2.56 11.0848 0 22.07744 0 33.16224-0.07168 2.37056 0 3.0464 0.98304 2.89792 3.23072-0.96768 14.63296-1.86368 29.28128-2.89792 43.92448z m71.29088 87.32672c-0.73728 9.46176-5.13536 17.49504-12.5696 23.5008-5.43232 4.352-11.74528 6.15936-18.6624 6.08256-5.87264 0-11.66848-0.0768-17.54112 0-2.00192 0-3.27168-0.60416-4.09088-2.55488-3.41504-7.6544-6.90688-15.32416-10.32192-22.97344-0.52736-1.13152-0.67584-2.33472-1.13152-3.456-1.63328-4.12672-1.5616-4.28544 2.97472-4.36224h13.90592c5.94944 0 8.47872-2.46784 8.5504-8.56576 0.07168-4.57216 0.07168-9.14944 0.07168-13.73696V494.2336c0.14848 0.15872 0.22016 0.15872 0.29696 0.15872V408.63744c0-4.28544 0.14848-4.43392 4.38784-4.43392h29.21472c5.13536 0 5.20704 0.14848 5.20704 5.40672 0 27.1872 0 54.36416 0.0768 81.47968 0.0768 23.87456 0.29696 47.75936 0.29696 71.6288 0 10.14272 0.14848 20.26496-0.6656 30.34112z m75.58656-28.90752c-4.98688 11.56096-10.19904 22.97344-15.31904 34.4576-0.45568 1.13664-1.19296 2.25792-2.3808 4.42368v0.01024c-2.97472-4.5056-6.0928-8.18176-8.11008-12.39552-2.82624-6.13888-4.5312-12.83584-7.35744-18.9952-3.0464-6.6816-4.15744-13.88032-5.57568-20.94592-1.1776-6.02112-1.40288-12.25216-1.8432-18.3296-1.2032-15.39584-2.23744-30.78656-3.44064-46.09536a2449.95584 2449.95584 0 0 0-2.0736-25.1648c-0.14848-1.50016 0.2304-2.176 1.94048-2.176 11.52512 0 22.97344-0.14848 34.49856-0.22016 2.1504 0 3.0464 0.96768 3.11808 2.9952 0.29696 4.65408 0.51712 9.31328 0.88576 13.97248 0.29696 3.83488 0.73728 7.6544 1.04448 11.41248 0.51712 5.40672 1.04448 10.81344 1.41312 16.14336 0.51712 6.90688 0.51712 13.81888 1.4848 20.63872 1.34144 10.4448 0.29696 21.10464 3.93216 31.32928 0.89088 2.40128-0.96768 6.08768-2.21696 8.93952z m84.28032 22.016c-2.89792 6.6816-6.02112 13.21472-8.99072 19.82464-1.64352 3.74784-3.19488 7.49568-4.76672 11.25376-1.85344 4.51072-3.11808 5.40672-7.87456 5.40672h-22.2976c-7.52128 0-15.0272 0.23552-22.53312-0.0768-3.56352-0.14336-7.0656-1.27488-10.62912-2.02752-1.792-0.36864-2.16064-1.42336-1.41312-3.14368a3709.71648 3709.71648 0 0 0 13.45024-29.21472c1.04448-2.24768 1.85344-4.65408 3.0464-6.90688 0.29696-0.6144 1.41312-1.28 2.00192-1.13152 12.42112 3.15392 25.13408 2.77504 37.76512 2.63168a874.6496 874.6496 0 0 1 20.07552 0c3.19488 0.00512 3.50208 0.45568 2.16576 3.38432z m3.84-21.86752a4.48512 4.48512 0 0 1-2.74944 1.4336c-13.89568 0.0768-27.8784 0.14848-41.77408-0.0768-4.23936-0.08704-8.5504-1.05472-11.74528-4.28544-3.3536-3.3792-4.98688-7.36256-3.28192-11.93984a897.52576 897.52576 0 0 1 9.58464-24.10496c3.88096-9.15456 7.81312-18.31936 12.05248-28.2368-2.30912-0.14848-3.712-0.29696-5.04832-0.29696-4.09088-0.07168-8.18176 0.29696-12.27264-0.2304-4.45952-0.51712-8.99072-1.04448-12.48256-4.79232-3.42528-3.6864-3.94752-8.04352-2.60608-12.32384 2.1504-6.83008 4.97664-13.44 7.80288-20.04992 2.67776-6.15424 5.72416-12.16 8.47872-18.24256 2.97472-6.53824 5.86752-13.07136 8.77056-19.6096a1361.99168 1361.99168 0 0 0 7.6544-17.33632c0.73728-1.80736 1.8688-2.47808 3.87072-2.47808 10.93632 0.07168 21.92896 0 32.86528 0 3.6352 0 3.712 0.36864 2.29888 3.6864-6.31296 14.63296-12.71808 29.20448-18.95936 43.84768a11.52 11.52 0 0 0-1.19296 4.87936c0.22016 3.90656 1.04448 4.5056 5.06368 4.5056 8.17152 0.0768 16.35328 0 24.448 0 1.64864 0 3.3536 0.22016 4.98688 0.29696 2.30912 0.0768 2.60608 1.05984 1.63328 3.072a2455.21408 2455.21408 0 0 0-13.3888 29.21472c-3.03616 6.91712-5.93408 13.89568-8.9088 20.8128a1530.1632 1530.1632 0 0 1-6.1696 13.80864c-1.94048 4.20352-0.60416 6.31296 4.15232 6.38976 6.02112 0 12.04224 0.0768 18.05824 0 2.08896 0 3.13344 0.60416 2.08896 2.85184-3.6352 8.25344-7.21408 16.58368-10.84928 24.85248-0.67072 1.50016-1.408 3.072-2.3808 4.352z m134.81472 58.73664h-125.3376c-1.72032-0.22016-3.48672-0.22016-5.94432-0.22016v-0.01536c0.88064-2.61632 1.41312-4.41856 2.1504-6.0672 4.69504-10.29632 9.4464-20.5056 14.0544-30.79168 1.04448-2.33472 2.52928-2.92352 4.75648-2.92352h28.6976c4.54656 0 4.75648-0.2304 4.75648-4.74112V461.66016c0-3.97824-0.0768-4.05504-4.08064-4.05504-6.10304 0-12.26752-0.0768-18.36544 0-2.30912 0-3.27168-0.51712-3.27168-3.1488 0.14848-10.97216 0.0768-21.92896 0.0768-32.88576 0-3.90656 0.0768-3.90656 3.86048-3.90656h73.00096c4.23936 0 8.5504 0.0768 12.78976 0 2.01728 0 2.82624 0.82432 2.74944 2.85184-0.0768 11.41248-0.0768 22.82496-0.0768 34.31424 0 2.02752-0.73728 2.77504-2.82624 2.77504-6.6048-0.0768-13.14304 0.07168-19.77856 0.07168-2.29376 0-3.33824 1.05984-3.33824 3.46624 0.0768 18.39104 0.14336 36.7104 0.14336 55.11168 0 20.87424 0 41.74848 0.0768 62.6944 0 3.75808 0.36864 4.21376 4.17792 4.21376h31.4368c3.41504 0 3.87072 0.36864 3.93728 3.81952 0.08704 10.97216 0 21.92896 0.08704 32.89088-0.01024 2.8672-1.57184 3.16416-3.73248 3.16416z m198.69696-34.92864c-0.14848 16.37376-11.008 29.21472-26.38848 32.89088-4.31616 1.05472-8.78592 1.35168-13.24544 1.5104-6.83008 0.22016-13.7472 0.07168-20.58752 0.07168-4.23936 0-5.42208-0.83456-6.9888-4.66432-3.33824-7.95136-6.83008-15.90784-10.26048-23.87456l-0.66048-1.57184c-1.19296-3.072-0.81408-3.61472 2.45248-3.61472 9.43616-0.07168 18.95424 0.15872 28.3904-0.29184 5.65248-0.29696 8.03328-2.85696 8.18688-8.64256 0.22016-11.04384-0.29696-22.07744-0.14848-33.11104 0.0768-5.48864-6.84032-11.42272-11.74528-11.71968a32.8448 32.8448 0 0 0-2.74944-0.14336c-18.73408 0-37.54496 0-56.2688 0.07168-5.27872 0-5.65248 0.53248-5.65248 5.8624l0.20992 77.55776c0 4.14208-0.0768 4.21376-4.23936 4.21376h-31.22176c-4.01408 0-4.3008-0.3072-4.3008-4.28544v-39.94112c0.06144 0.14336 0.13312 0.14336 0.20992 0.14336v-40.99584c0-2.78016-1.85344-2.93888-3.78368-2.93888-10.19392 0.08704-20.44416 0.31232-30.62272 0.31232-6.92224 0-6.17984 0.8192-6.25664-6.38976-0.0768-9.90208 0-19.90144 0-29.80352 0-3.59936 0.36864-4.05504 3.94752-4.13184 10.7008-0.07168 21.33504 0 32.04096-0.07168 4.09088 0 4.31104-0.15872 4.38272-4.21376 0.0768-9.90208-0.0768-19.8144 0-29.73184 0-2.4832-1.04448-3.23072-3.41504-3.23072-6.84544 0.0768-13.76256-0.07168-20.60288 0-2.1504 0-2.89792-0.74752-2.89792-2.92352 0.09216-11.26912 0.09216-22.46144-0.06144-33.72544 0-2.70336 1.03424-3.29216 3.41504-3.29216 6.31296 0.0768 12.6464 0 18.95936 0 4.23424 0 4.45952-0.3072 4.5312-4.74112 0-2.61632 0.14848-5.24288 0-7.87456-0.07168-2.4832 1.04448-3.15904 3.34336-3.15904 9.07776 0.0768 18.22208 0.0768 27.28448 0.0768h4.97664c3.94752 0 4.0192 0 4.1728 4.05504 0.06656 2.4064-0.1536 4.87936-0.08704 7.28576 0.0768 3.3792 0.9728 4.2752 4.31616 4.36224 5.65248 0.0768 11.30496 0.0768 17.024 0.0768 14.6432 0.07168 27.3664 5.09952 37.0176 16.29184 5.35552 6.22592 8.69888 13.81888 9.216 22.14912 0.52736 8.47872 0.15872 17.03936 0.3072 25.52832 0 3.15904 0.22016 6.38976 0.36864 9.53344 0.14336 3.15904 0.896 3.97824 4.09088 3.90656a48.56832 48.56832 0 0 1 19.03104 3.15904c13.00992 5.03808 21.03296 14.18752 23.63904 28.01152a44.4416 44.4416 0 0 1 0.73728 8.33024c0.08192 17.88928 0.06656 35.78368-0.06656 53.6832zM810.14272 453.632c-5.94432 3.90656-12.1856 3.75808-19.4048 3.6864-2.23744 0-5.20192 0.07168-8.09984-0.0768-0.7424-0.07168-2.00704-0.98304-2.08896-1.5872-0.6656-8.84736-1.77152-17.792 1.35168-26.35264 2.75456-7.5776 9.58464-12.01664 17.61792-12.16a19.99872 19.99872 0 0 1 19.32288 14.336c2.30912 8.2688-1.55648 17.42336-8.69888 22.15424z"
                                    fill="#FF2E4D"
                                    p-id="4318"
                                ></path>
                            </svg>
                            <div className="text-[12px] font-bold mt-1">小红书分析</div>
                        </div>
                        <div
                            onClick={() => {
                                setPlugOpen(true);
                                setPlugTitle('AI素材生成');
                                setPlugValue('generate_material_batch');
                            }}
                            className="flex items-center flex-col cursor-pointer  py-2 w-[80px] hover:bg-[#d9d9d9] h-[63px]"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="5361"
                                width="20"
                                height="20"
                            >
                                <path
                                    d="M910.2336 1024H113.7664C51.2 1024 0 972.8 0 910.2336V113.7664C0 51.2 51.2 0 113.7664 0h796.4672C972.8 0 1024 51.2 1024 113.7664v796.4672C1024 972.8 972.8 1024 910.2336 1024z m-236.544-242.176l-196.6848-516.352h-71.3472L208.9984 781.824h73.6768l49.664-141.312h215.0144l52.6336 141.312h73.6768z m65.9712 0h65.3568V413.1584h-65.3568V781.824z m-7.68-498.6624c0 11.5456 3.9168 21.1712 11.6992 28.8512 7.7568 7.6544 17.5616 11.4944 29.3376 11.4944 11.776 0 21.6832-3.84 29.824-11.52 8.1152-7.68 12.16-17.28 12.16-28.8256 0-11.776-4.0448-21.5552-12.16-29.312a41.472 41.472 0 0 0-29.824-11.6736c-11.5712 0-21.2992 3.9168-29.184 11.8272a39.6544 39.6544 0 0 0-11.8528 29.184z m-205.312 299.008h-173.3376l77.312-214.6816c3.1232-8.448 5.888-20.4544 8.3456-35.9936h1.6896c2.8672 17.1264 5.5552 29.1072 7.9872 35.9936l78.0032 214.6816z"
                                    fill="#F6B502"
                                    p-id="5362"
                                ></path>
                            </svg>
                            <div className="text-[12px] font-bold mt-1">AI素材生成</div>
                        </div>
                        <Divider className="mx-0" type="vertical" style={{ height: '35px' }} />
                        <div
                            onClick={() => {
                                setPlugOpen(true);
                                setPlugTitle('文本智能提取');
                                setPlugValue('extraction');
                            }}
                            className="flex items-center flex-col cursor-pointer  py-2 w-[80px] hover:bg-[#d9d9d9] h-[63px]"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="6760"
                                width="20"
                                height="20"
                            >
                                <path
                                    d="M791.466667 699.2l47.466666 47.466667h-215.466666v52.266666h215.466666l-47.466666 47.466667 36.8 37.333333 109.866666-110.933333-109.866666-110.933333-36.8 37.333333zM576 669.866667H181.333333V196.8h669.333334v367.466667h70.4V199.466667c0-43.2-34.666667-77.866667-77.866667-77.866667H188.8c-43.2 0-77.866667 34.666667-77.866667 77.866667v467.733333c0 43.2 34.666667 77.866667 77.866667 77.866667H576v-75.2zM569.066667 820.266667H248c-24 0-43.2 16.533333-43.2 37.333333s19.2 37.333333 43.2 37.333333h321.066667v-74.666666z"
                                    p-id="6761"
                                ></path>
                                <path
                                    d="M586.133333 595.733333c-17.6-1.6-27.2-5.333333-33.6-11.2l-0.533333-0.533333c-5.866667-6.4-9.066667-20.266667-9.066667-42.133333V308.8c0-3.2 2.666667-5.866667 5.866667-5.866667h37.333333c33.6 0 35.733333 4.8 46.4 14.4 11.733333 9.066667 16.533333 13.866667 22.933334 43.733334 0.533333 2.666667 3.2 4.8 5.866666 4.8h2.133334c3.733333 0 6.4-2.666667 5.866666-6.4l-0.533333-100.266667H346.133333c-3.2 0-5.866667 2.666667-5.866666 5.866667l-0.533334 93.866666c0 3.733333 2.666667 6.4 5.866667 6.4h2.133333c3.2 0 5.333333-2.133333 5.866667-4.8 5.866667-29.866667 11.2-34.666667 22.933333-43.733333 10.666667-9.066667 12.8-13.866667 46.4-13.866667h37.333334c3.2 0 5.866667 2.666667 5.866666 5.866667v226.133333c0 26.133333-2.666667 41.6-8.533333 46.4-0.533333 0-0.533333 0.533333-1.066667 1.066667-5.333333 6.933333-13.866667 11.2-31.466666 13.333333-3.2 0-5.333333 2.666667-5.333334 5.866667 0 3.2 2.666667 5.866667 5.866667 5.866667h158.933333c3.2 0 5.866667-2.666667 5.866667-5.866667 1.066667-2.666667-1.066667-5.866667-4.266667-5.866667zM725.333333 501.866667l-0.533333-42.666667h-137.6c-1.6 0-2.666667 1.066667-2.666667 2.666667v40c0 1.6 1.066667 2.666667 2.666667 2.666666h1.066667c1.066667 0 2.133333-1.066667 2.666666-2.133333 2.666667-12.8 4.8-14.933333 9.6-18.666667 4.266667-3.733333 5.333333-5.866667 19.733334-5.866666h16c1.6 0 2.666667 1.066667 2.666666 2.666666v96.533334c0 11.2-1.066667 17.6-3.733333 19.733333l-0.533333 0.533333c-2.133333 3.2-5.866667 4.8-13.333334 5.333334-1.6 0-2.666667 1.066667-2.666666 2.666666s1.066667 2.666667 2.666666 2.666667h67.733334c1.6 0 2.666667-1.066667 2.666666-2.666667 0-1.066667-1.066667-2.666667-2.666666-2.666666-7.466667-0.533333-11.733333-2.133333-14.4-4.8s-3.733333-8.533333-3.733334-18.133334V480.533333c0-1.6 1.066667-2.666667 2.666667-2.666666h16c14.4 0 15.466667 2.133333 19.733333 5.866666 4.8 3.733333 6.933333 5.866667 9.6 18.666667 0.533333 1.066667 1.066667 2.133333 2.666667 2.133333h1.066667c1.6 0 3.2-1.066667 2.666666-2.666666z m0 0"
                                    p-id="6762"
                                ></path>
                            </svg>
                            <div className="text-[12px] font-bold mt-1">文本智能提取</div>
                        </div>
                        <div
                            onClick={() => {
                                setPlugOpen(true);
                                setPlugTitle('图片OCR提取');
                                setPlugValue('imageOcr');
                            }}
                            className="flex items-center flex-col cursor-pointer  py-2 w-[80px] hover:bg-[#d9d9d9] h-[63px]"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="9623"
                                width="20"
                                height="20"
                            >
                                <path
                                    d="M640.189 960.294l-0.131-64 254.651-0.522 1.285-255.968 64 0.322-1.605 319.515-318.2 0.653z m-256.239-0.075l-318.197-1.237 0.251-319.042 64 0.051-0.201 255.239 254.396 0.989-0.249 64zM66.004 383.837L65.53 64.399l318.728 1.829-0.367 63.999-254.265-1.459 0.378 254.975-64 0.094zM897.495 383l-0.661-252.989-254.683 0.217-0.055-64 318.569-0.271 0.829 316.876-63.999 0.167zM404.866 510.522c0 24.75-5.328 46.895-15.984 66.43-10.656 19.537-25.553 34.719-44.688 45.547-19.137 10.828-40.562 16.242-64.281 16.242-23.146 0-44.201-5.242-63.164-15.727-18.965-10.484-33.717-25.207-44.258-44.172-10.543-18.963-15.812-40.418-15.812-64.367 0-25.093 5.328-47.665 15.984-67.718 10.656-20.05 25.609-35.549 44.859-46.492 19.25-10.941 41.135-16.414 65.656-16.414 23.604 0 44.714 5.242 63.336 15.727 18.619 10.484 33 25.438 43.141 44.859s15.211 41.451 15.211 66.085z m-78.719 2.062c0-20.281-3.896-36.265-11.688-47.953-7.793-11.688-18.45-17.531-31.969-17.531-14.781 0-26.297 5.615-34.547 16.844-8.25 11.231-12.375 27.1-12.375 47.609 0 20.053 4.096 35.693 12.289 46.922 8.191 11.23 19.336 16.844 33.43 16.844 8.594 0 16.328-2.52 23.203-7.562 6.875-5.041 12.203-12.26 15.984-21.656 3.782-9.396 5.673-20.566 5.673-33.517zM623.147 627.741c-20.396 7.332-43.943 11-70.641 11-26.24 0-48.872-5.012-67.891-15.039-19.021-10.025-33.545-24.291-43.57-42.797-10.028-18.504-15.039-39.846-15.039-64.023 0-26.009 5.613-49.156 16.844-69.437 11.229-20.281 27.097-35.949 47.609-47.008 20.51-11.057 44.114-16.586 70.813-16.586 21.312 0 41.938 2.578 61.875 7.734v68.578c-6.875-4.125-15.068-7.332-24.578-9.625a122.892 122.892 0 0 0-28.875-3.438c-20.168 0-36.066 5.787-47.695 17.359-11.631 11.575-17.446 27.271-17.446 47.093 0 19.709 5.814 35.264 17.446 46.664 11.629 11.402 27.184 17.102 46.664 17.102 17.988 0 36.15-4.582 54.484-13.75v66.173zM789.351 634.444l-18.391-53.109c-3.553-10.426-8.164-18.619-13.836-24.578-5.672-5.957-11.832-8.938-18.477-8.938h-2.922v86.625h-74.25V387.975h98.656c34.488 0 59.955 5.645 76.398 16.93 16.441 11.287 24.664 28.217 24.664 50.789 0 16.959-4.785 31.168-14.352 42.625-9.568 11.458-23.805 19.765-42.711 24.921v0.688c10.426 3.209 19.105 8.422 26.039 15.641 6.932 7.219 13.148 17.934 18.648 32.141l24.234 62.734h-83.7z m-7.047-168.265c0-8.25-2.521-14.781-7.562-19.594-5.043-4.812-12.949-7.219-23.719-7.219h-15.297v56.375h13.406c9.969 0 17.988-2.807 24.062-8.422 6.073-5.613 9.11-12.659 9.11-21.14z"
                                    p-id="9624"
                                ></path>
                            </svg>
                            <div className="text-[12px] font-bold mt-1">图片OCR提取</div>
                        </div>
                        <div
                            onClick={() => {
                                setPlugOpen(true);
                                setPlugTitle('AI字段补齐');
                                setPlugValue('generate_material_one');
                            }}
                            className="flex items-center flex-col cursor-pointer py-2 w-[80px] hover:bg-[#d9d9d9] h-[63px]"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="12640"
                                width="20"
                                height="20"
                            >
                                <path
                                    d="M589.6 364.3c3 5 8.7 7.7 14.5 7l25.2-3.1c9.4-1.1 15.3-10.7 12.3-19.6l-28.4-82.8c-2.1-6-7.7-10.1-14.1-10.1H292.9c-6.2 0-11.7 3.8-13.9 9.5l-32 82.9c-3.5 9.2 2.6 19.2 12.4 20.2l28.8 2.9c5.8 0.6 11.4-2.2 14.4-7.3l1.6-2.8c20.2-34.2 31.2-42.8 35-44.9 3.9-2.2 16.6-7.2 51.7-7.2 3.3 0 6 0 8.3 0.1V574c-1.9 0.2-4.5 0.5-8.3 0.5h-33.5c-8.2 0-14.9 6.7-14.9 14.9v21.8c0 8.2 6.7 14.9 14.9 14.9h173.9c8.2 0 14.9-6.7 14.9-14.9v-21.8c0-8.2-6.7-14.9-14.9-14.9h-33.5c-3.7 0-6.5-0.3-8.3-0.8V310.4v-1c4.3-0.1 10-0.2 17.8-0.2 36.3 0 45.3 5.9 46.2 6.6 3.4 2.5 13.4 12 34.4 45.8l1.7 2.7z"
                                    p-id="12641"
                                ></path>
                                <path
                                    d="M880 112H144c-17.6 0-32 14.4-32 32v736c0 17.6 14.4 32 32 32h422.1c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H184V184h656v389.6c0 8.8 7.2 16 16 16h40c8.8 0 16-7.2 16-16V144c0-17.6-14.4-32-32-32z"
                                    p-id="12642"
                                ></path>
                                <path
                                    d="M895.6 703.4h-97.8v-97.8c0-8.8-7.2-16-16-16H722c-8.8 0-16 7.2-16 16v97.8h-97.8c-8.8 0-16 7.2-16 16v59.8c0 8.8 7.2 16 16 16H706V893c0 8.8 7.2 16 16 16h59.8c8.8 0 16-7.2 16-16v-97.8h97.8c8.8 0 16-7.2 16-16v-59.8c0-8.8-7.2-16-16-16z"
                                    p-id="12643"
                                ></path>
                            </svg>
                            <div className="text-[12px] font-bold mt-1">AI字段补齐</div>
                        </div>
                        <div
                            onClick={() => {
                                setPlugOpen(true);
                                setPlugTitle('微信公共号分析');
                                setPlugValue('wchat');
                            }}
                            className="flex items-center flex-col cursor-pointer py-2 w-[100px] hover:bg-[#d9d9d9] h-[63px]"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="12640"
                                width="20"
                                height="20"
                            >
                                <path
                                    d="M589.6 364.3c3 5 8.7 7.7 14.5 7l25.2-3.1c9.4-1.1 15.3-10.7 12.3-19.6l-28.4-82.8c-2.1-6-7.7-10.1-14.1-10.1H292.9c-6.2 0-11.7 3.8-13.9 9.5l-32 82.9c-3.5 9.2 2.6 19.2 12.4 20.2l28.8 2.9c5.8 0.6 11.4-2.2 14.4-7.3l1.6-2.8c20.2-34.2 31.2-42.8 35-44.9 3.9-2.2 16.6-7.2 51.7-7.2 3.3 0 6 0 8.3 0.1V574c-1.9 0.2-4.5 0.5-8.3 0.5h-33.5c-8.2 0-14.9 6.7-14.9 14.9v21.8c0 8.2 6.7 14.9 14.9 14.9h173.9c8.2 0 14.9-6.7 14.9-14.9v-21.8c0-8.2-6.7-14.9-14.9-14.9h-33.5c-3.7 0-6.5-0.3-8.3-0.8V310.4v-1c4.3-0.1 10-0.2 17.8-0.2 36.3 0 45.3 5.9 46.2 6.6 3.4 2.5 13.4 12 34.4 45.8l1.7 2.7z"
                                    p-id="12641"
                                ></path>
                                <path
                                    d="M880 112H144c-17.6 0-32 14.4-32 32v736c0 17.6 14.4 32 32 32h422.1c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H184V184h656v389.6c0 8.8 7.2 16 16 16h40c8.8 0 16-7.2 16-16V144c0-17.6-14.4-32-32-32z"
                                    p-id="12642"
                                ></path>
                                <path
                                    d="M895.6 703.4h-97.8v-97.8c0-8.8-7.2-16-16-16H722c-8.8 0-16 7.2-16 16v97.8h-97.8c-8.8 0-16 7.2-16 16v59.8c0 8.8 7.2 16 16 16H706V893c0 8.8 7.2 16 16 16h59.8c8.8 0 16-7.2 16-16v-97.8h97.8c8.8 0 16-7.2 16-16v-59.8c0-8.8-7.2-16-16-16z"
                                    p-id="12643"
                                ></path>
                            </svg>
                            <div className="text-[12px] font-bold mt-1">微信公众号分析</div>
                        </div>
                        <div
                            onClick={() => {
                                setPlugMarketOpen(true);
                            }}
                            className="flex items-center flex-col cursor-pointer py-2 w-[80px] hover:bg-[#d9d9d9] h-[63px]"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="12640"
                                width="20"
                                height="20"
                            >
                                <path
                                    d="M589.6 364.3c3 5 8.7 7.7 14.5 7l25.2-3.1c9.4-1.1 15.3-10.7 12.3-19.6l-28.4-82.8c-2.1-6-7.7-10.1-14.1-10.1H292.9c-6.2 0-11.7 3.8-13.9 9.5l-32 82.9c-3.5 9.2 2.6 19.2 12.4 20.2l28.8 2.9c5.8 0.6 11.4-2.2 14.4-7.3l1.6-2.8c20.2-34.2 31.2-42.8 35-44.9 3.9-2.2 16.6-7.2 51.7-7.2 3.3 0 6 0 8.3 0.1V574c-1.9 0.2-4.5 0.5-8.3 0.5h-33.5c-8.2 0-14.9 6.7-14.9 14.9v21.8c0 8.2 6.7 14.9 14.9 14.9h173.9c8.2 0 14.9-6.7 14.9-14.9v-21.8c0-8.2-6.7-14.9-14.9-14.9h-33.5c-3.7 0-6.5-0.3-8.3-0.8V310.4v-1c4.3-0.1 10-0.2 17.8-0.2 36.3 0 45.3 5.9 46.2 6.6 3.4 2.5 13.4 12 34.4 45.8l1.7 2.7z"
                                    p-id="12641"
                                ></path>
                                <path
                                    d="M880 112H144c-17.6 0-32 14.4-32 32v736c0 17.6 14.4 32 32 32h422.1c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H184V184h656v389.6c0 8.8 7.2 16 16 16h40c8.8 0 16-7.2 16-16V144c0-17.6-14.4-32-32-32z"
                                    p-id="12642"
                                ></path>
                                <path
                                    d="M895.6 703.4h-97.8v-97.8c0-8.8-7.2-16-16-16H722c-8.8 0-16 7.2-16 16v97.8h-97.8c-8.8 0-16 7.2-16 16v59.8c0 8.8 7.2 16 16 16H706V893c0 8.8 7.2 16 16 16h59.8c8.8 0 16-7.2 16-16v-97.8h97.8c8.8 0 16-7.2 16-16v-59.8c0-8.8-7.2-16-16-16z"
                                    p-id="12643"
                                ></path>
                            </svg>
                            <div className="text-[12px] font-bold mt-1">插件市场</div>
                        </div>
                    </Space>
                </div>
                <div className="flex items-end justify-end" style={{ flex: '0 0 210px' }}>
                    <Space>
                        {!isShowField && (
                            <Button type="primary" onClick={() => setUploadOpen(true)}>
                                批量导入
                            </Button>
                        )}
                        <Button
                            type="primary"
                            onClick={() => {
                                setEditOpen(true);
                                setTitle('新增素材');
                            }}
                        >
                            新增素材
                        </Button>
                        {isShowField && (
                            <Dropdown menu={{ items }}>
                                <Button>
                                    <Space>
                                        <SettingOutlined className="p-1 cursor-pointer" />
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        )}
                    </Space>
                </div>
            </div>
            <Modal width={800} maskClosable={false} open={plugOpen} onCancel={() => setPlugOpen(false)} footer={false}>
                <div className="font-bold text-xl mb-8 flex items-center gap-2">{plugTitle}</div>
                <AiCreate
                    libraryId={libraryId}
                    bizType={bizType}
                    bizUid={bizUid}
                    pluginConfig={pluginConfig}
                    plugValue={plugValue}
                    setPlugOpen={setPlugOpen}
                    columns={columns}
                    tableData={tableData}
                    setSelectedRowKeys={setSelectedRowKeys}
                    downTableData={downTableData}
                    getTitleList={getTitleList}
                />
            </Modal>
            {openSwitchMaterial && (
                <ModalForm
                    width={1000}
                    title="切换素材库"
                    open={openSwitchMaterial}
                    onOpenChange={setOpenSwitchMaterial}
                    onFinish={async () => {
                        const result = await checkMaterialLibrary({
                            libraryId: selectSwitchRowKeys[0],
                            appUid
                        });
                        if (result) {
                            const data = await createMaterialLibraryAppBind({
                                libraryId: selectSwitchRowKeys[0],
                                appUid
                            });
                            if (data) {
                                message.success('切换成功!');
                                getTitleList();
                                getList();
                                setOpenSwitchMaterial(false);
                            }
                        } else {
                            Modal.confirm({
                                title: '提示',
                                icon: <ExclamationCircleFilled />,
                                content: '当前素材库与原始素材库存在差异, 确认切换',
                                async onOk() {
                                    const data = await createMaterialLibraryAppBind({
                                        libraryId: selectSwitchRowKeys[0],
                                        appUid: bizUid
                                    });
                                    if (data) {
                                        message.success('切换成功!');
                                        getTitleList();
                                        getList();
                                        setOpenSwitchMaterial(false);
                                    }
                                },
                                onCancel() {
                                    console.log('Cancel');
                                }
                            });
                        }
                    }}
                >
                    <div className="h-[calc(100vh-300px)] overflow-auto">
                        <MaterialLibrary
                            mode={'select'}
                            setSelectedRowKeys={setSelectSwitchRowKeys}
                            appUid={appUid}
                            libraryId={libraryId}
                            bizUid={bizUid}
                        />
                    </div>
                </ModalForm>
            )}
            <Modal width="60%" open={plugMarketOpen} onCancel={() => setPlugMarketOpen(false)} footer={false} title="插件市场">
                <Tabs
                    items={[
                        {
                            label: '插件市场',
                            key: '1',
                            children: (
                                <div>
                                    <CheckCard.Group className="w-full" size="small">
                                        {plugMarketList?.map((item) => (
                                            <div key={item.uid}>
                                                <div className="my-4 text-[16px] font-bold">
                                                    {sceneList?.find((i) => i.value === item.scene)?.label}
                                                </div>
                                                <div className="w-full grid justify-content-center gap-2 responsive-list-container sm:grid-cols-2 md:grid-cols-3 gap-x-3">
                                                    {item.children?.map((el: any) => (
                                                        <div
                                                            onClick={() => handleOpenPlug(el)}
                                                            className="p-4 border border-solid border-[#d9d9d9] rounded-lg hover:border-[#673ab7] cursor-pointer hover:shadow-md"
                                                            key={el.uid}
                                                        >
                                                            <div className="flex gap-4">
                                                                <div className="w-[64px] h-[64px] rounded-lg border border-solid border-[#d9d9d9]"></div>
                                                                <div>
                                                                    <div className="flex-1 text-[18px] font-bold">{el.pluginName}</div>
                                                                    <div className="line-clamp-3 h-[66px]">
                                                                        {sceneList?.find((i) => i.value === el.scene)?.label}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Divider className="my-2" />
                                                            <div className="flex justify-end">{el.creator}</div>
                                                        </div>
                                                    ))}
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
                            children: (
                                <div>
                                    <div className="flex justify-end mb-4">
                                        <Button onClick={() => setAddOpen(true)} type="primary">
                                            创建插件
                                        </Button>
                                    </div>
                                    <Table rowKey={'uid'} columns={PlugColumns} dataSource={plugTableData} />
                                </div>
                            )
                        }
                    ]}
                ></Tabs>
            </Modal>
            <DownMaterial libraryId={libraryId} uploadOpen={uploadOpen} setUploadOpen={setUploadOpen} getList={getList} />
            {addOpen && (
                <AddPlug
                    open={addOpen}
                    setOpen={setAddOpen}
                    wayList={wayList}
                    sceneList={sceneList}
                    rows={rows}
                    setRows={setRows}
                    getTablePlugList={getTablePlugList}
                />
            )}
            {plugConfigOpen && (
                <PlugAnalysis
                    columns={columns}
                    handleAnalysis={() => null}
                    onOpenChange={setPlugConfigOpen}
                    open={plugConfigOpen}
                    plugUid={plugUid}
                    record={plugRecord}
                />
            )}
        </div>
    );
};

const MaterialLibraryDetail = ({
    materialId,
    mode = 'page',
    isSelection = false
}: {
    materialId: number;
    mode: 'preview' | 'page';
    isSelection: boolean;
}) => {
    const [columns, setColumns] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    const [pluginConfig, setPluginConfig] = useState<any>(null);
    const [detail, setDetail] = useState<any>(null);
    const [selectedRowKeys, setSelectRowKeys] = useState<any>([]);
    const [page, setPage] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const [typeList, setTypeList] = useState<any[]>([]);
    const [canUpload, setCanUpload] = useState(true);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [forceUpdateHeader, setForceUpdateHeader] = useState(0);
    const [editOpen, setEditOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filedName, setFiledName] = useState<string>('');
    const [selectImg, setSelectImg] = useState<any>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [tableDataOriginal, setTableDataOriginal] = useState<any>([]);
    const [openSwitchMaterial, setOpenSwitchMaterial] = useState(false);
    const [selectedMaterialRowKeys, setSelectedMaterialRowKeys] = useState<React.Key[]>([]);
    const [btnLoading, setBtnLoading] = useState(-1);
    const [extend, setExtend] = useState<any>({});
    const [total, setTotal] = React.useState(0);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = (searchParams.get('id') || materialId) as string;

    const tableRef = useRef<any[]>([]);
    const actionRef = useRef<ActionType>();
    const tableMetaRef = useRef<any[]>([]);

    const [form] = Form.useForm();
    const [imageForm] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const el = document.querySelector('.MuiContainer-root');
        el?.classList.remove('overflow-y-auto');
        return () => {
            el?.classList.add('overflow-y-auto');
        };
    }, []);

    useEffect(() => {
        if (tableRef.current.length && selectImg?.largeImageURL) {
            const result: any = currentRecord;
            result[filedName] = selectImg?.largeImageURL;

            handleEditColumn(result);
        }
    }, [selectImg]);

    useEffect(() => {
        console.log(123);
        dictData('', 'material_format_type').then((res) => {
            setTypeList(res.list);
        });
    }, []);

    useEffect(() => {
        getMaterialLibraryTitleList({ id }).then((data) => {
            setPluginConfig(data.pluginConfig);
            setDetail(data);
            tableMetaRef.current = data.tableMeta;
        });
    }, [forceUpdateHeader]);
    const [tableMeta, seTtableMeta] = useState<any[]>([]);
    useEffect(() => {
        console.log(123);
        if (detail) {
            seTtableMeta(detail?.tableMeta);
            const list = detail?.tableMeta?.map((item: any) => ({
                desc: item.columnName,
                fieldName: item.columnCode,
                type: item.columnType,
                required: item.isRequired,
                width: item.columnWidth
            }));

            const newList =
                list?.map((item: any) => {
                    return {
                        title: (
                            <div className="flex items-center">
                                {item.desc}
                                {item.type === EditType.Image ? (
                                    <FileImageOutlined className="ml-1" />
                                ) : (
                                    <FileTextOutlined className="ml-1" />
                                )}
                            </div>
                        ),
                        required: !!item.required,
                        width: item.width || 400,
                        dataIndex: item.fieldName,
                        editable: () => {
                            return !(item.type === EditType.Image);
                        },
                        editType: item.type,
                        valueType: 'textarea',
                        fieldProps: { autoSize: { minRows: 1, maxRows: 5 } },
                        render: (text: any, row: any, index: number) => {
                            return (
                                <div className="flex justify-start items-center gap-2">
                                    {item.type === EditType.Image ? (
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
                                                        handleEditColumn({ ...row, [item.fieldName]: info?.file?.response?.data?.url });
                                                    }
                                                }}
                                            >
                                                {row[item.fieldName] ? (
                                                    <div className="relative">
                                                        <div className="relative">
                                                            <Image
                                                                onMouseEnter={() => setCanUpload(false)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                width={82}
                                                                height={82}
                                                                preview={false}
                                                                src={row[item.fieldName] + '?x-oss-process=image/resize,w_100/quality,q_80'}
                                                            />
                                                            <div
                                                                className="absolute z-[1] cursor-pointer inset-0 bg-[rgba(0, 0, 0, 0.5)] flex justify-center items-center text-white opacity-0 hover:opacity-100"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setPreviewOpen(true);
                                                                    setCurrentRecord(row);
                                                                    setFiledName(item.fieldName);
                                                                }}
                                                            >
                                                                <div>
                                                                    <EyeOutlined />
                                                                    预览
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                                        setIsModalOpen(true);
                                                                        e.stopPropagation();
                                                                        setCurrentRecord(row);
                                                                        setFiledName(item.fieldName);
                                                                        // setImageData(row.uuid);
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
                                                                    setIsModalOpen(true);
                                                                    e.stopPropagation();
                                                                    setCurrentRecord(row);
                                                                    setFiledName(item.fieldName);
                                                                    // setImageData(row.uuid);
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
                                    ) : (
                                        <div className="break-all line-clamp-4">{row[item.fieldName]}</div>
                                    )}
                                </div>
                            );
                        },
                        formItemProps: {
                            rules: [
                                {
                                    required: !!item.required,
                                    message: item.desc + '是必填项'
                                }
                            ]
                        },
                        type: item.type
                    };
                }) || [];
            const columnData = [
                {
                    title: '序号',
                    align: 'center',
                    className: 'align-middle',
                    dataIndex: 'index',
                    isDefault: true,
                    // sorter: (a: any, b: any) => a.id - b.id,
                    editable: () => {
                        return false;
                    },
                    width: 70,
                    fixed: true,
                    render: (_: any, row: any, index: number) => <span>{index + 1}</span>
                },
                ...newList,
                {
                    title: '使用次数',
                    dataIndex: 'usedCount',
                    align: 'center',
                    width: 100,
                    isDefault: true,
                    sorter: (a: any, b: any) => a.usedCount - b.usedCount,
                    renderText: (text: any) => text || 0
                }
            ];

            if (mode === 'page') {
                columnData.push({
                    title: '操作',
                    align: 'center',
                    dataIndex: 'operation',
                    className: 'align-middle',
                    isDefault: true,
                    width: 100,
                    fixed: 'right',
                    render: (text: any, record: any, index: number) => (
                        <div className="flex items-center justify-center">
                            <Button
                                type="link"
                                onClick={async () => {
                                    await form.setFieldsValue(record);
                                    setCurrentRecord(record);
                                    setTitle('编辑');
                                    setEditOpen(true);
                                }}
                            >
                                编辑
                            </Button>
                            <Popconfirm
                                title="提示"
                                description="请再次确认是否要删除"
                                onConfirm={() => handleDel(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="link" danger>
                                    删除
                                </Button>
                            </Popconfirm>
                        </div>
                    )
                });
            }

            setColumns(columnData);
        }
    }, [canUpload, detail, tableDataOriginal, tableData]);
    const getTableList = (data?: any, pages?: number, pageSize?: number) => {
        getMaterialLibraryDataPage({
            libraryId: id,
            sortingFields: data,
            pageSize: pageSize || page.pageSize,
            pageNo: pages || page.pageNo
        }).then((data) => {
            setTableDataOriginal(data.list);
            setTotal(data.total);
            let newList: any = [];
            data.list.map((item: any) => {
                let obj: any = {
                    ...item
                };
                item.content.forEach((item1: any) => {
                    if (item1?.['columnCode']) {
                        obj[item1['columnCode']] = item1?.['value'];
                        if (item1.description) {
                            obj[item1['columnCode'] + '_description'] = item1?.['description'];
                        }
                        if (item1.tags) {
                            obj[item1['columnCode'] + '_tags'] = item1?.['tags'];
                        }
                        if (item1.extend) {
                            obj[item1['columnCode'] + '_extend'] = item1?.['extend'];
                        }
                    }
                });
                newList.push(obj);
            });
            setTableData([...newList]);
            tableRef.current = newList;
        });
    };
    useEffect(() => {
        getTableList(null, page.pageNo);
    }, [forceUpdate]);

    const handleDel = async (id: number) => {
        const data = await delMaterialLibrarySlice({ id });
        if (data) {
            setForceUpdate(forceUpdate + 1);
            message.success('删除成功');
        }
    };

    const handleBatchDel = async () => {
        if (!selectedRowKeys.length) {
            message.error('请勾选要删除的数据');
            return;
        }
        const data = await delBatchMaterialLibrarySlice(selectedRowKeys);
        if (data) {
            setForceUpdate(forceUpdate + 1);
            setSelectRowKeys([]);
            message.success('删除成功');
        }
    };

    const handleUpdateColumn = async (index: number, size: any) => {
        const list = tableMetaRef.current[index - 1];

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

    const handleEditColumn = async (record: any, type = 1) => {
        const tableMetaList = tableMetaRef.current;
        const recordKeys = Object.keys(record);
        const content = tableMetaList.map((item) => {
            if (recordKeys.includes(item.columnCode)) {
                if (item.columnType === EditType.Image) {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode],
                        description: record[item.columnCode + '_description'],
                        tags: record[item.columnCode + '_tags'],
                        extend: record[item.columnCode + '_extend']
                    };
                } else {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode]
                    };
                }
            }
        });

        const data = {
            libraryId: detail.id,
            id: record.id,
            content: content,
            url: detail.iconUrl,
            status: detail.status
        };
        let result;
        if (type === 1) {
            result = await updateMaterialLibrarySlice(data);
        } else {
            result = await createMaterialLibrarySlice(data);
        }
        if (result) {
            if (type === 1) {
                message.success('更新成功');
                setForceUpdate(forceUpdate + 1);
            } else {
                message.success('新增成功');
                setForceUpdate(forceUpdate + 1);
            }
        }
    };

    const formOk = async (values: any) => {
        // const values = await form.validateFields();
        if (currentRecord) {
            await handleEditColumn({ ...values, id: currentRecord.id }, 1);
            setEditOpen(false);
            setCurrentRecord(null);
        } else {
            await handleEditColumn({ ...values }, 2);
            setEditOpen(false);
            setCurrentRecord(null);
        }
    };

    //字段配置
    const [colOpen, setColOpen] = useState(false);

    if (!columns.length) {
        return null;
    }

    const handleOcr = async (filedName: string, url: string, type: number) => {
        try {
            setBtnLoading(type);
            const data = await imageOcr({ imageUrls: [url], cleansing: !!type });
            const result = data?.list?.[0].ocrGeneralDTO;
            imageForm.setFieldValue(`${filedName}_tag`, result.tag);
            imageForm.setFieldValue(`${filedName}_description`, result.content);
            setBtnLoading(-1);
            setExtend({ [filedName + '_extend']: result.data });
        } catch (e) {
            setBtnLoading(-1);
        }
    };

    return (
        <div className="h-full">
            {mode === 'page' && (
                <SubCard
                    contentSX={{
                        p: '10px !important'
                    }}
                    sx={{ mb: '16px' }}
                >
                    <div>
                        <IconButton onClick={() => navigate('/material')} color="secondary">
                            <KeyboardBackspace fontSize="small" />
                        </IconButton>
                        <span className="text-[#000c] font-[500]">素材中心</span>
                    </div>
                </SubCard>
            )}
            <div className="bg-[#fff] rounded-md p-3 h-[calc(100%-80px)]">
                {mode === 'page' && (
                    <TableHeader
                        name={detail?.name}
                        iconUrl={detail?.iconUrl}
                        setTitle={setTitle}
                        setEditOpen={setEditOpen}
                        setColOpen={setColOpen}
                        selectedRowKeys={selectedRowKeys}
                        handleBatchDel={handleBatchDel}
                        libraryId={detail?.id}
                        bizType={'MATERIAL_LIBRARY'}
                        bizUid={detail?.uid}
                        pluginConfig={pluginConfig}
                        columns={columns}
                        tableMeta={tableMeta}
                        tableData={tableData}
                        setSelectedRowKeys={setSelectRowKeys}
                        getTitleList={() => setForceUpdateHeader(forceUpdateHeader + 1)}
                        getList={() => setForceUpdate(forceUpdate + 1)}
                        libraryType={detail?.createSource}
                        canSwitch={false}
                        canExecute={false}
                        isShowField={true}
                    />
                )}

                <div className="material-detail-table overflow-hidden h-[calc(100%-96px)]">
                    {columns.filter((item: any) => !item.isDefault).length > 0 ? (
                        <TablePro
                            isSelection={isSelection}
                            // key={forceUpdate}
                            handleEditColumn={handleEditColumn}
                            onUpdateColumn={handleUpdateColumn}
                            actionRef={actionRef}
                            tableData={tableData}
                            selectedRowKeys={selectedRowKeys}
                            setSelectedRowKeys={setSelectRowKeys}
                            columns={columns}
                            page={page}
                            setPage={setPage}
                            getList={getTableList}
                            setTableData={setTableData}
                            total={total}
                        />
                    ) : (
                        <Empty
                            className="mt-[10%]"
                            description={
                                <div className="flex flex-col">
                                    <p>暂未配置素材字段</p>
                                    <a onClick={() => setColOpen(true)}>去配置</a>
                                </div>
                            }
                        />
                    )}
                </div>
            </div>
            {editOpen && (
                <FormModal
                    title={title}
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    columns={columns}
                    row={currentRecord}
                    form={form}
                    formOk={formOk}
                    libraryId={id}
                    pluginConfig={detail.pluginConfig}
                    getList={() => setForceUpdateHeader((pre) => pre + 1)}
                />
            )}
            {isModalOpen && (
                <PicImagePick
                    libraryId={id}
                    pluginConfig={detail.pluginConfig}
                    getList={() => setForceUpdateHeader((pre) => pre + 1)}
                    materialList={[]}
                    allData={null}
                    details={null}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setSelectImg={setSelectImg}
                    columns={columns}
                    values={null}
                />
            )}
            {colOpen && (
                <Modal width={'80%'} footer={false} title="素材字段配置" open={colOpen} onCancel={() => setColOpen(false)}>
                    <HeaderField libraryId={detail?.id} headerSave={() => setForceUpdateHeader(forceUpdateHeader + 1)} />
                </Modal>
            )}

            {previewOpen && (
                <ModalForm
                    onInit={async () => {
                        const value: any = {};
                        value[filedName + '_tags'] = currentRecord[filedName + '_tags'];
                        value[filedName + '_description'] = currentRecord[filedName + '_description'];
                        await imageForm.setFieldsValue(value);
                    }}
                    layout="horizontal"
                    form={imageForm}
                    width={800}
                    title="预览"
                    open={previewOpen}
                    onOpenChange={setPreviewOpen}
                    onFinish={async () => {
                        const value = await imageForm.getFieldsValue();
                        const result = await handleEditColumn({
                            ...currentRecord,
                            ...value,
                            ...extend
                        });
                        setPreviewOpen(false);
                    }}
                >
                    <div className="flex justify-center mb-3">
                        <Image width={500} height={500} className="object-contain" src={currentRecord[filedName]} preview={false} />
                    </div>
                    <ProFormSelect mode="tags" name={filedName + '_tags'} label="标签" />
                    <div className="flex justify-end mb-2">
                        <Space>
                            <Button loading={btnLoading == 0} onClick={() => handleOcr(filedName, currentRecord[filedName], 0)}>
                                图片OCR
                            </Button>
                            <Button loading={btnLoading === 1} onClick={() => handleOcr(filedName, currentRecord[filedName], 1)}>
                                清洗OCR内容
                            </Button>
                        </Space>
                    </div>
                    <Spin spinning={btnLoading !== -1}>
                        <ProFormTextArea name={filedName + '_description'} label="描述" />
                    </Spin>
                    {currentRecord && currentRecord[filedName + '_extend'] && (
                        <div>
                            <Tag>有扩展字段</Tag>
                        </div>
                    )}
                </ModalForm>
            )}
        </div>
    );
};

export default MaterialLibraryDetail;
