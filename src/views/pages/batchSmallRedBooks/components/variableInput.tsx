import { Popover, Menu, Input, Checkbox } from 'antd';
import _ from 'lodash-es';
import ExePrompt from 'views/pages/copywriting/components/spliceCmponents/exePrompt';
import { useState, useRef } from 'react';
const { SubMenu } = Menu;
const { TextArea } = Input;
const VariableInput = ({
    open,
    setOpen,
    popoverWidth,
    handleMenu,
    items,
    index = 0,
    row,
    title,
    value,
    setValue,
    styles = {},
    promptList,
    model
}: {
    open: boolean;
    setOpen: (data: boolean) => void;
    popoverWidth?: number;
    handleMenu: (data: any) => void;
    items: any[];
    index?: number;
    title?: string;
    value?: any;
    row?: number;
    setValue: (data: any) => void;
    styles?: any;
    promptList?: any[];
    model?: string;
}) => {
    const inputList: any = useRef([]);
    const [tipValue, setTipValue] = useState('');
    const setData = (data: string, flag?: boolean) => {
        let newValue = _.cloneDeep(value);
        if (!newValue) {
            newValue = '';
        }
        const part1 = newValue.slice(0, inputList?.current[index]?.resizableTextArea?.textArea?.selectionStart);
        const part2 = newValue.slice(inputList?.current[index]?.resizableTextArea?.textArea?.selectionStart);
        newValue = flag ? `${part1}{${data}}${part2}` : `${part1}{{${data}}}${part2}`;
        setOpen(false);
        handleMenu({ index, newValue });
    };
    function renderMenuItems(data: any, index: number) {
        return data.map((item: any, i: number) => {
            if (item.children && item.children.length > 0) {
                return (
                    <SubMenu title={item.label} key={item.key}>
                        {renderMenuItems(item.children, index)}
                    </SubMenu>
                );
            } else {
                return (
                    <Menu.Item
                        onClick={({ domEvent, key }: any) => {
                            console.log(domEvent?.target?.type);
                            if (domEvent?.target?.type === 'checkbox') {
                                console.log(domEvent?.target?.checked, domEvent?.target?.value, index, i);
                            } else {
                                setData(key);
                            }
                        }}
                        key={item.key}
                    >
                        <div
                            onMouseEnter={() => {
                                setTipValue(item.desc);
                            }}
                            className="w-full flex justify-between items-center"
                        >
                            <div className="flex items-center gap-1">
                                {/* <div>{item.type === '*' && <Checkbox value={item.label}></Checkbox>}</div> */}
                                <div>{item.label}</div>
                            </div>
                            <div className="text-xs text-black/50">{item.desc}</div>
                        </div>
                    </Menu.Item>
                );
            }
        });
    }
    return (
        <Popover
            trigger="click"
            arrow={false}
            placement="bottomLeft"
            open={open}
            onOpenChange={() => setOpen(false)}
            content={
                <div style={{ width: popoverWidth + 'px', maxWidth: '1024px', minWidth: '512px' }} className={'flex items-stretch gap-2'}>
                    <Menu inlineIndent={12} className="flex-1 h-[300px] overflow-y-auto" defaultSelectedKeys={[]} mode="inline">
                        {renderMenuItems(items, index)}
                    </Menu>
                    <div className="flex-1 border border-solid border-[#d9d9d9] h-[300px] rounded-lg p-4">{tipValue}</div>
                </div>
            }
        >
            <div className="flex items-stretch relative">
                <TextArea
                    style={styles}
                    rows={row || 1}
                    value={value}
                    ref={(ref) => (inputList.current[index] = ref)}
                    onChange={(e) => {
                        setValue(e.target.value);
                        e.stopPropagation();
                    }}
                    className="rounded-r-[0px]"
                    allowClear
                />
                <div
                    onClick={(e) => {
                        setOpen(true);
                        e.stopPropagation();
                    }}
                    className="w-[50px] flex justify-center items-center border border-solid border-[#d9d9d9] ml-[-4px] bg-[#f8fafc] rounded-r-[6px] cursor-pointer"
                    style={{ borderLeft: 'none' }}
                >
                    参
                </div>
                <span className="text-black block bg-[#fff] px-[5px] absolute top-[-10px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc] z-[1]">
                    {title}
                </span>
                {model === 'AI_CUSTOM' && (
                    <ExePrompt
                        type="prompt_template_user"
                        changePrompt={(data: any) => {
                            setData(data, true);
                        }}
                        flag={true}
                    />
                )}
            </div>
        </Popover>
    );
};
export default VariableInput;
