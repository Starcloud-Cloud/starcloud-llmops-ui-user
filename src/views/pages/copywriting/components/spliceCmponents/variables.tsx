import { Popover, Input } from 'antd';
import { Error } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash-es';
interface Variable {
    pre: number;
    model: string;
    value: any;
    setValue: (data: any) => void;
}
const Variables = ({ pre, model, value, setValue }: Variable) => {
    const { TextArea } = Input;
    const iptRef: any = useRef(null);
    const [demandOpen, setDemandOpen] = useState(false);
    useEffect(() => {
        if (pre > 1) {
            setDemandOpen(true);
        }
    }, [pre]);
    return (
        <>
            <div className="mt-[20px] mb-[10px] text-[14px] font-[600] flex items-end">
                文案生成要求
                <span className="text-[12px] text-[#15273799]">（对生成的文案内容就行自定义要求，直接告诉AI你想怎么改文案）</span>
                <Popover
                    placement="top"
                    title="可以这样提要求"
                    content={
                        <div>
                            <div>把品牌替换为 "xxxxxx"</div>
                            <div>把价格替换为 "20-50元"</div>
                            <div>使用更夸张的表达方式</div>
                        </div>
                    }
                >
                    <Error sx={{ cursor: 'pointer', fontSize: '16px' }} fontSize="small" />
                </Popover>
            </div>
            <TextArea
                status={demandOpen && !value && model === 'AI_CUSTOM' ? 'error' : ''}
                ref={iptRef}
                style={{ height: '200px' }}
                value={value}
                onChange={(e) => {
                    setDemandOpen(true);
                    setValue(e.target.value);
                }}
            />
            {demandOpen && !value && model === 'AI_CUSTOM' && (
                <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">文案生成要求必填</span>
            )}
        </>
    );
};
export default Variables;
