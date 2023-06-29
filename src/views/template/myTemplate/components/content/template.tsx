import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import './textnoWarp.css';

function Template({ data, handleDetail }: any) {
    const theme = useTheme();
    return (
        <Card
            sx={{
                maxWidth: 280,
                height: 350,
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 15 : theme.palette.grey[200],
                ':hover': {
                    boxShadow: theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 14px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Box height="130px" overflow="hidden">
                <img
                    onClick={() => handleDetail(data)}
                    alt="图片"
                    className="headImg cursor"
                    width="100%"
                    height="130"
                    style={{ objectFit: 'cover' }}
                    src={data.images && data.images[0]}
                />
            </Box>
            <CardContent sx={{ px: 2, py: 1 }}>
                <Typography onClick={() => handleDetail(data)} className="active cursor" gutterBottom variant="h3" component="div" my={1}>
                    {data.name}
                </Typography>
                <Typography onClick={() => handleDetail(data)} className="cursor desc" variant="body2" component="div" lineHeight={1.2}>
                    {data.description}
                </Typography>
            </CardContent>
            <Box position="absolute" left="8px" bottom="8px">
                {data.categories &&
                    data.categories.map((item: string) => (
                        <Link href="#" key={item} mr={1} className="active cursor underline" fontSize={14}>
                            #{item}
                        </Link>
                    ))}
            </Box>
        </Card>
    );
}

export default Template;
