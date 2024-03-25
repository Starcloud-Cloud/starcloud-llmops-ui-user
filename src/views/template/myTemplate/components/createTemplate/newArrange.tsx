import { Box, Typography, TextField, Divider, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Image } from 'antd';
import SubCard from 'ui-component/cards/SubCard';

import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HelpIcon from '@mui/icons-material/Help';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import SouthIcon from '@mui/icons-material/South';

import { t } from 'hooks/web/useI18n';

import { stepList } from 'api/template';
import Valida from './newValidaForm';
import ArrangeModal from './arrangeModal';
import { useState, useEffect, memo } from 'react';
import _ from 'lodash-es';

function Arrange({ detail, config, editChange, basisChange, statusChange, changeConfigs, getTableData }: any) {
    const [stepTitle, setStepTitle] = useState<string[]>([]);
    const [modal, setModal] = useState<number>(0);
    const [stepIndex, setStepIndex] = useState<number>(0);
    //弹窗
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const handleClose = () => {
        setRow(null);
        setOpen(false);
    };
    //确认按钮
    const changevariable = ({ values, options }: any) => {
        const oldValue = _.cloneDeep(config);
        if (title === t('myApp.add')) {
            if (!oldValue.steps[modal].variable) {
                oldValue.steps[modal].variable = { variables: [] };
            }
            oldValue.steps[modal].variable.variables.push({ ...values, options });
        } else {
            oldValue.steps[modal].variable.variables[stepIndex] = {
                ...oldValue.steps[modal].variable.variables[stepIndex],
                ...values,
                options
            };
        }
        changeConfigs(oldValue);
        handleClose();
    };
    const [row, setRow] = useState<any>(null);
    //编辑变量
    const editModal = (row: any, i: number, index: number) => {
        setTitle(t('myApp.edit'));
        setRow(row);
        setModal(index);
        setStepIndex(i);
        setOpen(true);
    };
    //删除变量
    const delModal = (i: number, index: number) => {
        setModal(index);
        setStepIndex(i);
        const oldValues = _.cloneDeep(config);
        oldValues.steps[index].variable.variables.splice(i, 1);
        changeConfigs(oldValues);
    };
    const [expanded, setExpanded] = useState<(boolean | null | undefined)[]>([]);
    const expandChange = (index: number) => {
        const newallvalida = [...allvalida];
        newallvalida[index] = (allvalida[index] as number) + 1;
        setallvalida(newallvalida);
        let newValue = _.cloneDeep(expanded);
        newValue = newValue.map((item: boolean | null | undefined) => false);
        newValue[index] = true;
        setExpanded(newValue);
    };
    //判断步骤名称是否重复
    const [errIpt, setErrIpt] = useState<(null | undefined | boolean)[]>([]);
    //步骤名称是显示还是编辑状态
    const [editStatus, setEditStatus] = useState<(boolean | null | undefined)[]>([]);
    //步骤描述是显示还是编辑状态
    const [descStatus, setDescStatus] = useState<(boolean | null | undefined)[]>([]);
    //删除步骤的menu
    const [anchorEl, setAnchorEl] = useState<(null | HTMLElement)[]>([]);
    const menuOpen = anchorEl.map((item) => Boolean(item));
    const menuClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const newVal = [...anchorEl];
        newVal[index] = event.currentTarget;
        setAnchorEl(newVal);
    };
    const menuClose = (index: number) => {
        const newVal = [...anchorEl];
        newVal[index] = null;
        setAnchorEl(newVal);
    };
    //删除步骤
    const delStep = (index: number) => {
        const newValue = _.cloneDeep(config);
        newValue.steps.splice(index, 1);
        changeConfigs(newValue);
    };
    //复制步骤
    const copyStep = (step: any, index: number) => {
        const newStep = _.cloneDeep(step);
        beforeCopy(index, newStep.name, newStep, config.steps);
    };
    const beforeCopy = (index: number, name: string, newStep: any, steps: any) => {
        if (steps.some((item: { name: string }) => item.name === name + '-copy')) {
            beforeCopy(index, name + '-copy', newStep, steps);
        } else {
            const Name = _.cloneDeep(newStep);
            Name.name = name + '-copy';
            Name.field = name + '-copy';
            const newValue = _.cloneDeep(config);
            newValue.steps.splice(index + 1, 0, Name);
            changeConfigs(newValue);
        }
    };
    //移动步骤
    const stepMove = (index: number, direction: number) => {
        const newData = _.cloneDeep(config);
        const temp = newData?.steps[index];
        newData.steps[index] = newData?.steps[index + direction];
        newData.steps[index + direction] = temp;
        changeConfigs(newData);
        setPre(pre + 1);
    };
    //增加步骤
    const [stepLists, setStepList] = useState<{ name: string; field: string; description: string }[]>([]);
    const [addAnchorEl, setAddAnchorEl] = useState<(null | HTMLElement)[]>([]);
    const addOpen = addAnchorEl.map((item) => Boolean(item));
    const addClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const newVal = [...addAnchorEl];
        newVal[index] = event.currentTarget;
        setAddAnchorEl(newVal);
    };
    const addClose = (index: number) => {
        const newVal = [...addAnchorEl];
        newVal[index] = null;
        setAddAnchorEl(newVal);
    };
    const stepEtch = (index: number, name: string, steps: any, newStep: any, i: number) => {
        if (steps.some((item: { name: string }) => item.name === name + index)) {
            stepEtch(index + 1, name, steps, newStep, i);
        } else {
            const Name = _.cloneDeep(newStep);
            Name.name = Name.name + index;
            Name.field = Name.field + index;
            const newValue = _.cloneDeep(config);
            newValue.steps.splice(i + 1, 0, Name);
            changeConfigs(newValue);
            let newVal = [...expanded];
            newVal = newVal.map(() => false);
            newVal[i + 1] = true;
            setExpanded(newVal);
        }
    };
    const addStep = (step: any, index: number) => {
        getTableData(index);
        const newStep = _.cloneDeep(step);
        stepEtch(index + 1, newStep.name, config.steps, newStep, index);
    };
    const [pre, setPre] = useState(0);
    useEffect(() => {
        if (config) {
            setStepTitle(config.steps.map((item: { name: string }) => item.name));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.steps.length, pre]);
    useEffect(() => {
        setallvalidas(
            config?.steps.map((item: any) => item.flowStep.variable?.variables?.some((el: { value: string | null }) => !el.value))
        );
    }, [expanded]);

    //改变值让子组件检测到
    const [allvalida, setallvalida] = useState<(number | null)[]>([]);
    const [allvalidas, setallvalidas] = useState<(boolean | null)[]>([]);
    const getImage = (data: string) => {
        let image: string = '';
        try {
            image = require('../../../../../assets/images/carryOut/' + data + '.svg');
        } catch (errr) {
            image = '';
        }
        return image;
    };
    return (
        <Box>
            <Typography variant="h5" fontSize="1rem" mb={1}>
                {t('myApp.flow')}
            </Typography>
            {config?.steps.map((item: any, index: number) => (
                <Box key={item?.field}>
                    {index !== 0 && (
                        <Box display="flex" justifyContent="center">
                            <SouthIcon />
                        </Box>
                    )}
                    <SubCard
                        sx={{ overflow: 'visible' }}
                        contentSX={{
                            padding: '0 !important',
                            height: '100%',
                            overflow: 'visible'
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: '4px',
                                overflow: 'visible',
                                borderLeft: allvalidas[index] ? '5px solid #ff6376' : 'none'
                            }}
                            height="100px"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box display="flex" alignItems="center" flexWrap="wrap" overflow="visible">
                                <Box
                                    width="3.125rem"
                                    height="3.125rem"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="1px solid rgba(76,76,102,.1)"
                                    borderRadius="6px"
                                    margin="0 8px"
                                >
                                    <Image
                                        preview={false}
                                        style={{ width: '2.5rem', height: '2.5rem' }}
                                        src={getImage(item.flowStep.icon)}
                                        fallback="data:image/png;base64,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"
                                        alt="svg"
                                    />
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="h4">
                                        {t('market.steps')}
                                        {index + 1}：
                                    </Typography>
                                    {!editStatus[index] && (
                                        <Typography
                                            noWrap
                                            sx={{ maxWidth: { xs: '90px', sm: '200px', md: '450px', lg: '160px' } }}
                                            variant="h4"
                                        >
                                            {item.name}
                                        </Typography>
                                    )}
                                    {editStatus[index] && (
                                        <Box sx={{ width: { xs: '90px', sm: '180px', md: '400px', lg: '140px' } }}>
                                            <TextField
                                                onBlur={() => {
                                                    const newVal = [...errIpt];
                                                    if (!stepTitle[index]) {
                                                        const newValue = { ...editStatus };
                                                        newValue[index] = false;
                                                        setEditStatus(newValue);
                                                    } else if (
                                                        config?.steps.every((value: { name: string }, i: number) => {
                                                            if (index === i) {
                                                                return true;
                                                            } else {
                                                                return value.name !== item.name;
                                                            }
                                                        })
                                                    ) {
                                                        newVal[index] = false;
                                                        setErrIpt(newVal);
                                                        const newValue = { ...editStatus };
                                                        newValue[index] = false;
                                                        setEditStatus(newValue);
                                                        editChange({ num: index, label: 'name', value: stepTitle[index], flag: true });
                                                    } else {
                                                        newVal[index] = true;
                                                        setErrIpt(newVal);
                                                    }
                                                }}
                                                error={errIpt[index] ? true : false}
                                                onChange={(e) => {
                                                    const { value }: { name: string; value: string } = e.target;
                                                    const titIndex = [...stepTitle];
                                                    titIndex[index] = value;
                                                    setStepTitle(titIndex);
                                                }}
                                                helperText={errIpt[index] ? '步骤名称不能重复' : ' '}
                                                name="name"
                                                fullWidth
                                                autoFocus
                                                value={stepTitle[index]}
                                                variant="standard"
                                            />
                                        </Box>
                                    )}
                                    {/* 编辑名称和描述 */}
                                    {expanded[index] && (
                                        <>
                                            <Tooltip placement="top" title={t('market.editName')}>
                                                <IconButton
                                                    onClick={() => {
                                                        if (stepTitle[index] === '') {
                                                            const val = [...stepTitle];
                                                            val[index] = JSON.parse(JSON.stringify(item.name));
                                                            setStepTitle(val);
                                                        }
                                                        const newValue = { ...editStatus };
                                                        newValue[index] = true;
                                                        setEditStatus(newValue);
                                                    }}
                                                    size="small"
                                                >
                                                    <BorderColorIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Box display="inline-block" position="relative">
                                                <Tooltip placement="top" title={item.description ? item.description : t('market.addDesc')}>
                                                    <IconButton
                                                        onClick={() => {
                                                            const newValue = { ...editStatus };
                                                            newValue[index] = true;
                                                            setDescStatus(newValue);
                                                        }}
                                                        size="small"
                                                    >
                                                        <ChatBubbleIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {descStatus[index] && (
                                                    <Box position="absolute" bottom="-120px" right="-200px" zIndex={10} width="380px">
                                                        <TextField
                                                            onBlur={() => {
                                                                const newValue = { ...editStatus };
                                                                newValue[index] = false;
                                                                setDescStatus(newValue);
                                                            }}
                                                            onChange={(e) =>
                                                                editChange({ num: index, label: e.target.name, value: e.target.value })
                                                            }
                                                            autoFocus
                                                            name="description"
                                                            fullWidth
                                                            value={item.description}
                                                            multiline
                                                            minRows={4}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center">
                                {!expanded[index] && (
                                    <Button
                                        onClick={() => {
                                            expandChange(index);
                                        }}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        startIcon={<BorderColorIcon />}
                                    >
                                        {t('market.desc')}
                                    </Button>
                                )}
                                {expanded[index] && (
                                    <Tooltip placement="top" title={item.flowStep.description}>
                                        <HelpIcon fontSize="small" />
                                    </Tooltip>
                                )}
                                <IconButton
                                    aria-controls={menuOpen[index] ? 'del' + index : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen[index] ? 'true' : undefined}
                                    onClick={(e) => {
                                        menuClick(e, index);
                                    }}
                                >
                                    <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                    id={'del' + index}
                                    open={menuOpen[index] ? true : false}
                                    onClose={() => {
                                        menuClose(index);
                                    }}
                                    anchorEl={anchorEl[index]}
                                >
                                    <MenuItem
                                        disabled={config?.steps.length === 1}
                                        onClick={() => {
                                            delStep(index);
                                            const newVal = [...anchorEl];
                                            newVal[index] = null;
                                            setAnchorEl(newVal);
                                        }}
                                    >
                                        <DeleteIcon color="error" />
                                        {t('market.delete')}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            copyStep(item, index);
                                            const newVal = [...anchorEl];
                                            newVal[index] = null;
                                            setAnchorEl(newVal);
                                        }}
                                    >
                                        <ContentPasteIcon color="secondary" />
                                        复制
                                    </MenuItem>
                                    <MenuItem
                                        disabled={index === 0}
                                        onClick={() => {
                                            stepMove(index, -1);
                                            const newVal = [...anchorEl];
                                            newVal[index] = null;
                                            setAnchorEl(newVal);
                                        }}
                                    >
                                        <ExpandLessIcon color="secondary" />
                                        向上移动
                                    </MenuItem>
                                    <MenuItem
                                        disabled={index === config?.steps.length - 1}
                                        onClick={() => {
                                            stepMove(index, 1);
                                            const newVal = [...anchorEl];
                                            newVal[index] = null;
                                            setAnchorEl(newVal);
                                        }}
                                    >
                                        <ExpandMoreIcon color="secondary" />
                                        向下移动
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                        {expanded[index] && <Divider />}
                        {expanded[index] && (
                            <Box
                            // sx={{ display: expanded[index] ? 'block' : 'none' }}
                            >
                                <Valida
                                    key={item.field}
                                    title={item.name}
                                    handler={item?.flowStep?.handler}
                                    variable={item.variable?.variables}
                                    variables={item.flowStep.variable?.variables}
                                    responent={item.flowStep.response}
                                    buttonLabel={item.buttonLabel}
                                    basisChange={basisChange}
                                    index={index}
                                    allvalida={allvalida[index]}
                                    fields={item.field}
                                    setModal={(i) => {
                                        setModal(i);
                                    }}
                                    setOpen={setOpen}
                                    setTitle={setTitle}
                                    editChange={editChange}
                                    statusChange={statusChange}
                                    editModal={editModal}
                                    delModal={delModal}
                                />
                            </Box>
                        )}
                    </SubCard>
                    <Box textAlign="center" fontSize="25px" fontWeight={600} mt={1}>
                        |
                    </Box>
                    <IconButton
                        aria-controls={addOpen[index] ? 'add' + index : undefined}
                        aria-haspopup="true"
                        aria-expanded={addOpen[index] ? 'true' : undefined}
                        onClick={(e) => {
                            stepList(detail?.type).then((res) => {
                                setStepList(res);
                            });
                            addClick(e, index);
                        }}
                        color="secondary"
                        sx={{ display: 'block', margin: '0 auto', fontSize: 'unset' }}
                    >
                        <AddCircleSharpIcon />
                    </IconButton>
                    <Menu
                        id={'add' + index}
                        open={addOpen[index] ? true : false}
                        onClose={() => {
                            addClose(index);
                        }}
                        anchorEl={addAnchorEl[index]}
                    >
                        {stepLists.map((step) => (
                            <MenuItem
                                sx={{ display: 'block', maxWidth: '500px', whiteSpace: 'normal' }}
                                key={step.field}
                                onClick={() => {
                                    addStep(step, index);
                                    const newVal = [...anchorEl];
                                    newVal[index] = null;
                                    setAddAnchorEl(newVal);
                                }}
                            >
                                <Typography variant="h5">{step.name}</Typography>
                                <Typography>{step.description}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            ))}
            {open && (
                <ArrangeModal
                    open={open}
                    handleClose={handleClose}
                    title={title}
                    detail={detail}
                    row={row}
                    modal={modal}
                    changevariable={changevariable}
                />
            )}
        </Box>
    );
}
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.config?.steps) === JSON.stringify(nextProps?.config?.steps) &&
        JSON.stringify(prevProps?.detail?.type) === JSON.stringify(nextProps?.detail?.type)
    );
};
export default memo(Arrange, arePropsEqual);
