import { Divider, Input, List, Popover } from 'antd';
import { Tooltip, Chip, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { dictData } from 'api/template';

const ExePrompt = ({ changePrompt, flag }: { changePrompt: (data: any) => void; flag?: boolean }) => {
    const [currentDict, setCurrentDict] = useState<any>({});
    const [dictList, setDictList] = useState<any[]>([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        dictData().then((res) => {
            setDictList(res.list);
        });
    }, []);

    const handleSearch = () => {
        dictData(value).then((res) => {
            setDictList(res.list);
        });
    };

    return (
        <Popover
            trigger={'click'}
            content={
                <div>
                    <div className="flex border-b border-solid border-red-50">
                        <Input placeholder="请输入名称" onChange={(e: any) => setValue(e.target.value)} />
                        <Button className="ml-2" variant="contained" size="small" color="secondary" onClick={() => handleSearch()}>
                            搜索
                        </Button>
                    </div>
                    <Divider style={{ margin: '6px 0' }} />
                    <div className="w-[350px] flex gap-2 pt-2 h-[250px] overflow-y-auto">
                        <div className="w-[100px]">
                            <div>名称:</div>
                            {dictList?.map((item) => (
                                <div className="text-[#2196f3] border-solid cursor-pointer text-base" onClick={() => setCurrentDict(item)}>
                                    {item.label}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div>值:</div>
                            <div className="w-[250px] text-base">{currentDict.value}</div>
                        </div>
                    </div>
                    <Divider style={{ margin: '6px 0' }} />
                    <div className="flex flex-row-reverse">
                        <Button
                            disabled={Object.keys(currentDict).length === 0}
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => changePrompt(currentDict.value)}
                        >
                            确认
                        </Button>
                    </div>
                </div>
            }
        >
            <Button
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
