import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

export const Arrow = ({ isDesc }: { isDesc: boolean }) => {
    return isDesc ? <ArrowDownOutlined className="text-[#673ab7]" /> : <ArrowUpOutlined className="text-[#673ab7]" />;
};
