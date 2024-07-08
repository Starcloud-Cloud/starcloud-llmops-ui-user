import { Row, Col } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { dictData } from 'api/template';
const PlugMarket = ({ onOk }: { onOk: (title: string, value: string) => void }) => {
    const [handleList, setHandleList] = useState<any[]>([]);
    const [generateList, setGenerateList] = useState<any[]>([]);
    const getList = async () => {
        const result = await dictData('', 'material_library_plugins');
        console.log(result);

        const handle: any[] = [];
        const generate: any[] = [];
        result?.list?.map((item: any) => {
            const value = JSON.parse(item.value);
            console.log(value);
            if (value.type === 'generate') {
                handle.push(value);
            } else {
                generate.push(value);
            }
        });
        setHandleList(handle);
        setGenerateList(generate);
    };
    useEffect(() => {
        getList();
    }, []);
    const getImage = (src: string) => {
        let srcs;
        try {
            srcs = require('../../../assets/images/plugMarket/' + src + '.svg');
        } catch (err) {
            srcs = '../../../assets/images/plugMarket/xhrOcr.svg';
        }
        return srcs;
    };
    return (
        <>
            <div className="font-bold text-base mb-4">素材获取</div>
            <CheckCard.Group value={'undefined'} style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                    {handleList?.map((item) => (
                        <Col key={item.pluginsCode} span={8}>
                            <CheckCard
                                onChange={() => {
                                    onOk(item.name, item.pluginsCode);
                                }}
                                className="w-[100%]"
                                title={item.name}
                                value={item.pluginsCode}
                                avatar={<img className="w-[16px] h-[16px] align-middle" src={getImage(item.icon)} />}
                                description={<div className="line-clamp-2 h-[44px]">{item.description}</div>}
                            />
                        </Col>
                    ))}
                </Row>
                <div className="font-bold text-base my-4">素材处理</div>
                <Row gutter={[16, 16]}>
                    {generateList?.map((item) => (
                        <Col key={item.pluginsCode} span={8}>
                            <CheckCard
                                className="w-[100%]"
                                onChange={() => {
                                    onOk(item.name, item.pluginsCode);
                                }}
                                title={item.name}
                                value={item.pluginsCode}
                                avatar={<img className="w-[16px] h-[16px] align-middle" src={getImage(item.icon)} />}
                                description={<div className="line-clamp-2 h-[44px]">{item.description}</div>}
                            />
                        </Col>
                    ))}
                </Row>
            </CheckCard.Group>
        </>
    );
};
export default PlugMarket;
