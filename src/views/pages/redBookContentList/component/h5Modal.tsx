import { Modal, Input, Button, Switch, Select, QRCode, Card } from 'antd';
import { useState } from 'react';

const H5Modal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const [file1, setFile1] = useState('');
    const [file2, setFile2] = useState('');
    const [pdfName, setPdfName] = useState('');
    const [pdfOption, setPdfOption] = useState(false);
    const [fontSize, setFontSize] = useState('A');

    const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => setFile1(e.target.value);
    const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => setFile2(e.target.value);
    const handlePdfNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setPdfName(e.target.value);
    const handlePdfOptionChange = (checked: boolean) => setPdfOption(checked);
    const handleFontSizeChange = (value: string) => setFontSize(value);

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
                <div className="flex-1">
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
