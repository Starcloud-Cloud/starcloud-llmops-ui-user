import { useState } from 'react';
import { Button, Upload, UploadProps, Image, Progress, Transfer, Collapse, Radio } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import type { CollapseProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';

const BatcSmallRedBooks = () => {
    //1.批量上传图片素材
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
    //2.文案模板
    const [mockData, setMockData] = useState<any[]>([
        { key: '1', title: '文案 1', description: 'string' },
        { key: '2', title: '文案 2', description: 'string' },
        { key: '3', title: '文案 3', description: 'string' }
    ]);
    const [targetKeys, setTargetKeys] = useState<any[]>(['2']);
    const [selectedKeys, setSelectedKeys] = useState<any[]>(['1']);

    const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
        console.log('targetKeys:', nextTargetKeys);
        console.log('direction:', direction);
        console.log('moveKeys:', moveKeys);
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        console.log('sourceSelectedKeys:', sourceSelectedKeys);
        console.log('targetSelectedKeys:', targetSelectedKeys);
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };
    const onScroll = (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };
    //3.图片模板
    const [imageTem, setImageTem] = useState<any[]>([
        {
            key: '1',
            label: 'This is panel header 1',
            children: <p>模板 1</p>
        },
        {
            key: '2',
            label: 'This is panel header 2',
            children: <p>模板 2</p>
        },
        {
            key: '3',
            label: 'This is panel header 3',
            children: <p>模板 3</p>
        }
    ]);
    const addStyle = () => {};
    //4.生成参数
    const [radioValue, setRadioValue] = useState('');
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
                    <div key={index} className="relative w-[150px] h-[150px] rounded-[5px] overflow-hidden">
                        <Image className="w-[150px] h-[150px]" src="" preview={false} />
                        <div className="absolute w-[150px] h-[150px] top-0 flex justify-center items-center bg-[#000]/[0.1]">
                            <Progress type="dashboard" percent={75} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-[18px] font-[600] my-[20px]">2. 文案模板</div>
            <Transfer
                dataSource={mockData}
                titles={['精选文案', '已选择的文案']}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                onScroll={onScroll}
                render={(item) => item.title}
            />
            <div className="text-[18px] font-[600] my-[20px]">3. 图片模板</div>
            <div className="mb-[20px]">
                <Button onClick={addStyle} icon={<PlusOutlined rev={undefined} />}>
                    增加风格
                </Button>
            </div>
            <Collapse accordion items={imageTem} />
            <div className="text-[18px] font-[600] my-[20px]">4. 生成随机参数</div>
            <Radio.Group value={radioValue} onChange={(e: RadioChangeEvent) => setRadioValue(e.target.value)}>
                <Radio value="a">全部随机</Radio>
                <Radio value="b">按顺序</Radio>
            </Radio.Group>
            <div className="mt-[20px] flex justify-center items-center">
                <Button type="primary" className="w-[300px]">
                    保存
                </Button>
            </div>
        </div>
    );
};
export default BatcSmallRedBooks;
