import { Modal } from 'antd';
const PlugMarket = ({ open, setOpen }: { open: boolean; setOpen: (data: any) => void }) => {
    return (
        <Modal width={800} open={open} onCancel={() => setOpen(false)}>
            <div className="font-bold text-xl mb-8">插件市场</div>
            <div className="font-bold text-base mb-4">素材获取</div>
            <div className="flex gap-2 items-center flex-wrap"></div>
        </Modal>
    );
};
export default PlugMarket;
