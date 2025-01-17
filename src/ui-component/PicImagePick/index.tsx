import { Modal, Input, Image, Checkbox, Select, Space, Popover, InputNumber, Button, Tag, Empty, Spin, Progress, message } from 'antd';
import { imageSearch } from 'api/redBook/imageSearch';
import { appModify } from 'api/template';
import axios from 'axios';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { getAccessToken } from 'utils/auth';
import { planModifyConfig } from 'api/redBook/batchIndex';
import _ from 'lodash';
import { templateUpdate } from 'api/redBook/material';
import { origin_url } from 'utils/axios/config';

const { Search } = Input;
const { Option } = Select;

export const PicImagePick = ({
    isrery,
    getList,
    materialList,
    allData,
    details,
    libraryId,
    isModalOpen,
    setIsModalOpen,
    setSelectImg,
    columns,
    values,
    pluginConfig
}: {
    isrery?: boolean;
    getList?: any;
    materialList?: any;
    allData?: any;
    details?: any;
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    setSelectImg: (selectImg: any) => void;
    columns?: any[];
    values?: any;
    pluginConfig?: string;
    libraryId?: string | null;
}) => {
    const [hits, setHits] = useState<any[]>([]);
    const [totalHits, setTotalHits] = useState(0);
    const [checkItem, setCheckItem] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [q, setQ] = useState('');
    const [size, setSize] = useState<any>({});
    const [query, setQuery] = useState<any>({});
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [submitLoading, setSubmitLoading] = React.useState(false);
    const [percent, setPercent] = React.useState({
        label: '图片下载中',
        value: 0
    });
    const [canSearch, setCanSearch] = React.useState(false);

    const scrollRef = React.useRef(null);
    const totalHitsRef = React.useRef(totalHits);
    const currentPageRef = React.useRef(currentPage);

    useEffect(() => {
        totalHitsRef.current = totalHits;
    }, [totalHits]);

    // 每次 currentPage 更新时同步更新 ref
    useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

    // 回显
    useEffect(() => {
        if (pluginConfig) {
            const jsonPluginConfig = JSON.parse(pluginConfig);
            const picImagePickQuery = jsonPluginConfig.picImagePickQuery;
            setQuery(picImagePickQuery?.query || {});
            setSize(picImagePickQuery?.size || {});
        }
    }, [pluginConfig]);

    const handleScroll = useCallback(
        debounce(() => {
            const element: any = scrollRef.current;
            if (element) {
                if (element.scrollTop + element.clientHeight >= element.scrollHeight - 20) {
                    const nextPage = currentPageRef.current + 1;
                    if (nextPage <= Math.ceil(totalHitsRef.current / 40)) {
                        setCanSearch(true);
                        setCurrentPage(nextPage);
                    }
                }
            }
        }, 100),
        []
    );

    useEffect(() => {
        const element: any = scrollRef.current;
        element.addEventListener('scroll', handleScroll);
        return () => {
            element.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const handleOk = async () => {
        if (!checkItem?.largeImageURL) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '请选择图片',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            return;
        }
        setPercent({
            label: '图片下载中',
            value: 0
        });
        let imageBlob;
        try {
            setSubmitLoading(true);
            const response = await axios.get(checkItem.largeImageURL, { responseType: 'blob' });
            imageBlob = response.data;
        } catch (error) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '图片获取失败',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            setSubmitLoading(false);
        }
        setPercent({
            label: '图片上传中',
            value: 33
        });

        // Step 2: 创建FormData对象
        const formData = new FormData();
        formData.append('image', imageBlob, 'image.png'); // 'file' 是服务器端接收图片的字段名，'downloaded-image.jpg' 是文件名

        setPercent({
            label: '图片上传到云端',
            value: 66
        });
        // Step 3: 上传到服务器
        const uploadResponse = await axios.post(`${origin_url}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`, formData, {
            headers: {
                Authorization: 'Bearer ' + getAccessToken()
            }
        });

        const url = uploadResponse.data.data.url;

        setSelectImg({ ...checkItem, largeImageURL: url });
        handleCancel();

        setTimeout(() => {
            setPercent({
                label: '图片插入成功',
                value: 100
            });
        }, 1000);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setQ('');
        setCurrentPage(1);
        setHits([]);
        setTotalHits(0);
    };
    useEffect(() => {
        const fetchData = debounce(() => {
            if (canSearch) {
                setLoading(true);
                imageSearch(
                    q ? { q, page: currentPage, per_page: 40, lang: 'zh', ...query } : { page: currentPage, per_page: 40, ...query }
                )
                    .then((res) => {
                        const { totalHits, hits: newData } = res;
                        setHits([...hits, ...newData]);
                        setTotalHits(totalHits);
                    })
                    .finally(() => {
                        setLoading(false);
                        setCanSearch(false);
                    });
            }
        }, 200); // 设置防抖时间为300毫秒

        fetchData();
        return () => {
            fetchData.cancel(); // 取消防抖
        };
    }, [currentPage, q, query, canSearch]);

    const onChange = (item: any) => {
        setCheckItem(item);
    };

    const tags = React.useMemo(() => {
        return (
            columns
                ?.filter((item: any) => item?.type === 'string' || item.type === 'textBox')
                ?.map((item: any) => ({
                    label: item?.title,
                    value: values[item?.dataIndex]
                }))
                .filter((item: any) => item.value) || []
        );
    }, [values, columns]);
    const newTags = ['表情', '职业人物', '鲜花', '贴纸'];

    const handleChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    useEffect(() => {
        setInputValue(selectedTags.join('+'));
    }, [selectedTags]);

    const handleFilter = async () => {
        const jsonPluginConfig = JSON.parse(pluginConfig || '{}');
        jsonPluginConfig.picImagePickQuery = { query, size };

        // 保存筛选项
        const res = await templateUpdate({
            id: libraryId,
            pluginConfig: JSON.stringify(jsonPluginConfig)
        });
        if (res) {
            getList();
            message.success('保存成功!');
        }
    };

    return (
        <Modal width={'80%'} title="图片选择" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Search
                placeholder="请输入搜索的图片"
                enterButton
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSearch={(value) => {
                    if (value !== q || !value) {
                        setQ(value);
                        setCurrentPage(1);
                        setHits([]);
                        setTotalHits(0);
                    }
                    setCanSearch(true);
                }}
            />
            {tags?.length > 0 && (
                <div className="flex mt-3">
                    <span className="w-[60px]">素材字段</span>
                    <div className="flex-1 overflow-auto">
                        {tags?.map((item: any, index: number) => {
                            const showValue = item.value.length > 20 ? item.value.slice(0, 20) + '...' : item.value;
                            return (
                                <Tag.CheckableTag
                                    key={index}
                                    checked={selectedTags.includes(item.value)}
                                    onChange={(checked) => handleChange(item.value, checked)}
                                >
                                    <span className="font-bold">{item.label}：</span>
                                    {showValue}
                                </Tag.CheckableTag>
                            );
                        })}
                    </div>
                </div>
            )}
            <Space className="my-2">
                <span className="border-solid">筛选项</span>
                <Select
                    style={{ width: '120px' }}
                    placeholder="图片类型"
                    value={query?.image_type}
                    onChange={(value) => {
                        setCurrentPage(1);
                        setHits([]);
                        setTotalHits(0);
                        setQuery((pre: any) => ({
                            ...pre,
                            image_type: value
                        }));
                    }}
                >
                    <Option value={'all'}>全部</Option>
                    <Option value={'photo'}>照片</Option>
                    <Option value={'illustration'}>插画</Option>
                    <Option value={'vector'}>向量</Option>
                </Select>
                <Select
                    style={{ width: '120px' }}
                    placeholder="图像方向"
                    value={query?.orientation}
                    onChange={(value) => {
                        setCurrentPage(1);
                        setHits([]);
                        setTotalHits(0);
                        setQuery((pre: any) => ({
                            ...pre,
                            orientation: value
                        }));
                    }}
                >
                    <Option value={'all'}>全部</Option>
                    <Option value={'horizontal'}>水平</Option>
                    <Option value={'vertical'}>垂直</Option>
                </Select>
                <Popover
                    placement="bottom"
                    content={
                        <div>
                            <div className="text-slate-400">大于</div>
                            <div>
                                <InputNumber
                                    placeholder="宽度(像素)"
                                    value={size?.min_width}
                                    onChange={(value) => {
                                        setSize((pre: any) => ({
                                            ...pre,
                                            min_width: value
                                        }));
                                    }}
                                />
                                x
                                <InputNumber
                                    placeholder="长度(像素)"
                                    value={size?.min_height}
                                    onChange={(value) => {
                                        setSize((pre: any) => ({
                                            ...pre,
                                            min_height: value
                                        }));
                                    }}
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setCurrentPage(1);
                                        setHits([]);
                                        setTotalHits(0);
                                        setQuery((pre: any) => ({
                                            ...pre,
                                            ...size
                                        }));
                                    }}
                                >
                                    确定
                                </Button>
                            </div>
                        </div>
                    }
                    arrow={false}
                >
                    <Input
                        style={{ width: '120px' }}
                        placeholder="尺寸"
                        disabled
                        className="!bg-white"
                        value={query.min_width && query.min_height && `${query.min_width} x ${query.min_height}`}
                    />
                </Popover>
                <Select
                    style={{ width: '300px' }}
                    placeholder="颜色"
                    mode="multiple"
                    value={query?.colors ? query?.colors?.split(',') : []}
                    onChange={(value) => {
                        setCurrentPage(1);
                        setHits([]);
                        setTotalHits(0);
                        setQuery((pre: any) => ({
                            ...pre,
                            colors: value.join(',')
                        }));
                    }}
                >
                    <Option value={'grayscale'}>灰度</Option>
                    <Option value={'transparent'}>透明</Option>
                    <Option value={'red'}>红色</Option>
                    <Option value={'orange'}>橙色</Option>
                    <Option value={'yellow'}>黄色</Option>
                    <Option value={'green'}>绿色</Option>
                    <Option value={'turquoise'}>青绿色</Option>
                    <Option value={'blue'}>蓝色</Option>
                    <Option value={'lilac'}>淡紫色</Option>
                    <Option value={'pink'}>粉红色</Option>
                    <Option value={'white'}>白色</Option>
                    <Option value={'gray'}>灰色</Option>
                    <Option value={'black'}>黑色</Option>
                    <Option value={'brown'}>棕色</Option>
                </Select>
                {!isrery && (
                    <Button type="primary" onClick={() => handleFilter()}>
                        保存筛选项
                    </Button>
                )}
            </Space>
            <br />
            <Space>
                {newTags.map((item) => (
                    <div
                        className="px-2 py-1 rounded-md border border-solid border-[#d9d9d9] cursor-pointer text-xs "
                        onClick={() => {
                            setInputValue(item);
                            setQ(item);
                            setCanSearch(true);
                            setQuery((pre: any) => ({
                                ...pre,
                                colors: 'transparent',
                                image_type: 'illustration'
                            }));
                        }}
                        key={item}
                    >
                        {item}
                    </div>
                ))}
            </Space>

            <div className="mt-3 max-h-[560px] overflow-auto" ref={scrollRef}>
                {hits.length ? (
                    <Spin spinning={loading}>
                        <div className="min-h-[300px]">
                            <Masonry columnsCount={6}>
                                {hits.map((item: any, index: number) => (
                                    <div className="mx-2 my-2 relative" key={index}>
                                        <Checkbox
                                            checked={item.id === checkItem?.id}
                                            onChange={() => onChange(item)}
                                            className="absolute right-0 z-10"
                                        />
                                        <Image
                                            width={'100%'}
                                            src={item.previewURL}
                                            preview={{
                                                src: item.largeImageURL
                                            }}
                                        />
                                    </div>
                                ))}
                            </Masonry>
                        </div>
                    </Spin>
                ) : loading ? (
                    <Spin>
                        <Empty />
                    </Spin>
                ) : (
                    <Empty />
                )}
            </div>
            <Modal
                width={300}
                title="保存中"
                open={submitLoading}
                onOk={() => setSubmitLoading(false)}
                onCancel={() => setSubmitLoading(false)}
                footer={null}
            >
                <div className="flex flex-col items-center justify-center">
                    <Progress percent={percent.value} type="circle" />
                    <span>{percent.label}</span>
                </div>
            </Modal>
        </Modal>
    );
};
