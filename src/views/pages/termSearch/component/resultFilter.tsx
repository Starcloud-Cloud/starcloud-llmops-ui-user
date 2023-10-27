import { Row, Col, InputNumber, Input, Popover, Button, Radio } from 'antd';
import { DownOutlined, QuestionCircleOutlined, FilterOutlined, SyncOutlined } from '@ant-design/icons';
import { useState } from 'react';
const ResultFilter = () => {
    const [filteOpen, setFilteOpen] = useState(true);
    const serachList = [
        {
            title: '流量占比',
            desc: `指的是所有查询ASIN通过不同流量词获得的曝光量占比总和关键词的流量占比数值越大，说明该关键词给ASIN带来的曝光量越大`,
            addonAfter: '%'
        },
        {
            title: 'ABA周排名',
            desc: `数据来源于亚马逊ABA数据的每周关键词搜索频率排名（Search Frequency Rank）

            数字越小表示排名越靠前，搜索量越高`,
            addonAfter: ''
        },
        {
            title: '月搜索量',
            desc: `指的是一个自然月的月搜索量，比如2022年6月，该关键词在亚马逊站内的搜索总次数\n您现在看到的是上个月的月搜索量，每月月初更新上个月的数据`,
            addonAfter: ''
        },
        {
            title: '月购买量',
            desc: `指一个自然月，比如2023年7月，在亚马逊站内搜索该关键词后产生购买的次数

            比如：某用户搜索iphone charger，然后1次购买了1个iphone充电器，2条数据线(关联推荐的商品)，则购买量=1`,
            addonAfter: ''
        },
        {
            title: '购买率',
            desc: `购买率，购买率=购买量/搜索量，指的是在买家输入该搜索词并点击此细分市场中的任意商品后，买家的购买次数占买家输入该搜索词总次数的比例，详细了解
                比如关键词wireless charger，一个月内被搜索了120万次，共产生了1.6万次销售(未必全部是无线充电器，也可能是数据线)，则该词的购买率 = 1.6万/120万=1.33%`,
            addonAfter: '%'
        },
        {
            title: 'SPR',
            desc: `SellerSprite Product Rank，能够让该关键词排名维持在搜索结果第1页的8天预估单量
             比如SPR=280，则代表产品8天内该关键词下的出单量需要达到280，才能让该关键词排名维持在搜索结果第1页
            SPR数值越大，表示让关键词排名维持在首页的单量要求更高，竞争更激烈
            扩展阅读：如何让关键词排名快速上首页？`,
            addonAfter: ''
        },
        {
            title: '标题密度',
            desc: `该关键词在亚马逊搜索结果第1页的产品中，标题包含该关键词的产品数量
                    比如标题密度为12，则代表该关键词的搜索结果第1页中，共有12个产品的标题包含了该关键词
                    扩展阅读：如何利用标题密度找出竞品核心关键词？`,
            addonAfter: ''
        },
        {
            title: '商品数',
            desc: `商品数，指搜索该关键词后出现了多少相关产品(All Departments类目)

            比如：1-48 of over 1,000 results for "ipad stand"
            基于IP地址的不同，各地区IP呈现的搜索结果数都不同，所以您在亚马逊前台搜索的结果数可能也会存在差别，详细解释`,
            addonAfter: ''
        },
        {
            title: '供需比',
            desc: `供需比 = 搜索量(需求) / 商品数(供应)

            在同类市场中，供需比值越高，则代表该市场需求越强劲
            
            
            
            比如关键词phone holder的月搜索量为69,465，商品数为14,875
            
            则该关键词对应细分市场的供需比为69,465/14,875=4.7`,
            addonAfter: ''
        },
        {
            title: '广告竞品数',
            desc: `表示近7天内进入过该关键词搜索结果前3页的广告产品总数
                    包括SP广告、HR广告、品牌广告和视频广告`,
            addonAfter: ''
        },
        {
            title: '点击集中度',
            desc: `点击集中度，指该关键词下点击排名前三ASIN的点击总占比
            数据来源于亚马逊后台ABA报告，一般来说，点击集中度越高，该词垄断程度越高
            扩展阅读：如何快速判断细分市场垄断程度？
            
            如果点击前三ASIN的点击共享分别是13.9%、12.4%、11.1%
            则前三ASIN点击总占比=13.9%+12.4%+11.1%=37.4%`,
            addonAfter: '%'
        },
        {
            title: '转化总占比',
            desc: `前三ASIN转化总占比，指的是该关键词下点击排名前三ASIN的转化共享之和

            （转化共享，指的是该ASIN在这个关键词下的销量占整个词销量的比例）
            
            数据来源于亚马逊后台ABA报告，一般来说，前三ASIN的转化总占比越高，该词垄断程度越高
            
            
            
            假设点击前三ASIN的转化共享分别是18.4%、10.9%、5.6%
            
            则前三ASIN转化总占比=18.4%+10.9%+5.6%=34.9%`,
            addonAfter: '%'
        },
        {
            title: 'PPC竞价',
            desc: `亚马逊站内广告Bid价格，系统提供【词组匹配】的Bid建议价格以及范围

            关键词出价是市场竞争度、市场成熟度的直接反映，也是营销费用的反映
            
            
            
            在站内广告投放时，您可以优先选择低竞争高需求的关键词，也就是出价较低而搜索量较高的关键词
            
            视频介绍：点击这里`,
            addonAfter: '%'
        },
        {
            title: '单词个数',
            desc: `关键词词组的单词个数，以空格区分；只能输入整数

            比如iphone11 case单词个数为2，airpods pro case单词个数为3`,
            addonAfter: ''
        },
        {
            title: '相关ASIN数',
            desc: `拓展流量词是查询多个ASIN的流量词后合并去重显示

            相关ASIN数则表示在查询的ASIN及其变体中，每个流量词来源于哪些ASIN
            
            
            
            数量越大，表示该流量词在查询的ASIN及其变体中出现的频率越高
            
            比如相关ASIN数最小值设置为3，则可以筛选出在查询的ASIN及其变体中，相关ASIN数大于等于3的关键词`,
            addonAfter: ''
        },
        {
            title: 'Amazon Choice',
            desc: `AC推荐词：Amazon's Choice，勾选后可以筛选出拥有AC标识的关键词

            亚马逊系统会根据Listing的表现在某个关键词下优质、好价的产品上标注Amazon's Choice`,
            addonAfter: '',
            type: 'radio'
        },
        {
            title: '排除关键词',
            desc: `支持多个关键词或词组输入查询，多词用英文逗号,或空格隔开，如: child, kids



            添加后的筛选结果中不会有任何包含该关键词或该词组的结果出现
            
            比如输入phone，则筛选结果中不会出现任何包含phone的词组`,
            addonAfter: '',
            size: true
        },
        {
            title: '包含关键词',
            desc: `支持多个关键词或词组输入查询，多词用英文逗号,或空格隔开，如: child, kids



            广泛匹配：输入后筛选结果中可以匹配拼写错误，单复数，相似关键字、不讲究顺序等等
            
            例如belt，可以匹配到leather belt ，black belt for men等等
            
            
            
            词组匹配：输入后筛选结果中只包含这个词组，且单词顺序保持一致
            
            例如coffee cups，可以匹配到blue coffee cups，coffee cups for traveling等等`,
            addonAfter: '',
            size: true
        }
    ];
    return (
        <div className="my-[20px] bg-[#fff]">
            <div className="flex items-center p-[30px]">
                <span className="font-[600] text-[#505355]">搜索结果过滤 </span>
                <span
                    className="text-[#673ab7] rounded border border-solid border-[#673ab7] text-[13px] font-[500] px-[6px] py-[10px] cursor-pointer ml-[30px] leading-3"
                    onClick={() => setFilteOpen(!filteOpen)}
                >
                    隐藏过滤条件{' '}
                    <DownOutlined style={{ transition: 'transform .3s', transform: !filteOpen ? 'rotate(-180deg)' : '' }} rev={undefined} />
                </span>
            </div>
            {filteOpen && (
                <div>
                    <Row gutter={20} className="px-[30px]">
                        {serachList.map((item) =>
                            !item.size ? (
                                <Col key={item.title} xxl={4} xl={6} lg={8} md={12} xs={12}>
                                    <div className="mb-[10px] text-[#86898c] text-[13px] font-[500]">
                                        {item.title}{' '}
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
                                    {item.type !== 'radio' ? (
                                        <div className="flex items-center mb-[30px]">
                                            <InputNumber className="flex-1" placeholder="最小值" addonAfter={item.addonAfter} />
                                            <span>&nbsp;~&nbsp;</span>
                                            <InputNumber className="flex-1" placeholder="最大值" addonAfter={item.addonAfter} />
                                        </div>
                                    ) : (
                                        <Radio>仅AC推荐词</Radio>
                                    )}
                                </Col>
                            ) : (
                                <Col key={item.title} span={8}>
                                    <div className="mb-[10px] text-[#86898c] text-[13px] font-[500]">
                                        {item.title}{' '}
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
                                    <div className="flex mb-[30px]">
                                        <Input placeholder="请输入关键词，多个以逗号区分" />
                                    </div>
                                </Col>
                            )
                        )}
                    </Row>
                    <div className="flex items-center justify-center pb-[30px]">
                        <Button type="primary" icon={<FilterOutlined rev={undefined} />}>
                            开始筛选
                        </Button>
                        <Button className="ml-[60px]" icon={<SyncOutlined rev={undefined} />}>
                            重置条件
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ResultFilter;
