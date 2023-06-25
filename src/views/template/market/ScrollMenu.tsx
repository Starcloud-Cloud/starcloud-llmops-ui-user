import { Box, IconButton } from '@mui/material';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BorderAllIcon from '@mui/icons-material/BorderAll';

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
    const [active, setActive] = useState(1);
    useEffect(() => {
        categories().then((res) => {
            setMenuList(res);
        });
    }, []);
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
    const focus = { textAlign: 'center', padding: '5px 20px', borderRadius: 15, cursor: 'pointer', fontSize: '12px' };
    const focuos = {
        textAlign: 'center',
        padding: '5px 20px',
        borderRadius: 15,
        cursor: 'pointer',
        background: '#673ab7',
        color: '#fff',
        fontSize: '12px'
    };
    return (
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {menuList.map((item, index) => (
                <Box
                    onClick={() => {
                        setActive(index);
                    }}
                    sx={active === index ? focuos : focus}
                    key={index}
                >
                    <BorderAllIcon fontSize="small" />
                    <Box sx={{ whiteSpace: 'nowrap' }}>{item.name}</Box>
                </Box>
            ))}
        </ScrollMenu>
    );
}
export default ScrollMenus;
