import { Grid } from '@mui/material';
import { RightOutlined } from '@ant-design/icons';
import { marketPage } from 'api/template';
import { useNavigate } from 'react-router-dom';
import Template from 'views/template/myTemplate/components/content/template';
import marketStore from 'store/market';
import { useEffect } from 'react';
import aaa from '../../../../assets/images/category/amazon.svg';

function List() {
    //路由跳转
    const navigate = useNavigate();
    //状态管理
    const { sorllList, setTotal, setTemplate, setNewTemplate, setSorllList }: any = marketStore();
    const handleDetail = (data: { uid: string }) => {
        navigate(`/appMarket/detail/${data.uid}`);
    };
    useEffect(() => {
        marketPage({ pageNo: 1, pageSize: 1000 }).then((res) => {
            setTemplate(res.list);
            setNewTemplate(res.list);
            setSorllList(res.list.slice(0, 30));
            setTotal(res.page.total);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <div className="flex justify-between items-center my-[24px]">
                <div className="text-[20px] line-[25px] font-bold flex items-end gap-2">
                    <img height="20px" src={aaa} alt="" />
                    <span>热门</span>
                </div>
                <div className="text-[#673ab7] cursor-pointer">
                    更多
                    <RightOutlined rev={undefined} />
                </div>
            </div>
            <Grid container spacing={2}>
                {sorllList.map((item: any, index: number) => (
                    <Grid lg={2} md={3} sm={6} xs={6} key={item.uid + index} item>
                        <Template handleDetail={handleDetail} data={item} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
export default List;
