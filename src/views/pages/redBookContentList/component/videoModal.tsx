import { useState, useEffect } from 'react';
import { Modal, Form, Select, Image, Progress, Button, Switch, Tooltip, Card } from 'antd';
import { ExclamationCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { saveSetting, generateVideo, getVideoResult } from 'api/video';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { dictData } from 'api/template';

const VideoModal = ({
    videoOpen,
    setVideoOpen,
    businessUid,
    quickConfiguration,
    quickValue,
    templateList,
    imageList,
    videoList,
    getDetail,
    title
}: {
    videoOpen: boolean;
    setVideoOpen: (value: boolean) => void;
    businessUid: string;
    quickConfiguration: any;
    quickValue: any;
    templateList: any[];
    imageList: any[];
    videoList: any[];
    getDetail: () => void;
    title: string;
}) => {
    const Option = Select.Option;
    const [form] = Form.useForm();
    const [excuteLoading, setExcuteLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [voiceRoleOptions, setVoiceRoleOptions] = useState<any[]>([]);
    const [soundEffectOptions, setSoundEffectOptions] = useState<any[]>([]);

    const executeVideo = async () => {
        const values = await form.validateFields();
        setExcuteLoading(true);
        templateList.forEach(async (item, index) => {
            try {
                const res = await generateVideo({
                    uid: businessUid,
                    quickConfiguration: JSON.stringify(values),
                    videoConfig: item.videoConfig,
                    imageCode: item.code
                });
                pollResult(res?.id, index);
            } catch (error) {
                setExcuteLoading(false);
            }
        });
    };

    const pollResult = async (videoUid: string, index: number) => {
        setExcuteLoading(false);
        const interval = setInterval(async () => {
            try {
                const res = await getVideoResult({
                    videoUid,
                    creativeContentUid: businessUid,
                    imageCode: templateList[index].code
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
        try {
            const res = await getVideoResult({
                videoUid,
                creativeContentUid: businessUid,
                imageCode: templateList[index].code
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
    };

    const retryVideo = async (index: number) => {
        try {
            setExcuteLoading(true);
            const res = await generateVideo({
                uid: businessUid,
                quickConfiguration: JSON.stringify(form.getFieldsValue()),
                videoConfig: templateList[index].videoConfig,
                imageCode: templateList[index].code
            });
            pollResult(res?.id, index);
        } catch (error) {
            setExcuteLoading(false);
        }
    };
    const saveSettings = async (flag?: any) => {
        const values = await form.validateFields();
        const res = await saveSetting({
            uid: businessUid,
            quickConfiguration: JSON.stringify(values),
            videoContents: results
        });
        if (flag) {
            setVideoOpen(false);
        }
        getDetail();
        dispatch(
            openSnackbar({
                open: true,
                message: '保存成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                transition: 'SlideDown',
                close: false
            })
        );
    };

    useEffect(() => {
        if (videoOpen && quickValue) {
            form.setFieldsValue(quickValue);
        }
    }, [videoOpen]);
    useEffect(() => {
        if (videoList && videoList?.length > 0) {
            setResults(videoList);
        }
    }, [videoList]);
    useEffect(() => {
        dictData('', 'tts_voice_role_all_json').then((res) => {
            setVoiceRoleOptions(JSON.parse(res.list[0]?.remark));
        });
        dictData('', 'tts_sound_effect').then((res) => {
            setSoundEffectOptions(res.list);
        });
    }, []);

    // 添加音频播放函数
    const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
    const playAudioDemo = (demoLink: string) => {
        if (audioPlayer) {
            audioPlayer.pause();
        }
        const audio = new Audio(demoLink);
        audio.play();
        setAudioPlayer(audio);
    };

    //预览
    const [previewVideo, setPreviewVideo] = useState<boolean>(false);
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string>('');

    return (
        <Modal width={'600px'} open={videoOpen} title={'图文视频生成'} footer={null} onCancel={() => setVideoOpen(false)}>
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    voiceRole: undefined,
                    soundEffect: undefined,
                    repeatEnable: false,
                    repeatRole: undefined
                }}
            >
                {quickConfiguration?.isVoiceRole && (
                    <Form.Item label="发音角色" name="voiceRole" rules={[{ required: true, message: '请选择发音角色' }]}>
                        <Select optionLabelProp="label" style={{ width: 200 }}>
                            {voiceRoleOptions?.map((item) => (
                                <Select.Option key={item.code} label={item.voice} value={item.code}>
                                    <div className="flex items-center justify-between">
                                        <span>{item.voice}</span>
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
                )}
                {quickConfiguration?.isSoundEffect && (
                    <Form.Item label="指示效果" name="soundEffect" rules={[{ required: true, message: '请选择指示效果' }]}>
                        <Select style={{ width: 200 }} options={soundEffectOptions} />
                    </Form.Item>
                )}
                {quickConfiguration?.isRepeatEnable && (
                    <Form.Item label="是否跟读" name="repeatEnable" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                )}
                {quickConfiguration?.isRepeatRole && (
                    <Form.Item label="跟读发音角色" name="repeatRole" rules={[{ required: true, message: '请选择跟读发音角色' }]}>
                        <Select optionLabelProp="label" style={{ width: 200 }}>
                            {voiceRoleOptions?.map((item) => (
                                <Select.Option key={item.code} label={item.voice} value={item.code}>
                                    <div className="flex items-center justify-between">
                                        <span>{item.voice}</span>
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
                )}
            </Form>
            <div className="my-4 text-base font-[500]">
                生成列表{' '}
                <Tooltip title="按照配置的图片模版数量生成对应的视频">
                    <ExclamationCircleOutlined />
                </Tooltip>
            </div>
            {templateList?.map((item, index) => (
                <Card size="small" key={index} className="mb-4">
                    <div className="flex items-start gap-2">
                        <Image src={imageList?.filter((i) => i.code === item.code)[0]?.url} preview={false} width={100} />
                        <div className="flex flex-col justify-between w-full relative min-h-[110px]">
                            {!results[index] ? (
                                <div className="text-base text-[#000000a6] font-[500]">未生成，点击生成视频按钮</div>
                            ) : (
                                <div className="w-full flex flex-col items-start gap-2">
                                    <div className="text-base w-full font-[500]">
                                        {results[index]?.status === 'completed' ? (
                                            <div className="text-[#52c41a]">生成成功</div>
                                        ) : results[index]?.status === 'failed' || results[index]?.status === 'unknown' ? (
                                            <div className="text-[#ff4d4f]">生成失败：{results[index]?.error}</div>
                                        ) : (
                                            <div className="w-full">
                                                <Progress percent={results[index]?.progress || 0} showInfo={false} />
                                                <div className="text-md font-[500]">生成中 {results[index]?.progress || 0}%</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end gap-2 absolute top-0 right-0 h-full">
                                {results[index]?.status === 'failed' ? (
                                    <Button loading={excuteLoading} onClick={() => retryVideo(index)}>
                                        重试
                                    </Button>
                                ) : results[index]?.status === 'completed' ? (
                                    <div className="flex flex-col gap-2 justify-between">
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => {
                                                    setPreviewVideoUrl(results[index]?.videoUrl);
                                                    setPreviewVideo(true);
                                                }}
                                            >
                                                预览
                                            </Button>
                                            <Button
                                                type="primary"
                                                onClick={async () => {
                                                    const response = await fetch(results[index]?.videoUrl);
                                                    const arrayBuffer = await response.arrayBuffer();
                                                    const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
                                                    const videoUrl = URL.createObjectURL(blob);
                                                    if (videoUrl) {
                                                        const link = document.createElement('a');
                                                        link.href = videoUrl;
                                                        link.setAttribute('download', title + '.mp4'); // 设置下载文件名
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    } else {
                                                        dispatch(
                                                            openSnackbar({
                                                                open: true,
                                                                message: '视频链接无效，无法下载',
                                                                variant: 'alert',
                                                                alert: {
                                                                    color: 'error'
                                                                },
                                                                close: false
                                                            })
                                                        );
                                                    }
                                                }}
                                            >
                                                下载
                                            </Button>
                                        </div>
                                        <Button loading={excuteLoading} onClick={() => retryVideo(index)} type="primary">
                                            重新生成
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
            {results?.length === 0 ? (
                <div className="flex justify-center gap-2 mt-4">
                    <Button onClick={() => saveSettings()}>保存配置</Button>
                    <Button loading={excuteLoading} type="primary" onClick={executeVideo}>
                        生成视频
                    </Button>
                </div>
            ) : results?.some((item) => item?.status === 'pending' || item?.status === 'processing') ? (
                <div className="flex justify-center gap-2 mt-4">
                    <Button>取消</Button>
                </div>
            ) : (
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        type="primary"
                        onClick={() => {
                            saveSettings(true);
                        }}
                    >
                        确认
                    </Button>
                </div>
            )}
            {previewVideo && (
                <Modal width={'448px'} open={previewVideo} title={'预览视频'} footer={null} onCancel={() => setPreviewVideo(false)}>
                    <video src={previewVideoUrl} width={'400px'} controls />
                </Modal>
            )}
        </Modal>
    );
};

export default VideoModal;
