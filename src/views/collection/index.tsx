import { InputAdornment, FormControl, OutlinedInput, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import MarketTemplate from 'views/template/myTemplate/components/content/marketTemplate';
import { useEffect, useState, useRef } from 'react';
import { Row, Col, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { favoriteList } from 'api/template/collect';
import { getTenant, ENUM_TENANT } from 'utils/permission';
import '../template/market/index.scss';
const Collection = () => {
    const navigate = useNavigate();
    const [collectList, setCollectList] = useState<any[]>([]);
    const [newList, setNewList] = useState<any[]>([]);
    const [styleList, setStyleList] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const handleDetail = (data: any) => {
        if (getTenant() === ENUM_TENANT.AI) {
            navigate(`/appMarketDetail/${data.favoriteUid}?type=collect`);
        } else {
            navigate(`/batchSmallRedBook?appUid=${data.uid}`);
        }
    };
    const searchList = () => {
        const newData = collectList.filter(
            (item) => item.name?.toLowerCase().includes(value.toLowerCase()) || item.spell?.toLowerCase().includes(value.toLowerCase())
        );
        setNewList(newData);
    };
    const timer: any = useRef(null);
    useEffect(() => {
        if (collectList.length > 0) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                searchList();
            }, 300);
        }
    }, [value]);
    useEffect(() => {
        favoriteList({ type: 'APP_MARKET' }).then((res) => {
            setNewList(res);
            setCollectList(res);
        });
        favoriteList({ type: 'TEMPLATE_MARKET' }).then((res) => {
            setStyleList(res);
        });
    }, []);
    return (
        <div className="Rows">
            {getTenant() !== ENUM_TENANT.AI ? (
                <Tabs
                    items={[
                        {
                            label: '应用市场',
                            key: 'app',
                            children: (
                                <>
                                    <FormControl color="secondary" size="small" sx={{ width: '300px' }} variant="outlined">
                                        <OutlinedInput
                                            name="name"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={searchList} edge="end">
                                                        <Search />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="搜索收藏的AI应用"
                                        />
                                    </FormControl>
                                    <Row className="mt-4" gutter={[16, 16]}>
                                        {newList.map((el: any, index: number) => (
                                            <Col className={`xxxl-col flex-shrink-0`} key={el?.uid}>
                                                <MarketTemplate like="collect" key={el?.uid} handleDetail={handleDetail} data={el} />
                                            </Col>
                                        ))}
                                    </Row>
                                </>
                            )
                        },
                        {
                            label: '风格市场',
                            key: 'style',
                            children: (
                                <Row gutter={[16, 16]}>
                                    {styleList.map((el: any, index: number) => (
                                        <Col className={`xxxl-col flex-shrink-0`} key={el?.uid}>
                                            <MarketTemplate
                                                like="collect"
                                                type="STYLE"
                                                key={el?.uid}
                                                handleDetail={handleDetail}
                                                data={el}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            )
                        }
                    ]}
                />
            ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8">
                    {newList.map((el: any, index: number) => (
                        <MarketTemplate like="collect" type="APP" key={el?.uid} handleDetail={handleDetail} data={el} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default Collection;
