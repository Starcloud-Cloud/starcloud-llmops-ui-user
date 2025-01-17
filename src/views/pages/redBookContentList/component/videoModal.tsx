import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Select, Image, Progress, Button, Switch, Tooltip, Card, Tabs } from 'antd';
import { ExclamationCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { saveSetting, generateVideo, getVideoResult, mergeVideo } from 'api/video';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { dictData } from 'api/template';
import _ from 'lodash-es';

const VideoModal = ({
    videoOpen,
    setVideoOpen,
    businessUid,
    quickConfiguration,
    quickValue,
    templateList,
    imageList,
    video,
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
    video: any;
    getDetail: () => void;
    title: string;
}) => {
    const Option = Select.Option;
    const [form] = Form.useForm();
    const [excuteLoading, setExcuteLoading] = useState(false);
    const [reTryLoading, setReTryLoading] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [voiceRoleOptions, setVoiceRoleOptions] = useState<any[]>([]);
    const [soundEffectOptions, setSoundEffectOptions] = useState<any[]>([]);

    const timer = useRef<any>(null);
    const progresstimer = useRef<any>([]);
    const allTimer = useRef<any>([]);
    const executeVideo = async () => {
        setProgress([]);
        const values = await form.validateFields();
        setExcuteLoading(true);
        imageList.map(async (item, index) => {
            try {
                const res = await generateVideo({
                    uid: businessUid,
                    quickConfiguration: JSON.stringify(values),
                    videoConfig: templateList?.find((t) => t.code === item.code)?.videoConfig,
                    imageCode: item.code,
                    imageUrl: item.url
                });
                pollResult(res?.id, index);
            } catch (error) {
                setExcuteLoading(false);
            }
        });
        timer.current = setTimeout(() => {
            const newList = _.cloneDeep(results);
            newList.forEach((item, index) => {
                if (item?.status === 'pending' || item?.status === 'processing') {
                    item.status = 'failed';
                    item.error = '生成超时';
                }
                clearInterval(progresstimer.current[index]);
            });
            allTimer.current.forEach((item: any) => {
                clearInterval(item);
            });

            setResults(newList);
        }, 1000 * 60 * 3);
    };

    const pollResult = async (videoUid: string, index: number) => {
        setExcuteLoading(false);
        progressTimer(index);
        allTimer.current[index] = setInterval(async () => {
            console.log(1);

            try {
                const res = await getVideoResult({
                    videoUid,
                    creativeContentUid: businessUid,
                    imageCode: imageList[index].code,
                    imageUrl: imageList[index].url
                });
                if (res?.status === 'completed' || res?.status === 'failed') {
                    clearInterval(allTimer.current[index]);
                }
                setResults((prev) => {
                    const newResults = [...prev];
                    newResults[index] = res;
                    const allCompleted = newResults.every((item) => item?.status === 'completed' || item?.status === 'failed');
                    if (allCompleted && newResults.length === imageList.length) {
                        saveSettings(false, newResults);
                    }
                    return newResults;
                });
            } catch (error) {
                clearInterval(allTimer.current[index]);
            }
        }, 2000);
        try {
            const res = await getVideoResult({
                videoUid,
                creativeContentUid: businessUid,
                imageCode: imageList[index].code,
                imageUrl: imageList[index].url
            });
            if (res?.status === 'completed' || res?.status === 'failed') {
                clearInterval(allTimer.current[index]);
                clearInterval(progresstimer.current[index]);
            }
            setResults((prev) => {
                const newResults = [...prev];
                newResults[index] = res;
                return newResults;
            });
        } catch (error) {
            clearInterval(allTimer.current[index]);
            clearInterval(progresstimer.current[index]);
        }
    };

    const retryVideo = async (index: number) => {
        setReTryLoading((prev) => {
            const newList = [...prev];
            newList[index] = true;
            return newList;
        });
        setProgress((prev) => {
            const newList = [...prev];
            newList[index] = 0;
            return newList;
        });
        try {
            const res = await generateVideo({
                uid: businessUid,
                quickConfiguration: JSON.stringify(form.getFieldsValue()),
                videoConfig: templateList?.find((t) => t.code === imageList[index].code)?.videoConfig,
                imageCode: imageList[index].code,
                imageUrl: imageList[index].url
            });
            setReTryLoading((prev) => {
                const newList = [...prev];
                newList[index] = false;
                return newList;
            });
            pollResult(res?.id, index);
        } catch (error) {
            setReTryLoading((prev) => {
                const newList = [...prev];
                newList[index] = false;
                return newList;
            });
            setExcuteLoading(false);
        }
    };
    const saveSettings = async (flag?: any, valueList?: any[], video?: any) => {
        const values = await form.validateFields();
        await saveSetting({
            uid: businessUid,
            quickConfiguration: JSON.stringify(values),
            video: {
                videoList: valueList || results,
                completeVideoUrl: video?.videoUrl || completeVideo?.videoUrl,
                completeAudioUrl: video?.audioUrl || completeVideo?.completeAudioUrl
            }
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
        if (!videoOpen) {
            // setMergeStep(0);
            setMergeProgress(0);
        }
    }, [videoOpen]);
    useEffect(() => {
        if (video) {
            setResults(video?.videoList || []);
            if (video?.completeVideoUrl) {
                setMergeStep(1);
                setCompleteVideo({
                    videoUrl: video?.completeVideoUrl,
                    audioUrl: video?.completeAudioUrl
                });
            }
        }
    }, [video]);
    useEffect(() => {
        dictData('', 'tts_voice_role_all_json').then((res) => {
            setVoiceRoleOptions(JSON.parse(res.list[0]?.remark));
        });
        dictData('', 'tts_sound_effect').then((res) => {
            setSoundEffectOptions(res.list);
        });
        return () => {
            allTimer.current.forEach((item: any) => {
                clearInterval(item);
            });
            clearTimeout(timer.current);
        };
    }, []);
    const [progress, setProgress] = useState<number[]>([]);

    const progressTimer = (index: number, isMerge?: boolean) => {
        // 3分钟 = 180秒
        const duration = 180;
        // 目标进度
        const targetProgress = 99;
        // 计算每次增长的步长 (指数增长,开始快后面慢)
        const step = 0.5;
        const startTime = Date.now();
        progresstimer.current[index] = setInterval(() => {
            console.log(1);

            const elapsedTime = (Date.now() - startTime) / 1000; // 已经过去的秒数
            const percentage = Math.min(elapsedTime / duration, 1);

            // 使用指数函数使进度增长呈现非线性
            const currentProgress = Math.min(targetProgress * (1 - Math.exp(-step * percentage * 10)), targetProgress);
            if (isMerge) {
                setMergeProgress(Math.round(currentProgress));
            } else {
                setProgress((prev) => {
                    const newList = [...prev];
                    newList[index] = Math.round(currentProgress);
                    return newList;
                });
            }

            if (elapsedTime >= duration) {
                clearInterval(progresstimer.current);
            }
        }, 1000);

        return () => clearInterval(progresstimer.current[index]);
    };

    useEffect(() => {
        if (results.every((item) => item?.status === 'completed' || item?.status === 'failed' || item?.status === 'unknown')) {
            console.log(2);
            progresstimer.current.forEach((item: any) => {
                clearInterval(item);
            });
            clearTimeout(timer.current);
        }
    }, [results]);

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

    //合并视频
    const [mergeVideoLoading, setMergeVideoLoading] = useState(false);
    const [completeVideo, setCompleteVideo] = useState<any>(null);

    //合并视频进度
    const [mergeStep, setMergeStep] = useState<number>(0);
    const [mergeProgress, setMergeProgress] = useState<number>(0);
    const [mergeMessage, setMergeMessage] = useState<string>('');
    const mergeVideos = async () => {
        setMergeProgress(0);
        setCompleteVideo(null);
        setMergeStep(1);
        progressTimer(0, true);
        setMergeVideoLoading(true);
        try {
            const res = await mergeVideo({
                videos: results.map((item) => ({
                    url: item?.videoUrl,
                    type: 'none'
                }))
            });
            clearInterval(progresstimer.current[0]);
            setMergeVideoLoading(false);
            setCompleteVideo({
                videoUid: res?.id,
                videoUrl: res?.url,
                completeAudioUrl: res?.audio_url
            });
            saveSettings(false, undefined, { videoUrl: res?.url, audioUrl: res?.audio_url });
        } catch (error: any) {
            clearInterval(progresstimer.current[0]);
            setMergeVideoLoading(false);
            setMergeMessage(error?.message || '合并失败');
        }
    };

    return (
        <Modal
            width={'600px'}
            open={videoOpen}
            title={'图文视频生成'}
            maskClosable={false}
            footer={null}
            onCancel={() => setVideoOpen(false)}
        >
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
                        <Select optionLabelProp="label" style={{ width: 250 }}>
                            {voiceRoleOptions?.map((item) => (
                                <Select.Option key={item.code} label={`${item.name} - ${item.language} - ${item.voice}`} value={item.code}>
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
                )}
                {quickConfiguration?.isAnimationEnable && (
                    <Form.Item label="是否启用动效" name="animationEnable" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                )}
                {quickConfiguration?.isAnimationEnable && (
                    <Form.Item noStyle dependencies={['animationEnable']}>
                        {({ getFieldValue }) => {
                            const animationEnabled = getFieldValue('animationEnable');
                            return animationEnabled ? (
                                <Form.Item label="指示效果" name="soundEffect" rules={[{ required: true, message: '请选择指示效果' }]}>
                                    <Select style={{ width: 250 }} options={soundEffectOptions} />
                                </Form.Item>
                            ) : null;
                        }}
                    </Form.Item>
                )}
                {quickConfiguration?.isRepeatEnable && (
                    <Form.Item label="是否跟读" name="repeatEnable" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                )}
                {quickConfiguration?.isRepeatRole && (
                    <Form.Item noStyle dependencies={['repeatEnable']}>
                        {({ getFieldValue }) => {
                            const repeatEnabled = getFieldValue('repeatEnable');
                            return repeatEnabled ? (
                                <Form.Item
                                    label="跟读发音角色"
                                    name="repeatRole"
                                    rules={[{ required: true, message: '请选择跟读发音角色' }]}
                                >
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
                            ) : null;
                        }}
                    </Form.Item>
                )}
            </Form>
            <div className="text-base font-[500]">
                视频列表{' '}
                <Tooltip title="按照配置的图片模版数量生成对应的视频">
                    <ExclamationCircleOutlined className="cursor-pointer" />
                </Tooltip>
            </div>
            <Tabs>
                <Tabs.TabPane tab="生成配置" key="1">
                    {imageList?.map((item, index) => (
                        <Card size="small" key={index} className="mb-4">
                            <div className="flex items-start gap-2">
                                <Image src={imageList?.filter((i) => i.code === item?.code)[0]?.url} preview={false} width={100} />
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
                                                        <Progress percent={progress[index]} showInfo={false} />
                                                        <div className="text-md font-[500]">生成中 {progress[index] || 0}%</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2 absolute top-0 right-0 h-full">
                                        {results[index]?.status === 'failed' ? (
                                            <Button loading={reTryLoading[index]} onClick={() => retryVideo(index)}>
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
                                                                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                        close: false
                                                                    })
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        下载
                                                    </Button>
                                                </div>
                                                <Button loading={reTryLoading[index]} onClick={() => retryVideo(index)} type="primary">
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
                            <Button loading={excuteLoading} onClick={executeVideo}>
                                重新生成
                            </Button>
                            <Button type="primary" onClick={() => saveSettings(true)}>
                                确认
                            </Button>
                        </div>
                    )}
                </Tabs.TabPane>
                {results?.length > 1 && results?.every((item) => item?.status === 'completed') && (
                    <Tabs.TabPane tab="合并视频" key="2">
                        <Card size="small" className="mb-4">
                            <div className="flex items-start gap-2">
                                <div>
                                    <Image src={imageList[0]?.url} preview={false} width={100} />
                                    <div className="text-xs text-black/50 mt-2 text-center">合并{results.length}个视频</div>
                                </div>
                                <div className="flex flex-col justify-between w-full relative min-h-[110px]">
                                    {mergeStep === 0 ? (
                                        <div className="text-base text-[#000000a6] font-[500]">未合成，点击合成视频按钮</div>
                                    ) : (
                                        <div className="w-full flex flex-col items-start gap-2">
                                            <div className="text-base w-full font-[500]">
                                                {completeVideo?.videoUrl ? (
                                                    <div className="text-[#52c41a]">合并成功</div>
                                                ) : mergeMessage ? (
                                                    <div className="text-[#ff4d4f]">合并失败：{mergeMessage}</div>
                                                ) : (
                                                    <div className="w-full">
                                                        <Progress percent={mergeProgress} showInfo={false} />
                                                        <div className="text-md font-[500]">合并中 {mergeProgress || 0}%</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2 absolute top-0 right-0 h-full">
                                        {mergeStep === 0 ? (
                                            <Button loading={mergeVideoLoading} type="primary" onClick={mergeVideos}>
                                                <svg
                                                    viewBox="0 0 1024 1024"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    p-id="6936"
                                                    width="20"
                                                    height="20"
                                                >
                                                    <path
                                                        d="M401.408 522.24h-196.608v-40.96h196.608l-47.104-47.104c-8.192-8.192-8.192-20.48 0-28.672 8.192-8.192 20.48-8.192 28.672 0l96.256 96.256-96.256 96.256c-8.192 8.192-20.48 8.192-28.672 0-8.192-8.192-8.192-20.48 0-28.672l47.104-47.104z m221.184-40.96h196.608v40.96h-196.608l47.104 47.104c8.192 8.192 8.192 20.48 0 28.672-8.192 8.192-20.48 8.192-28.672 0l-96.256-96.256 96.256-96.256c8.192-8.192 20.48-8.192 28.672 0 8.192 8.192 8.192 20.48 0 28.672l-47.104 47.104z m-202.752 286.72h40.96v61.44c0 34.816-26.624 61.44-61.44 61.44h-225.28c-34.816 0-61.44-26.624-61.44-61.44v-634.88c0-34.816 26.624-61.44 61.44-61.44h225.28c34.816 0 61.44 26.624 61.44 61.44v61.44h-40.96v-61.44c0-10.24-8.192-20.48-20.48-20.48h-225.28c-10.24 0-20.48 8.192-20.48 20.48v634.88c0 12.288 8.192 20.48 20.48 20.48h225.28c10.24 0 20.48-8.192 20.48-20.48v-61.44z m143.36 0h40.96v61.44c0 12.288 8.192 20.48 20.48 20.48h225.28c10.24 0 20.48-10.24 20.48-20.48v-634.88c0-12.288-8.192-20.48-20.48-20.48h-225.28c-10.24 0-20.48 10.24-20.48 20.48v63.488h-40.96V194.56c0-34.816 26.624-61.44 61.44-61.44h225.28c34.816 0 61.44 26.624 61.44 61.44v634.88c0 34.816-26.624 61.44-61.44 61.44h-225.28c-34.816 0-61.44-26.624-61.44-61.44v-61.44z"
                                                        fill="#fff"
                                                        p-id="6937"
                                                    ></path>
                                                </svg>
                                                合并视频
                                            </Button>
                                        ) : mergeMessage ? (
                                            <Button loading={mergeVideoLoading} onClick={mergeVideos}>
                                                重试
                                            </Button>
                                        ) : completeVideo?.videoUrl ? (
                                            <div className="flex flex-col gap-2 justify-between">
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => {
                                                            setPreviewVideoUrl(completeVideo?.videoUrl);
                                                            setPreviewVideo(true);
                                                        }}
                                                    >
                                                        预览
                                                    </Button>
                                                    <Button type="primary" onClick={async () => {}}>
                                                        下载
                                                    </Button>
                                                </div>
                                                <Button
                                                    type="primary"
                                                    loading={mergeVideoLoading}
                                                    onClick={() => {
                                                        mergeVideos();
                                                    }}
                                                >
                                                    重新合并
                                                </Button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <div className="flex justify-center mt-4">
                            <Button type="primary" onClick={() => saveSettings(true)}>
                                确认
                            </Button>
                        </div>
                    </Tabs.TabPane>
                )}
            </Tabs>

            {previewVideo && (
                <Modal width={'448px'} open={previewVideo} title={'预览视频'} footer={null} onCancel={() => setPreviewVideo(false)}>
                    <video src={previewVideoUrl} width={'400px'} controls />
                </Modal>
            )}
        </Modal>
    );
};

export default VideoModal;
