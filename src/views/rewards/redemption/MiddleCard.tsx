import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventNoteIcon from '@mui/icons-material/EventNote';

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
    <Card sx={{ background: '#E4F1FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
        <CardContent>
            <Box display="flex" alignItems="center">
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mr: 2 }}>
                    <Icon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="subtitle1">{title}</Typography>
                    <Typography variant="body2">{description}</Typography>
                </Box>
            </Box>
        </CardContent>
        <Button variant="contained" disabled={isDisabled} sx={{ textTransform: 'none' }} onClick={onClick}>
            {buttonText}
        </Button>
    </Card>
);

export default MiddleCard;
