import { Box, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { categories } from 'api/template';
import marketStore from 'store/market';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

import { useContext, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
interface MenuList {
    name: string;
    icon: string;
}
function ScrollMenus({ change }: { change: any }) {
    const theme = useTheme();
    const [menuList, setMenuList] = useState<MenuList[]>([]);
    const [active, setActive] = useState<number | string>(0);
    const setCategoryList = marketStore((state) => state.setCategoryList);
    useEffect(() => {
        categories().then((res) => {
            setMenuList(res);
            setCategoryList(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeCategory = (item: any, index: number) => {
        if (active === index) {
            setActive(0);
            change('ALL');
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
        padding: '0px 15px',
        borderRadius: 15,
        cursor: 'pointer',
        fontSize: '12px',
        border: '1px solid transparent',
        paddingTop: '5px',
        marginBottom: 2
    };
    const focuos = {
        textAlign: 'center',
        padding: '0px 15px',
        borderRadius: 15,
        cursor: 'pointer',
        paddingTop: '5px',
        color: theme.palette.secondary[800],
        fontWeight: 600,
        fontSize: '12px',
        marginBottom: 2
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
                    <Box sx={{ whiteSpace: 'nowrap', fontSize: '14px' }}>{item.name}</Box>
                </Box>
            ))}
        </ScrollMenu>
    );
}
export default ScrollMenus;
