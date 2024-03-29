import { Divider, Input, List, Popover, Tag } from 'antd';
import { Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { dictData } from 'api/template';

const ExePrompt = ({ type, changePrompt, flag }: { type: string; changePrompt: (data: any) => void; flag?: boolean }) => {
    const [currentDict, setCurrentDict] = useState<any>({});
    const [dictList, setDictList] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const [selectId, setSelectId] = useState('');
    const [open, setOpen] = useState(false);
    const [tag, setTag] = useState([]);
    const [originDictList, setOriginDictList] = useState<any[]>([]);

    useEffect(() => {
        dictData(value, type).then((res) => {
            if (!value) {
                setOriginDictList(res.list);
                const tagList = res.list.map((item: any) => item.value.split(/[,，]/));
                setTag(tagList);
            }
            setDictList(res.list);
        });
    }, [value]);

    const tags = useMemo(() => {
        // 数组去重
        const list: any = tag.flat() || [];
        let uniqueArr = list.filter((item: any, index: number) => list.indexOf(item) === index);
        return uniqueArr;
    }, [tag]);

    const handleTag = (tag: string) => {
        const list = originDictList.filter((item) => item.value.includes(tag));
        setCurrentDict({});
        setDictList(list);
    };

    return (
        <Popover
            open={open}
            trigger={'click'}
            content={
                <div className="w-[640px]">
                    <div className="flex border-b border-solid border-red-50">
                        <Input placeholder="请输入名称" onChange={(e: any) => setValue(e.target.value)} />
                    </div>
                    <Divider style={{ margin: '6px 0' }} />
                    <div className="flex flex-wrap w-full">
                        {tags.flat().map((item: any) => (
                            <Tag className="cursor-pointer mb-1" onClick={() => handleTag(item)}>
                                {item}
                            </Tag>
                        ))}
                    </div>
                    <div className="w-full flex gap-2 pt-2 h-[300px] overflow-y-auto">
                        <div className="w-[20%]">
                            {dictList?.map((item) => (
                                <div
                                    className={` ${
                                        selectId === item.id ? 'text-[#fff]' : 'text-[#2196f3]'
                                    }  border-solid cursor-pointer text-sm line-clamp-1 ${
                                        selectId === item.id ? 'bg-[#673ab7]' : ''
                                    } rounded flex justify-center mb-1`}
                                    onMouseEnter={() => {
                                        setCurrentDict(item);
                                        setSelectId(item.id);
                                    }}
                                    onClick={() => {
                                        changePrompt(item.remark);
                                        setSelectId('');
                                        setTimeout(() => {
                                            setOpen(false);
                                        }, 200);
                                    }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                        <div className="text-sm flex-1 bg-[#fafafa] rounded p-1 overflow-y-auto line-clamp-1 whitespace-pre">
                            {currentDict.remark}
                        </div>
                    </div>
                </div>
            }
        >
            <Button
                onClick={() => setOpen(true)}
                variant="contained"
                size="small"
                style={{ right: flag ? '52px' : '0.5rem' }}
                className={`absolute top-2 z-[1000]`}
                color="secondary"
            >
                示例 prompt
            </Button>
        </Popover>
    );
};
export default ExePrompt;
