import { Box, Card, CardContent, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import marketStore from 'store/market';
import './textnoWarp.scss';

function Template({ data, handleDetail, uid }: any) {
    const { categoryList } = marketStore();
    const theme = useTheme();
    return (
        <Card
            onClick={() => handleDetail && handleDetail(data)}
            sx={{
                aspectRatio: '186 / 235',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid',
                display: 'flex',
                flexDirection: 'column',
                itemAlign: 'center',
                cursor: 'pointer',
                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 15 : 'rgba(230,230,231,1)',
                ':hover': {
                    boxShadow: theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 5px 0 rgb(32 40 45 / 8%)'
                }
            }}
            className={`xs:w-[289px] sm:w-[203.33px]  hover:border-[#673ab7]` + (uid === data?.uid ? 'border-solid border-[#673ab7]' : '')}
        >
            <Box sx={{ textAlign: 'center', marginTop: '15px' }}>
                <img
                    alt="图片"
                    className="object-cover rounded-full w-[100px] h-[100px] outline outline-1  outline-offset-2 outline-[#6839b7]"
                    src={data.images && data.images[0]}
                />
            </Box>
            <CardContent
                sx={{
                    px: 2,
                    py: 1,
                    position: 'relative'
                }}
            >
                <Tooltip disableInteractive title={data.name}>
                    <Typography
                        className="textnoWarp active cursor"
                        gutterBottom
                        variant="h3"
                        sx={{ fontSize: '1.1rem', color: '#0009', textAlign: 'center' }}
                        component="div"
                        my={1}
                    >
                        {data.name}
                    </Typography>
                </Tooltip>
                <Tooltip disableInteractive title={data.description}>
                    <Typography sx={{ fontSize: '.8rem' }} className="line-clamp-4 cursor-pointer" variant="body2" component="div">
                        {data.description}
                    </Typography>
                </Tooltip>
            </CardContent>
            <Box position="absolute" left="16px" bottom="5px">
                {/* {data.categories &&
                    data.categories.map((item: string) => (
                        <Link color="secondary" href="#" key={item} mr={1} fontSize=".9rem">
                            #{categoryList?.find((el: { code: string }) => el.code === item)?.name}
                        </Link>
                    ))} */}
            </Box>
        </Card>
    );
}

export default Template;
