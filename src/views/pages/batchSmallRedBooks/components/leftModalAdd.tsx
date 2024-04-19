import { Modal, Button, Table } from 'antd';
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
    return (
        <Modal zIndex={9999} maskClosable={false} width={'70%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
            <div className="flex justify-end my-[20px]">
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
                rowKey={(record, index) => String(index)}
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
        </Modal>
    );
};
export default LeftModalAdd;
