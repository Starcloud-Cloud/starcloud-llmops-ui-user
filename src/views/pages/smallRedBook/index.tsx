import React, { useState, useRef } from 'react';
import { Button, message, Steps, Upload, UploadProps, Carousel, Row, Col, Tabs, Tooltip } from 'antd';
import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, SubnodeOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import EditStyle from './components/editStyle';
import _ from 'lodash-es';
import './index.scss';
const SmallRedBook = () => {
    const { TabPane } = Tabs;
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
    ]);
    //存储图片的地址
    const [tabImage, setTabImage] = useState<any>({});
    //删除存储的图片
    const detailImage = (label: string, index: number) => {
        const newData = _.cloneDeep(tabImage);
        newData[label].splice(index, 1);
        setTabImage(newData);
    };
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        listType: 'picture-card',
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: false,
            previewIcon: (
                <Tooltip placement="top" title={'添加到风格里边'}>
                    <SubnodeOutlined className="!text-[#fff]" rev={undefined} />
                </Tooltip>
            )
        },
        fileList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/uploadLimitPixel`,
        data: {},
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange(info) {
            if (info.fileList.every((value) => value.status !== 'uploading')) {
                const errMsg = info.fileList.map((item: any) => {
                    setFileList(info.fileList);
                });
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        onPreview(e) {
            const newData = _.cloneDeep(tabImage);
            if (!newData[activeKey]) {
                setTabImage({
                    ...newData,
                    [activeKey]: [e]
                });
            } else {
                if (!newData[activeKey].some((item: any) => item.uid === e.uid)) {
                    newData[activeKey].push(e);
                    setTabImage(newData);
                }
            }
        }
    };
    const steps = [
        {
            title: 'First',
            content: 'First-content'
        },
        {
            title: 'Second',
            content: 'Second-content'
        },
        {
            title: 'Last',
            content: 'Last-content'
        }
    ];
    const [current, setCurrent] = useState(1);
    const next = () => {
        // setCurrent(current + 1);
        console.log(tabImage);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const contentStyle: React.CSSProperties = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79'
    };
    const [activeKey, setActiveKey] = useState('one');
    const [items, setItems] = useState<any>([
        { label: '头图', closable: false, key: 'one' },
        { label: '图片 1', key: 'two' }
    ]);
    const newTabIndex = useRef(0);
    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };
    const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...items];
        newPanes.push({
            label: '图片 ' + newPanes.length,
            key: newActiveKey
        });
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };
    const remove = (targetKey: any) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item: any, i: number) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item: any) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };
    return (
        <div className="h-full bg-[#fff] p-[20px]">
            <Steps className="px-[100px]" current={current} items={[{ title: '第一步' }, { title: '第二步' }, { title: '第三步' }]} />
            <div className="min-h-[500px] my-[20px] rounded border border-dashed border-[#d4d4d4] p-[20px]">
                {current === 0 && (
                    <div>
                        <FormControl color="secondary" fullWidth>
                            <InputLabel id="type">类型</InputLabel>
                            <Select labelId="type" label="类型">
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}
                {current === 1 && (
                    <div className="min-h-[500px]">
                        <Upload {...props}>
                            <div>
                                <PlusOutlined rev={undefined} />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                        <Divider sx={{ my: '20px' }} />
                        <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={onEdit}>
                            {items.map((item: any) => (
                                <TabPane tab={item.label} key={item.key}>
                                    <div>
                                        <EditStyle
                                            tabImage={tabImage[item.key]}
                                            label={item.key}
                                            detailImage={detailImage}
                                            key={JSON.stringify(item)}
                                        />
                                    </div>
                                </TabPane>
                            ))}
                        </Tabs>
                    </div>
                )}
                {current === 2 && (
                    <div>
                        <Row gutter={20}>
                            <Col md={18} sm={12} xs={24}>
                                <Carousel autoplay>
                                    <div>
                                        <h3 style={contentStyle}>1</h3>
                                    </div>
                                    <div>
                                        <h3 style={contentStyle}>2</h3>
                                    </div>
                                    <div>
                                        <h3 style={contentStyle}>3</h3>
                                    </div>
                                    <div>
                                        <h3 style={contentStyle}>4</h3>
                                    </div>
                                </Carousel>
                            </Col>
                            <Col className="flex-1">111111shkjshdfksjdhfksjdhfksjhfksd</Col>
                        </Row>
                    </div>
                )}
            </div>
            <div>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        执行
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
            </div>
        </div>
    );
};
export default SmallRedBook;
