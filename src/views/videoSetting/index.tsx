import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Form, Input, Select, InputNumber, Radio, Button, Space, Popover, Tooltip, Image } from 'antd';
import { DeleteOutlined, PlusOutlined, SwapOutlined, MoreOutlined } from '@ant-design/icons';
import { DragOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getImageTemplateJSON } from 'api/template/index';

// 定义发音单元的数据结构
interface VoiceUnit {
    id: string;
    order: number;
    settings: {
        interval: number;
    };
    elements: Array<{
        type: 'text' | 'ref';
        content: string;
        audio: {
            voiceRole: string;
            source: string;
            frame: {
                start: number;
                end: number;
            };
        };
        point: {
            x: number;
            y: number;
            bx: number;
            by: number;
        };
    }>;
    soundEffect: {
        point: {
            x: number;
            y: number;
            bx: number;
            by: number;
        };
        frame: {
            start: number;
            end: number;
        };
        animation: {
            type: string;
            size: [number, number];
            params: object;
        };
    };
}

// 定义整体配置的数据结构
interface VoiceConfig {
    globalSettings: {
        elementInterval: number; // 发音元素间隔
        unitInterval: number; // 发音单元间隔
        voiceRole: string; // 发音角色
        soundEffect: string; // 发音效果
        resolution: {
            width: number;
            height: number;
        };
        background: {
            type: string;
            source: string;
            size: {
                width: number;
                height: number;
            };
        };
    };
    videoConfig: {
        mode: 'merge' | 'split'; // 视频生成配置：合并生成/分开生成
    };
}

const VideoSetting: React.FC = () => {
    const [form] = Form.useForm<VoiceConfig>();
    const [voiceUnits, setVoiceUnits] = useState<VoiceUnit[]>([
        {
            id: uuidv4(),
            order: 1,
            settings: {
                interval: 1
            },
            elements: [
                {
                    type: 'text',
                    content: '标题',
                    audio: {
                        voiceRole: '男声1',
                        source: '',
                        frame: {
                            start: 0,
                            end: 0
                        }
                    },
                    point: {
                        x: 0,
                        y: 0,
                        bx: 0,
                        by: 0
                    }
                }
            ],
            soundEffect: {
                point: {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0
                },
                frame: {
                    start: 0,
                    end: 0
                },
                animation: {
                    type: 'default',
                    size: [100, 100],
                    params: {}
                }
            }
        }
    ]);

    // 添加新的发音单元
    const addVoiceUnit = () => {
        const newUnit: VoiceUnit = {
            id: uuidv4(),
            order: voiceUnits.length + 1,
            settings: {
                interval: 1
            },
            elements: [
                {
                    type: 'text',
                    content: '标题',
                    audio: {
                        voiceRole: '男声1',
                        source: '',
                        frame: {
                            start: 0,
                            end: 0
                        }
                    },
                    point: {
                        x: 0,
                        y: 0,
                        bx: 0,
                        by: 0
                    }
                }
            ],
            soundEffect: {
                point: {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0
                },
                frame: {
                    start: 0,
                    end: 0
                },
                animation: {
                    type: 'default',
                    size: [100, 100],
                    params: {}
                }
            }
        };
        setVoiceUnits([...voiceUnits, newUnit]);
    };

    // 添加发音单元数据
    const addVoiceUnitItem = (index: number) => {
        const newList = _.cloneDeep(voiceUnits);
        newList[index].elements.push({
            type: 'text',
            content: `发音单元${newList[index].elements.length + 1}`,
            audio: {
                voiceRole: '男声1',
                source: '',
                frame: {
                    start: 0,
                    end: 0
                }
            },
            point: {
                x: 0,
                y: 0,
                bx: 0,
                by: 0
            }
        });
        setVoiceUnits(newList);
    };
    // 切换类型
    const handleChangeType = (index: number, elementIndex: number) => {
        const newList = _.cloneDeep(voiceUnits);
        newList[index].elements[elementIndex].type = newList[index].elements[elementIndex].type === 'text' ? 'ref' : 'text';
        setVoiceUnits(newList);
    };
    // 更新发音单元数据
    const handleChange = (value: any, elementIndex: number, unitIndex: number, type: 'interval' | 'voiceRole') => {
        const newList = _.cloneDeep(voiceUnits);
        if (type === 'interval') {
            newList[unitIndex].settings.interval = value;
        } else if (type === 'voiceRole') {
            newList[unitIndex].elements[elementIndex].audio.voiceRole = value;
        }
        setVoiceUnits(newList);
    };

    // 删除发音单元
    const removeVoiceUnit = (id: string) => {
        setVoiceUnits(voiceUnits.filter((unit) => unit.id !== id));
    };

    // 提交表单
    const handleSubmit = async (values: VoiceConfig) => {
        const result = await form.validateFields();
        console.log({
            ...result,
            voiceUnits
        });
    };

    // 处理拖拽结束
    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(voiceUnits);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        console.log(items);
        setVoiceUnits(items);
    };

    const [windowWidth, setWindowWidth] = useState(window.innerWidth); //检测窗口宽度
    const [imgRes, setImgRes] = useState<any>(null);
    const [currentElementId, setCurrentElementId] = useState<string>('');
    const imgRef = useRef<HTMLDivElement>(null);
    const scale = useMemo(() => {
        return imgRef?.current && imgRes.json ? imgRef?.current?.offsetWidth / imgRes.json?.clipPath?.width : 1;
    }, [imgRes, windowWidth, imgRef?.current]);
    useEffect(() => {
        getImageTemplateJSON('clxycsig600096fynph9b188w').then((res) => {
            const newRes = res;
            newRes.json = JSON.parse(res?.json);
            setImgRes(newRes);
        });
    }, []);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="w-full h-full p-4 flex gap-4">
            <div className="flex-1 bg-white rounded-lg p-4 flex justify-center items-center">
                <div className="w-[70%] relative" ref={imgRef}>
                    <Image width="100%" preview={false} src={imgRes?.example} />
                    {imgRes?.json?.objects
                        ?.filter((item: any) => item.type === 'image' || item.type.includes('text'))
                        ?.map((item: any, index: number) => {
                            return (
                                <div
                                    key={`${item.id}-${index}`}
                                    onMouseEnter={() => setCurrentElementId(item.id)}
                                    onMouseLeave={() => setCurrentElementId('')}
                                    className={`${
                                        item.id === currentElementId ? 'outline outline-offset-2 outline-blue-500 w-full' : 'w-full'
                                    }`}
                                    style={{
                                        width: `${item.width * item.scaleX * scale}px`,
                                        height: `${item.height * item.scaleY * scale}px`,
                                        left: `${item.left * scale}px`,
                                        top: `${item.top * scale}px`,
                                        position: 'absolute',
                                        transform: `rotate(${item.angle}deg)`
                                    }}
                                />
                            );
                        })}
                </div>
            </div>
            <Card title="图文视频配置" className="flex-1 h-full overflow-y-scroll">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        globalSettings: {
                            elementInterval: 1,
                            unitInterval: 2,
                            voiceRole: '男声2',
                            soundEffect: '手指',
                            resolution: {
                                width: 1286,
                                height: 1714
                            }
                        },
                        videoConfig: {
                            mode: 'merge'
                        }
                    }}
                >
                    <Card size="small" title="全局配置" style={{ marginBottom: 24 }}>
                        <Form.Item label="发音元素间隔" name={['globalSettings', 'elementInterval']} rules={[{ required: true }]}>
                            <InputNumber addonAfter="秒" min={0} style={{ width: 200 }} />
                        </Form.Item>

                        <Form.Item label="发音单元间隔" name={['globalSettings', 'unitInterval']} rules={[{ required: true }]}>
                            <InputNumber addonAfter="秒" min={0} style={{ width: 200 }} />
                        </Form.Item>

                        <Form.Item label="发音角色" name={['globalSettings', 'voiceRole']} rules={[{ required: true }]}>
                            <Select style={{ width: 200 }}>
                                <Select.Option value="男声1">男声1</Select.Option>
                                <Select.Option value="男声2">男声2</Select.Option>
                                <Select.Option value="女声1">女声1</Select.Option>
                                <Select.Option value="女声2">女声2</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="发音效果" name={['globalSettings', 'soundEffect']} rules={[{ required: true }]}>
                            <Select style={{ width: 200 }}>
                                <Select.Option value="手指">手指</Select.Option>
                                <Select.Option value="其他效果">其他效果</Select.Option>
                            </Select>
                        </Form.Item>
                    </Card>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="draggable-card">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {voiceUnits.map((unit, index) => (
                                        <Draggable key={unit.id} draggableId={unit.id.toString()} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps}>
                                                    <Card
                                                        style={{ marginBottom: 16 }}
                                                        title={`发音单元 ${index + 1}`}
                                                        size="small"
                                                        extra={
                                                            <Space>
                                                                <div {...provided.dragHandleProps}>
                                                                    <DragOutlined className="cursor-move" />
                                                                </div>
                                                                <Button
                                                                    type="text"
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() => removeVoiceUnit(unit.id)}
                                                                    disabled={voiceUnits.length === 1}
                                                                />
                                                            </Space>
                                                        }
                                                    >
                                                        {/* <div className="mb-4">
                                                                <div className="text-md font-normal text-black/[0.88] mb-2">间隔时间</div>
                                                                <InputNumber value={unit.settings.interval} addonAfter="秒" min={0} />
                                                            </div> */}
                                                        <div className="flex flex-wrap gap-4">
                                                            {unit.elements.map((item, i) => (
                                                                <div
                                                                    onMouseEnter={() => {
                                                                        if (item.type === 'ref') {
                                                                            setCurrentElementId(item.content);
                                                                        }
                                                                    }}
                                                                    onMouseLeave={() => setCurrentElementId('')}
                                                                    className={`rounded-lg border border-solid border-gray-300 relative px-6 ${
                                                                        item.content === currentElementId
                                                                            ? 'outline outline-offset-2 outline-blue-500'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    {item.type === 'text' ? (
                                                                        <Input
                                                                            className="w-[150px]"
                                                                            variant="borderless"
                                                                            value={item.content}
                                                                            onChange={(e) => {
                                                                                const newList = _.cloneDeep(voiceUnits);
                                                                                newList[index].elements[i].content = e.target.value;
                                                                                newList[index].elements[i].point = {
                                                                                    x: 0,
                                                                                    y: 0,
                                                                                    bx: 0,
                                                                                    by: 0
                                                                                };
                                                                                setVoiceUnits(newList);
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <Select
                                                                            variant="borderless"
                                                                            value={item.content}
                                                                            className="w-[150px]"
                                                                            onChange={(value) => {
                                                                                const newList = _.cloneDeep(voiceUnits);
                                                                                newList[index].elements[i].content = value;
                                                                                const point = imgRes?.json?.objects?.find(
                                                                                    (item: any) => item.id === value
                                                                                );
                                                                                console.log(point);
                                                                                const { left, top, width, height } = point;
                                                                                newList[index].elements[i].point = {
                                                                                    x: left,
                                                                                    y: top,
                                                                                    bx: left + width,
                                                                                    by: top + height
                                                                                };
                                                                                setVoiceUnits(newList);
                                                                            }}
                                                                        >
                                                                            {imgRes?.variableList?.map((item: any) => (
                                                                                <Select.Option value={item.field}>
                                                                                    {item.label}
                                                                                </Select.Option>
                                                                            ))}
                                                                        </Select>
                                                                    )}
                                                                    <Popover
                                                                        content={
                                                                            <div className="w-[250px]">
                                                                                <div>
                                                                                    <div className="text-md font-normal text-black/[0.88] mb-2 mt-4">
                                                                                        发音角色
                                                                                    </div>
                                                                                    <Select
                                                                                        value={item.audio.voiceRole}
                                                                                        onChange={(value) =>
                                                                                            handleChange(value, i, index, 'voiceRole')
                                                                                        }
                                                                                        className="w-full"
                                                                                    >
                                                                                        <Select.Option value="男声1">男声1</Select.Option>
                                                                                        <Select.Option value="男声2">男声2</Select.Option>
                                                                                        <Select.Option value="女声1">女声1</Select.Option>
                                                                                        <Select.Option value="女声2">女声2</Select.Option>
                                                                                    </Select>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        trigger="click"
                                                                        placement="top"
                                                                    >
                                                                        <MoreOutlined className="text-xs absolute top-1 right-1 cursor-pointer text-black" />
                                                                    </Popover>
                                                                    <Tooltip title="切换类型">
                                                                        <SwapOutlined
                                                                            onClick={() => handleChangeType(index, i)}
                                                                            className="text-xs absolute top-1 left-1 cursor-pointer"
                                                                        />
                                                                    </Tooltip>
                                                                </div>
                                                            ))}
                                                            <div
                                                                onClick={() => addVoiceUnitItem(index)}
                                                                className="px-8 py-1 rounded-lg border border-solid border-gray-300 flex gap-2 items-center cursor-pointer"
                                                            >
                                                                <PlusOutlined />
                                                                <div className="text-base text-gray-500">增加数据</div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <Button className="mb-4" type="dashed" onClick={addVoiceUnit} block icon={<PlusOutlined />}>
                        添加发音单元
                    </Button>

                    <Card size="small" title="视频生成配置">
                        <Form.Item name={['videoConfig', 'mode']}>
                            <Radio.Group>
                                <Radio value="merge">合并生成</Radio>
                                <Radio value="split">分开生成</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Card>

                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Space>
                            <Button>取消</Button>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default VideoSetting;
