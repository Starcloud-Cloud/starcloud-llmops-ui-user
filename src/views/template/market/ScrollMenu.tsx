import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BorderAllIcon from '@mui/icons-material/BorderAll';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

import { useContext } from 'react';

function ScrollMenus() {
    const items = [
        'Apple',
        'Banana',
        'Cherry',
        'Durian',
        'Elderberry',
        'Apple',
        'Banana',
        'Cherry',
        'Durian',
        'Elderberry',
        'Apple',
        'Banana',
        'Cherry',
        'Durian',
        'Elderberry'
    ];
    const LeftArrow = () => {
        const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

        return (
            <Box sx={{ width: '40px' }}>
                {!isFirstItemVisible ? (
                    <IconButton onClick={() => scrollPrev()}>
                        {' '}
                        <KeyboardArrowLeftIcon />{' '}
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
                        {' '}
                        <KeyboardArrowRightIcon />
                    </IconButton>
                ) : (
                    ''
                )}
            </Box>
        );
    };
    return (
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {items.map((id, index) => (
                <Box sx={{ mx: 2, textAlign: 'center' }} key={index}>
                    <BorderAllIcon />
                    <Box>{id}</Box>
                </Box>
            ))}
        </ScrollMenu>
    );
}
export default ScrollMenus;
