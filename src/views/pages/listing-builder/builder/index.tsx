import { Button, Card, CardHeader, Divider, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { KeyWord } from './components/Keyword';
import { Content } from './components/Content';
import { Dropdown, MenuProps } from 'antd';

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        )
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                2nd menu item (disabled)
            </a>
        ),
        disabled: true
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                3rd menu item (disabled)
            </a>
        ),
        disabled: true
    },
    {
        key: '4',
        danger: true,
        label: 'a danger item'
    }
];

const ListingBuilder = () => {
    return (
        <Card className="h-full">
            <CardHeader
                sx={{ padding: 2 }}
                title={
                    <div>
                        <Dropdown menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()}>中国</a>
                        </Dropdown>
                    </div>
                }
                action={
                    <div>
                        <Button startIcon={<SaveIcon />} color="secondary" size="small" variant="contained">
                            保存草稿
                        </Button>
                        <IconButton></IconButton>
                    </div>
                }
            />
            <Divider />
            <div className="flex bg-[#f4f6f8] h-full">
                <div className="w-[400px] h-full">
                    <KeyWord />
                </div>
                <div className="flex-1 h-full ml-2">
                    <Content />
                </div>
            </div>
        </Card>
    );
};

export default ListingBuilder;
