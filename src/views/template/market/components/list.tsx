import { Grid } from '@mui/material';
import { marketPage } from 'api/template';
import { useNavigate } from 'react-router-dom';
import Template from 'views/template/myTemplate/components/content/template';

import { useEffect, useState } from 'react';

function List() {
    //路由跳转
    const navigate = useNavigate();

    const [total, setTotal] = useState(0);
    console.log(total);

    const [listData, setListData] = useState<Array<{ uid: string }>>([]);
    const handleDetail = (data: { version: number | string; uid: string }) => {
        navigate(`/template/templateMarket/detail?version=${data.version}&uid=${data.uid}`);
    };
    useEffect(() => {
        marketPage({ pageNo: 1, pageSize: 1000 }).then((res) => {
            setListData(res.list);
            setTotal(res.page.total);
        });
    }, []);
    return (
        <Grid container spacing={2} my={2}>
            {listData.map((item, index) => (
                <Grid key={item.uid + index} item>
                    <Template handleDetail={handleDetail} data={item} />
                </Grid>
            ))}
        </Grid>
    );
}
export default List;
