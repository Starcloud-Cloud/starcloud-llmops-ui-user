import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShareIcon from '@mui/icons-material/Share';
import PollIcon from '@mui/icons-material/Poll';

// Define the shape of props that this component expects
interface BottomCardProps {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    Icon: typeof GroupAddIcon | typeof PersonAddIcon | typeof ShareIcon | typeof PollIcon;
    endText: string;
    height: { xs: string; sm: string; md: string }; // add height property
    onClick: () => void; // add onClick function for button
}

const BottomCard: React.FC<BottomCardProps> = ({ title, subtitle, description, buttonText, Icon, endText, height, onClick }) => (
    <Card sx={{ background: '#E4F1FF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 1, height: height }}>
        <CardContent sx={{ width: '100%', flexGrow: 1, pb: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="h5">{title}</Typography>
                    <Typography variant="h6" sx={{ color: '#693af4' }}>
                        {subtitle}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Icon fontSize="large" />
                </Box>
            </Box>
            <Typography variant="body2">{description}</Typography>
            <Typography variant="body2" mt={2}>
                {endText}
            </Typography>
        </CardContent>
        <Box p={1}>
            <Button variant="outlined" sx={{ textTransform: 'none' }} fullWidth onClick={onClick}>
                {buttonText}
            </Button>
        </Box>
    </Card>
);

export default BottomCard;
