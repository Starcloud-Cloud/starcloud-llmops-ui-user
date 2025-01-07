import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, InputNumber, Radio, Button, Space, Popover, Tooltip, Image, Switch, Checkbox } from 'antd';
import { DeleteOutlined, PlusOutlined, SwapOutlined, MoreOutlined } from '@ant-design/icons';
import { DragOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
            frame: {
                start: number;
                end: number;
            };
        };
        settings: {
            audioEnable: boolean; // 是否发音
            repeatEnable: boolean; // 是否跟读
            repeatRole: string; // 跟读发音角色
            repeatCount: number; // 跟读次数
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
        repeatEnable: boolean; // 是否跟读
        repeatRole: string; // 跟读发音角色
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

const VideoSetting: React.FC<{
    currentElementId: string;
    setCurrentElementId: (value: string) => void;
    currentJson: any;
    variableList: any[];
    videoConfig: any;
    upDateData: (value: any) => void;
    quickConfiguration: any;
    setQuickConfiguration: (value: any) => void;
}> = ({
    currentElementId,
    setCurrentElementId,
    currentJson,
    variableList,
    videoConfig,
    upDateData,
    quickConfiguration,
    setQuickConfiguration
}) => {
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
                        frame: {
                            start: 0,
                            end: 0
                        }
                    },
                    settings: {
                        audioEnable: true,
                        repeatEnable: true,
                        repeatRole: '男声1',
                        repeatCount: 2
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
                        frame: {
                            start: 0,
                            end: 0
                        }
                    },
                    settings: {
                        audioEnable: true,
                        repeatEnable: true,
                        repeatRole: '男声1',
                        repeatCount: 2
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

    const [popForm] = Form.useForm();
    // 添加发音单元数据
    const addVoiceUnitItem = (index: number) => {
        const newList = _.cloneDeep(voiceUnits);
        newList[index].elements.push({
            type: 'text',
            content: `发音单元${newList[index].elements.length + 1}`,
            audio: {
                voiceRole: '男声1',
                frame: {
                    start: 0,
                    end: 0
                }
            },
            settings: {
                audioEnable: true,
                repeatEnable: true,
                repeatRole: '男声1',
                repeatCount: 2
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
    // 删除发音单元元素
    const removeVoiceUnitItem = (index: number, elementIndex: number) => {
        const newList = _.cloneDeep(voiceUnits);
        newList[index].elements.splice(elementIndex, 1);
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

    const handleValuesChange = (_: any, allValues: any) => {
        upDateData({
            ...allValues,
            voiceUnits
        });
        console.log(allValues, voiceUnits);
    };
    useEffect(() => {
        console.log(videoConfig, currentJson);
        if (videoConfig) {
            const config = JSON.parse(videoConfig);
            form.setFieldsValue({
                globalSettings: config.globalSettings,
                videoConfig: config.videoConfig
            });
            setVoiceUnits(config.voiceUnits);
        }
    }, []);
    useEffect(() => {
        form.validateFields().then((values) => {
            upDateData({
                ...values,
                voiceUnits
            });
        });
    }, [voiceUnits]);

    return (
        <Form
            form={form}
            layout="vertical"
            // onFinish={handleSubmit}
            initialValues={{
                globalSettings: {
                    elementInterval: 1,
                    unitInterval: 2,
                    voiceRole: '男声2',
                    soundEffect: '手指',
                    repeatEnable: false,
                    repeatRole: '背景1',
                    resolution: {
                        width: 1286,
                        height: 1714
                    }
                },
                videoConfig: {
                    mode: 'merge'
                }
            }}
            onValuesChange={handleValuesChange}
        >
            <Card size="small" title="全局配置" style={{ marginBottom: 24 }}>
                <Form.Item label="发音元素间隔" name={['globalSettings', 'elementInterval']} rules={[{ required: true }]}>
                    <InputNumber addonAfter="秒" min={0} style={{ width: 200 }} />
                </Form.Item>

                <Form.Item label="发音单元间隔" name={['globalSettings', 'unitInterval']} rules={[{ required: true }]}>
                    <InputNumber addonAfter="秒" min={0} style={{ width: 200 }} />
                </Form.Item>

                <div className="flex items-center gap-2">
                    <Form.Item label="发音角色" name={['globalSettings', 'voiceRole']} rules={[{ required: true }]}>
                        <Select style={{ width: 200 }}>
                            <Select.Option value="男声1">男声1</Select.Option>
                            <Select.Option value="男声2">男声2</Select.Option>
                            <Select.Option value="女声1">女声1</Select.Option>
                            <Select.Option value="女声2">女声2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Checkbox
                        checked={quickConfiguration.isVoiceRole}
                        onChange={() => setQuickConfiguration({ ...quickConfiguration, isVoiceRole: !quickConfiguration.isVoiceRole })}
                    />
                    <div className="text-xs">快捷配置</div>
                </div>

                <div className="flex items-center gap-2">
                    <Form.Item label="发音效果" name={['globalSettings', 'soundEffect']} rules={[{ required: true }]}>
                        <Select style={{ width: 200 }}>
                            <Select.Option value="手指">手指</Select.Option>
                            <Select.Option value="其他效果">其他效果</Select.Option>
                        </Select>
                    </Form.Item>
                    <Checkbox
                        checked={quickConfiguration.isSoundEffect}
                        onChange={() => setQuickConfiguration({ ...quickConfiguration, isSoundEffect: !quickConfiguration.isSoundEffect })}
                    />
                    <div className="text-xs">快捷配置</div>
                </div>

                <div className="flex items-center gap-2">
                    <Form.Item
                        className="w-[200px]"
                        label="是否跟读"
                        name={['globalSettings', 'repeatEnable']}
                        valuePropName="checked"
                        rules={[{ required: true }]}
                    >
                        <Switch />
                    </Form.Item>
                    <Checkbox
                        checked={quickConfiguration.isRepeatEnable}
                        onChange={() =>
                            setQuickConfiguration({ ...quickConfiguration, isRepeatEnable: !quickConfiguration.isRepeatEnable })
                        }
                    />
                    <div className="text-xs">快捷配置</div>
                </div>

                <div className="flex items-center gap-2">
                    <Form.Item label="跟读发音角色" name={['globalSettings', 'repeatRole']} rules={[{ required: true }]}>
                        <Select style={{ width: 200 }}>
                            <Select.Option value="背景1">背景1</Select.Option>
                            <Select.Option value="背景2">背景2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Checkbox
                        checked={quickConfiguration.isRepeatRole}
                        onChange={() => setQuickConfiguration({ ...quickConfiguration, isRepeatRole: !quickConfiguration.isRepeatRole })}
                    />
                    <div className="text-xs">快捷配置</div>
                </div>
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
                                                        <Button
                                                            size="small"
                                                            type="primary"
                                                            icon={<PlusOutlined />}
                                                            onClick={() => addVoiceUnitItem(index)}
                                                        >
                                                            增加发音元素
                                                        </Button>
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
                                                <div className="grid grid-cols-2 gap-4">
                                                    {unit.elements.map((item, i) => (
                                                        <div className="p-2 border border-solid border-[#f0f0f0] rounded-lg">
                                                            <div className="mb-2 flex justify-between items-center">
                                                                <div className="text-xs font-[500]">
                                                                    {item.type === 'text' ? '文本' : '变量'}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Popover
                                                                        title="发音元素配置"
                                                                        onOpenChange={async (open) => {
                                                                            if (!open) {
                                                                                const result = await popForm.validateFields();
                                                                                console.log(result);
                                                                                const newList = _.cloneDeep(voiceUnits);
                                                                                newList[index].elements[i].settings = result;
                                                                                newList[index].elements[i].audio.voiceRole =
                                                                                    result.voiceRole;
                                                                                setVoiceUnits(newList);
                                                                                popForm.resetFields();
                                                                            } else {
                                                                                popForm.setFieldsValue({
                                                                                    ...item.settings,
                                                                                    voiceRole: item.audio.voiceRole
                                                                                });
                                                                            }
                                                                        }}
                                                                        content={
                                                                            <div className="w-[250px]">
                                                                                <Form form={popForm}>
                                                                                    <Form.Item
                                                                                        label="是否发音"
                                                                                        name="audioEnable"
                                                                                        valuePropName="checked"
                                                                                    >
                                                                                        <Switch />
                                                                                    </Form.Item>
                                                                                    <Form.Item label="发音角色" name="voiceRole">
                                                                                        <Select>
                                                                                            <Select.Option value="男声1">
                                                                                                男声1
                                                                                            </Select.Option>
                                                                                            <Select.Option value="男声2">
                                                                                                男声2
                                                                                            </Select.Option>
                                                                                            <Select.Option value="女声1">
                                                                                                女声1
                                                                                            </Select.Option>
                                                                                            <Select.Option value="女声2">
                                                                                                女声2
                                                                                            </Select.Option>
                                                                                        </Select>
                                                                                    </Form.Item>
                                                                                    <Form.Item
                                                                                        label="是否跟读"
                                                                                        name="repeatEnable"
                                                                                        valuePropName="checked"
                                                                                    >
                                                                                        <Switch />
                                                                                    </Form.Item>
                                                                                    <Form.Item label="跟读角色" name="repeatRole">
                                                                                        <Select>
                                                                                            <Select.Option value="男声1">
                                                                                                男声1
                                                                                            </Select.Option>
                                                                                            <Select.Option value="男声2">
                                                                                                男声2
                                                                                            </Select.Option>
                                                                                            <Select.Option value="女声1">
                                                                                                女声1
                                                                                            </Select.Option>
                                                                                            <Select.Option value="女声2">
                                                                                                女声2
                                                                                            </Select.Option>
                                                                                        </Select>
                                                                                    </Form.Item>
                                                                                    <Form.Item label="跟读次数" name="repeatCount">
                                                                                        <InputNumber min={1} addonAfter="次" />
                                                                                    </Form.Item>
                                                                                </Form>
                                                                            </div>
                                                                        }
                                                                        trigger="click"
                                                                        placement="top"
                                                                    >
                                                                        <MoreOutlined className="text-xs cursor-pointer" />
                                                                    </Popover>
                                                                    <Tooltip title="切换类型">
                                                                        <SwapOutlined
                                                                            onClick={() => handleChangeType(index, i)}
                                                                            className="cursor-pointer"
                                                                        />
                                                                    </Tooltip>
                                                                    <DeleteOutlined
                                                                        onClick={() => removeVoiceUnitItem(index, i)}
                                                                        className="cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div
                                                                onMouseEnter={() => {
                                                                    if (item.type === 'ref') {
                                                                        setCurrentElementId(item.content);
                                                                    }
                                                                }}
                                                                onMouseLeave={() => setCurrentElementId('')}
                                                                className={`rounded-lg ${
                                                                    item.content === currentElementId && item.type === 'ref'
                                                                        ? 'outline outline-offset-2 outline-blue-500'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {item.type === 'text' ? (
                                                                    <Input.TextArea
                                                                        rows={2}
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
                                                                        value={item.content}
                                                                        className="w-full"
                                                                        onChange={(value) => {
                                                                            const newList = _.cloneDeep(voiceUnits);
                                                                            newList[index].elements[i].content = value;
                                                                            const point = currentJson?.objects?.find(
                                                                                (item: any) => item.id === value
                                                                            );
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
                                                                        {variableList?.map((item: any) => (
                                                                            <Select.Option value={item.field}>{item.label}</Select.Option>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
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

            {/* <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <Space>
                        <Button>取消</Button>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Space>
                </div> */}
        </Form>
    );
};

export default VideoSetting;
