import { Card, CardContent, Box, Typography, Tooltip, Link } from '@mui/material';
import { Image } from 'antd';
import { useTheme } from '@mui/material/styles';
import marketStore from 'store/market';
import './textnoWarp.scss';

function Template({ data, handleDetail }: any) {
    const { categoryList } = marketStore();
    const theme = useTheme();
    return (
        <Card
            sx={{
                aspectRatio: '186 / 235',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 15 : 'rgba(230,230,231,1)',
                ':hover': {
                    boxShadow: theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 5px 0 rgb(32 40 45 / 8%)'
                },
                p: 2
            }}
        >
            <CardContent
                sx={{
                    p: '0',
                    pt: '8px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div className="flex items-center">
                    {data?.icon && (
                        <Image
                            onClick={() => handleDetail(data)}
                            preview={false}
                            className="cursor-pointer rounded-lg overflow-hidden border border-solid border-slate-200"
                            height="20px"
                            src={require('../../../../../assets/images/category/' + data?.icon + '.svg')}
                        />
                    )}
                    {!data?.icon && data?.images && (
                        <Image
                            onClick={() => handleDetail(data)}
                            preview={false}
                            className="cursor-pointer rounded-lg overflow-hidden border border-solid border-slate-200"
                            height="20px"
                            src={data.images[0]}
                        />
                    )}
                    <Tooltip placement="top" disableInteractive title={data.name}>
                        <Typography
                            onClick={() => handleDetail(data)}
                            className=" ml-[5px] textnoWarp active cursor overflow-hidden line-clamp-1"
                            gutterBottom
                            variant="h3"
                            sx={{ fontSize: '1.1rem' }}
                            component="div"
                            my={1}
                        >
                            {data.name}
                        </Typography>
                    </Tooltip>
                </div>

                <Tooltip placement="top" disableInteractive title={data.description}>
                    <Typography
                        sx={{ fontSize: '.8rem' }}
                        onClick={() => handleDetail(data)}
                        className="line-clamp-5 cursor-pointer"
                        variant="body2"
                        lineHeight="1.1rem"
                    >
                        {data.description}
                    </Typography>
                </Tooltip>
            </CardContent>
            <Box position="absolute" left="16px" bottom="5px">
                {data.categories &&
                    data.categories.map((item: string) => (
                        <Link color="secondary" href="#" key={item} mr={1} fontSize=".9rem">
                            #{categoryList?.find((el: { code: string }) => el.code === item)?.name}
                        </Link>
                    ))}
            </Box>
        </Card>
    );
}

export default Template;
