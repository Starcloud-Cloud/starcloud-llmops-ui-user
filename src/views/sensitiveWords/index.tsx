import { Input, Button, Card, Divider, Tag, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { riskword, riskReplace } from 'api/redBook/index';
import copy from 'clipboard-copy';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import './index.scss';
const SensitiveWords = ({ wordsOpen, wordsValues }: { wordsOpen?: boolean; wordsValues?: string }) => {
    //敏感词监测
    const [wordsLoading, setWordsLoading] = useState(false);
    const [wordsValue, setWordsValue] = useState('');
    const [newWordsRes, setNewWordsRes] = useState<any>(undefined);
    const handleRiskword = async () => {
        setWordsLoading(true);
        try {
            const result = await riskword({
                content: wordsValue
            });
            setNewWordsRes(result);
            setWordsLoading(false);
        } catch (err) {
            setWordsLoading(false);
        }
    };
    const editWords = async ({ key: processManner }: any) => {
        const { resContent, topRiskStr, lowRiskStr } = newWordsRes;
        const result = await riskReplace({
            resContent,
            topRiskStr,
            lowRiskStr,
            processManner
        });
        setNewWordsRes({
            ...newWordsRes,
            resContent: result.replaceContent
        });
    };
    useEffect(() => {
        if (!wordsOpen) {
            setWordsValue('');
            setNewWordsRes(undefined);
        }
    }, [wordsOpen]);
    useEffect(() => {
        if (wordsValues) {
            setWordsValue(wordsValues);
        }
    }, [wordsValues]);

    const items: MenuProps['items'] = [
        {
            key: 'riskPinyin',
            label: '违禁词转拼音'
        },
        {
            key: 'topPinyin',
            label: '禁用词转拼音'
        },
        {
            key: 'lowPinyin',
            label: '敏感词转拼音'
        },
        {
            key: 'riskEmpty',
            label: '删除违禁词'
        },
        {
            key: 'topEmpty',
            label: '删除禁用词'
        },
        {
            key: 'lowEmpty',
            label: '删除敏感词'
        }
    ];
    return (
        <div className="bg-white h-full p-4">
            <div className="text-lg font-[600] mb-6">违禁词检测</div>
            <div className="w-full flex justify-between items-stretch gap-2 h-[452px]">
                <div className="flex-1">
                    <Input.TextArea
                        value={wordsValue}
                        onChange={(e) => setWordsValue(e.target.value)}
                        rows={16}
                        className="text-base whitespace-pre-wrap"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <Button onClick={() => setWordsValue('')}>清空内容</Button>
                        <Button loading={wordsLoading} onClick={handleRiskword} icon={<SearchOutlined />} type="primary">
                            开始检测
                        </Button>
                    </div>
                </div>
                <div className="w-[1px] bg-[#d9d9d9]"></div>
                <div className="flex-1">
                    <div className="relative h-[calc(100%-40px)]">
                        <div
                            dangerouslySetInnerHTML={{ __html: newWordsRes?.resContent }}
                            className="w-full border border-solid border-[#d9d9d9] rounded-lg h-full whitespace-pre-wrap text-base overflow-y-auto px-[11px] py-1"
                        />
                        {newWordsRes?.riskList && newWordsRes?.riskList?.length === 0 && (
                            <div className=" absolute bottom-0 w-full bg-[#5bc2591a] text-[#5bc259] py-4 text-sm flex items-center gap-2 px-4">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="7332"
                                    width="16"
                                    height="16"
                                >
                                    <path
                                        d="M512 0C228.430769 0 0 228.430769 0 512s228.430769 512 512 512 512-228.430769 512-512S795.569231 0 512 0z m256 413.538462l-271.753846 271.753846c-7.876923 7.876923-19.692308 11.815385-31.507692 11.815384-11.815385 0-23.630769-3.938462-31.507693-11.815384l-169.353846-169.353846c-15.753846-15.753846-15.753846-47.261538 0-63.015385 15.753846-15.753846 47.261538-15.753846 63.015385 0l137.846154 137.846154 240.246153-240.246154c15.753846-15.753846 47.261538-15.753846 63.015385 0 19.692308 15.753846 19.692308 47.261538 0 63.015385z"
                                        fill="#5bc259"
                                        p-id="7333"
                                    ></path>
                                </svg>
                                恭喜 , 您的文案中没有检测出违禁词
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                        <Dropdown menu={{ items, onClick: editWords }}>
                            <Button icon={<DownOutlined />}>编辑违禁词</Button>
                        </Dropdown>
                        <Button
                            disabled={!newWordsRes?.resContent}
                            onClick={() => {
                                copy(
                                    newWordsRes?.resContent
                                        ?.replace(/<span class="(jwy-lowRisk|jwy-topRisk)">([\s\S]*?)<\/span>/g, '$2')
                                        ?.replace(/<span class="(jwy-lowRisk|jwy-topRisk)">([\s\S]*?)<\/span>/g, '$2')
                                );
                                dispatch(
                                    openSnackbar({
                                        open: true,
                                        message: '复制成功',
                                        variant: 'alert',
                                        alert: {
                                            color: 'success'
                                        },
                                        close: false,
                                        anchorOrigin: { vertical: 'top', horizontal: 'center' }
                                    })
                                );
                            }}
                            type="primary"
                        >
                            复制内容
                        </Button>
                    </div>
                </div>
            </div>
            {newWordsRes?.riskList && newWordsRes?.riskList?.length > 0 && (
                <Card className="mt-6" size="small" title="检测报告">
                    <div className="text-sm text-[#e92424] font-[400] mt-4">禁用词，不得使用：{newWordsRes?.topRiskStr}</div>
                    <div className="text-sm text-[#ff7800] font-[400]">敏感词，谨慎使用：{newWordsRes?.lowRiskStr}</div>
                    <Divider className="my-2" />
                    <div>
                        {newWordsRes?.riskList?.map((item: any) => (
                            <>
                                <div className="flex items-center gap-8 text-[#999] font-[500] mt-4">
                                    <div>
                                        <Tag color={item?.type === '禁用词' ? 'error' : 'warning'}>{item?.type}</Tag>
                                        <span className="text-[#333]">{item.title}</span>
                                    </div>
                                    <div>
                                        <span>来源：</span>
                                        <span>{item?.sourse}</span>
                                    </div>
                                    <div className="flex-1">
                                        <span>解释：</span>
                                        <span>{item?.reason}</span>
                                    </div>
                                </div>
                                <Divider className="my-2" />
                            </>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};
export default SensitiveWords;
