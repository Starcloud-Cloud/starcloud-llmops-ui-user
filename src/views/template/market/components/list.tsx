import { Grid } from '@mui/material';
import { marketPage } from 'api/template';
import { useNavigate } from 'react-router-dom';
import Template from 'views/template/myTemplate/components/content/template';
import marketStore from 'store/market';
import { useEffect } from 'react';

function List() {
    //路由跳转
    const navigate = useNavigate();
    //状态管理
    const { templateList, sorllList, setTotal, setTemplate, setNewTemplate, setSorllList }: any = marketStore();
    const handleDetail = (data: { uid: string }) => {
        navigate(`/appMarket/detail/${data.uid}`);
    };
    useEffect(() => {
        if (templateList.length === 0) {
            marketPage({ pageNo: 1, pageSize: 1000 }).then((res) => {
                setTemplate(res.list);
                setNewTemplate(res.list);
                setSorllList(res.list.slice(0, 30));
                setTotal(res.page.total);
            });
        } else {
            setSorllList(templateList.slice(0, 30));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Grid container spacing={2}>
            {sorllList.map((item: any, index: number) => (
                <Grid lg={2} md={3} sm={6} xs={6} key={item.uid + index} item>
                    <Template handleDetail={handleDetail} data={item} />
                </Grid>
            ))}
        </Grid>
    );
}
export default List;
