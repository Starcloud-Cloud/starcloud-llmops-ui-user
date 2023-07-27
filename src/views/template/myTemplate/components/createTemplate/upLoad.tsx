import { Box, Grid, Typography } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import CodeIcon from '@mui/icons-material/Code';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
function Upload() {
    const upLoadList = [
        {
            title: '网页',
            desc: '用户在此链接可以直接和您的机器人聊天',
            action: ['复制链接', '预览体验', '域名部署']
        },
        {
            title: 'JS嵌入',
            desc: '可添加到网站的任何位置，将此 iframe 添加到 html 代码中',
            action: ['创建站点', '查看代码']
        },
        {
            title: 'API调用',
            desc: '通过API，可直接进行调用或发出请求',
            action: ['接口秘钥', '接口文档']
        },
        {
            title: '微信群聊',
            desc: '微信群在新创建的微信群聊中提供机器人服务，首位进群人员为管理员；',
            action: ['创建群聊', '查看群聊']
        },
        {
            title: '微信公众号',
            desc: '可在微信公众号后台配置，提供机器人服务',
            action: ['配置微信公众号']
        }
    ];
    return (
        <Box>
            <Grid container spacing={2}>
                {upLoadList.map((item) => (
                    <Grid item md={6} xs={12}>
                        <SubCard contentSX={{ height: '120px', p: '20px', display: 'flex' }}>
                            <Box>
                                <Box
                                    width="40px"
                                    height="40px"
                                    borderRadius="50%"
                                    sx={{ background: '#673ab74f' }}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <CodeIcon color="secondary" />
                                </Box>
                            </Box>
                            <Box ml={2}>
                                <Typography fontSize={16} fontWeight={500}>
                                    {item.title}
                                </Typography>
                                <Typography margin="10px 0 24px" lineHeight="16px" color="#9da3af">
                                    {item.desc}
                                </Typography>
                                <Box display="flex">
                                    {item.action.map((el) => (
                                        <Box
                                            color="#b5bed0"
                                            fontSize="12px"
                                            display="flex"
                                            alignItems="center"
                                            mr={2}
                                            sx={{ cursor: 'pointer', '&:hover': { color: '#673ab7' } }}
                                        >
                                            <ContentPasteIcon sx={{ fontSize: '12px' }} />
                                            &nbsp;&nbsp; {el}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </SubCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
export default Upload;
