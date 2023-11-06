import { useState } from 'react';
import { Button, Upload, UploadProps, Image, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
const BatcSmallRedBooks = () => {
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        showUploadList: false,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/upload`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange(info) {},
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    const [imageList, setImageList] = useState<any[]>([{}]);
    return (
        <div>
            <div className="text-[18px] font-[600] my-[20px]">1. 批量上传素材图片</div>
            <div className="flex gap-[20px]">
                <div>
                    <Upload>
                        <div className=" w-[150px] h-[150px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                            <PlusOutlined rev={undefined} />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                </div>
                {imageList.map((item: any, index: number) => (
                    <div className="relative w-[150px] h-[150px] rounded-[5px] overflow-hidden">
                        <Image className="w-[150px] h-[150px]" src="" preview={false} />
                        <div className="absolute w-[150px] h-[150px] flex justify-center items-center bg-[#000]/[0.2]">
                            <Progress type="dashboard" percent={75} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default BatcSmallRedBooks;
