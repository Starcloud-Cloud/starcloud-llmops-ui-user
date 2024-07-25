import { Modal, Steps } from 'antd';
const UploadMaterial = ({ open, setOpen }: { open: boolean; setOpen: (data: boolean) => void }) => {
    <Modal width={'80%'} title="上传素材字段" open={open} onCancel={() => setOpen}>
        <Steps
            size="small"
            current={1}
            items={[
                {
                    title: '上传'
                },
                {
                    title: '表结构配置'
                },
                {
                    title: '预览'
                }
            ]}
        />
    </Modal>;
};
export default UploadMaterial;
