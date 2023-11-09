import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Upload, UploadProps, Image, Progress, Transfer, Collapse, Radio, Modal, Row, Col, InputNumber, Popover } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import type { RadioChangeEvent } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import StyleTabs from './components/styleTabs';
import { copyWritingTemplates } from 'api/redBook/batchIndex';
import Forms from 'views/pages/smallRedBook/components/form';
import { imageTemplates } from 'api/template';
import { planCreate, planGet, planModify, listTemplates } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
const BatcSmallRedBooks = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const [value, setValue] = useState('');
    const [valueOpen, setValueOpen] = useState(false);
    const newTabIndex = useRef(1);
    //1.批量上传图片素材
    const [open, setOpen] = useState(false);
    const [previewImage, setpreviewImage] = useState('');
    const [imageList, setImageList] = useState<any[]>([]);
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        fileList: imageList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/upload`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 500,
        onChange(info) {
            console.log(info);

            setImageList(info.fileList);
        },
        onPreview: (file) => {
            setpreviewImage(file?.response?.data?.url);
            setOpen(true);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    //2.文案模板
    const [mockData, setMockData] = useState<any[]>([]);
    const [targetKeys, setTargetKeys] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);

    const deduplicateArray = (arr: any[], prop: string) => {
        const uniqueValues = new Set();
        const deduplicatedArray: any[] = [];
        for (const item of arr) {
            const value = item[prop];
            if (!uniqueValues.has(value)) {
                uniqueValues.add(value);
                deduplicatedArray.push(item);
            }
        }
        return deduplicatedArray;
    };
    useEffect(() => {
        if (targetKeys.length > 0) {
            const arr: any[] = [];
            const newList = mockData?.filter((item: any) => targetKeys.some((el) => item.uid === el));
            newList.map((item) => {
                item.variables?.map((el: any) => {
                    arr.push(el);
                });
            });
            const newData = _.cloneDeep(detailData);
            newData.variableList = deduplicateArray(arr, 'field');
            setDetailData(newData);
        } else {
            if (detailData?.variableList) {
                const newData = _.cloneDeep(detailData);
                newData.variableList = [];
                setDetailData(newData);
            }
        }
    }, [targetKeys]);
    const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };
    //3.图片模板
    const [typeList, setTypeList] = useState<any[]>([]); //选择格式的列表（四宫格、六宫格、九宫格）
    useEffect(() => {
        if (searchParams.get('uid')) {
            planGet(searchParams.get('uid')).then((res) => {
                if (res) {
                    setValue(res.name);
                    setDetailData(res.config);
                    setTargetKeys(res.config?.copyWritingList);
                    setImageList(
                        res.config?.imageUrlList?.map((item: any) => {
                            return {
                                uid: uuidv4(),
                                thumbUrl: item,
                                response: {
                                    data: {
                                        url: item
                                    }
                                }
                            };
                        })
                    );
                }
            });
        }
        if (searchParams.get('template')) {
            listTemplates().then((result) => {
                if (result) {
                    const res = result[searchParams.get('template') as string];
                    setValue(res.name);
                    setDetailData(res.config);
                    setTargetKeys(res.config?.copyWritingList);
                    setImageList(
                        res.config?.imageUrlList?.map((item: any) => {
                            return {
                                uid: uuidv4(),
                                thumbUrl: item,
                                response: {
                                    data: {
                                        url: item
                                    }
                                }
                            };
                        })
                    );
                }
            });
        }
        imageTemplates().then((res) => {
            setTypeList(res);
        });
        copyWritingTemplates().then((res: any) => {
            setMockData(res);
        });
    }, []);
    const digui = (data: number) => {
        let newData = _.cloneDeep(detailData);
        if (!newData.imageStyleList) {
            newData.imageStyleList = [];
        }
        if (newData.imageStyleList.every((item: any) => item.name.indexOf(data.toString()) === -1)) {
            if (!newData.imageStyleList) {
                newData.imageStyleList = [];
            }
            newData.imageStyleList.push({
                id: uuidv4(),
                name: `风格 ${data}`,
                templateList: [
                    {
                        id: '',
                        name: '首图',
                        variables: []
                    }
                ]
            });
            setDetailData(newData);
        } else {
            digui(newTabIndex.current++);
        }
    };

    const addStyle = () => {
        digui(newTabIndex.current++);
    };

    //保存
    const [detailData, setDetailData] = useState<any>({
        randomType: 'RANDOM',
        total: 1
    });
    const handleSave = () => {
        if (!value) {
            setValueOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '模板名称必填',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return false;
        }
        if (!imageList || imageList.length === 0) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '没有上传图片',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return false;
        }
        const newData = _.cloneDeep(detailData);
        newData.imageUrlList = imageList.map((item: any) => item?.response?.data?.url)?.filter((el: any) => el);
        newData.copyWritingList = targetKeys;
        if (searchParams.get('uid')) {
            planModify({ name: value, config: newData, type: 'XHS', uid: searchParams.get('uid') }).then((res) => {
                if (res) {
                    navigate('/redBookTaskList');
                }
            });
        } else {
            planCreate({ name: value, config: newData, type: 'XHS' }).then((res) => {
                if (res) {
                    navigate('/redBookTaskList');
                }
            });
        }
    };
    return (
        <div>
            <TextField
                sx={{ width: '300px', mb: 2 }}
                size="small"
                color="secondary"
                InputLabelProps={{ shrink: true }}
                error={valueOpen && !value}
                helperText={valueOpen && !value ? '模板名称必填' : ' '}
                label="模板名称"
                value={value}
                onChange={(e: any) => {
                    setValueOpen(true);
                    setValue(e.target.value);
                }}
            />
            <div className="text-[18px] font-[600] my-[20px]">1. 批量上传素材图片</div>
            <div className="flex flex-wrap gap-[10px] h-[300px] overflow-y-auto shadow">
                <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
                    <Image preview={false} alt="example" src={previewImage} />
                </Modal>
                <div>
                    <Upload {...props}>
                        <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                            <PlusOutlined rev={undefined} />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                </div>
                {/* {imageList.map((item: any, index: number) => (
                    <div key={index} className="relative w-[100px] h-[100px] rounded-[5px] overflow-hidden">
                        <Image
                            className="w-[100px] h-[100px]"
                            preview={{
                                visible: false,
                                mask: (
                                    <div className="w-full h-full flex flex-col justify-center items-center cursor-default relative">
                                        <span
                                            onClick={(info) => {
                                                console.log(info);

                                                const newValue = _.cloneDeep(imageList);
                                                newValue.splice(index, 1);
                                                setImageList(newValue);
                                            }}
                                            className="block cursor-pointer hover:text-[red]"
                                        >
                                            <DeleteOutlined className="text-[20px]" rev={undefined} />
                                        </span>
                                    </div>
                                )
                            }}
                            src={item.response?.data?.url}
                            fallback="data:image/png;base64,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"
                        />
                        {item?.percent !== 100 && (
                            <div className="absolute w-[100px] h-[100px] top-0 flex justify-center items-center bg-[#000]/[0.1]">
                                <Progress size="small" type="circle" percent={75} />
                            </div>
                        )}
                    </div>
                ))} */}
            </div>
            <div className="text-[18px] font-[600] my-[20px]">2. 文案模板</div>
            <Transfer
                dataSource={mockData.map((item) => {
                    return {
                        key: item.uid,
                        title: item.name,
                        description: item.description
                    };
                })}
                listStyle={{
                    width: 400,
                    height: 400
                }}
                titles={['精选文案', '已选择的文案']}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                render={(item) => (
                    <Popover zIndex={9999} content={<div className="w-[500px]">{item.description}</div>} placement="top">
                        <div>{item.title}</div>
                    </Popover>
                )}
            />
            <div className="text-[16px] font-[600] my-[20px]">模板字段</div>
            <Row gutter={20}>
                {detailData?.variableList?.map((item: any, index: number) => (
                    <Col key={index} sm={12} xs={24} md={6}>
                        <Forms
                            item={item}
                            index={index}
                            changeValue={(data: any) => {
                                const newData = _.cloneDeep(detailData);
                                newData.variableList[data.index].value = data.value;
                                setDetailData(newData);
                            }}
                        />
                    </Col>
                ))}
            </Row>
            <div className="text-[18px] font-[600] my-[20px]">3. 图片模板</div>
            <div className="mb-[20px]">
                <Button onClick={addStyle} icon={<PlusOutlined rev={undefined} />}>
                    增加风格
                </Button>
            </div>
            {detailData?.imageStyleList && (
                <Collapse
                    // accordion
                    defaultActiveKey={detailData?.imageStyleList?.map((item: any) => item.id)}
                    items={detailData?.imageStyleList?.map((item: any, index: number) => {
                        return {
                            key: item.id,
                            label: item.name,
                            extra: (
                                <Popover
                                    content={
                                        <Button
                                            onClick={(e: any) => {
                                                const newData = _.cloneDeep(detailData);
                                                newData.imageStyleList.splice(index, 1);
                                                setDetailData(newData);
                                                e.stopPropagation();
                                            }}
                                            danger
                                            icon={<DeleteOutlined rev={undefined} />}
                                        >
                                            删除
                                        </Button>
                                    }
                                    trigger="click"
                                >
                                    <IconButton size="small" onClick={(e: any) => e.stopPropagation()}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </Popover>
                            ),
                            children: (
                                <StyleTabs
                                    imageStyleData={item?.templateList}
                                    typeList={typeList}
                                    setDetailData={(data: any) => {
                                        const newData = _.cloneDeep(detailData);
                                        newData.imageStyleList[index].templateList = data;
                                        setDetailData(newData);
                                    }}
                                />
                            )
                        };
                    })}
                />
            )}
            <div className="text-[18px] font-[600] my-[20px]">4. 生成随机参数</div>
            <div>
                <Radio.Group
                    value={detailData?.randomType}
                    onChange={(e: RadioChangeEvent) => {
                        const newData = _.cloneDeep(detailData);
                        newData.randomType = e.target.value;
                        setDetailData(newData);
                    }}
                >
                    <Radio value="RANDOM">全部随机</Radio>
                    <Radio value="SEQUENCE">按顺序</Radio>
                </Radio.Group>
            </div>
            <InputNumber
                value={detailData?.total}
                onChange={(e: any) => {
                    const newData = _.cloneDeep(detailData);
                    newData.total = e;
                    setDetailData(newData);
                }}
                min={1}
                max={500}
                className="mt-[20px] w-[300px]"
            />
            <div className="mt-[40px] flex justify-center items-center">
                <Button onClick={handleSave} type="primary" className="w-[300px]">
                    {searchParams.get('uid') ? '更新' : '创建'}
                </Button>
            </div>
        </div>
    );
};
export default BatcSmallRedBooks;
