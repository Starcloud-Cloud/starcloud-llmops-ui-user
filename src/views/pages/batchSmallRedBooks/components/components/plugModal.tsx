import { Modal, Tag, Space, Popover, Input, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
const PlugModal = ({ handleWchat }: { handleWchat: (data: any) => void }) => {
    const { TextArea } = Input;
    const [valueOpen, setValueOpen] = useState(false);
    const [value, setValue] = useState('');
    const handleExe = async () => {
        if (!value) {
            setValueOpen(true);
            return false;
        }
        handleWchat(value?.split(/[,\n\r，]+/).filter(Boolean));
    };
    return (
        <div>
            <div className="flex justify-between items-center">
                <Space>
                    <Tag color="processing">使用场景</Tag>
                    <Tag color="processing">实现方式</Tag>
                </Space>
                <Popover
                    content={
                        <Space direction={'vertical'}>
                            <Space>
                                <div>使用场景：</div>
                                <div>素材新增</div>
                            </Space>
                            <Space>
                                <div>实现方式：</div>
                                <div> coze api</div>
                            </Space>
                            <Space>
                                <div>coze bot：</div>
                                <div>微信公众号分析</div>
                            </Space>
                            <Space>
                                <div>参数配置：</div>
                                <div>配置</div>
                            </Space>
                            <Space>
                                <div>创建时间：</div>
                                <div> 2021-10-10 12:13:00</div>
                            </Space>
                        </Space>
                    }
                >
                    <InfoCircleOutlined className="cursor-pointer" />
                </Popover>
            </div>
            <div className="text-xs text-black/50 mt-4">我是描述</div>
            <div className="text-[16px] font-bold my-4">1.输入需要抓取的小红书链接，最大支持 20 个</div>
            <TextArea
                value={value}
                placeholder="使用逗号或者回车来分割链接"
                className="flex-1"
                status={!value && valueOpen ? 'error' : ''}
                onChange={(e) => {
                    setValueOpen(true);
                    setValue(e.target.value);
                }}
                rows={10}
            />
            {!value && valueOpen && <span className="ml-4px text-xs text-[#ff4d4f]"> 小红书链接字段内容必填</span>}
            <div className="flex mt-4 justify-center">
                <Button type="primary" onClick={handleExe}>
                    执行
                </Button>
            </div>
        </div>
    );
};
export default PlugModal;
