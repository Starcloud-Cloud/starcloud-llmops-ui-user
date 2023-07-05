import { Box, IconButton } from '@mui/material';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { categories } from 'api/template';
import marketStore from 'store/market';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
interface MenuList {
    name: string;
    icon: string;
}
function ScrollMenus({ change }: { change: any }) {
    const theme = useTheme();
    const [menuList, setMenuList] = useState<MenuList[]>([]);
    const [active, setActive] = useState<number | string>('');
    const setCategoryList = marketStore((state) => state.setCategoryList);
    useEffect(() => {
        categories().then((res) => {
            setMenuList(res);
            setCategoryList(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigate = useNavigate();
    const changeCategory = (item: any, index: number) => {
        navigate('/template/templateMarket/list');
        if (active === index) {
            setActive('');
            change('');
        } else {
            setActive(index);
            change(item.code);
        }
    };
    const LeftArrow = () => {
        const { scrollPrev } = useContext(VisibilityContext);
        return (
            <Box sx={{ width: '40px' }}>
                {
                    <IconButton onClick={() => scrollPrev()}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                }
            </Box>
        );
    };
    const RightArrow = () => {
        const { scrollNext } = useContext(VisibilityContext);
        return (
            <Box sx={{ width: '40px' }}>
                {
                    <IconButton onClick={() => scrollNext()}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                }
            </Box>
        );
    };
    const focus = {
        textAlign: 'center',
        padding: '0px 30px',
        borderRadius: 15,
        cursor: 'pointer',
        fontSize: '12px',
        border: '1px solid transparent',
        paddingTop: '5px',
        marginBottom: 1
    };
    const focuos = {
        textAlign: 'center',
        padding: '0px 30px',
        borderRadius: 15,
        cursor: 'pointer',
        background: theme?.palette.secondary.light,
        paddingTop: '5px',
        color: theme.palette.secondary[800],
        fontSize: '12px',
        marginBottom: 1
    };
    return (
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {menuList?.map((item, index) => (
                <Box
                    onClick={() => {
                        changeCategory(item, index);
                    }}
                    sx={active === index ? focuos : focus}
                    key={index}
                >
                    <img style={{ width: '25px' }} src={require('../../../assets/images/category/' + item.icon + '.svg')} alt="Icon" />
                    <Box sx={{ whiteSpace: 'nowrap' }}>{item.name}</Box>
                </Box>
            ))}
        </ScrollMenu>
    );
}
export default ScrollMenus;
