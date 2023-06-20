import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import './textnoWarp.css';

function Template({ data, handleDetail }: any) {
    return (
        <Card sx={{ width: 260, height: 350, overflow: 'hidden', position: 'relative' }}>
            <img
                onClick={() => handleDetail(data)}
                alt="图片"
                className="headImg cursor"
                width="100%"
                height="130"
                style={{ objectFit: 'cover' }}
                src={data.images && data.images[0]}
            />
            <CardContent sx={{ padding: 2 }}>
                <Typography onClick={() => handleDetail(data)} className="active cursor" gutterBottom variant="h3" component="div" my={1}>
                    {data.name}
                </Typography>
                <Typography onClick={() => handleDetail(data)} className="cursor" variant="body2" component="div" lineHeight={1.2}>
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
