import { Modal, Button, QRCode, Card, Popover, Form, Switch, Select, Radio, Image } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getH5, PdfExecute, listWordbookTemplate, WordbookExecute, saveConfig } from 'api/video/h5';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const H5Modal = ({
    open,
    setOpen,
    uid,
    title,
    columns
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    uid: string;
    title: string;
    columns: any[];
}) => {
    const [form] = Form.useForm();
    const [qrCodeOpen, setQrCodeOpen] = useState(false);
    const [qrCode, setQrCode] = useState<string>('');
    const [wordbookTemplate, setWordbookTemplate] = useState<any[]>([]);
    const [h5Data, setH5Data] = useState<any>(null);

    //pdf配置
    const [pdfOpen, setPdfOpen] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const pdfExecute = async () => {
        if (!h5Data?.resourceConfiguration?.imagePdfConfiguration) {
            setPdfOpen(true);
        } else {
            setPdfLoading(true);
            try {
                const res = await PdfExecute(h5Data);
                setH5Data((prev: any) => ({
                    ...prev,
                    resource: {
                        ...prev.resource,
                        imagePdfUrl: res
                    }
                }));
                setPdfLoading(false);
            } catch (error) {
                setPdfLoading(false);
            }
        }
    };

    //抗遗忘写本配置
    const [wordbookOpen, setWordbookOpen] = useState(false);
    const [wordbookLoading, setWordbookLoading] = useState(false);
    const wordbookExecute = async () => {
        if (!h5Data?.resourceConfiguration?.wordbookPdfConfiguration) {
            setWordbookOpen(true);
        } else {
            setWordbookLoading(true);
            try {
                const res = await WordbookExecute(h5Data);
                setH5Data((prev: any) => ({
                    ...prev,
                    resource: {
                        ...prev.resource,
                        wordbookPdfUrl: res
                    }
                }));
                setWordbookLoading(false);
            } catch (error) {
                setWordbookLoading(false);
            }
        }
    };

    const download = async (url: string, format: string) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = title + '.' + format;
        link.click();
    };
    const handleSave = async () => {
        const res = await saveConfig(h5Data);
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
        setOpen(false);
    };
    useEffect(() => {
        if (pdfOpen) {
            form.resetFields();
            if (h5Data?.resourceConfiguration?.imagePdfConfiguration) {
                form.setFieldsValue(h5Data?.resourceConfiguration?.imagePdfConfiguration);
            } else {
                form.validateFields(['isAddAudioQrCode', 'isAddVideoQrCode', 'qrCodeLocation']);
            }
        }
        if (wordbookOpen) {
            form.resetFields();
            if (h5Data?.resourceConfiguration?.wordbookPdfConfiguration) {
                const { wordField, paraphraseField, posterTemplate } = h5Data?.resourceConfiguration?.wordbookPdfConfiguration;
                form.setFieldsValue({ wordField, paraphraseField, posterTemplate: posterTemplate?.code });
            } else {
                form.validateFields(['wordField', 'paraphraseField', 'posterTemplate']);
            }
        }
    }, [pdfOpen, wordbookOpen]);
    useEffect(() => {
        if (open) {
            getH5(uid).then((res: any) => {
                setH5Data(res);
            });
            listWordbookTemplate().then((res: any) => {
                setWordbookTemplate(res);
            });
        }
    }, [open]);

    return (
        <Modal title="H5页面" open={open} onCancel={() => setOpen(false)} width="60%" footer={null}>
            <div className="text-xs text-gray-500 mb-4">
                创建一个 H5 页面，分享给他人。别人可以轻松的观看你制作的图文和视频作品，也可以下载
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center">
                    <QRCode size={150} value={process.env.REACT_APP_SHARE_URL + '/dataShare?uid=' + uid} />
                    <div className="text-xs text-gray-500 mt-2 font-bold hover:text-[#673ab7] cursor-pointer">查看</div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <Card size="small">
                        <div className="flex justify-between">
                            <div className="text-base font-bold">{title}.mp4</div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => download(h5Data?.resource?.completeVideoUrl, 'mp4')}
                                    disabled={!h5Data?.resource?.completeVideoUrl}
                                    type="primary"
                                >
                                    下载
                                </Button>
                                <Button
                                    onClick={() => {
                                        setQrCode(h5Data?.resource?.completeVideoUrl);
                                        setQrCodeOpen(true);
                                    }}
                                    disabled={!h5Data?.resource?.completeVideoUrl}
                                    type="primary"
                                >
                                    扫码
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="flex justify-between">
                            <div className="text-base font-bold">{title}.mp3</div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => download(h5Data?.resource?.completeAudioUrl, 'mp3')}
                                    disabled={!h5Data?.resource?.completeAudioUrl}
                                    type="primary"
                                >
                                    下载
                                </Button>
                                <Button
                                    onClick={() => {
                                        setQrCode(h5Data?.resource?.completeAudioUrl);
                                        setQrCodeOpen(true);
                                    }}
                                    disabled={!h5Data?.resource?.completeAudioUrl}
                                    type="primary"
                                >
                                    扫码
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="flex justify-end mb-4">
                            <Popover
                                title="pdf 配置"
                                placement="top"
                                trigger="click"
                                open={pdfOpen}
                                onOpenChange={setPdfOpen}
                                content={
                                    <Form className="w-[300px]" layout="vertical" form={form}>
                                        <Form.Item
                                            initialValue={false}
                                            label="增加音频二维码"
                                            name="isAddAudioQrCode"
                                            valuePropName="checked"
                                        >
                                            <Switch />
                                        </Form.Item>
                                        <Form.Item
                                            initialValue={false}
                                            label="增加视频二维码"
                                            name="isAddVideoQrCode"
                                            valuePropName="checked"
                                        >
                                            <Switch />
                                        </Form.Item>
                                        <Form.Item label="二维码位置" name="qrCodeLocation" rules={[{ required: true }]}>
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
                                                onClick={async () => {
                                                    const values = await form.validateFields([
                                                        'isAddAudioQrCode',
                                                        'isAddVideoQrCode',
                                                        'qrCodeLocation'
                                                    ]);
                                                    setH5Data((prev: any) => ({
                                                        ...prev,
                                                        resourceConfiguration: {
                                                            ...prev.resourceConfiguration,
                                                            imagePdfConfiguration: values
                                                        }
                                                    }));
                                                    setPdfOpen(false);
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
                            <div className="text-base font-bold">{title}.pdf</div>
                            <div className="flex gap-2">
                                <Button loading={pdfLoading} onClick={pdfExecute}>
                                    {h5Data?.resource?.imagePdfUrl ? '重新生成' : '生成'}
                                </Button>
                                <Button
                                    onClick={() => download(h5Data?.resource?.imagePdfUrl, 'pdf')}
                                    disabled={!h5Data?.resource?.imagePdfUrl}
                                    type="primary"
                                >
                                    下载
                                </Button>
                                <Button
                                    onClick={() => {
                                        setQrCode(h5Data?.resource?.imagePdfUrl);
                                        setQrCodeOpen(true);
                                    }}
                                    disabled={!h5Data?.resource?.imagePdfUrl}
                                    type="primary"
                                >
                                    扫码
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="flex justify-end mb-4">
                            <Popover
                                title="遗忘单词本配置"
                                placement="top"
                                trigger="click"
                                open={wordbookOpen}
                                onOpenChange={setWordbookOpen}
                                content={
                                    <Form form={form} layout="vertical" className="w-[300px]">
                                        <Form.Item label="选择单词的字段" name="wordField" rules={[{ required: true }]}>
                                            <Select>
                                                {columns.map((item: any) => (
                                                    <Select.Option value={item.columnCode}>{item.columnName}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="选择译义的字段" name="paraphraseField" rules={[{ required: true }]}>
                                            <Select>
                                                {columns.map((item: any) => (
                                                    <Select.Option value={item.columnCode}>{item.columnName}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="选择模式" name="posterTemplate" rules={[{ required: true }]}>
                                            <Radio.Group className="w-full">
                                                <div className="grid grid-cols-3 gap-2 w-full">
                                                    {wordbookTemplate.map((item: any) => (
                                                        <div className="flex flex-col items-center">
                                                            <Image width={'100%'} src={item.example} preview={false} />
                                                            <Radio value={item.code}>{item.groupName}</Radio>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Radio.Group>
                                        </Form.Item>
                                        <div className="flex gap-2 justify-center">
                                            <Button onClick={() => setOpen(false)}>取消</Button>
                                            <Button
                                                type="primary"
                                                onClick={async () => {
                                                    const values = await form.validateFields([
                                                        'wordField',
                                                        'paraphraseField',
                                                        'posterTemplate'
                                                    ]);
                                                    setH5Data((prev: any) => ({
                                                        ...prev,
                                                        resourceConfiguration: {
                                                            ...prev.resourceConfiguration,
                                                            wordbookPdfConfiguration: {
                                                                ...values,
                                                                posterTemplate: wordbookTemplate?.find(
                                                                    (item: any) => item.code === values.posterTemplate
                                                                )
                                                            }
                                                        }
                                                    }));
                                                    setWordbookOpen(false);
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
                            <div className="text-base font-bold">{title}--抗遗忘写本.pdf</div>
                            <div className="flex gap-2">
                                <Button loading={wordbookLoading} onClick={wordbookExecute}>
                                    {h5Data?.resource?.wordbookPdfUrl ? '重新生成' : '生成'}
                                </Button>
                                <Button
                                    onClick={() => download(h5Data?.resource?.wordbookPdfUrl, 'pdf')}
                                    disabled={!h5Data?.resource?.wordbookPdfUrl}
                                    type="primary"
                                >
                                    下载
                                </Button>
                                <Button
                                    onClick={() => {
                                        setQrCode(h5Data?.resource?.wordbookPdfUrl);
                                        setQrCodeOpen(true);
                                    }}
                                    disabled={!h5Data?.resource?.wordbookPdfUrl}
                                    type="primary"
                                >
                                    扫码
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="flex gap-2 justify-center mt-4">
                <Button onClick={() => setOpen(false)}>取消</Button>
                <Button onClick={handleSave} type="primary">
                    保存
                </Button>
            </div>
            <Modal open={qrCodeOpen} onCancel={() => setQrCodeOpen(false)} footer={null}>
                <div className="flex flex-col gap-2 items-center">
                    <QRCode size={180} value={qrCode} />
                    <div className="text-xs font-bold text-black/50">扫码查看详情</div>
                </div>
            </Modal>
        </Modal>
    );
};

export default H5Modal;
