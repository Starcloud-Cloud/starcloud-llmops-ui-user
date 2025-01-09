import { useState, useEffect } from 'react';
import { Modal, Form, Select, Image, Progress, Button, Switch } from 'antd';
import { generateVideo, getVideoResult } from 'api/video';

const VideoModal = ({
    videoOpen,
    setVideoOpen,
    businessUid,
    quickConfiguration,
    templateList
}: {
    videoOpen: boolean;
    setVideoOpen: (value: boolean) => void;
    businessUid: string;
    quickConfiguration: any;
    templateList: any[];
}) => {
    const Option = Select.Option;
    const [form] = Form.useForm();
    const [executeStep, setExecuteStep] = useState(0);
    const [results, setResults] = useState<any[]>([]);

    const executeVideo = () => {
        templateList.forEach(async (item, index) => {
            console.log(item);

            try {
                const res = await generateVideo({
                    uid: businessUid,
                    quickConfiguration: JSON.stringify(form.getFieldsValue()),
                    videoConfig: item.videoConfig,
                    imageCode: item.code
                });
                pollResult(res?.id, index);
            } catch (error) {}
        });
        setExecuteStep(1);
    };

    const pollResult = (videoUid: string, index: number) => {
        const interval = setInterval(async () => {
            try {
                const res = await getVideoResult({
                    videoUid,
                    creativeContentUid: businessUid
                });
                if (res?.status === 'completed' || res?.status === 'failed') {
                    clearInterval(interval);
                }
                setResults((prev) => {
                    const newResults = [...prev];
                    newResults[index] = res;
                    return newResults;
                });
            } catch (error) {
                clearInterval(interval);
            }
        }, 2000);
    };

    const retryVideo = async (index: number) => {
        const res = await generateVideo({
            uid: businessUid,
            quickConfiguration: JSON.stringify(form.getFieldsValue()),
            videoConfig: templateList[index].videoConfig,
            imageCode: templateList[index].code
        });
        pollResult(res?.id, index);
    };

    //预览
    const [previewVideo, setPreviewVideo] = useState<boolean>(false);
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string>('');
    const obj = {
        id: '2',
        resources: {
            xxxxxxx: '你好啊',
            牙膏: '牙膏'
        },
        globalSettings: {
            elementInterval: 1,
            unitInterval: 2,
            voiceRole: '情感女声',
            repeatEnable: true,
            repeatRole: '跟读角色：温柔淑女',
            soundEffect: '手指',
            resolution: {
                width: 1286,
                height: 1714
            },
            fps: 5,
            format: 'mp4',
            quality: 'height',
            background: {
                type: 'img',
                source: 'material/images/tmp.png'
            }
        },
        voiceUnits: [
            {
                id: '1',
                order: 1,
                settings: {
                    interval: 1
                },
                elements: [
                    {
                        type: 'text',
                        content: 'teeth, teeth, teeth, 牙膏',
                        settings: {
                            audioEnable: true,
                            repeatEnable: true,
                            repeatRole: '跟读角色：温柔淑女',
                            repeatCount: 1
                        },
                        audio: {
                            voiceRole: '温柔淑女'
                        },
                        point: {
                            x: 55.5442,
                            y: 140.5672,
                            bx: 844.4559,
                            by: 253.5672
                        }
                    }
                ],
                soundEffect: {
                    animation: {
                        type: '圆圈',
                        size: [150, 150],
                        params: {}
                    }
                }
            },
            {
                id: '2',
                order: 1,
                settings: {
                    interval: 1
                },
                elements: [
                    {
                        type: 'text',
                        content: 'teeth, teeth, teeth, teeth',
                        settings: {
                            audioEnable: true,
                            repeatEnable: true,
                            repeatRole: '跟读角色：温柔淑女',
                            repeatCount: 1
                        },
                        audio: {
                            voiceRole: '温柔淑女'
                        },
                        point: {
                            x: 113.2877,
                            y: 491.6392,
                            bx: 779.2499,
                            by: 983.1892
                        }
                    }
                ],
                soundEffect: {
                    animation: {
                        type: '圆圈',
                        size: [150, 150],
                        params: {}
                    }
                }
            }
        ]
    };

    return (
        <Modal width={'700px'} open={videoOpen} title={'图文视频生成'} footer={null} onCancel={() => setVideoOpen(false)}>
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    voiceRole: '温柔淑女',
                    soundEffect: '手指',
                    repeatEnable: false,
                    repeatRole: '温柔淑女'
                }}
            >
                {quickConfiguration?.isVoiceRole && (
                    <Form.Item label="发音角色" name="voiceRole" rules={[{ required: true, message: '请选择发音角色' }]}>
                        <Select style={{ width: 200 }}>
                            <Option value="温柔淑女">温柔淑女</Option>
                            <Option value="男声2">男声2</Option>
                            <Option value="女声1">女声1</Option>
                            <Option value="女声2">女声2</Option>
                        </Select>
                    </Form.Item>
                )}
                {quickConfiguration?.isSoundEffect && (
                    <Form.Item label="发音效果" name="soundEffect" rules={[{ required: true, message: '请选择发音效果' }]}>
                        <Select style={{ width: 200 }}>
                            <Option value="手指">手指</Option>
                            <Option value="其他效果">其他效果</Option>
                        </Select>
                    </Form.Item>
                )}
                {quickConfiguration?.isRepeatEnable && (
                    <Form.Item label="是否跟读" name="repeatEnable" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                )}
                {quickConfiguration?.isRepeatRole && (
                    <Form.Item label="跟读发音角色" name="repeatRole" rules={[{ required: true, message: '请选择跟读发音角色' }]}>
                        <Select style={{ width: 200 }}>
                            <Option value="温柔淑女">温柔淑女</Option>
                            <Option value="男声2">男声2</Option>
                            <Option value="女声1">女声1</Option>
                            <Option value="女声2">女声2</Option>
                        </Select>
                    </Form.Item>
                )}
            </Form>
            <div className="my-4 text-base font-[500]">生成内容</div>
            {templateList?.map((item, index) => (
                <div key={index} className="flex items-start gap-2 mb-4">
                    <Image src={item.example} preview={false} width={100} />
                    <div className="flex flex-col justify-between w-full h-full">
                        {executeStep === 0 ? (
                            <div className="text-base text-[#000000a6] font-[500]">未开始，点击生成，开始生成视频</div>
                        ) : (
                            <div className="w-full flex flex-col items-start gap-2">
                                {results[index]?.status !== 'failed' && results[index]?.status !== 'completed' && (
                                    <div className="w-full">
                                        <Progress percent={results[index]?.progress || 0} showInfo={false} />
                                        <div className="text-md font-[500]">生成中 {results[index]?.progress || 0}%</div>
                                    </div>
                                )}
                                <div className="text-md  font-[500]">
                                    {results[index]?.status === 'completed'
                                        ? '生成成功'
                                        : results[index]?.status === 'failed'
                                        ? '生成失败'
                                        : null}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            {results[index]?.status === 'failed' ? (
                                <Button onClick={() => retryVideo(index)}>重试</Button>
                            ) : results[index]?.status === 'completed' ? (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => {
                                            setPreviewVideoUrl(results[index]?.videoUrl);
                                            setPreviewVideo(true);
                                        }}
                                    >
                                        预览
                                    </Button>
                                    <Button type="primary">下载</Button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            ))}
            {executeStep === 0 ? (
                <div className="flex justify-center gap-2 mt-4">
                    <Button onClick={() => setVideoOpen(false)}>取消</Button>
                    <Button type="primary" onClick={executeVideo}>
                        生成视频
                    </Button>
                </div>
            ) : results?.some((item) => item?.status === 'pending' || item?.status === 'processing') ? (
                <div className="flex justify-center gap-2 mt-4">
                    <Button>取消</Button>
                </div>
            ) : (
                <div className="flex justify-center gap-2 mt-4">
                    <Button type="primary">确认</Button>
                </div>
            )}
            <Modal width={'748px'} open={previewVideo} title={'预览视频'} footer={null} onCancel={() => setPreviewVideo(false)}>
                <video src={previewVideoUrl} width={'700px'} controls />
            </Modal>
        </Modal>
    );
};

export default VideoModal;
