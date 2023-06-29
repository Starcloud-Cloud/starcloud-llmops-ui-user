import ChevronRight from '@mui/icons-material/ChevronRight';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { Item } from 'types/template';
import './textnoWarp.css';
function MyselfTemplate({ data }: { data: Item }) {
    return (
        <Card sx={{ height: 150 }}>
            <Box display="flex" alignItems="center" p={2}>
                <ChevronRight sx={{ fontSize: '80px' }} />
                <Box overflow="hidden">
                    <Typography variant="h3" noWrap width="100%" mb={0.5}>
                        {data.name}
                    </Typography>
                    <div className="textnoWarp">{data.description} </div>
                    <Box fontSize={12}>
                        {data.categories.map((el) => (
                            <Link href="#" fontSize={14} mr={0.5}>
                                {el}
                            </Link>
                        ))}
                    </Box>
                    <Box fontSize={14} mt={0.5}>
                        {data.tags.map((el) => (
                            <Chip label={el} size="small" variant="outlined" />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}

export default MyselfTemplate;
