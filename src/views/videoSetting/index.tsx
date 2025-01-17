import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, InputNumber, Tag, Button, Space, Popover, Tooltip, Image, Switch, Checkbox, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined, SwapOutlined, MoreOutlined } from '@ant-design/icons';
import { DragOutlined, ExclamationCircleOutlined, SoundOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { dictData } from 'api/template';

// 定义发音单元的数据结构
interface VoiceUnit {
    id: string;
    order: number;
    settings: {
        interval: number | undefined;
    };
    elements: Array<{
        type: 'text' | 'ref';
        content: string | undefined;
        audio: {
            voiceRole: string | undefined;
            // frame: {
            //     start: number;
            //     end: number;
            // };
        };
        settings: {
            audioEnable: boolean; // 是否发音
            repeatEnable: boolean; // 是否跟读
            repeatRole: string | undefined; // 跟读发音角色
            repeatCount: number | undefined; // 跟读次数
        };
        point: {
            x: number;
            y: number;
            bx: number;
            by: number;
        };
    }>;
    soundEffect: {
        // point: {
        //     x: number;
        //     y: number;
        //     bx: number;
        //     by: number;
        // };
        // frame: {
        //     start: number;
        //     end: number;
        // };
        animation: {
            type: string | undefined;
            // size: [number, number];
            // params: object;
        };
    };
}

// 定义整体配置的数据结构
interface VoiceConfig {
    globalSettings: {
        elementInterval: number; // 发音元素间隔
        unitInterval: number; // 发音单元间隔
        voiceRole: string; // 发音角色
        soundEffect: string; // 指示效果
        repeatEnable: boolean; // 是否跟读
        animationEnable: boolean; // 是否启用动效
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
    // videoConfig: {
    //     mode: 'merge' | 'split'; // 视频生成配置：合并生成/分开生成
    // };
}

const VideoSetting: React.FC<{
    canEdit: boolean;
    currentElementId: string;
    setCurrentElementId: (value: string) => void;
    currentJson: any;
    variableList: any[];
    videoConfig: any;
    upDateData: (value: any) => void;
    quickConfiguration: any;
    setQuickConfiguration: (value: any) => void;
}> = ({
    canEdit,
    currentElementId,
    setCurrentElementId,
    currentJson,
    variableList,
    videoConfig,
    upDateData,
    quickConfiguration,
    setQuickConfiguration
}) => {
    const [voiceRoleOptions, setVoiceRoleOptions] = useState<any[]>([]);
    const [soundEffectOptions, setSoundEffectOptions] = useState<any[]>([]);
    const [form] = Form.useForm<VoiceConfig>();
    const [voiceUnits, setVoiceUnits] = useState<VoiceUnit[]>([
        {
            id: uuidv4(),
            order: 1,
            settings: {
                interval: undefined
            },
            elements: [
                {
                    type: 'ref',
                    content: undefined,
                    audio: {
                        voiceRole: undefined
                        // frame: {
                        //     start: 0,
                        //     end: 0
                        // }
                    },
                    settings: {
                        audioEnable: true,
                        repeatEnable: false,
                        repeatRole: undefined,
                        repeatCount: undefined
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
                // point: {
                //     x: 0,
                //     y: 0,
                //     bx: 0,
                //     by: 0
                // },
                // frame: {
                //     start: 0,
                //     end: 0
                // },
                animation: {
                    type: undefined
                    // size: [100, 100],
                    // params: {}
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
                interval: undefined
            },
            elements: [
                {
                    type: 'ref',
                    content: undefined,
                    audio: {
                        voiceRole: undefined
                        // frame: {
                        //     start: 0,
                        //     end: 0
                        // }
                    },
                    settings: {
                        audioEnable: true,
                        repeatEnable: false,
                        repeatRole: undefined,
                        repeatCount: undefined
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
                // point: {
                //     x: 0,
                //     y: 0,
                //     bx: 0,
                //     by: 0
                // },
                // frame: {
                //     start: 0,
                //     end: 0
                // },
                animation: {
                    type: undefined
                    // size: [100, 100],
                    // params: {}
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
            type: 'ref',
            content: undefined,
            audio: {
                voiceRole: undefined
                // frame: {
                //     start: 0,
                //     end: 0
                // }
            },
            settings: {
                audioEnable: true,
                repeatEnable: false,
                repeatRole: undefined,
                repeatCount: undefined
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

    // 删除发音单元
    const removeVoiceUnit = (id: string) => {
        setVoiceUnits(voiceUnits.filter((unit) => unit.id !== id));
    };

    // 处理拖拽结束
    const onDragEnd = (result: any) => {
        console.log(result);
        if (!result.destination) return;

        // 深拷贝当前数组
        let newVoiceUnits = _.cloneDeep(voiceUnits);

        [newVoiceUnits[result.source.index], newVoiceUnits[result.destination.index]] = [
            newVoiceUnits[result.destination.index],
            newVoiceUnits[result.source.index]
        ];
        // 更新顺序号并设置状态
        setVoiceUnits(
            newVoiceUnits.map((unit, index) => ({
                ...unit,
                order: index + 1
            }))
        );
    };

    const handleValuesChange = (_: any, allValues: any) => {
        const newData = {
            ...allValues,

            voiceUnits
        };

        // newData.globalSettings.resolution = {
        //     width: 1286,
        //     height: 1714
        // };
        // newData.globalSettings = {
        //     ...allValues.globalSettings,
        //     fps: 5,
        //     format: 'mp4',
        //     quality: 'height',
        //     background: {
        //         type: 'img',
        //         source: 'material/images/tmp.png'
        //     }
        // };

        upDateData(newData);
        console.log(allValues, voiceUnits);
    };
    useEffect(() => {
        console.log(videoConfig, currentJson);
        if (videoConfig) {
            const config = JSON.parse(videoConfig);
            form.setFieldsValue({
                globalSettings: config.globalSettings
                // videoConfig: config.videoConfig
            });
            setVoiceUnits(config.voiceUnits);
        }
    }, []);
    useEffect(() => {
        form.validateFields().then((values) => {
            const newData: any = {
                ...values,
                voiceUnits
            };
            // newData.globalSettings.resolution = {
            //     width: 1286,
            //     height: 1714
            // };
            // newData.globalSettings = {
            //     ...values.globalSettings,
            //     fps: 5,
            //     format: 'mp4',
            //     quality: 'height',
            //     background: {
            //         type: 'img',
            //         source: 'material/images/tmp.png'
            //     }
            // };
            upDateData(newData);
        });
    }, [voiceUnits]);
    useEffect(() => {
        dictData('', 'tts_voice_role_all_json').then((res) => {
            setVoiceRoleOptions(JSON.parse(res.list[0]?.remark));
        });
        dictData('', 'tts_sound_effect').then((res) => {
            setSoundEffectOptions(res.list);
        });
    }, []);

    const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

    const playAudioDemo = (demoLink: string) => {
        if (audioPlayer) {
            audioPlayer.pause();
        }
        const audio = new Audio(demoLink);
        audio.play();
        setAudioPlayer(audio);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            disabled={canEdit}
            // onFinish={handleSubmit}
            initialValues={{
                globalSettings: {
                    elementInterval: 1,
                    unitInterval: 1,
                    voiceRole: undefined,
                    soundEffect: undefined,
                    repeatEnable: false,
                    animationEnable: false,
                    repeatRole: undefined
                }
                // videoConfig: {
                //     mode: 'merge'
                // }
            }}
            onValuesChange={handleValuesChange}
        >
            <div className="text-base font-[500] mb-4">基础配置</div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <Form.Item label="发音元素间隔" name={['globalSettings', 'elementInterval']} rules={[{ required: true }]}>
                        <InputNumber addonAfter="秒" min={1} max={9} style={{ width: 250 }} />
                    </Form.Item>
                    <div className="flex items-center gap-2">
                        <Form.Item
                            label="是否启用动效"
                            className="w-[250px]"
                            name={['globalSettings', 'animationEnable']}
                            valuePropName="checked"
                            rules={[{ required: true }]}
                        >
                            <Switch />
                        </Form.Item>
                        <Checkbox
                            checked={quickConfiguration.isAnimationEnable}
                            onChange={() =>
                                setQuickConfiguration({ ...quickConfiguration, isAnimationEnable: !quickConfiguration.isAnimationEnable })
                            }
                        />
                        <div className="text-xs">快捷配置</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Form.Item
                            className="w-[250px]"
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
                        <Form.Item label="发音角色" name={['globalSettings', 'voiceRole']} rules={[{ required: true }]}>
                            <Select optionLabelProp="label" style={{ width: 250 }}>
                                {voiceRoleOptions?.map((item) => (
                                    <Select.Option
                                        key={item.code}
                                        label={`${item.name} - ${item.language} - ${item.voice}`}
                                        value={item.code}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{`${item.name} - ${item.language} - ${item.voice}`}</span>
                                            {item.demo_link && (
                                                <Button
                                                    type="text"
                                                    icon={<SoundOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // 防止触发选择事件
                                                        playAudioDemo(item.demo_link);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Checkbox
                            checked={quickConfiguration.isVoiceRole}
                            onChange={() => setQuickConfiguration({ ...quickConfiguration, isVoiceRole: !quickConfiguration.isVoiceRole })}
                        />
                        <div className="text-xs">快捷配置</div>
                    </div>
                </div>
                <div className="flex-1">
                    <Form.Item label="发音单元间隔" name={['globalSettings', 'unitInterval']} rules={[{ required: true }]}>
                        <InputNumber addonAfter="秒" min={1} max={9} style={{ width: 250 }} />
                    </Form.Item>

                    <div className="flex items-center gap-2">
                        <Form.Item label="指示效果" name={['globalSettings', 'soundEffect']}>
                            <Select allowClear style={{ width: 250 }}>
                                <Select.Option value="手指">手指</Select.Option>
                                <Select.Option value="圆圈">圆圈</Select.Option>
                            </Select>
                        </Form.Item>
                        <Checkbox
                            checked={quickConfiguration.isSoundEffect}
                            onChange={() =>
                                setQuickConfiguration({ ...quickConfiguration, isSoundEffect: !quickConfiguration.isSoundEffect })
                            }
                        />
                        <div className="text-xs">快捷配置</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Form.Item label="跟读发音角色" name={['globalSettings', 'repeatRole']}>
                            <Select allowClear optionLabelProp="label" style={{ width: 250 }}>
                                {voiceRoleOptions?.map((item) => (
                                    <Select.Option
                                        key={item.code}
                                        label={`${item.name} - ${item.language} - ${item.voice}`}
                                        value={item.code}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{`${item.name} - ${item.language} - ${item.voice}`}</span>
                                            {item.demo_link && (
                                                <Button
                                                    type="text"
                                                    icon={<SoundOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // 防止触发选择事件
                                                        playAudioDemo(item.demo_link);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Checkbox
                            checked={quickConfiguration.isRepeatRole}
                            onChange={() =>
                                setQuickConfiguration({ ...quickConfiguration, isRepeatRole: !quickConfiguration.isRepeatRole })
                            }
                        />
                        <div className="text-xs">快捷配置</div>
                    </div>
                </div>
            </div>

            <div className="text-base font-[500] my-4">
                发音单元{' '}
                <Tooltip title="添加要发音的图片模版字段">
                    <ExclamationCircleOutlined className="cursor-pointer" />
                </Tooltip>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="draggable-card">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {voiceUnits.map((unit, index) => (
                                <Draggable key={unit.id} draggableId={unit.id} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps}>
                                            <Card
                                                style={{ marginBottom: 16 }}
                                                title={
                                                    <div className="flex items-center gap-2">
                                                        <div>发音单元 {index + 1}</div>
                                                        <div {...provided.dragHandleProps}>
                                                            <DragOutlined className="cursor-move" />
                                                        </div>
                                                        {unit.soundEffect.animation.type && (
                                                            <Tag color="success">{unit.soundEffect.animation.type}</Tag>
                                                        )}
                                                        {unit.settings.interval && <Tag color="success">{unit.settings.interval}秒</Tag>}
                                                    </div>
                                                }
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
                                                        <Popover
                                                            title="发音单元配置"
                                                            onOpenChange={async (open) => {
                                                                if (open) {
                                                                    popForm.resetFields();
                                                                    popForm.setFieldsValue({
                                                                        type: unit.soundEffect.animation.type,
                                                                        interval: unit.settings.interval
                                                                    });
                                                                } else {
                                                                    const result = await popForm.validateFields();
                                                                    const newList = _.cloneDeep(voiceUnits);
                                                                    newList[index].soundEffect.animation.type = result.type;
                                                                    newList[index].settings.interval = result.interval;
                                                                    setVoiceUnits(newList);
                                                                }
                                                            }}
                                                            content={
                                                                <div className="w-[250px]">
                                                                    <Form form={popForm}>
                                                                        <Form.Item label="指示效果" name="type">
                                                                            <Select
                                                                                defaultValue={form.getFieldValue([
                                                                                    'globalSettings',
                                                                                    'soundEffect'
                                                                                ])}
                                                                                allowClear
                                                                                options={soundEffectOptions}
                                                                            ></Select>
                                                                        </Form.Item>
                                                                        <Form.Item label="发音元素间隔" name="interval">
                                                                            <InputNumber
                                                                                defaultValue={form.getFieldValue([
                                                                                    'globalSettings',
                                                                                    'elementInterval'
                                                                                ])}
                                                                                min={1}
                                                                                max={9}
                                                                                addonAfter="秒"
                                                                            />
                                                                        </Form.Item>
                                                                    </Form>
                                                                </div>
                                                            }
                                                            trigger="click"
                                                            placement="top"
                                                        >
                                                            <MoreOutlined className="cursor-pointer" />
                                                        </Popover>
                                                        <Button
                                                            type="text"
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => removeVoiceUnit(unit.id)}
                                                            disabled={voiceUnits.length === 1}
                                                        />
                                                    </Space>
                                                }
                                            >
                                                <div className="grid grid-cols-2 gap-4">
                                                    {unit.elements.map((item, i) => (
                                                        <div className="p-2 border border-solid border-[#f0f0f0] rounded-lg">
                                                            <div className="mb-2 flex justify-between items-center">
                                                                <div className="text-xs font-[500]">
                                                                    {item.type === 'text' ? '文本' : '变量'}
                                                                    <Tooltip title="切换类型">
                                                                        <SwapOutlined
                                                                            onClick={() => handleChangeType(index, i)}
                                                                            className="cursor-pointer ml-2"
                                                                        />
                                                                    </Tooltip>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Popover
                                                                        title="发音元素配置"
                                                                        onOpenChange={async (open) => {
                                                                            if (!open) {
                                                                                const result = await popForm.validateFields();
                                                                                const newList = _.cloneDeep(voiceUnits);
                                                                                newList[index].elements[i].settings = result;
                                                                                newList[index].elements[i].audio.voiceRole =
                                                                                    result.voiceRole;
                                                                                setVoiceUnits(newList);
                                                                            } else {
                                                                                popForm.resetFields();
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
                                                                                        <Select
                                                                                            optionLabelProp="label"
                                                                                            defaultValue={form.getFieldValue([
                                                                                                'globalSettings',
                                                                                                'voiceRole'
                                                                                            ])}
                                                                                            allowClear
                                                                                        >
                                                                                            {voiceRoleOptions?.map((item) => (
                                                                                                <Select.Option
                                                                                                    key={item.code}
                                                                                                    label={`${item.name} - ${item.language} - ${item.voice}`}
                                                                                                    value={item.code}
                                                                                                >
                                                                                                    <div className="flex items-center justify-between">
                                                                                                        <span>{`${item.name} - ${item.language} - ${item.voice}`}</span>
                                                                                                        {item.demo_link && (
                                                                                                            <Button
                                                                                                                type="text"
                                                                                                                icon={<SoundOutlined />}
                                                                                                                onClick={(e) => {
                                                                                                                    e.stopPropagation(); // 防止触发选择事件
                                                                                                                    playAudioDemo(
                                                                                                                        item.demo_link
                                                                                                                    );
                                                                                                                }}
                                                                                                            />
                                                                                                        )}
                                                                                                    </div>
                                                                                                </Select.Option>
                                                                                            ))}
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
                                                                                        <Select
                                                                                            optionLabelProp="label"
                                                                                            allowClear
                                                                                            defaultValue={form.getFieldValue([
                                                                                                'globalSettings',
                                                                                                'repeatRole'
                                                                                            ])}
                                                                                        >
                                                                                            {voiceRoleOptions?.map((item) => (
                                                                                                <Select.Option
                                                                                                    key={item.code}
                                                                                                    label={`${item.name} - ${item.language} - ${item.voice}`}
                                                                                                    value={item.code}
                                                                                                >
                                                                                                    <div className="flex items-center justify-between">
                                                                                                        <span>{`${item.name} - ${item.language} - ${item.voice}`}</span>
                                                                                                        {item.demo_link && (
                                                                                                            <Button
                                                                                                                type="text"
                                                                                                                icon={<SoundOutlined />}
                                                                                                                onClick={(e) => {
                                                                                                                    e.stopPropagation(); // 防止触发选择事件
                                                                                                                    playAudioDemo(
                                                                                                                        item.demo_link
                                                                                                                    );
                                                                                                                }}
                                                                                                            />
                                                                                                        )}
                                                                                                    </div>
                                                                                                </Select.Option>
                                                                                            ))}
                                                                                        </Select>
                                                                                    </Form.Item>
                                                                                    <Form.Item label="跟读次数" name="repeatCount">
                                                                                        <InputNumber min={1} max={9} addonAfter="次" />
                                                                                    </Form.Item>
                                                                                </Form>
                                                                            </div>
                                                                        }
                                                                        trigger="click"
                                                                        placement="top"
                                                                    >
                                                                        <MoreOutlined className="text-xs cursor-pointer" />
                                                                    </Popover>
                                                                    <Popconfirm
                                                                        title="确定删除吗？"
                                                                        onConfirm={() => removeVoiceUnitItem(index, i)}
                                                                    >
                                                                        <DeleteOutlined className="cursor-pointer" />
                                                                    </Popconfirm>
                                                                </div>
                                                            </div>

                                                            <div
                                                                onMouseEnter={() => {
                                                                    if (item.type === 'ref') {
                                                                        setCurrentElementId(item.content || '');
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
                                                                        showSearch
                                                                        filterOption={(input, option) => {
                                                                            return ((option?.children ?? '') as any)
                                                                                .toLowerCase()
                                                                                .includes(input.toLowerCase());
                                                                        }}
                                                                    >
                                                                        {variableList?.map((item: any) => (
                                                                            <Select.Option value={item.field}>{item.label}</Select.Option>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            </div>
                                                            <div className="mt-2">
                                                                {item.settings.audioEnable && <Tag color="success">发音</Tag>}
                                                                {item.audio.voiceRole && <Tag color="success">{item.audio.voiceRole}</Tag>}

                                                                {item.settings.repeatEnable && <Tag color="success">跟读</Tag>}
                                                                {item.settings.repeatRole && (
                                                                    <Tag color="success">{item.settings.repeatRole}</Tag>
                                                                )}
                                                                {item.settings.repeatCount && (
                                                                    <Tag color="success">{item.settings.repeatCount}次</Tag>
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

            {/* <Card size="small" title="视频生成配置">
                <Form.Item name={['videoConfig', 'mode']}>
                    <Radio.Group>
                        <Radio value="merge">合并生成</Radio>
                        <Radio value="split">分开生成</Radio>
                    </Radio.Group>
                </Form.Item>
            </Card> */}

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
