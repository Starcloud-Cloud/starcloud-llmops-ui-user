import { Card, CardContent, Box, Typography, Tooltip, Link, Button, Chip, Divider, Switch } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './skillCard.scss';
import { delSkill, modifySkill } from 'api/chat';
import { Confirm } from 'ui-component/Confirm';
import { useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import workflow from 'assets/images/chat/workflow.svg';

function SkillCard({ data, handleCreate, handleEdit, forceUpdate, workflowList }: any) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleAble = () => {
        const values: any = {
            uid: data.uid,
            type: data.type,
            appConfigId: data.appConfigId,
            disabled: !data.disabled
        };
        if (data.type === 5) {
            values.systemHandlerSkillDTO = {
                name: data.name,
                desc: data.description,
                copyWriting: data.copyWriting,
                code: data.code,
                icon: data.images
            };
        }
        if (data.type === 3) {
            values.appWorkflowSkillDTO = {
                name: data.name,
                desc: data.description,
                copyWriting: data.copyWriting,
                skillAppUid: data.skillAppUid,
                icon: data.images,
                appType: data?.appType,
                defaultPromptDesc: data.defaultPromptDesc
            };
        }

        modifySkill(values).then((res: any) => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '修改成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
            forceUpdate();
        });
    };

    const handleDelete = () => {
        delSkill(data.uid).then((res) => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '删除成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
            forceUpdate();
        });
    };

    const handleTag = (data: any) => {
        if (data.type === 5 || data.type === 'system') {
            return '系统';
        }
        if ((data.type === 3 && data.appType === 1) || data.type === 'market') {
            return '应用市场';
        }
        if ((data.type === 3 && data.appType === 0) || data.type === 'MYSELF') {
            return '我的应用';
        }
    };

    const handleDisabled = (data: any) => {
        // 系统的通过这个判断 // TODO别的后面再加
        if (data.type === 'system') {
            const codeList = workflowList.map((v: any) => v.code);
            return codeList.includes(data.code);
        }
    };

    return (
        <Card
            sx={{
                aspectRatio: '186 / 235',
                overflow: 'hidden',
                border: '1px solid',
                position: 'relative',
                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 15 : 'rgba(230,230,231,1)',
                ':hover': {
                    boxShadow: theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 5px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Box sx={{ aspectRatio: '186 / 80', overflow: 'hidden' }}>
                {/* {!data.images ? (
                    <svg
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="200"
                        height="200"
                        onClick={() => handleEdit(data)}
                    >
                        <path
                            d="M689.737143 650.496c8.996571-5.339429 18.797714-9.435429 29.220571-12.105143a28.233143 28.233143 0 0 1-0.219428-3.474286v-27.940571a27.940571 27.940571 0 0 1 55.881143 0v27.940571a28.196571 28.196571 0 0 1-0.219429 3.474286c10.386286 2.669714 20.224 6.765714 29.257143 12.105143a28.233143 28.233143 0 0 1 2.267428-2.596571l19.748572-19.748572a27.940571 27.940571 0 1 1 39.497143 39.497143l-19.748572 19.748571a28.16 28.16 0 0 1-2.56 2.304c5.302857 9.033143 9.435429 18.834286 12.068572 29.257143a28.233143 28.233143 0 0 1 3.474285-0.219428h27.940572a27.940571 27.940571 0 1 1 0 55.881143h-27.940572a28.16 28.16 0 0 1-3.474285-0.219429 111.067429 111.067429 0 0 1-12.068572 29.257143c0.877714 0.658286 1.755429 1.462857 2.56 2.267428l19.748572 19.748572a27.940571 27.940571 0 1 1-39.497143 39.497143l-19.748572-19.748572a28.233143 28.233143 0 0 1-2.304-2.56 111.067429 111.067429 0 0 1-29.257142 12.068572 28.196571 28.196571 0 0 1 0.256 3.474285v27.940572a27.940571 27.940571 0 1 1-55.881143 0v-27.940572c0-1.170286 0.073143-2.304 0.219428-3.474285a111.067429 111.067429 0 0 1-29.257143-12.068572 28.233143 28.233143 0 0 1-2.304 2.56l-19.748571 19.748572a27.940571 27.940571 0 1 1-39.497143-39.497143l19.748572-19.748572a28.269714 28.269714 0 0 1 2.596571-2.304 111.067429 111.067429 0 0 1-12.105143-29.257142 28.16 28.16 0 0 1-3.474286 0.256h-27.940571a27.940571 27.940571 0 0 1 0-55.881143h27.940571c1.170286 0 2.340571 0.073143 3.474286 0.219428 2.669714-10.422857 6.765714-20.224 12.105143-29.257143a28.16 28.16 0 0 1-2.596571-2.304l-19.748572-19.748571a27.940571 27.940571 0 1 1 39.497143-39.497143l19.748571 19.748572a28.233143 28.233143 0 0 1 2.304 2.596571zM914.285714 582.436571A233.947429 233.947429 0 0 0 746.678857 512a234.057143 234.057143 0 0 0-172.397714 75.446857h-11.995429v14.043429A233.691429 233.691429 0 0 0 512 746.678857c0 65.645714 26.953143 125.001143 70.436571 167.606857H182.857143a73.142857 73.142857 0 0 1-73.142857-73.142857V182.857143a73.142857 73.142857 0 0 1 73.142857-73.142857h658.285714a73.142857 73.142857 0 0 1 73.142857 73.142857v399.579428z m-640.950857-197.485714l-37.924571 36.059429 106.057143 116.114285L512 374.747429l-35.328-38.729143-132.644571 126.354285-70.692572-77.421714z m0 201.142857l-37.924571 36.059429 106.057143 116.114286L512 575.890286l-35.328-38.729143-132.644571 126.354286-70.692572-77.421715z m288.950857-199.789714v50.249143h201.142857v-50.249143h-201.142857z m184.393143 416.219429a55.881143 55.881143 0 1 0 0-111.725715 55.881143 55.881143 0 0 0 0 111.725715z"
                            fill="#6580A9"
                            p-id="1616"
                        ></path>
                    </svg>
                ) : ( */}
                <img
                    onClick={() => handleEdit(data)}
                    alt="图片"
                    className="headImg cursor"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                    src={data.images || workflow}
                />
                {/* )} */}
            </Box>
            <CardContent
                sx={{
                    px: 2,
                    pt: 1,
                    position: 'relative',
                    overflow: 'hidden'
                }}
                className="pb-[18px]"
            >
                <Tooltip disableInteractive title={data.name}>
                    <Typography
                        onClick={() => handleEdit(data)}
                        className="skillCard active cursor"
                        gutterBottom
                        variant="h3"
                        sx={{ fontSize: '1.1rem' }}
                        component="div"
                        my={1}
                    >
                        {data.name}
                    </Typography>
                </Tooltip>
                <Tooltip disableInteractive title={data.description}>
                    <Typography
                        sx={{ fontSize: '.8rem', height: '36px' }}
                        onClick={() => handleEdit(data)}
                        className="cursor desc"
                        variant="body2"
                        lineHeight="1.1rem"
                    >
                        {data.description}
                    </Typography>
                </Tooltip>
            </CardContent>
            <div className="py-[8px] px-1 flex justify-between items-center absolute bottom-0 w-full border-t-[1px] border-solid border-[#e3e8ef]">
                <Chip label={handleTag(data)} size={'small'} className="h-[20px]" variant={'outlined'} />
                <Button
                    className="!py-[2px] !min-w-[45px] !px-[5px] leading-5"
                    variant="contained"
                    size={'small'}
                    color="secondary"
                    disabled={handleDisabled(data)}
                    onClick={() => handleCreate(data)}
                >
                    添加
                </Button>
            </div>
            {handleEdit && (
                <div className="mt-[7px] px-1 flex justify-between items-center">
                    <div>
                        <span className="text-sm">{data.disabled ? '关闭' : '开启'}</span>
                        <Switch color={'secondary'} size={'small'} checked={!data.disabled} onClick={handleAble} />
                    </div>
                    <Button size={'small'} color="secondary" onClick={() => setOpen(true)}>
                        删除
                    </Button>
                </div>
            )}
            <Confirm open={open} handleClose={() => setOpen(false)} handleOk={handleDelete} />
        </Card>
    );
}

export default SkillCard;
