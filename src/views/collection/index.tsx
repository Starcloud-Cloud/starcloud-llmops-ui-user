import { TextField, InputAdornment, Grid, FormControl, OutlinedInput, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import Template from 'views/template/myTemplate/components/content/template';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteList } from 'api/template/collect';
const Collection = () => {
    const navigate = useNavigate();
    const [collectList, setCollectList] = useState<any[]>([]);
    const [newList, setNewList] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const handleDetail = (data: any) => {
        navigate(`/appMarketDetail/${data.favoriteUid}?type=collect`);
    };
    const searchList = () => {
        const newData = collectList.filter(
            (item) => item.name?.toLowerCase().includes(value.toLowerCase()) || item.spell?.toLowerCase().includes(value.toLowerCase())
        );
        setNewList(newData);
    };
    useEffect(() => {
        favoriteList({}).then((res) => {
            setNewList(res);
            setCollectList(res);
        });
    }, []);
    return (
        <div>
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
            <div className="mt-[16px]">
                <Grid container spacing={2}>
                    {newList.map((item) => (
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
