import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Upload, UploadFile, UploadProps, message } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { useState } from 'react';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import './index.scss';
const { Dragger } = Upload;

export const PictureCreateContainer = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const size = useWindowSize();

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        fileList,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined rev={undefined} />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    return (
        <div className="prb_container">
            <div className="prb_container_wrapper">
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon" style={{ width: '350px' }}>
                        <InboxOutlined rev={undefined} />
                    </p>
                    <p>点击或拖拽文件上传</p>
                    <p>仅支持 .jpg/.png/.webp 格式</p>
                </Dragger>
                {/* <div className="flex flex-wrap w-full">
                    <Space>
                        <div>
                            <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                        </div>
                        <div>
                            <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                        </div>
                        <div>
                            <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                        </div>
                        <div>
                            <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                        </div>
                    </Space>
                </div> */}
            </div>
            <Modal
                open={isModalOpen}
                closable={false}
                footer={null}
                width={size.width < 768 ? '100%' : '55%'}
                onCancel={() => setIsModalOpen(false)}
                className="prb_custom_modal"
            >
                <div className="h-5/6 p-4 bg-neutral-50 rounded-md">
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        // onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                </div>
                <div className="h-1/6 flex p-4 justify-between">
                    <div>
                        <p className="font-bold">已上传 1/30 张</p>
                        <p>支持多张图片同时上传，仅支持 JPG/PNG/WEBP 格式图片</p>
                    </div>
                    <div className="flex items-center">
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>取消</Button>
                            <Button type={'primary'} style={{ background: '#673ab7' }}>
                                抠图
                            </Button>
                        </Space>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
