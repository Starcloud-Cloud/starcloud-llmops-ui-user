import { Modal, Input, Image, Checkbox, Select, Space, Popover, InputNumber, Button, Tag } from 'antd';
import { imageSearch } from 'api/redBook/imageSearch';
import axios from 'axios';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { getAccessToken } from 'utils/auth';

const { Search } = Input;
const { Option } = Select;

export const PicImagePick = ({
    isModalOpen,
    setIsModalOpen,
    setSelectImg,
    columns,
    values
}: {
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    setSelectImg: (selectImg: any) => void;
    columns?: any[];
    values?: any;
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

    const handleScroll = useCallback(
        debounce(() => {
            const element: any = scrollRef.current;
            if (element) {
                if (element.scrollTop + element.clientHeight >= element.scrollHeight - 20) {
                    const nextPage = currentPageRef.current + 1;
                    if (nextPage <= Math.ceil(totalHitsRef.current / 20)) {
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
        const response = await axios.get(checkItem.largeImageURL, { responseType: 'blob' });
        const imageBlob = response.data;

        // Step 2: 创建FormData对象
        const formData = new FormData();
        formData.append('image', imageBlob, 'image.jpg'); // 'file' 是服务器端接收图片的字段名，'downloaded-image.jpg' 是文件名

        // Step 3: 上传到服务器
        const uploadResponse = await axios.post(
            `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
            formData,
            {
                headers: {
                    Authorization: 'Bearer ' + getAccessToken()
                }
            }
        );
        const url = uploadResponse.data.data.url;

        setSelectImg({ ...checkItem, largeImageURL: url });
        handleCancel();
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setQ('');
        setCurrentPage(1);
        setHits([]);
        setTotalHits(0);
    };
    useEffect(() => {
        console.log(hits, 'hits');
        imageSearch(q ? { q, page: currentPage, per_page: 20, lang: 'zh', ...query } : { page: currentPage, per_page: 20, ...query }).then(
            (res) => {
                const { totalHits, hits: newData } = res;
                setHits([...hits, ...newData]);
                setTotalHits(totalHits);
            }
        );
    }, [currentPage, q, query]);

    const onChange = (item: any) => {
        setCheckItem(item);
    };

    const tags = React.useMemo(() => {
        return columns
            ?.filter((item: any) => item?.type === 'string' || item.type === 'textBox')
            ?.map((item: any) => ({
                label: item?.title,
                value: values[item?.dataIndex]
            }))
            .filter((item: any) => item.value);
    }, [values, columns]);

    const handleChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    useEffect(() => {
        setInputValue(selectedTags.join(' '));
    }, [selectedTags]);

    return (
        <Modal width={1000} title="图片选择" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Search
                placeholder="请输入搜索的图片"
                enterButton
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSearch={(value) => {
                    setQ(value);
                    setCurrentPage(1);
                    setHits([]);
                    setTotalHits(0);
                }}
            />
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
            <div className="mt-2">
                <Space>
                    <span className="border-solid">筛选项</span>
                    <Select
                        style={{ width: '120px' }}
                        placeholder="图片类型"
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
                </Space>
            </div>

            <div className="mt-3 max-h-[560px] overflow-auto" ref={scrollRef}>
                <Masonry columnsCount={4}>
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
        </Modal>
    );
};
