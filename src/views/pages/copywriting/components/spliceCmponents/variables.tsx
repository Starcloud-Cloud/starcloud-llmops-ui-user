import { Popover, Input } from 'antd';
import { Error } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import _ from 'lodash-es';
import { dictData } from 'api/template/index';
import VariableInput from 'views/pages/batchSmallRedBooks/components/variableInput';
interface Variable {
    pre: number;
    model: string;
    schemaList: any[];
    value: any;
    details: any;
    setValue: (data: any) => void;
}
const Variables = ({ pre, model, details, schemaList, value, setValue }: Variable) => {
    const { TextArea } = Input;
    const iptRef: any = useRef(null);
    const [demandOpen, setDemandOpen] = useState(false);
    useEffect(() => {
        if (pre > 1) {
            setDemandOpen(true);
        }
    }, [pre]);
    const [open, setOpen] = useState(false);
    const handleMenu = ({ index, newValue }: any) => {
        let newData = _.cloneDeep(value);
        newData = newValue;
        setValue(newData);
    };
    const widthRef: any = useRef(null);
    const [popoverWidth, setPopoverWidth] = useState(undefined);
    useEffect(() => {
        if (widthRef.current) {
            setPopoverWidth(widthRef.current?.offsetWidth);
        }
    }, [widthRef]);
    const [promptList, setPromptList] = useState<any[]>([]);
    useEffect(() => {
        dictData().then((res) => {
            console.log(res.list);

            setPromptList(res.list);
        });
    }, []);
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
            <div className="w-full" ref={widthRef}>
                <VariableInput
                    open={open}
                    setOpen={setOpen}
                    popoverWidth={popoverWidth}
                    handleMenu={handleMenu}
                    details={details}
                    stepCode="笔记生成"
                    index={undefined}
                    value={value}
                    row={6}
                    setValue={(value) => {
                        setDemandOpen(true);
                        setValue(value);
                    }}
                    // promptList={promptList}
                    model={model}
                />
            </div>
            {/* <TextArea
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
            )} */}
        </>
    );
};
export default Variables;
