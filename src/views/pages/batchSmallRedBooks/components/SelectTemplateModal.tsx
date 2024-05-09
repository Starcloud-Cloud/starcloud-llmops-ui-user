import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import { Menu, MenuProps, Image, Empty } from 'antd';
import React, { useEffect } from 'react';

export const SelectTemplateModal = ({
    open,
    imageTypeList,
    handleClose,
    handleOk
}: {
    open: boolean;
    imageTypeList: any[];
    handleClose: () => void;
    handleOk: (temp: any) => void;
}) => {
    const [menuList, setMenuList] = React.useState<any[]>([]);
    const [templateList, setTemplateList] = React.useState<any[]>([]);
    const [current, setCurrent] = React.useState('');
    const [type, setType] = React.useState<any[]>([]);

    useEffect(() => {
        const menus = imageTypeList?.map((item: any) => ({
            label: `${item.name}(${item.list.length})`,
            value: item.code,
            key: item.code,
            list: item.list
        }));
        setMenuList(menus);
        const firstType = menus?.[0]?.value;
        setType([firstType]);
        setTemplateList(menus?.[0]?.list);
    }, []);

    const onClick: MenuProps['onClick'] = ({ item }: { item: any }) => {
        const templates = item?.props.list;
        setType([item?.props?.value]);
        setTemplateList(templates);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
                '& > div:focus-visible': { outline: 'none' }
            }}
            style={{
                zIndex: 99999
            }}
        >
            <MainCard
                style={{
                    position: 'absolute',
                    width: '1000px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="选择风格"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent className="h-[520px] overflow-hidden">
                    <div className="flex">
                        <div className="w-[155px] overflow-y-auto h-[520px] pb-[30px]">
                            <Menu onClick={onClick} style={{ width: 150 }} selectedKeys={type} mode="inline" items={menuList} />
                        </div>
                        {templateList.length ? (
                            <div className="grid grid-cols-4 gap-4 ml-3 overflow-y-auto h-[520px] flex-1 p-[3px] pb-[55px]">
                                {templateList.map((v: any, i) => (
                                    <img
                                        className={`h-auto max-w-full rounded-lg cursor-pointer ${
                                            v.code === current && 'outline outline-offset-2 outline-1 outline-blue-500'
                                        }`}
                                        src={v.example}
                                        key={i}
                                        onClick={() => setCurrent(v.code)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center flex-1">
                                <Empty />
                            </div>
                        )}
                    </div>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            type="button"
                            color={'secondary'}
                            onClick={() => {
                                const temp = templateList.find((v) => v.code === current);
                                handleOk(temp);
                            }}
                        >
                            确认
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
