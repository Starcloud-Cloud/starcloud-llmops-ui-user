import { Popover, Menu, Input, Checkbox, Button } from 'antd';
import _ from 'lodash-es';
import ExePrompt from 'views/pages/copywriting/components/spliceCmponents/exePrompt';
import { useState, useRef, useEffect } from 'react';
import { schemeOptions } from 'api/redBook/copywriting';
const { SubMenu } = Menu;
const { TextArea } = Input;
const VariableInput = ({
    open,
    setOpen,
    popoverWidth,
    handleMenu,
    index = 0,
    row,
    title,
    value,
    setValue,
    styles = {},
    model,
    appUid,
    stepCode = '图片生成'
}: {
    open: boolean;
    setOpen: (data: boolean) => void;
    popoverWidth?: number;
    handleMenu: (data: any) => void;
    index?: number;
    title?: string;
    value?: any;
    row?: number;
    setValue: (data: any) => void;
    styles?: any;
    model?: string;
    appUid: string;
    stepCode?: string;
}) => {
    const inputList: any = useRef([]);
    const tipRef = useRef<any>('');
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
    const [schemaList, setSchemaList] = useState<any[]>([]);
    function getjsonschma(json: any, name?: string, jsonType?: string) {
        const arr: any = [];
        const arrList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        for (const key in json.properties) {
            const property = json.properties[key];
            if (property.type === 'object') {
                const convertedProperty = getjsonschma(property, name);
                arr.push(convertedProperty);
            } else if (property.type === 'array') {
                arr.push(
                    {
                        key: key + 'index',
                        label: key + '[*]',
                        title: property?.title,
                        desc: '元素集合',
                        children: [
                            ...arrList.map((item: number, index: number) => ({
                                key: `${key}[${index}]`,
                                label: `${key}[${index}]`,
                                title: property?.title,
                                desc: `第 ${index} 个元素`,
                                children: getjsonschma(property?.items, `${name}.${key}[${index}]`)
                            }))
                        ]
                    },
                    {
                        key: name + '.' + key,
                        label: `${key}.list.(*)`,
                        title: property?.title,
                        desc: '元素内容集合',
                        type: '*',
                        children: getjsonschma(property?.items, `${name}.${key}`, '*')
                    }
                );
            } else {
                arr.push({
                    key: jsonType ? name + `.list('${key}')` : name + '.' + key,
                    label: key,
                    title: property?.title,
                    desc: property?.description,
                    type: jsonType
                });
            }
        }
        return arr;
    }
    //复选框
    const variableRef = useRef<any[]>([]);
    const [varableOpen, setVarableOpen] = useState<any[]>([]);
    const [variableList, setVariableList] = useState<any>([]);
    function renderMenuItems(data: any, index: number) {
        return data.map((item: any, i: number) => {
            if (item.children && item.children.length > 0) {
                return (
                    <SubMenu
                        className="relative"
                        title={
                            <div className="flex justify-between items-center">
                                <div id={item.key + i} className="flex gap-1 w-full items-center">
                                    <div>{item.label}</div>
                                    {item?.type === '*' && variableList?.length > 0 && (
                                        <Button
                                            onClick={(e) => {
                                                setData(
                                                    item.key + '.list(' + variableList.map((item: any) => `'${item}'`).join(', ') + ')'
                                                );
                                                setVarableOpen([]);
                                                setOpen(false);
                                                variableRef.current = [];
                                                setVariableList(variableRef.current);
                                                e.stopPropagation();
                                            }}
                                            size="small"
                                            type="primary"
                                        >
                                            插入变量
                                        </Button>
                                    )}
                                </div>
                                <div className="text-xs text-black/50">{item.desc}</div>
                                <div
                                    className="absolute w-full h-full left-0"
                                    onMouseEnter={() => {
                                        if (item.type === '*') {
                                            tipRef.current = `${item.desc}\n会把集合中相同字段的内容显示在一起，可选择多个字段`;
                                            setTipValue(tipRef.current);
                                            return;
                                        }
                                        tipRef.current = item.desc;
                                        setTipValue(tipRef.current);
                                    }}
                                ></div>
                            </div>
                        }
                        key={item.key}
                    >
                        {renderMenuItems(item.children, index)}
                    </SubMenu>
                );
            } else {
                return (
                    <Menu.Item
                        onClick={({ domEvent, key }: any) => {
                            if (domEvent?.target?.type === 'checkbox') {
                                if (domEvent?.target?.checked) {
                                    variableRef.current?.push(domEvent?.target?.value);
                                    setVariableList(variableRef.current);
                                    const newList = _.cloneDeep(varableOpen);
                                    newList[i] = true;
                                    setVarableOpen(newList);
                                } else {
                                    const length = variableRef.current?.findIndex((v) => v === domEvent?.target?.value);
                                    variableRef.current?.splice(length, 1);
                                    setVariableList(variableRef.current);
                                    const newList = _.cloneDeep(varableOpen);
                                    newList[i] = false;
                                    setVarableOpen(newList);
                                }
                            } else {
                                setData(key);
                            }
                        }}
                        key={item.key}
                    >
                        <div
                            onMouseEnter={() => {
                                tipRef.current = item.desc;
                                setTipValue(tipRef.current);
                            }}
                            className="w-full flex justify-between items-center"
                        >
                            <div className="flex items-center gap-1">
                                <div>{item.type === '*' && <Checkbox checked={varableOpen[i]} value={item.label}></Checkbox>}</div>
                                <div>{item.label}</div>
                            </div>
                            <div className="text-xs text-black/50">{item.desc}</div>
                        </div>
                    </Menu.Item>
                );
            }
        });
    }
    const getJSON = (item: any) => {
        let obj: any = {};
        try {
            obj = {
                ...JSON.parse(item.inJsonSchema),
                properties: {
                    ...JSON.parse(item.inJsonSchema).properties,
                    ...JSON.parse(item.outJsonSchema)
                }
            };
        } catch (err) {
            obj = {};
        }
        return obj;
    };
    useEffect(() => {
        schemeOptions({ appUid, stepCode }).then((res) => {
            const newList = res
                ?.filter((item: any) => item.inJsonSchema || item.outJsonSchema)
                ?.map((item: any) => {
                    return {
                        label: item.name,
                        key: item.code,
                        description: item.description,
                        children: item.inJsonSchema
                            ? getjsonschma(getJSON(item), item.name)
                            : item.outJsonSchema
                            ? getjsonschma(JSON.parse(item.outJsonSchema), item.name)
                            : []
                    };
                });
            setSchemaList(newList);
        });
    }, []);
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
                        {renderMenuItems(schemaList, index)}
                    </Menu>
                    <div className="flex-1 border border-solid border-[#d9d9d9] h-[300px] rounded-lg p-4 whitespace-pre-wrap">
                        {tipValue}
                    </div>
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
