import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    Select,
    InputNumber,
    Tag,
    Button,
    Space,
    Popover,
    Tooltip,
    Image,
    Switch,
    Checkbox,
    Popconfirm,
    Collapse,
    ColorPicker,
    theme,
    Row,
    Col,
    Divider
} from 'antd';
import axios from 'axios';
import type { ColorPickerProps } from 'antd';
import { cyan, generate, green, presetPalettes, red } from '@ant-design/colors';
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
            // repeatEnable: boolean; // 是否跟读
            repeatRole: string | undefined; // 跟读发音角色
            soundSpeed: string | undefined; // 发音角色语速
            repeatCount: number | undefined; // 跟读次数
            pauseEnable: string | null; // 是否换行停顿
            enable: boolean | undefined; // 是否显示字幕
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
        soundSpeed: string; // 发音角色语音速度
        soundEffect: string; // 指示效果
        // repeatEnable: boolean; // 是否跟读
        // animationEnable: boolean; // 是否启用动效
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
        subtitles: {
            enable: boolean;
            font: string | undefined;
            fontSize: string | undefined;
            color: string | undefined;
            bgColor: string | undefined;
            position: number | undefined;
        };
    };
    // videoConfig: {
    //     mode: 'merge' | 'split'; // 视频生成配置：合并生成/分开生成
    // };
}
type Presets = Required<ColorPickerProps>['presets'][number];

function genPresets(presets = presetPalettes) {
    return Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors, key: label }));
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
    const { token } = theme.useToken();

    const presets = genPresets({
        primary: generate(token.colorPrimary),
        red,
        green,
        cyan
    });
    const customPanelRender: ColorPickerProps['panelRender'] = (_, { components: { Picker, Presets } }) => (
        <Row justify="space-between" wrap={false}>
            <Col span={12}>
                <Presets />
            </Col>
            <Divider type="vertical" style={{ height: 'auto' }} />
            <Col flex="auto">
                <Picker />
            </Col>
        </Row>
    );

    const [voiceRoleOptions, setVoiceRoleOptions] = useState<any[]>([]);
    const [soundEffectOptions, setSoundEffectOptions] = useState<any[]>([]);
    const [soundSpeedOptions, setSoundSpeedOptions] = useState<any[]>([]);
    const [fontOptions, setFontOptions] = useState<any[]>([]);
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
                        // repeatEnable: false,
                        repeatRole: undefined,
                        repeatCount: undefined,
                        soundSpeed: undefined,
                        pauseEnable: null,
                        enable: undefined
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
                        // repeatEnable: false,
                        repeatRole: undefined,
                        repeatCount: undefined,
                        soundSpeed: undefined,
                        pauseEnable: null,
                        enable: undefined
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
                // repeatEnable: false,
                repeatRole: undefined,
                repeatCount: undefined,
                soundSpeed: undefined,
                pauseEnable: null,
                enable: undefined
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

        // 获取拖动的元素
        const [removed] = newVoiceUnits.splice(result.source.index, 1);
        // 将元素插入到目标位置
        newVoiceUnits.splice(result.destination.index, 0, removed);

        // 更新状态
        setVoiceUnits(newVoiceUnits);
    };

    const handleValuesChange = (_: any, allValues: any) => {
        const newData = {
            ...allValues,

            voiceUnits
        };
        newData.globalSettings.subtitles.position = {
            x: 0,
            y: newData.globalSettings.subtitles.position,
            bx: 0,
            by: 0
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
    };
    useEffect(() => {
        if (videoConfig) {
            const config = JSON.parse(videoConfig);
            console.log(config.globalSettings);
            if (config?.globalSettings?.subtitles?.position) {
                config.globalSettings.subtitles.position = config?.globalSettings?.subtitles?.position?.y;
            }
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
            newData.globalSettings.subtitles.position = {
                x: 0,
                y: newData.globalSettings.subtitles.position,
                bx: 0,
                by: 0
            };
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
        dictData('', 'tts_voice_speed_all_json').then((res) => {
            setSoundSpeedOptions(JSON.parse(res.list[0]?.remark));
        });
        axios.get('https://poster.mofabiji.com/api/font').then((res) => {
            const fontOption = Object.entries(res.data.data).map(([_, font]: any) => ({
                label: font.name,
                value: _,
                preview: font.preview,
                show: font.show
            }))?.filter(item=> item.show!== false)
            setFontOptions(fontOption);
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
                    // repeatEnable: false,
                    // animationEnable: false,
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

                    {/* <div className="flex items-center gap-2">
                        <Form.Item
                            label="是否启用指示效果"
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
                    </div> */}

                    {/* <div className="flex items-center gap-2">
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
                    </div> */}

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

                    <div className="flex items-center gap-2">
                        <Form.Item label="跟读发音角色" name={['globalSettings', 'repeatRole']} rules={[{ required: true }]}>
                            <Select allowClear optionLabelProp="label" style={{ width: 250 }}>
                                <Select.Option value="close_repeat" label="不跟读">
                                    不跟读
                                </Select.Option>
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
                <div className="flex-1">
                    <Form.Item label="发音单元间隔" name={['globalSettings', 'unitInterval']} rules={[{ required: true }]}>
                        <InputNumber addonAfter="秒" min={1} max={9} style={{ width: 250 }} />
                    </Form.Item>

                    <div className="flex items-center gap-2">
                        <Form.Item label="发音角色语速" name={['globalSettings', 'soundSpeed']} rules={[{ required: true }]}>
                            <Select allowClear optionLabelProp="label" style={{ width: 250 }}>
                                {soundSpeedOptions?.map((item) => (
                                    <Select.Option key={item.speech_rate} label={item.name} value={item.speech_rate}>
                                        <div className="w-full flex items-center justify-between">
                                            <span>{item.name}</span>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 防止触发选择事件
                                                    playAudioDemo(item.demo_link);
                                                }}
                                                type="text"
                                                icon={<SoundOutlined />}
                                            />
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Checkbox
                            checked={quickConfiguration.isSoundSpeed}
                            onChange={() =>
                                setQuickConfiguration({ ...quickConfiguration, isSoundSpeed: !quickConfiguration.isSoundSpeed })
                            }
                        />
                        <div className="text-xs">快捷配置</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Form.Item label="指示效果" name={['globalSettings', 'soundEffect']} rules={[{ required: true }]}>
                            <Select allowClear style={{ width: 250 }} options={soundEffectOptions} />
                        </Form.Item>
                        <Checkbox
                            checked={quickConfiguration.isSoundEffect}
                            onChange={() =>
                                setQuickConfiguration({ ...quickConfiguration, isSoundEffect: !quickConfiguration.isSoundEffect })
                            }
                        />
                        <div className="text-xs">快捷配置</div>
                    </div>
                </div>
            </div>
            <Collapse
                items={[
                    {
                        key: '1',
                        label: '字幕配置',
                        children: (
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <Form.Item
                                            name={['globalSettings', 'subtitles', 'enable']}
                                            valuePropName="checked"
                                            label="开启字幕"
                                            required
                                            initialValue={false}
                                        >
                                            <Switch />
                                        </Form.Item>

                                        <Form.Item
                                            name={['globalSettings', 'subtitles', 'fontSize']}
                                            label="字幕大小"
                                            rules={[{ required: true }]}
                                            initialValue={30}
                                        >
                                            <InputNumber addonAfter="像素" min={1} style={{ width: 250 }} />
                                        </Form.Item>

                                        <Form.Item
                                            name={['globalSettings', 'subtitles', 'font']}
                                            label="字体选择"
                                            rules={[{ required: true }]}
                                            initialValue={fontOptions[0]?.value}
                                        >
                                            <Select style={{ width: 250 }} optionLabelProp="label">
                                                {fontOptions?.map(
                                                    (item) => (
                                                            <Select.Option label={item.label} key={item.value} value={item.value}>
                                                                <Image src={item.preview} preview={false} />
                                                            </Select.Option>
                                                        )
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className="flex-1">
                                        <Form.Item
                                            name={['globalSettings', 'subtitles', 'color']}
                                            label="字幕颜色"
                                            normalize={(value) => {
                                                console.log(value);

                                                if (value?.toHexString) {
                                                    if (value?.cleared) {
                                                        return '';
                                                    } else {
                                                        return value.toHexString().toUpperCase();
                                                    }
                                                }
                                                return value;
                                            }}
                                            required
                                            initialValue="#f5222d"
                                        >
                                            <ColorPicker
                                                allowClear
                                                styles={{ popupOverlayInner: { width: 480 } }}
                                                presets={presets}
                                                panelRender={customPanelRender}
                                                disabledAlpha
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name={['globalSettings', 'subtitles', 'bgColor']}
                                            label="字幕背景颜色"
                                            normalize={(value) => {
                                                if (value?.toHexString) {
                                                    if (value?.cleared) {
                                                        return '';
                                                    } else {
                                                        return value.toHexString().toUpperCase();
                                                    }
                                                }
                                                return value;
                                            }}
                                            required
                                        >
                                            <ColorPicker
                                                allowClear
                                                styles={{ popupOverlayInner: { width: 480 } }}
                                                presets={presets}
                                                panelRender={customPanelRender}
                                                disabledAlpha
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="字幕位置"
                                            rules={[{ required: true }]}
                                            name={['globalSettings', 'subtitles', 'position']}
                                            initialValue={100}
                                        >
                                            <InputNumber addonBefore="底部" addonAfter="像素" min={1} style={{ width: 250 }} />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    // {
                    //     key: '2',
                    //     label: '疯狂模式',
                    //     children: (
                    //         <div>
                    //             <div className="flex items-center gap-2">
                    //                 <div className="flex-1">
                    //                     <Form.Item name="enableCrazyMode" valuePropName="checked" label="开启疯狂模式">
                    //                         <Switch />
                    //                     </Form.Item>

                    //                     <Form.Item name="fontSize" label="字幕大小">
                    //                         <Input style={{ width: 250 }} placeholder="20-100" />
                    //                     </Form.Item>

                    //                     <Form.Item name="fontFamily" label="字体选择">
                    //                         <Select style={{ width: 250 }}>
                    //                             <Select.Option value="ADS">ADS</Select.Option>
                    //                             {/* 添加更多字体选项 */}
                    //                         </Select>
                    //                     </Form.Item>
                    //                 </div>
                    //                 <div className="flex-1">
                    //                     <Form.Item name="fontColor" label="字幕颜色">
                    //                         <ColorPicker />
                    //                     </Form.Item>

                    //                     <Form.Item name="maxRepeatTimes" label="最大重复次数">
                    //                         <Input style={{ width: 250 }} placeholder="5-30" />
                    //                     </Form.Item>

                    //                     <Form.Item name="repeatMode" label="重复模式">
                    //                         <Select style={{ width: 250 }}>
                    //                             <Select.Option value="模式1">模式1</Select.Option>
                    //                             <Select.Option value="模式2">模式2</Select.Option>
                    //                             <Select.Option value="模式3">模式3</Select.Option>
                    //                         </Select>
                    //                     </Form.Item>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     )
                    // }
                ]}
            />

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
                                                            <Tag color="success">
                                                                {
                                                                    soundEffectOptions.find(
                                                                        (item) => item.value === unit.soundEffect.animation.type
                                                                    )?.label
                                                                }
                                                            </Tag>
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
                                                                            <div className="w-[300px]">
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
                                                                                    <Form.Item label="发音角色语速" name="soundSpeed">
                                                                                        <Select
                                                                                            allowClear
                                                                                            optionLabelProp="label"
                                                                                            defaultValue={form.getFieldValue([
                                                                                                'globalSettings',
                                                                                                'soundSpeed'
                                                                                            ])}
                                                                                        >
                                                                                            {soundSpeedOptions?.map((item) => (
                                                                                                <Select.Option
                                                                                                    key={item.speech_rate}
                                                                                                    label={item.name}
                                                                                                    value={item.speech_rate}
                                                                                                >
                                                                                                    <div className="w-full flex items-center justify-between">
                                                                                                        <span>{item.name}</span>
                                                                                                        <Button
                                                                                                            onClick={(e) => {
                                                                                                                e.stopPropagation(); // 防止触发选择事件
                                                                                                                playAudioDemo(
                                                                                                                    item.demo_link
                                                                                                                );
                                                                                                            }}
                                                                                                            type="text"
                                                                                                            icon={<SoundOutlined />}
                                                                                                        />
                                                                                                    </div>
                                                                                                </Select.Option>
                                                                                            ))}
                                                                                        </Select>
                                                                                    </Form.Item>
                                                                                    {/* <Form.Item
                                                                                        label="是否跟读"
                                                                                        name="repeatEnable"
                                                                                        valuePropName="checked"
                                                                                    >
                                                                                        <Switch />
                                                                                    </Form.Item> */}
                                                                                    <Form.Item label="跟读角色" name="repeatRole">
                                                                                        <Select
                                                                                            optionLabelProp="label"
                                                                                            allowClear
                                                                                            defaultValue={form.getFieldValue([
                                                                                                'globalSettings',
                                                                                                'repeatRole'
                                                                                            ])}
                                                                                        >
                                                                                            <Select.Option
                                                                                                value="close_repeat"
                                                                                                label="不跟读"
                                                                                            >
                                                                                                不跟读
                                                                                            </Select.Option>
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
                                                                                    <Form.Item label="换行停顿" name="pauseEnable">
                                                                                        <Select
                                                                                            options={[
                                                                                                { label: '不停顿', value: null },
                                                                                                { label: '多行停顿', value: 'multiline' },
                                                                                                { label: '单行+多行停顿', value: 'allline' }
                                                                                            ]}
                                                                                        />
                                                                                    </Form.Item>
                                                                                    <Form.Item
                                                                                        label="是否显示字幕"
                                                                                        name="enable"
                                                                                        valuePropName="checked"
                                                                                    >
                                                                                        <Switch
                                                                                            defaultValue={form.getFieldValue([
                                                                                                'globalSettings',
                                                                                                'subtitles',
                                                                                                'enable'
                                                                                            ])}
                                                                                        />
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
                                                                {item.settings.audioEnable ? (
                                                                    <>
                                                                        <Tag color="success">发音</Tag>
                                                                        {item?.settings?.soundSpeed && (
                                                                            <Tag color="success">
                                                                                {
                                                                                    soundSpeedOptions.find(
                                                                                        (i) => i.value === item?.settings?.soundSpeed
                                                                                    )?.label
                                                                                }
                                                                            </Tag>
                                                                        )}
                                                                        {item.audio.voiceRole && (
                                                                            <Tag color="success">
                                                                                发音角色：
                                                                                {
                                                                                    voiceRoleOptions?.find(
                                                                                        (i) => i.code === item.audio.voiceRole
                                                                                    )?.name
                                                                                }
                                                                            </Tag>
                                                                        )}

                                                                        {/* {item.settings.repeatEnable && <Tag color="success">跟读</Tag>} */}

                                                                        {item.settings.repeatRole === 'close_repeat' ? (
                                                                            <Tag color="success">不跟读</Tag>
                                                                        ) : item.settings.repeatRole ? (
                                                                            <Tag color="success">
                                                                                跟读角色：
                                                                                {
                                                                                    voiceRoleOptions?.find(
                                                                                        (i) => i.code === item.settings.repeatRole
                                                                                    )?.name
                                                                                }
                                                                            </Tag>
                                                                        ) : form.getFieldValue(['globalSettings', 'repeatRole']) &&
                                                                          form.getFieldValue(['globalSettings', 'repeatRole']) !==
                                                                              'close_repeat' ? (
                                                                            <Tag color="success">跟读</Tag>
                                                                        ) : (
                                                                            ''
                                                                        )}
                                                                        {item.settings.repeatCount && (
                                                                            <Tag color="success">
                                                                                跟读次数：{item.settings.repeatCount}次
                                                                            </Tag>
                                                                        )}
                                                                        {item.settings.pauseEnable && (
                                                                            <Tag color="success">
                                                                                {item.settings.pauseEnable === 'multiline'
                                                                                    ? '多行停顿'
                                                                                    : '单行+多行停顿'}
                                                                            </Tag>
                                                                        )}
                                                                        {item.settings.enable === false && (
                                                                            <Tag color="success">不显示字幕</Tag>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <Tag color="success">不发音</Tag>
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
