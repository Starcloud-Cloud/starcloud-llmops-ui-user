import { TextField, InputAdornment, Grid } from '@mui/material';
import { Search } from '@mui/icons-material';
import Template from 'views/template/myTemplate/components/content/template';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteList } from 'api/template/collect';
const Collection = () => {
    const navigate = useNavigate();
    const [collectList, setCollectList] = useState<any[]>([]);
    const handleDetail = (data: any) => {
        navigate(`/appMarketDetail/${data.favoriteUid}?type=collect`);
    };
    useEffect(() => {
        favoriteList({}).then((res) => {
            setCollectList(res);
        });
    }, []);
    return (
        <div>
            <TextField
                size="small"
                id="filled-start-adornment"
                sx={{ width: '300px' }}
                placeholder="搜索收藏的AI应用"
                name="name"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    )
                }}
            />
            <div className="mt-[16px]">
                <Grid container spacing={2}>
                    {collectList.map((item) => (
                        <Grid xl={1.5} lg={2.4} md={3} sm={6} xs={6} key={item.uid} item>
                            <Template like="collect" handleDetail={handleDetail} data={item} />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};
export default Collection;
