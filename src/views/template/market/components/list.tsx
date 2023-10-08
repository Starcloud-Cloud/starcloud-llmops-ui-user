import { Grid } from '@mui/material';
import { RightOutlined } from '@ant-design/icons';
import { marketPage, listGroupByCategory } from 'api/template';
import { useNavigate } from 'react-router-dom';
import Template from 'views/template/myTemplate/components/content/template';
import marketStore from 'store/market';
import { useEffect, useState } from 'react';

function List() {
    //路由跳转
    const navigate = useNavigate();
    //状态管理
    const { sorllList, setTotal, setTemplate, setNewTemplate, setSorllList }: any = marketStore();
    const handleDetail = (data: { uid: string }) => {
        navigate(`/appMarket/detail/${data.uid}`);
    };
    const [appList, setAppList] = useState<any[]>([]);
    useEffect(() => {
        marketPage({ pageNo: 1, pageSize: 1000 }).then((res) => {
            setTemplate(res.list);
            setNewTemplate(res.list);
            setSorllList(res.list.slice(0, 30));
            setTotal(res.page.total);
        });
        listGroupByCategory({ isSearchHot: true }).then((res) => {
            setAppList(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            {appList.map((item) => (
                <div key={item.code}>
                    <div className="flex justify-between items-center my-[24px]">
                        <div className="text-[20px] line-[25px] font-bold flex items-end gap-2">
                            <img height="20px" src={require('../../../../assets/images/category/' + item.icon + '.svg')} alt="" />
                            <span>{item.name}</span>
                        </div>
                        <div className="text-[#673ab7] cursor-pointer">
                            更多模板
                            <RightOutlined rev={undefined} />
                        </div>
                    </div>
                    <Grid container display="flex" flexWrap="nowrap" overflow="hidden" spacing={2}>
                        {item.appList.map((item: any, index: number) => (
                            <Grid flexShrink={0} lg={2} md={3} sm={6} xs={6} key={item.uid + index} item>
                                <Template handleDetail={handleDetail} data={item} />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            ))}
        </div>
    );
}
export default List;
