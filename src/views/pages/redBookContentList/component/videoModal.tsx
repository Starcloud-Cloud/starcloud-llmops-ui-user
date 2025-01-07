import { Modal, Form, Select, Image, Progress, Button, Switch } from 'antd';
import { useState } from 'react';
const VideoModal = ({
    videoOpen,
    setVideoOpen,
    quickConfiguration,
    templateList
}: {
    videoOpen: boolean;
    setVideoOpen: (value: boolean) => void;
    quickConfiguration: any;
    templateList: any[];
}) => {
    const Option = Select.Option;

    const [executeVideoLoading, setExecuteVideoLoading] = useState(false);
    const [executeStep, setExecuteStep] = useState(0);
    const executeVideo = () => {
        setExecuteStep(1);
        setExecuteVideoLoading(true);
    };
    const executeSave = () => {};

    return (
        <Modal width={'700px'} open={videoOpen} title={'图文视频生成'} footer={null} onCancel={() => setVideoOpen(false)}>
            <Form layout="vertical">
                {quickConfiguration?.isVoiceRole && (
                    <Form.Item label="发音角色" name="voiceRole" rules={[{ required: true, message: '请选择发音角色' }]}>
                        <Select defaultValue="男声2" style={{ width: 200 }}>
                            <Option value="男声1">男声1</Option>
                            <Option value="男声2">男声2</Option>
                            <Option value="女声1">女声1</Option>
                            <Option value="女声2">女声2</Option>
                        </Select>
                    </Form.Item>
                )}
                {quickConfiguration?.isSoundEffect && (
                    <Form.Item label="发音效果" name="soundEffect" rules={[{ required: true, message: '请选择发音效果' }]}>
                        <Select defaultValue="手指" style={{ width: 200 }}>
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
                    <Form.Item label="跟读发音角色" name="readVoiceRole" rules={[{ required: true, message: '请选择跟读发音角色' }]}>
                        <Select defaultValue="女声2" style={{ width: 200 }}>
                            <Option value="男声1">男声1</Option>
                            <Option value="男声2">男声2</Option>
                            <Option value="女声1">女声1</Option>
                            <Option value="女声2">女声2</Option>
                        </Select>
                    </Form.Item>
                )}
            </Form>
            <div className="my-4 text-base font-[500]">生成内容</div>
            {templateList?.map(
                (item: any) =>
                    item?.openVideoMode && (
                        <div className="flex items-start gap-2 mb-4">
                            <Image src={item.example} preview={false} width={100} />
                            <p className="text-base text-[#000000a6] font-[500]">未开始，点击生成，开始生成视频</p>
                            <Button
                                onClick={() => {
                                    console.log(JSON.parse(item?.videoConfig));
                                }}
                            >
                                获取视频参数
                            </Button>
                            {/* <div className="w-full flex flex-col items-start gap-2">
                        <Progress percent={50} showInfo={false} />
                        <div className="text-md text-black/50 font-[500]">生成中 50%</div>
                    </div> */}
                        </div>
                    )
            )}
            {executeStep === 0 ? (
                <div className="flex justify-center gap-2 mt-4">
                    <Button>取消</Button>
                    <Button type="primary" onClick={executeVideo}>
                        生成视频
                    </Button>
                </div>
            ) : executeStep === 1 ? (
                <div className="flex justify-center gap-2 mt-4">
                    <Button>取消</Button>
                </div>
            ) : (
                <div className="flex justify-center gap-2 mt-4">
                    <Button type="primary" onClick={executeSave}>
                        确认
                    </Button>
                </div>
            )}
        </Modal>
    );
};
export default VideoModal;
