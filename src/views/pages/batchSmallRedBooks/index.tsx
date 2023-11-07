import { useState, useEffect, useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { Button, Upload, UploadProps, Image, Progress, Transfer, Collapse, Radio, Modal, Row, Col, InputNumber } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import type { RadioChangeEvent } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import StyleTabs from './components/styleTabs';
import Forms from 'views/pages/smallRedBook/components/form';
import { listMarketAppOption, xhsApp, imageTemplates } from 'api/template';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
const res = {
    imageUrlList: [],
    copywritingList: [],
    variableList: [
        {
            label: '',
            field: 'aaa',
            type: '',
            style: 'SELECT',
            group: '',
            order: 0,
            defaultValue: {},
            value: {},
            isShow: true,
            isPoint: true,
            description: '',
            options: [
                {
                    label: 'aaa',
                    value: '',
                    description: ''
                }
            ]
        }
    ],
    imageStyleList: [
        {
            name: '风格 1234',
            templateList: [
                {
                    id: 'ONE_BOX_GRID',
                    posterId: '',
                    name: '',
                    token: '',
                    imageNumber: 0,
                    variables: [
                        {
                            label: '',
                            field: 'aaa',
                            type: '',
                            style: 'SELECT',
                            group: '',
                            order: 0,
                            defaultValue: {},
                            value: {},
                            isShow: true,
                            isPoint: true,
                            description: '',
                            options: [
                                {
                                    label: 'aaa',
                                    value: '',
                                    description: ''
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    total: 0
};
const BatcSmallRedBooks = () => {
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
    const [mockData, setMockData] = useState<any[]>([
        { key: '1', title: '文案 1', description: 'string' },
        { key: '2', title: '文案 2', description: 'string' },
        { key: '3', title: '文案 3', description: 'string' }
    ]);
    const [targetKeys, setTargetKeys] = useState<any[]>(['2']);
    const [selectedKeys, setSelectedKeys] = useState<any[]>(['1']);

    const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
        console.log('targetKeys:', nextTargetKeys);
        console.log('direction:', direction);
        console.log('moveKeys:', moveKeys);
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        console.log('sourceSelectedKeys:', sourceSelectedKeys);
        console.log('targetSelectedKeys:', targetSelectedKeys);
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };
    const onScroll = (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };
    //3.图片模板
    const [typeList, setTypeList] = useState<any[]>([]); //选择格式的列表（四宫格、六宫格、九宫格）
    useEffect(() => {
        imageTemplates().then((res) => {
            setTypeList(res);
        });
    }, []);
    const [imageTem, setImageTem] = useState<any[]>([
        {
            key: '1',
            name: '风格 1',
            templateList: []
        }
    ]);
    const addStyle = () => {
        const newList = _.cloneDeep(imageTem);
        newList.push({ key: uuidv4(), label: `风格 ${newTabIndex.current++}` });
        setImageTem(newList);
    };
    //4.生成参数
    const [radioValue, setRadioValue] = useState('');
    const [numbe, setNumbe] = useState<number | string>(1);

    //保存
    const [detailData, setDetailData] = useState<any>(res);
    const handleSave = () => {
        console.log(imageList);
        console.log(targetKeys);
    };
    return (
        <div>
            <div className="text-[18px] font-[600] my-[20px]">1. 批量上传素材图片</div>
            <div className="flex flex-wrap gap-[10px] h-[300px] overflow-y-auto shadow">
                <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
                    <Image preview={false} alt="example" width={472} height={472} src={previewImage} />
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
                dataSource={mockData}
                listStyle={{
                    width: 400,
                    height: 600
                }}
                titles={['精选文案', '已选择的文案']}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                onScroll={onScroll}
                render={(item) => item.title}
            />
            <div className="text-[18px] font-[600] my-[20px]">3. 文案模板并集</div>
            <Row gutter={20}>
                {detailData.variableList.map((item: any, index: number) => (
                    <Col key={index} sm={12} xs={24} md={6}>
                        <Forms
                            item={item}
                            index={index}
                            changeValue={(data: any) => {
                                console.log(data);
                            }}
                        />
                    </Col>
                ))}
            </Row>
            <div className="text-[18px] font-[600] my-[20px]">4. 图片模板</div>
            <div className="mb-[20px]">
                <Button onClick={addStyle} icon={<PlusOutlined rev={undefined} />}>
                    增加风格
                </Button>
            </div>
            <Collapse
                accordion
                items={detailData.imageStyleList.map((item: any, index: number) => {
                    return {
                        key: item.key,
                        label: item.name,
                        children: <StyleTabs imageStyleData={item?.templateList} typeList={typeList} />
                    };
                })}
            />
            <div className="text-[18px] font-[600] my-[20px]">5. 生成随机参数</div>
            <div>
                <Radio.Group value={radioValue} onChange={(e: RadioChangeEvent) => setRadioValue(e.target.value)}>
                    <Radio value="a">全部随机</Radio>
                    <Radio value="b">按顺序</Radio>
                </Radio.Group>
            </div>
            <InputNumber min={1} max={9} defaultValue={3} className="mt-[20px] w-[300px]" />
            <div className="mt-[40px] flex justify-center items-center">
                <Button onClick={handleSave} type="primary" className="w-[300px]">
                    保存
                </Button>
            </div>
        </div>
    );
};
export default BatcSmallRedBooks;
