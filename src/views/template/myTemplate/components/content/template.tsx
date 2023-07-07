import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import marketStore from 'store/market';
import Link from '@mui/material/Link';
import './textnoWarp.css';

function Template({ data, handleDetail }: any) {
    const { categoryList } = marketStore();
    const theme = useTheme();
    return (
        <Card
            sx={{
                aspectRatio: '186 / 220',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 15 : 'rgba(230,230,231,1)',
                ':hover': {
                    boxShadow: theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 5px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Box sx={{ aspectRatio: '186 / 80', overflow: 'hidden' }}>
                <img
                    onClick={() => handleDetail(data)}
                    alt="图片"
                    className="headImg cursor"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                    src={data.images && data.images[0]}
                />
            </Box>
            <CardContent
                sx={{
                    px: 2,
                    py: 1,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Tooltip title={<Box sx={{ p: 0.5, fontSize: '14px' }}>{data.name}</Box>}>
                    <Typography
                        onClick={() => handleDetail(data)}
                        className="textnoWarp active cursor"
                        gutterBottom
                        variant="h3"
                        sx={{ fontSize: '1rem' }}
                        component="div"
                        my={1}
                    >
                        {data.name}
                    </Typography>
                </Tooltip>
                <Typography
                    sx={{ fontSize: '.75rem', color: 'rgba(21,39,55,.6)' }}
                    onClick={() => handleDetail(data)}
                    className="cursor desc"
                    variant="body2"
                    component="div"
                    lineHeight={1.2}
                >
                    {data.description}
                </Typography>
            </CardContent>
            <Box position="absolute" left="8px" bottom="8px">
                {data.categories &&
                    data.categories.map((item: string) => (
                        <Link href="#" key={item} mr={1} className="active cursor underline" fontSize={14}>
                            #{categoryList?.find((el: { code: string }) => el.code === item)?.name}
                        </Link>
                    ))}
            </Box>
        </Card>
    );
}

export default Template;
