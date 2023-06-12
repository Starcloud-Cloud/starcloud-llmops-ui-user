import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import './textnoWarp.css';

function Template({ handleDetail }: any) {
    const goDetail = () => {
        handleDetail();
    };
    return (
        <Card sx={{ width: 260, height: 350, overflow: 'hidden', position: 'relative', marginRight: '20px' }}>
            <img
                onClick={goDetail}
                alt="图片"
                className="headImg cursor"
                width="100%"
                height="130"
                style={{ objectFit: 'cover' }}
                src="https://download.hotsalecloud.com/wp-plugins/img/template_img/default/Custom.jpg"
            />
            <CardContent sx={{ padding: 2 }}>
                <Typography onClick={goDetail} className="active cursor" gutterBottom variant="h3" component="div" my={1}>
                    亚马逊生成模板
                </Typography>
                <Typography onClick={goDetail} className="cursor" variant="body2" component="div" lineHeight={1.2}>
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except
                    Antarctica
                </Typography>
            </CardContent>
            <Link href="#" className="active cursor underline" position="absolute" left="8px" bottom="8px" fontSize={14}>
                #Link
            </Link>
        </Card>
    );
}

export default Template;
