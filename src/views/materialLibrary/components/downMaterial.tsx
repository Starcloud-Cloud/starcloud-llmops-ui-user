import { Modal, Upload, Button, Progress, UploadProps } from 'antd';
import { useState, useEffect, useRef } from 'react';
import {
    getMaterialTitle,
    getMaterialPage,
    createMaterial,
    updateMaterial,
    delMaterial,
    templateExport,
    templateImport
} from 'api/redBook/material';

const DownMaterial = ({ libraryId, uploadOpen, setUploadOpen, getList, getTitleList }: any) => {
    const [uploadLoading, setUploadLoading] = useState(false); //上传文件开启进度条
    const perRef = useRef<number>(0);
    const [percent, setPercent] = useState(0); //模拟进度条数据
    const timer1: any = useRef(null);
    useEffect(() => {
        if (uploadLoading) {
            timer1.current = setInterval(() => {
                if (percent < 70) {
                    perRef.current += 30;
                    setPercent(perRef.current);
                }
            }, 20);
        } else {
            clearInterval(timer1.current);
            setPercent(0);
        }
    }, [uploadLoading]);
    const props1: UploadProps = {
        //上传压缩包
        showUploadList: false,
        accept: '.zip,.rar',
        beforeUpload: async (file, fileList) => {
            setUploadLoading(true);
            try {
                await templateImport({
                    libraryId,
                    materialType: 2,
                    file
                });
                perRef.current = 100;
                setPercent(perRef.current);
                setUploadOpen(false);
                setUploadLoading(false);
                getList();
                getTitleList();
                return false;
            } catch (error) {
                console.error('Error uploading file:', error);
                setUploadLoading(false);
            }
        }
    };
    const handleDownLoad = async () => {
        //下载模板
        const res = await templateExport({ id: libraryId });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(res);
        downloadLink.download = '模版.zip';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    return (
        <Modal width={400} title="批量导入" open={uploadOpen} footer={null} onCancel={() => setUploadOpen(false)}>
            <p>
                支持以 XLS 文件形式批量导入数据，导入文件将自动刷新素材列表。
                <span className="text-[#673ab7] cursor-pointer" onClick={handleDownLoad}>
                    下载导入文件模板
                </span>
            </p>
            {/* <div className="my-4 flex justify-center">
        <Radio.Group onChange={(e) => setRadioType(e.target.value)} value={radioType}>
            <Radio value={1}>累加数据</Radio>
            <Radio value={2}>覆盖已有数据</Radio>
        </Radio.Group>
    </div> */}
            <div className="flex justify-center mt-4">
                <div className="flex flex-col items-center">
                    <Upload {...props1}>
                        <Button type="primary">上传 ZIP</Button>
                    </Upload>
                    <div className="text-xs text-black/50 mt-2">请把下载的内容修改后，对目录打包后再上传</div>
                </div>
            </div>
            {uploadLoading && <Progress size="small" percent={percent} />}
        </Modal>
    );
};
export default DownMaterial;
