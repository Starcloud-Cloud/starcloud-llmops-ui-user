import { Modal, Button, QRCode, Card, Popover, Form, Switch, Select, Radio, Image } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';

const H5Modal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const [form] = Form.useForm();
    return (
        <Modal title="H5页面" open={open} onCancel={() => setOpen(false)} width="60%" footer={null}>
            <div className="text-xs text-gray-500 mb-4">
                创建一个 H5 页面，分享给他人。别人可以轻松的观看你制作的图文和视频作品，也可以下载
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center">
                    <QRCode size={150} value="https://www.baidu.com" />
                    <div className="text-xs text-gray-500 mt-2 font-bold hover:text-[#673ab7] cursor-pointer">查看</div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <Card size="small">
                        <div className="flex justify-between">
                            <div className="text-base font-bold">文件名 单词 A.mp4</div>
                            <div className="flex gap-2">
                                <Button type="primary">下载</Button>
                                <Button type="primary">扫码</Button>
                            </div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="flex justify-between">
                            <div className="text-base font-bold">文件名 单词 B.mp3</div>
                            <div className="flex gap-2">
                                <Button type="primary">下载</Button>
                                <Button type="primary">扫码</Button>
                            </div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="flex justify-end mb-4">
                            <Popover
                                title="pdf 配置"
                                placement="top"
                                content={
                                    <Form className="w-[300px]" layout="vertical" form={form}>
                                        <Form.Item label="增加音频二维码" name="audio" valuePropName="checked">
                                            <Switch />
                                        </Form.Item>
                                        <Form.Item label="增加视频二维码" name="video" valuePropName="checked">
                                            <Switch />
                                        </Form.Item>
                                        <Form.Item label="二维码位置" name="position">
                                            <Select>
                                                <Select.Option value="左上">左上</Select.Option>
                                                <Select.Option value="右上">右上</Select.Option>
                                                <Select.Option value="左下">左下</Select.Option>
                                                <Select.Option value="右下">右下</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <div className="flex gap-2 justify-center">
                                            <Button onClick={() => setOpen(false)}>取消</Button>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    /* 保存逻辑 */
                                                }}
                                            >
                                                保存
                                            </Button>
                                        </div>
                                    </Form>
                                }
                            >
                                <Button size="small" type="primary" shape="circle" icon={<SettingOutlined />} />
                            </Popover>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-base font-bold">文件名 单词 B.pdf</div>
                            <div className="flex gap-2">
                                <Button>重新生成</Button>
                                <Button type="primary">下载</Button>
                                <Button type="primary">扫码</Button>
                            </div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="flex justify-between">
                            <div className="text-base font-bold">文件名 单词 B.pdf</div>
                            <div className="flex gap-2">
                                <Button>重新生成</Button>
                            </div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="flex justify-end mb-4">
                            <Popover
                                title="遗忘单词本配置"
                                placement="top"
                                content={
                                    <Form layout="vertical" className="w-[300px]">
                                        <Form.Item label="选择单词的字段" name="fieldA">
                                            <Select>
                                                <Select.Option value="A">A</Select.Option>
                                                <Select.Option value="B">B</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="选择译义的字段" name="fieldB">
                                            <Select>
                                                <Select.Option value="A">A</Select.Option>
                                                <Select.Option value="B">B</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="选择模式" name="mode">
                                            <Radio.Group className="w-full">
                                                <div className="grid grid-cols-3 gap-2 w-full">
                                                    <div className="flex flex-col items-center">
                                                        <Image width={'100%'} height={100} src={''} preview={false} />
                                                        <Radio value="option1">选项1</Radio>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <Image width={'100%'} height={100} src={''} preview={false} />
                                                        <Radio value="option2">选项2</Radio>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <Image width={'100%'} height={100} src={''} preview={false} />
                                                        <Radio value="option3">选项3</Radio>
                                                    </div>
                                                </div>
                                            </Radio.Group>
                                        </Form.Item>
                                        <div className="flex gap-2 justify-center">
                                            <Button onClick={() => setOpen(false)}>取消</Button>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    /* 保存逻辑 */
                                                }}
                                            >
                                                保存
                                            </Button>
                                        </div>
                                    </Form>
                                }
                            >
                                <Button size="small" type="primary" shape="circle" icon={<SettingOutlined />} />
                            </Popover>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-base font-bold">xxxx单词 A--抗遗忘写本.pdf</div>
                            <div className="flex gap-2">
                                <Button>重新生成</Button>
                                <Button type="primary">下载</Button>
                                <Button type="primary">扫码</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="flex gap-2 justify-center mt-4">
                <Button onClick={() => setOpen(false)}>取消</Button>
                <Button type="primary">保存</Button>
            </div>
        </Modal>
    );
};

export default H5Modal;
