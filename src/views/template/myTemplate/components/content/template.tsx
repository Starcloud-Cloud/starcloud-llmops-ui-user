import { Card, CardContent, Box, Typography, Tooltip, Link } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Image } from 'antd';
import marketStore from 'store/market';
import './textnoWarp.scss';

function Template({ data, handleDetail }: any) {
    const { categoryList } = marketStore();
    return (
        <Card
            onClick={() => handleDetail(data)}
            sx={{
                aspectRatio: '186 / 220',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid',
                borderColor: '#E6E6E7',
                cursor: 'pointer',
                ':hover': {
                    borderColor: '#CECAD5',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    '.arrow_btn': {
                        display: 'block'
                    }
                },
                p: 2
            }}
        >
            <CardContent
                sx={{
                    p: '0',
                    pt: '8px'
                }}
            >
                {data?.icon && (
                    <div className="w-9 h-9 bg-cover rounded-xl border border-solid border-slate-200 cursor-pointer overflow-hidden flex justify-center items-center">
                        <Image
                            preview={false}
                            width={30}
                            height={30}
                            src={require('../../../../../assets/images/category/' + data?.icon + '.svg')}
                        />
                    </div>
                )}
                <Tooltip placement="top" disableInteractive title={data.name}>
                    <Typography
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
                <Tooltip placement="top" disableInteractive title={data.description}>
                    <Typography
                        sx={{ fontSize: '.8rem' }}
                        className="text-xs line-clamp-4 text-[#15273799]"
                        variant="body2"
                        lineHeight="1.1rem"
                    >
                        {data.description}
                    </Typography>
                </Tooltip>
            </CardContent>
            <div className="w-7 h-7 rounded-full bg-[#673ab7] absolute right-3 bottom-3 arrow_btn hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <ArrowForwardIcon fontSize="small" sx={{ color: '#fff' }} />
                </div>
            </div>
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
