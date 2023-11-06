import { useEffect, useState } from 'react';
import { Row, Col, InputNumber, Input, Popover, Button, Checkbox, Card, Select, Space } from 'antd';
import { DownOutlined, QuestionCircleOutlined, FilterOutlined, SyncOutlined } from '@ant-design/icons';
import { dictPage } from 'api/listing/thesaurus';
import { COUNTRY_LIST } from 'views/pages/listing-builder/data';

const { Option } = Select;

const searchList = [
    {
        title: 'ABA周排名',
        key: 'SearchRank',
        after: false,
        desc: `数据来源于亚马逊ABA数据的每周关键词搜索频率排名（Search Frequency Rank）
        数字越小表示排名越靠前，搜索量越高`,
        addonAfter: ''
    },
    {
        title: '月搜索量',
        key: 'Search',
        after: false,
        desc: `指的是一个自然月的月搜索量，比如2022年6月，该关键词在亚马逊站内的搜索总次数\n您现在看到的是上个月的月搜索量，每月月初更新上个月的数据`,
        addonAfter: ''
    },
    {
        title: '月购买量',
        key: 'Purchases',
        after: false,
        desc: `指一个自然月，比如2023年7月，在亚马逊站内搜索该关键词后产生购买的次数

        比如：某用户搜索iphone charger，然后1次购买了1个iphone充电器，2条数据线(关联推荐的商品)，则购买量=1`,
        addonAfter: ''
    },
    {
        title: '购买率',
        key: 'PurchasesRate',
        after: false,
        desc: `购买率，购买率=购买量/搜索量，指的是在买家输入该搜索词并点击此细分市场中的任意商品后，买家的购买次数占买家输入该搜索词总次数的比例，详细了解
            比如关键词wireless charger，一个月内被搜索了120万次，共产生了1.6万次销售(未必全部是无线充电器，也可能是数据线)，则该词的购买率 = 1.6万/120万=1.33%`,
        addonAfter: '%'
    },
    {
        title: 'SPR',
        key: 'SPR',
        desc: `SellerSprite Product Rank，能够让该关键词排名维持在搜索结果第1页的8天预估单量
         比如SPR=280，则代表产品8天内该关键词下的出单量需要达到280，才能让该关键词排名维持在搜索结果第1页
        SPR数值越大，表示让关键词排名维持在首页的单量要求更高，竞争更激烈
        扩展阅读：如何让关键词排名快速上首页？`,
        after: false,
        addonAfter: ''
    },
    {
        title: '标题密度',
        key: 'TitleDensity',
        desc: `该关键词在亚马逊搜索结果第1页的产品中，标题包含该关键词的产品数量
                比如标题密度为12，则代表该关键词的搜索结果第1页中，共有12个产品的标题包含了该关键词
                扩展阅读：如何利用标题密度找出竞品核心关键词？`,
        after: false,
        addonAfter: ''
    },
    {
        title: '商品数',
        key: 'Products',
        after: false,
        desc: `商品数，指搜索该关键词后出现了多少相关产品(All Departments类目)

        比如：1-48 of over 1,000 results for "ipad stand"
        基于IP地址的不同，各地区IP呈现的搜索结果数都不同，所以您在亚马逊前台搜索的结果数可能也会存在差别，详细解释`,
        addonAfter: ''
    },
    {
        title: '供需比',
        key: 'SupplyDemandRatio',
        after: false,
        desc: `供需比 = 搜索量(需求) / 商品数(供应)

        在同类市场中，供需比值越高，则代表该市场需求越强劲
        
        
        
        比如关键词phone holder的月搜索量为69,465，商品数为14,875
        
        则该关键词对应细分市场的供需比为69,465/14,875=4.7`,
        addonAfter: ''
    },
    {
        title: '广告竞品数',
        key: 'AdProducts',
        after: false,
        desc: `表示近7天内进入过该关键词搜索结果前3页的广告产品总数
                包括SP广告、HR广告、品牌广告和视频广告`,
        addonAfter: ''
    },
    {
        title: '点击集中度',
        key: 'MonopolyClickRate',
        desc: `点击集中度，指该关键词下点击排名前三ASIN的点击总占比
        数据来源于亚马逊后台ABA报告，一般来说，点击集中度越高，该词垄断程度越高
        扩展阅读：如何快速判断细分市场垄断程度？
        
        如果点击前三ASIN的点击共享分别是13.9%、12.4%、11.1%
        则前三ASIN点击总占比=13.9%+12.4%+11.1%=37.4%`,
        addonAfter: '%'
    },

    {
        title: 'RPC竞价',
        key: 'Bid',
        after: false,
        desc: `亚马逊站内广告Bid价格，系统提供【词组匹配】的Bid建议价格以及范围

        关键词出价是市场竞争度、市场成熟度的直接反映，也是营销费用的反映
        
        
        
        在站内广告投放时，您可以优先选择低竞争高需求的关键词，也就是出价较低而搜索量较高的关键词
        
        视频介绍：点击这里`,
        addonAfter: '%'
    },
    {
        title: '单词个数',
        key: 'WordCount',
        desc: `关键词词组的单词个数，以空格区分；只能输入整数
        比如iphone11 case单词个数为2，airpods pro case单词个数为3`,
        addonAfter: '',
        after: false
    },
    {
        title: 'Amazon Choice',
        desc: `AC推荐词：Amazon's Choice，勾选后可以筛选出拥有AC标识的关键词

        亚马逊系统会根据Listing的表现在某个关键词下优质、好价的产品上标注Amazon's Choice`,
        addonAfter: '',
        type: 'checkbox'
    }
];

const ResultFilter = ({
    filterTable,
    type,
    getExtended,
    setAddKeywordOpen,
    setUid,
    uid
}: {
    filterTable: (data: any) => void;
    type: number;
    getExtended: () => void;
    setAddKeywordOpen: (open: boolean) => void;
    setUid: (uid: string) => void;
    uid: string;
}) => {
    const [filterOpen, setFilterOpen] = useState(true);
    const [searchWord, setSearchWord] = useState<any>({});
    const [list, setList] = useState<any>([]);

    useEffect(() => {
        dictPage({ pageSize: 100, pageNo: 1 })
            .then((res) => {
                const fetchedRows = res.list;
                setList(fetchedRows);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <Card className="py-[10px]">
            <Row gutter={20} className="px-[30px]">
                <Col xxl={4} xl={6} lg={8} md={12} xs={24} className="pb-[30px]">
                    {list?.length > 0 && (
                        <Select
                            style={{ width: '100%' }}
                            placeholder="select one country"
                            value={uid}
                            onChange={(value) => {
                                setUid(value);
                            }}
                        >
                            {list?.map((item: any) => (
                                <Option value={item.uid} label={item.name}>
                                    <Space>
                                        <div className="flex items-center">
                                            <span role="img">{COUNTRY_LIST.find((v: any) => v.key === item.endpoint)?.icon}</span>
                                            <span className="ml-1">{item.name}</span>
                                        </div>
                                    </Space>
                                </Option>
                            ))}
                        </Select>
                    )}
                </Col>

                <Col xxl={4} xl={6} lg={8} md={12} xs={24} className="pb-[30px]">
                    <Input
                        placeholder="包含关键词，多个以逗号区分"
                        value={searchWord.includeKeywords}
                        onChange={(e) =>
                            setSearchWord({
                                ...searchWord,
                                includeKeywords: e.target.value.split(',')
                            })
                        }
                    />
                </Col>
                <Col xxl={4} xl={6} lg={8} md={12} xs={24} className="pb-[30px]">
                    <Input
                        placeholder="排除关键词，多个以逗号区分"
                        value={searchWord.excludeKeywords}
                        onChange={(e) => {
                            setSearchWord({
                                ...searchWord,
                                excludeKeywords: e.target.value?.split(',')
                            });
                        }}
                    />
                </Col>
                <Col className="pb-[30px]">
                    <div className="flex items-center">
                        <span
                            className="text-[#673ab7] rounded border border-solid border-[#673ab7] text-[13px] font-[500] px-[6px] py-[9px] cursor-pointer leading-3"
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            {filterOpen ? '隐藏过滤条件' : '展示过滤条件'}
                            <DownOutlined
                                style={{ transition: 'transform .3s', transform: !filterOpen ? 'rotate(-180deg)' : '' }}
                                rev={undefined}
                            />
                        </span>
                    </div>
                </Col>
                <Col className="pb-[30px]">
                    <Button type="primary" onClick={() => filterTable(searchWord)}>
                        查询
                    </Button>
                </Col>
                <Col className="pb-[30px]">
                    <Button onClick={() => setAddKeywordOpen(true)}>新增关键词</Button>
                </Col>
            </Row>

            {filterOpen && (
                <div>
                    <Row gutter={20} className="px-[30px]">
                        {searchList.map((item: any) => (
                            <Col key={item.title} xxl={4} xl={6} lg={8} md={12} xs={24}>
                                <div className="mb-[10px] text-[#86898c] text-[13px] font-[500] flex items-center">
                                    {item.title}
                                    <Popover
                                        color="#262626"
                                        trigger="hover"
                                        zIndex={9999}
                                        placement="top"
                                        title={<div className="max-w-[500px] text-[#fff]">{item.desc}</div>}
                                    >
                                        <QuestionCircleOutlined className="cursor-pointer" rev={undefined} />
                                    </Popover>
                                </div>
                                {item.type !== 'checkbox' ? (
                                    <div className="flex items-center mb-[30px]">
                                        <InputNumber
                                            min={0}
                                            value={item.after ? searchWord[item.key + 'Min'] : searchWord['min' + item.key]}
                                            onChange={(data) => {
                                                // if (item.addonAfter === '%') {
                                                //     setSearchWord({
                                                //         ...searchWord,
                                                //         [item.after ? item.key + 'Min' : 'min' + item.key]: data / 100
                                                //     });
                                                // } else {
                                                setSearchWord({
                                                    ...searchWord,
                                                    [item.after ? item.key + 'Min' : 'min' + item.key]: data
                                                });
                                                // }
                                            }}
                                            // formatter={(value) => {
                                            //     if (value) {
                                            //         return item.addonAfter === '%' ? (value * 100).toString() : value;
                                            //     } else {
                                            //         return '';
                                            //     }
                                            // }}
                                            className="flex-1"
                                            placeholder="最小值"
                                            controls={false}
                                            addonAfter={item.addonAfter}
                                        />
                                        <span>&nbsp;~&nbsp;</span>
                                        <InputNumber
                                            value={item.after ? searchWord[item.key + 'Max'] : searchWord['max' + item.key]}
                                            onChange={(data) => {
                                                console.log(data, 'data');
                                                // if (item.addonAfter === '%') {
                                                //     setSearchWord({
                                                //         ...searchWord,
                                                //         [item.after ? item.key + 'Max' : 'max' + item.key]: data / 100
                                                //     });
                                                // } else {
                                                setSearchWord({
                                                    ...searchWord,
                                                    [item.after ? item.key + 'Max' : 'max' + item.key]: data
                                                });
                                                // }
                                            }}
                                            // formatter={(value) => {
                                            //     if (value) {
                                            //         return item.addonAfter === '%' ? (value * 100).toString() : value;
                                            //     } else {
                                            //         return '';
                                            //     }
                                            // }}
                                            min={0}
                                            className="flex-1"
                                            placeholder="最大值"
                                            controls={false}
                                            addonAfter={item.addonAfter}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center mb-[30px]">
                                        <Checkbox
                                            checked={searchWord.amazonChoice}
                                            onChange={(e) => {
                                                setSearchWord({
                                                    ...searchWord,
                                                    amazonChoice: e.target.checked
                                                });
                                            }}
                                        >
                                            仅AC推荐词
                                        </Checkbox>
                                    </div>
                                )}
                            </Col>
                        ))}
                    </Row>

                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => {
                                filterTable(searchWord);
                            }}
                            type="primary"
                            icon={<FilterOutlined rev={undefined} />}
                        >
                            开始筛选
                        </Button>
                        <Button
                            onClick={() => {
                                setSearchWord({});
                                filterTable({});
                            }}
                            className="ml-[60px]"
                            icon={<SyncOutlined rev={undefined} />}
                        >
                            重置条件
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ResultFilter;
