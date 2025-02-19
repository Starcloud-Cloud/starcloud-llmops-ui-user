import { Popover, Menu, Checkbox, Button, Tooltip } from 'antd';
import { useLocation } from 'react-router-dom';
import _ from 'lodash-es';
import { useState, useRef, useEffect, useMemo } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { schemeOptions } from 'api/redBook/copywriting';
import image from 'assets/images/icons/image.svg';
import string from 'assets/images/icons/string.svg';
import textBox from 'assets/images/icons/textBox.svg';
import number from 'assets/images/icons/nu.svg';
const { SubMenu } = Menu;

export function getjsonschma(json: any, name?: string, jsonType?: string) {
    const arr: any = [];
    const arrList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const key in json.properties) {
        const property = json.properties[key];
        if (property.type === 'object') {
            if (property?.properties) {
                arr.push({
                    key: jsonType ? name + `.list('${key}')` : name + '.' + key,
                    label: key,
                    title: property?.title,
                    desc: property?.description,
                    children: getjsonschma(property, name + '.' + key, jsonType)
                });
            } else {
                const convertedProperty = getjsonschma(property, name, jsonType);
                arr.push(convertedProperty);
            }
        } else if (property.type === 'array' && property?.items?.type === 'object') {
            arr.push({
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
            });
            arr.push({
                key: name + '.' + key,
                label: `${key}.list.(*)`,
                title: property?.title,
                desc: '元素内容集合',
                type: '*',
                children: getjsonschma(property?.items, `${name}.${key}`, '*')
            });
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
export const getJSON = (item: any) => {
    let obj: any = {};
    try {
        obj = {
            ...JSON.parse(item.inJsonSchema),
            properties: {
                ...JSON.parse(item.inJsonSchema).properties,
                ...(item.code === '基础信息' || !item.outJsonSchema ? {} : JSON.parse(item.outJsonSchema).properties)
            }
        };
    } catch (err) {
        console.log(err);

        obj = {};
    }
    return obj;
};
const Can = ({
    open,
    setOpen,
    setData,
    index = 0,
    details,
    stepCode
}: {
    open: boolean;
    setOpen: (data: boolean) => void;
    setData: (data: any) => void;
    index?: number;
    details: any;
    stepCode: string;
}) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appUid = searchParams.get('appUid');
    const planUid = searchParams.get('uid');
    const inputList: any = useRef([]);
    const tipRef = useRef<any>('');
    const [tipValue, setTipValue] = useState('');
    const newDeatil = useMemo(() => {
        const newList = _.cloneDeep(details);
        newList?.workflowConfig?.steps?.forEach((item: any) => {
            item?.variable?.variables?.forEach((el: any) => {
                if (typeof el.value === 'object') {
                    el.value = JSON.stringify(el.value);
                }
            });
            item?.flowStep.variable?.variables?.forEach((el: any) => {
                if (typeof el.value === 'object') {
                    el.value = JSON.stringify(el.value);
                }
            });
        });
        return newList;
    }, [details]);
    const [schemaList, setSchemaList] = useState<any[]>([]);

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
                                            className="z-[1000]"
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
                        icon={
                            item?.desc?.split('_')[1] === 'ext' ? (
                                <svg
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="9623"
                                    width="15"
                                    height="15"
                                >
                                    <path
                                        d="M640.189 960.294l-0.131-64 254.651-0.522 1.285-255.968 64 0.322-1.605 319.515-318.2 0.653z m-256.239-0.075l-318.197-1.237 0.251-319.042 64 0.051-0.201 255.239 254.396 0.989-0.249 64zM66.004 383.837L65.53 64.399l318.728 1.829-0.367 63.999-254.265-1.459 0.378 254.975-64 0.094zM897.495 383l-0.661-252.989-254.683 0.217-0.055-64 318.569-0.271 0.829 316.876-63.999 0.167zM404.866 510.522c0 24.75-5.328 46.895-15.984 66.43-10.656 19.537-25.553 34.719-44.688 45.547-19.137 10.828-40.562 16.242-64.281 16.242-23.146 0-44.201-5.242-63.164-15.727-18.965-10.484-33.717-25.207-44.258-44.172-10.543-18.963-15.812-40.418-15.812-64.367 0-25.093 5.328-47.665 15.984-67.718 10.656-20.05 25.609-35.549 44.859-46.492 19.25-10.941 41.135-16.414 65.656-16.414 23.604 0 44.714 5.242 63.336 15.727 18.619 10.484 33 25.438 43.141 44.859s15.211 41.451 15.211 66.085z m-78.719 2.062c0-20.281-3.896-36.265-11.688-47.953-7.793-11.688-18.45-17.531-31.969-17.531-14.781 0-26.297 5.615-34.547 16.844-8.25 11.231-12.375 27.1-12.375 47.609 0 20.053 4.096 35.693 12.289 46.922 8.191 11.23 19.336 16.844 33.43 16.844 8.594 0 16.328-2.52 23.203-7.562 6.875-5.041 12.203-12.26 15.984-21.656 3.782-9.396 5.673-20.566 5.673-33.517zM623.147 627.741c-20.396 7.332-43.943 11-70.641 11-26.24 0-48.872-5.012-67.891-15.039-19.021-10.025-33.545-24.291-43.57-42.797-10.028-18.504-15.039-39.846-15.039-64.023 0-26.009 5.613-49.156 16.844-69.437 11.229-20.281 27.097-35.949 47.609-47.008 20.51-11.057 44.114-16.586 70.813-16.586 21.312 0 41.938 2.578 61.875 7.734v68.578c-6.875-4.125-15.068-7.332-24.578-9.625a122.892 122.892 0 0 0-28.875-3.438c-20.168 0-36.066 5.787-47.695 17.359-11.631 11.575-17.446 27.271-17.446 47.093 0 19.709 5.814 35.264 17.446 46.664 11.629 11.402 27.184 17.102 46.664 17.102 17.988 0 36.15-4.582 54.484-13.75v66.173zM789.351 634.444l-18.391-53.109c-3.553-10.426-8.164-18.619-13.836-24.578-5.672-5.957-11.832-8.938-18.477-8.938h-2.922v86.625h-74.25V387.975h98.656c34.488 0 59.955 5.645 76.398 16.93 16.441 11.287 24.664 28.217 24.664 50.789 0 16.959-4.785 31.168-14.352 42.625-9.568 11.458-23.805 19.765-42.711 24.921v0.688c10.426 3.209 19.105 8.422 26.039 15.641 6.932 7.219 13.148 17.934 18.648 32.141l24.234 62.734h-83.7z m-7.047-168.265c0-8.25-2.521-14.781-7.562-19.594-5.043-4.812-12.949-7.219-23.719-7.219h-15.297v56.375h13.406c9.969 0 17.988-2.807 24.062-8.422 6.073-5.613 9.11-12.659 9.11-21.14z"
                                        p-id="9624"
                                    ></path>
                                </svg>
                            ) : (
                                ''
                            )
                        }
                        key={item.key}
                    >
                        {renderMenuItems(item.children, index)}
                    </SubMenu>
                );
            } else if (!item.children) {
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
                        icon={
                            item.desc?.split('-')[1] ? (
                                <img
                                    className="w-[15px]"
                                    src={
                                        item.desc?.split('-')[1] === '5' || item.desc?.split('-')[1] === 'image'
                                            ? image
                                            : item.desc?.split('-')[1] === '0'
                                            ? string
                                            : item.desc?.split('-')[1] === 'textBox'
                                            ? textBox
                                            : number
                                    }
                                    alt=""
                                />
                            ) : (
                                <img className="w-[15px]" src={string} alt="" />
                            )
                        }
                        key={item.key}
                    >
                        <div
                            onMouseEnter={() => {
                                tipRef.current = item.title;
                                setTipValue(tipRef.current);
                            }}
                            className="w-full flex justify-between items-center"
                        >
                            <div className="flex gap-1 items-center">
                                <div className="flex items-center gap-1">
                                    <div>{item.type === '*' && <Checkbox checked={varableOpen[i]} value={item.label}></Checkbox>}</div>
                                    <div>{item.label}</div>
                                </div>
                            </div>
                            <div className="text-xs text-black/50">{item.title}</div>
                        </div>
                    </Menu.Item>
                );
            }
        });
    }
    useEffect(() => {
        if (open) {
            schemeOptions({ stepCode, appReqVO: newDeatil, source: appUid ? 'MARKET' : 'APP', planUid: appUid ? planUid : undefined }).then(
                (res) => {
                    const newList = res
                        ?.filter((item: any) => item.inJsonSchema || item.outJsonSchema)
                        ?.map((item: any) => ({
                            label: item.name,
                            key: item.code,
                            description: item.description,
                            children: item.inJsonSchema
                                ? getjsonschma(getJSON(item), item.name)
                                : item.outJsonSchema
                                ? getjsonschma(JSON.parse(item.outJsonSchema), item.name)
                                : []
                        }))
                        ?.filter((item: any) => item?.children?.length > 0);

                    setSchemaList(newList);
                }
            );
        }
    }, [open]);
    return (
        <Popover
            trigger="click"
            arrow={false}
            placement="bottom"
            open={open}
            onOpenChange={() => setOpen(false)}
            content={
                <div className={'w-[600px] flex items-stretch gap-2'}>
                    <div className="flex flex-col flex-1 h-[310px]">
                        <span className="text-sm text-gray-500 mb-2">
                            <span className="mr-2">变量选择</span>
                            <Tooltip title={'可选择上游步骤支持的变量，执行时会自动替换为具体的值'} style={{ zIndex: 1002 }}>
                                <ExclamationCircleOutlined />
                            </Tooltip>
                        </span>
                        <Menu inlineIndent={12} className="flex-1 h-[300px] overflow-y-auto" defaultSelectedKeys={[]} mode="inline">
                            {renderMenuItems(schemaList, index)}
                        </Menu>
                    </div>
                    <div className="flex-1 h-[310px] w-full border border-solid border-[#d9d9d9] rounded-lg p-4 whitespace-pre-wrap">
                        {tipValue}
                    </div>
                </div>
            }
        >
            <div
                onClick={(e) => {
                    setOpen(true);
                }}
                className="w-[25px] h-[25px] rounded-md bg-[#e7b8ff33] text-xs text-[#673ab7] text-center leading-[25px] cursor-pointer"
            >
                参
            </div>
        </Popover>
    );
};
export default Can;
