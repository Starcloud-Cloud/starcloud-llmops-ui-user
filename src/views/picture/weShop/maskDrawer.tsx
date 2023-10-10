import { Box, Grid, Typography, Tabs, Tab, Link, TextField, Chip, Button } from '@mui/material';
import { useState } from 'react';
import { Drawer, Upload, Image } from 'antd';
import type { UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import avatar from 'assets/images/pay/people1.png';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box py={2}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}
const MaskDrawer = ({ open, setOpen }: { open: boolean; setOpen: (data: boolean) => void }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const { Dragger } = Upload;
    const getBase64 = (img: any, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };
    const props: UploadProps = {
        name: 'file',
        showUploadList: false,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/dataset-source-data/uploadFiles`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        accept: '.png, .jpg, .jpeg, .bmp, .tif, .tiff',
        onChange(info) {
            console.log(info);

            if (info.file.status === 'uploading') {
                setLoading(true);
            } else if (info.file.status === 'done') {
                getBase64(info.file.originFileObj, (url) => {
                    setLoading(false);
                    setImageUrl(url);
                });
            }
            // else if (status === 'error') {
            // }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    const [maskValue, setMaskValue] = useState(0);
    const maskChange = (event: React.SyntheticEvent, newValue: number) => {
        setMaskValue(newValue);
    };
    const [active, setActive] = useState<null | number>(null);
    return (
        <Drawer
            width="80%"
            style={{ overflow: 'hidden' }}
            bodyStyle={{ width: '100%', position: 'relative' }}
            placement="right"
            closable={false}
            onClose={() => setOpen(false)}
            open={open}
            getContainer={false}
        >
            <Box width="100%" height="100%" sx={{ overflowX: 'hidden', overflowY: 'auto', pb: '65px' }}>
                <Grid container spacing={1} flexWrap="wrap">
                    <Grid item md={6} sx={{ aspectRatio: '1/1' }}>
                        {imageUrl ? (
                            <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                            <Dragger {...props}>
                                <div>
                                    {loading ? (
                                        <p className="ant-upload-drag-icon">
                                            <LoadingOutlined rev={undefined} />
                                        </p>
                                    ) : (
                                        <p className="ant-upload-drag-icon">
                                            <PlusOutlined rev={undefined} />
                                        </p>
                                    )}
                                    <p className="ant-upload-text">点击上传或直接将图片文件拖入区域</p>
                                    <p className="ant-upload-hint">大小不超过10MB，宽度比小于2，格式不支持gif格式</p>
                                </div>
                            </Dragger>
                        )}
                        <Typography mt={0.5} textAlign="center" color="#697586">
                            原图
                        </Typography>
                    </Grid>
                    <Grid item md={6} sx={{ aspectRatio: '1/1' }}>
                        {imageUrl ? (
                            <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                            <Dragger {...props}>
                                <div>
                                    {loading ? (
                                        <p className="ant-upload-drag-icon">
                                            <LoadingOutlined rev={undefined} />
                                        </p>
                                    ) : (
                                        <p className="ant-upload-drag-icon">
                                            <PlusOutlined rev={undefined} />
                                        </p>
                                    )}
                                    <p className="ant-upload-text">点击上传或直接将图片文件拖入区域</p>
                                    <p className="ant-upload-hint">大小不超过10MB，宽度比小于2，格式不支持gif格式</p>
                                </div>
                            </Dragger>
                        )}
                        <Typography mt={0.5} textAlign="center" color="#697586">
                            选区图，或<Link color="#697586">上传一张蒙版图</Link>
                        </Typography>
                    </Grid>
                </Grid>
                <Tabs value={maskValue} onChange={maskChange}>
                    <Tab label="文字描述" {...a11yProps(0)} />
                    <Tab label="快捷模板" {...a11yProps(1)} />
                    <Tab label="高级自定义" {...a11yProps(2)} />
                    <Tab label="复刻其他任务" {...a11yProps(3)} />
                </Tabs>
                <CustomTabPanel value={maskValue} index={0}>
                    <Box>
                        <TextField multiline minRows={3} maxRows={3} fullWidth />
                        <Typography mt={3} variant="h5">
                            描述你想要生成的图片内容，支持中英文，例如：
                        </Typography>
                        <ul
                            style={{ listStylePosition: 'inside', color: '#697586', fontSize: '14px', lineHeight: '22px' }}
                            className="mt-[12px]"
                        >
                            <li>穿着碎花连衣裙的女孩走在东京街头</li>
                            <li>胖胖的可爱小男孩在海边玩沙子</li>
                            <li>一张豪华真皮沙发放置在酒店的大堂</li>
                            <li>变形金刚玩具出现在火星基地</li>
                        </ul>
                        <Typography mt={3} variant="h5">
                            也可以非常详细地描述画面中的人物、地点、动作、时间、天气、环境、道具、气氛等要素，并同时指定拍摄的手法，如“iPhone拍摄、眼神看向镜头、大景深”。
                        </Typography>
                        <Typography my="12px" fontWeight={500}>
                            案例一：
                        </Typography>
                        <Typography>
                            一位年轻的中国女性，蓬松的金色短发，纹身，高度细致的皮肤，逼真的细节眼睛，自然的皮肤纹理，自信的表情，时髦的嘻哈装扮，走在背景是
                        </Typography>
                        <Typography my="12px" fontWeight={500}>
                            案例二：
                        </Typography>
                        <Typography>
                            A beautiful and elegant woman wearing a deep red V-neck dress is posing for a photo on a sailboat in front of a
                            Hawaiian beach in the year 2020. The image should have a vintage film feel with a warm color tone and faded
                            effect. The woman should be the main focus of the image, with the sailboat and beach in the background. Please
                            use Artstation as a reference and include intricate details and hyperdetailed elements.{' '}
                        </Typography>
                    </Box>
                </CustomTabPanel>
                <CustomTabPanel value={maskValue} index={1}>
                    <Box>
                        <Typography variant="h5" mb={2}>
                            面具（下列头像仅代表模特类型和性别）
                        </Typography>
                        <Grid container spacing={2} flexWrap="wrap">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item, index) => (
                                <Grid item md={2}>
                                    <Image
                                        onClick={() => setActive(index)}
                                        preview={false}
                                        style={{
                                            borderRadius: '10px',
                                            outlineOffset: '2px',
                                            outlineColor: active === index ? '#673ab7' : 'transparent',
                                            outlineStyle: 'solid',
                                            cursor: 'pointer'
                                        }}
                                        src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Typography variant="h5" my={2}>
                            地点
                        </Typography>
                        <Grid container spacing={2} flexWrap="wrap">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item, index) => (
                                <Grid item md={2}>
                                    <Image
                                        onClick={() => setActive(index)}
                                        preview={false}
                                        style={{
                                            borderRadius: '10px',
                                            outlineOffset: '2px',
                                            outlineColor: active === index ? '#673ab7' : 'transparent',
                                            outlineStyle: 'solid',
                                            cursor: 'pointer'
                                        }}
                                        src={avatar}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </CustomTabPanel>
                <CustomTabPanel value={maskValue} index={2}>
                    <Typography variant="h5" mb={2}>
                        算法倾向
                    </Typography>
                    <Chip color="secondary" variant="outlined" label="自由发挥" />
                    <Chip sx={{ ml: 1 }} label="参考原图" variant="outlined" />
                    <Grid container spacing={2}>
                        <Grid item md={6}>
                            <Typography variant="h5" my={2}>
                                请输入
                                <Typography variant="h5" component="span" color="secondary">
                                    正向
                                </Typography>
                                咒语，当前仅支持英文（必填）
                            </Typography>
                            <TextField multiline minRows={6} fullWidth />
                        </Grid>
                        <Grid item md={6}>
                            <Typography variant="h5" my={2}>
                                请输入
                                <Typography variant="h5" component="span" color="secondary">
                                    反向
                                </Typography>
                                咒语，当前仅支持英文（非必填）
                            </Typography>
                            <TextField multiline minRows={6} fullWidth />
                        </Grid>
                    </Grid>
                    <Typography mt={3} variant="h5">
                        描述你想要生成的图片内容：一个简单的词组，一些简单的句子。咒语之间用英文逗号隔开。不要输入敏感词汇，否则无法生成。高级自定义目前仅支持英文(可结合翻译软件服用，效果不受影响）。如：
                    </Typography>
                    <ul
                        style={{ listStylePosition: 'inside', color: '#697586', fontSize: '14px', lineHeight: '22px' }}
                        className="mt-[12px]"
                    >
                        <li>
                            A beautiful girl ,wearing Hanging neck vest，sleeveless，Carrying a shoulder bag，Smoked Makeup，outdoors,
                            bright light blue sky
                        </li>
                        <li>A cat lies on a desk full of books, bagels, grass dinner plate</li>
                    </ul>
                    <Typography mt={3} variant="h5">
                        正向咒语：尽量使用正面的语言来描述需求，避免使用否定的词语。良好的句子结构和精确的描述会让生成的商品场景还原度更高且丰富有层次。想加强的部分，用()，(())来强调权重，如果某个部分很重要，可以改变一下该咒语的顺序，顺序越靠前，被赋予的权重越高。想要生成某种风格图片，可以指定摄影器材，相机型号，镜头，如：
                    </Typography>
                    <Typography my="12px" fontWeight={500}>
                        范例一：
                    </Typography>
                    <Typography>
                        1girl, a beautiful and fitness girl, ((tall)), ((long legs)), in sneaks, short hair, in black hoodie, umbilical
                        cord, in gym, fitness equipments, colorful background, left hand in front of her chest, in black mask,lights,wood
                        and steel,sunshine, bright lights
                    </Typography>
                    <Typography my="12px" fontWeight={500}>
                        范例二：
                    </Typography>
                    <Typography>
                        street style photo of a nattractive 25 year old woman, fullbody shot,wearing Floral suspender skirt,highly detailed
                        skin and hair soho ShangHai, Ektar100, 4k{' '}
                    </Typography>
                    <Typography mt={3} variant="h5">
                        反向咒语：反向即“不要”，不需要额外写“not、don't、should't”等。不需要太长的句子，只需要写单词即可。
                    </Typography>
                    <Typography my="12px" fontWeight={500}>
                        范例一：
                    </Typography>
                    <Typography>
                        cartoons, anime, bad proportions, nude, big head, no neck, extra legs, uncoordinated limbs, weird feet, weird toes,
                        no legs, no feet
                    </Typography>
                </CustomTabPanel>
                <CustomTabPanel value={maskValue} index={3}>
                    <Typography mt={3} variant="h5">
                        在当前任务中复刻指定的任务号，选择其中一张生成图进行模特和场景的复刻，即可完成同模特同场景的多图展示。
                    </Typography>
                    <Typography my={3} variant="h5">
                        【复刻任务】操作要点及操作教程：
                    </Typography>
                    <ul
                        style={{ listStylePosition: 'inside', color: '#697586', fontSize: '14px', lineHeight: '22px' }}
                        className="mt-[12px]"
                    >
                        <li>如需实现同商品套图。复刻任务上传的原图须与被复刻任务为同一个商品的图片（同款同色，不同展示角度的商品图）</li>
                        <li>被复刻的任务（即原任务），请选用模特正脸的照片，如果是侧脸图，效果则无法保证</li>
                        <li>复刻任务图中模特面部占比与被复刻任务中模特面部图片占比需保持一致。反之，则效果无法保证</li>
                    </ul>
                </CustomTabPanel>
            </Box>
            <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                position="absolute"
                bottom="0"
                alignItems="center"
                p="0 55px 0 0"
                height="65px"
                sx={{ background: '#fff', borderTop: '1px solid #eeeeee' }}
            >
                <Typography variant="h5">
                    本次任务将消耗
                    <Typography component="span" variant="h5">
                        200
                    </Typography>
                    点魔法豆
                </Typography>
                <Button color="secondary" variant="outlined" sx={{ width: '200px' }}>
                    执行
                </Button>
            </Box>
        </Drawer>
    );
};
export default MaskDrawer;
