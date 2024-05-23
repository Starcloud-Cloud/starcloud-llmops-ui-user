import { Modal, Input, Image, Checkbox, Select, Space } from 'antd';
import { imageSearch } from 'api/redBook/imageSearch';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useState } from 'react';
import Masonry from 'react-responsive-masonry';

const { Search } = Input;
const { Option } = Select;

export const PicImagePick = ({
    isModalOpen,
    setIsModalOpen,
    setSelectImg
}: {
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    setSelectImg: (selectImg: any) => void;
}) => {
    const [hits, setHits] = useState<any[]>([]);
    const [totalHits, setTotalHits] = useState(0);
    const [checkItem, setCheckItem] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
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

    const handleOk = () => {
        setSelectImg(checkItem);
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
        imageSearch(q ? { q, page: currentPage, per_page: 20, lang: 'ZH' } : { page: currentPage, per_page: 20 }).then((res) => {
            const { totalHits, hits: newData } = res;
            setHits([...hits, ...newData]);
            setTotalHits(totalHits);
        });
    }, [currentPage, q]);

    const onChange = (item: any) => {
        setCheckItem(item);
    };

    return (
        <Modal width={1000} title="图片选择" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Search
                placeholder="请输入搜索的图片"
                enterButton
                onSearch={(value) => {
                    setQ(value);
                    setCurrentPage(1);
                    setHits([]);
                    setTotalHits(0);
                }}
            />
            <div className="mt-2">
                <Space>
                    <span className="border-solid">筛选项</span>
                    <Select style={{ width: '120px' }} placeholder="图片类型">
                        <Option value={'1'}>照片</Option>
                        <Option value={'2'}>插画</Option>
                        <Option value={'3'}>向量</Option>
                    </Select>
                    <Select style={{ width: '120px' }} placeholder="图像方向">
                        <Option value={'1'}>全部</Option>
                        <Option value={'2'}>水平</Option>
                        <Option value={'3'}>垂直</Option>
                    </Select>
                    <Select style={{ width: '120px' }} placeholder="尺寸">
                        <Option value={'1'}>全部</Option>
                        <Option value={'2'}>水平</Option>
                        <Option value={'3'}>垂直</Option>
                    </Select>
                    <Select style={{ width: '120px' }} placeholder="尺寸">
                        <Option value={'1'}>全部</Option>
                        <Option value={'2'}>水平</Option>
                        <Option value={'3'}>垂直</Option>
                    </Select>
                    <Select style={{ width: '120px' }} placeholder="发布日期">
                        <Option value={'1'}>{'全部'}</Option>
                        <Option value={'1'}>{'<24小时'}</Option>
                        <Option value={'2'}>{'<72小时'}</Option>
                        <Option value={'3'}>{'<7天'}</Option>
                        <Option value={'3'}>{'<6个月'}</Option>
                        <Option value={'3'}>{'<12个月'}</Option>
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
