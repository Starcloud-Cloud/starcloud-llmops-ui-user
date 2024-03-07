import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import { Menu, MenuProps, Row, Col, Empty } from 'antd';
import React, { useEffect } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const SelectApp = ({
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
            label: `${item.name}(${item.appConfigurationList.length})`,
            value: item.code,
            key: item.code,
            list: item.appConfigurationList
        }));
        menus?.forEach((item) => {
            if (item.value === 'ALL') {
                item.label = `${item.label?.split('(')[0]}(${imageTypeList?.map((el) => el.appConfigurationList)?.flat()?.length})`;
                item.list = imageTypeList?.map((el) => el.appConfigurationList)?.flat();
            }
        });
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
        >
            <MainCard
                style={{
                    position: 'absolute',
                    width: '1000px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="选择应用"
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
                            <Row gutter={16} className="flex-1">
                                {templateList.map((v: any, i) => (
                                    <Col key={i} span={8}>
                                        <div
                                            className={`w-full border border-solid border-black/20 rounded-lg p-4 hover:shadow-md cursor-pointer ${
                                                v.appUid === current && 'outline outline-offset-2 outline-1 outline-blue-500'
                                            }`}
                                            onClick={() => setCurrent(v?.appUid)}
                                        >
                                            <div className="text-[16px] font-bold">{v?.appName}</div>
                                            <div className="text-[12px] text-black/40 my-2 line-clamp-3">{v?.description}</div>
                                            <div>
                                                步骤数：<span>{v?.stepCount || '-'}</span>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
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
                                const temp = templateList.find((v) => v.appUid === current);
                                if (temp) {
                                    handleOk(temp);
                                } else {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '请选择一个应用',
                                            variant: 'alert',
                                            alert: {
                                                color: 'error'
                                            },
                                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                            transition: 'SlideDown',
                                            close: false
                                        })
                                    );
                                }
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
export default SelectApp;
