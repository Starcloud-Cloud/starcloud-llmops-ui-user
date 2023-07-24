import { ReactElement, useEffect, useState } from 'react';

// material-ui
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// assets
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type AccordionItem = {
    id: string;
    title: ReactElement | string;
    content: ReactElement | string;
    disabled?: boolean;
    expanded?: boolean;
    defaultExpand?: boolean | undefined;
};

interface accordionProps {
    data: AccordionItem[];
    defaultExpandedId?: string | boolean | null;
    expandIcon?: ReactElement;
    square?: boolean;
    toggle?: boolean;
}

// ==============================|| ACCORDION ||============================== //

const ChatAccordion = ({ data, defaultExpandedId = null, expandIcon, square, toggle }: accordionProps) => {
    const theme = useTheme();

    const [expanded, setExpanded] = useState<string | boolean | null>(null);
    const handleChange = (panel: string) => (event: React.SyntheticEvent<Element, Event>, newExpanded: boolean) => {
        toggle && setExpanded(newExpanded ? panel : false);
    };

    useEffect(() => {
        setExpanded(defaultExpandedId);
    }, [defaultExpandedId]);

    return (
        <>
            {data &&
                data.map((item: AccordionItem) => (
                    <Box
                        sx={{
                            marginBottom: '15px',
                            width: '100%',
                            backgroundColor: 'rgb(255, 255, 255)',
                            color: 'rgb(54, 65, 82)',
                            transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid rgb(238, 238, 238)',
                            borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 15 : 'rgba(230,230,231,1)',
                            ':hover': {
                                boxShadow:
                                    theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 5px 0 rgb(32 40 45 / 8%)'
                            }
                        }}
                    >
                        <MuiAccordion
                            key={item.id}
                            defaultExpanded={!item.disabled && item.defaultExpand}
                            expanded={(!toggle && !item.disabled && item.expanded) || (toggle && expanded === item.id)}
                            disabled={item.disabled}
                            square={square}
                            onChange={handleChange(item.id)}
                        >
                            <MuiAccordionSummary
                                expandIcon={expandIcon || expandIcon === false ? expandIcon : <ExpandMoreIcon />}
                                sx={{ color: theme.palette.mode === 'dark' ? 'grey.500' : 'grey.800', fontWeight: 500 }}
                            >
                                {item.title}
                            </MuiAccordionSummary>
                            <MuiAccordionDetails>{item.content}</MuiAccordionDetails>
                        </MuiAccordion>
                    </Box>
                ))}
        </>
    );
};

export default ChatAccordion;
