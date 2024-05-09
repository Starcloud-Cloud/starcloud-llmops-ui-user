import { Modal, Button, Table, Radio, Input, Switch } from 'antd';
import { useState } from 'react';
const LeftModalAdd = ({
    zoomOpen,
    setZoomOpen,
    tableLoading,
    columns,
    tableData,
    setTitle,
    setEditOpen,
    setPage
}: {
    zoomOpen: boolean;
    setZoomOpen: (data: boolean) => void;
    tableLoading: boolean;
    columns: any[];
    tableData: any[];
    setTitle: (data: string) => void;
    setEditOpen: (data: boolean) => void;
    setPage: (data: any) => void;
}) => {
    const { TextArea } = Input;
    const [open, setOpen] = useState(false);
    return (
        <Modal maskClosable={false} width={'70%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
            <div className="flex gap-2 justify-end my-[20px]">
                <Button type="primary" onClick={() => setOpen(true)}>
                    AI 字段生成
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        setTitle('新增');
                        setEditOpen(true);
                    }}
                >
                    新增
                </Button>
            </div>
            <Table
                scroll={{ y: 500 }}
                rowKey={(record, index) => {
                    return String(index);
                }}
                pagination={{
                    onChange: (page) => {
                        setPage(page);
                    }
                }}
                loading={tableLoading}
                size="small"
                virtual
                columns={columns}
                dataSource={tableData}
            />
            <Modal maskClosable={false} width={'60%'} open={open} footer={null} onCancel={() => setOpen(false)}>
                <div className="text-[16px] font-bold mb-4">1.选择需要 AI 补齐的字段</div>
                <Radio.Group defaultValue="c" buttonStyle="solid">
                    {columns?.map((item) => (
                        <Radio.Button key={item.title} value={item.title}>
                            {item.title}
                        </Radio.Button>
                    ))}
                </Radio.Group>
                <div className="text-[16px] font-bold my-4">2.告诉 AI 如何生成这些字段内容</div>
                <TextArea />
                <div className="text-[16px] font-bold my-4">3.如何处理素材</div>
                <div className="flex gap-2 items-center text-xs text-black/50">
                    <Switch />
                    <span>字段为空时生成</span>
                </div>
                <div className="flex justify-center gap-6 mt-6">
                    <Button type="primary">处理一条素材</Button>
                    <Button type="primary">处理全部素材</Button>
                </div>
            </Modal>
        </Modal>
    );
};
export default LeftModalAdd;
