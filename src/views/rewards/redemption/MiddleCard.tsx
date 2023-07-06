import React from 'react';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SubCard from 'ui-component/cards/SubCard';

// Define the shape of props that this component expects
interface MiddleCardProps {
    title: string;
    description: string;
    buttonText: string;
    isDisabled: boolean;
    Icon: typeof AccountBoxIcon | typeof EventNoteIcon;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const MiddleCard: React.FC<MiddleCardProps> = ({ Icon, title, description, buttonText, isDisabled, onClick }) => (
    <SubCard sx={{ p: 1, width: '100%' }}>
        <CardContent
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flexGrow: 1
            }}
        >
            <Box display="flex" alignItems="center">
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mr: 2 }}>
                    <Icon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="subtitle1">{title}</Typography>
                    <Typography variant="body2">{description}</Typography>
                </Box>
            </Box>
            <Button
                variant="contained"
                disabled={isDisabled}
                sx={{ textTransform: 'none', transform: 'scale(0.8)', width: '7rem' }}
                onClick={onClick}
            >
                {buttonText}
            </Button>
        </CardContent>
    </SubCard>
);

export default MiddleCard;
