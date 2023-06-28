import { Box, IconButton } from '@mui/material';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { categories } from 'api/template';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

import { useContext, useState, useEffect } from 'react';
interface MenuList {
    name: string;
    icon: string;
}
function ScrollMenus() {
    const [menuList, setMenuList] = useState<MenuList[]>([]);
    const [active, setActive] = useState<number | string>('');
    useEffect(() => {
        categories().then((res) => {
            setMenuList(res);
        });
    }, []);
    const changeCategory = (index: number) => {
        if (active === index) {
            setActive('');
        } else {
            setActive(index);
        }
    };
    const LeftArrow = () => {
        const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
        return (
            <Box sx={{ width: '40px' }}>
                {!isFirstItemVisible ? (
                    <IconButton onClick={() => scrollPrev()}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                ) : (
                    ''
                )}
            </Box>
        );
    };
    const RightArrow = () => {
        const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
        return (
            <Box sx={{ width: '40px' }}>
                {!isLastItemVisible ? (
                    <IconButton onClick={() => scrollNext()}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                ) : (
                    ''
                )}
            </Box>
        );
    };
    const focus = {
        textAlign: 'center',
        padding: '0px 30px',
        borderRadius: 15,
        cursor: 'pointer',
        fontSize: '12px',
        border: '1px solid transparent'
    };
    const focuos = {
        textAlign: 'center',
        padding: '0px 30px',
        borderRadius: 15,
        cursor: 'pointer',
        border: '1px solid #673ab7',
        fontSize: '12px'
    };
    return (
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {menuList?.map((item, index) => (
                <Box
                    onClick={() => {
                        changeCategory(index);
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
