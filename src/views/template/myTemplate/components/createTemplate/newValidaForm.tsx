import {
    Box,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Tooltip,
    Chip,
    FormControlLabel
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { t } from 'hooks/web/useI18n';
import { Divider, Popconfirm, Input, Collapse } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import Add from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import _ from 'lodash-es';
import { Validas, Rows } from 'types/template';
import FormExecute from 'views/template/components/newValidaForm';
import { useState, memo, useEffect, useRef } from 'react';
const Valida = ({
    handler,
    variable,
    variables,
    responent,
    fields,
    basisChange,
    index,
    allvalida,
    setModal,
    setOpen,
    setTitle,
    statusChange,
    editModal,
    delModal
}: Validas) => {
    const { TextArea } = Input;
    const { Panel } = Collapse;
    const [pre, setPre] = useState(0);
    useEffect(() => {
        if (variables.some((value: any) => !value.value)) {
            setPre(pre + 1);
        }
    }, [allvalida]);
    const iptRef = useRef<any | null>(null);
    const changePrompt = (field: string, i: number) => {
        const newVal = _.cloneDeep(variables);
        const part1 = newVal[i].value.slice(0, iptRef?.current?.resizableTextArea?.textArea?.selectionStart);
        const part2 = newVal[i].value.slice(iptRef?.current?.resizableTextArea?.textArea?.selectionStart);
        newVal[i].value = `${part1}{STEP.${fields}.${field}}${part2}`;
        basisChange({ e: { name: 'prompt', value: newVal[i].value }, index, i, flag: false, values: true });
    };
    return (
        <div className="py-2">
            <form>
                <Collapse defaultActiveKey={['1']}>
                    <Panel
                        header={
                            <div className="flex items-center gap-2">
                                {handler === 'VariableActionHandler' ||
                                handler === 'MaterialActionHandler' ||
                                variables?.find((item) => item.field === 'prompt')?.value ? (
                                    <CheckCircleIcon fontSize="small" color="success" />
                                ) : (
                                    <CancelIcon fontSize="small" color="error" />
                                )}
                                <div>
                                    {handler === 'VariableActionHandler' || handler === 'MaterialActionHandler'
                                        ? '变量'
                                        : t('market.prompt')}
                                </div>
                            </div>
                        }
                        key="1"
                    >
                        {variables?.map(
                            (el: any, i: number) =>
                                handler !== 'AssembleActionHandler' && (
                                    <Grid item md={12} xs={12} key={el.field}>
                                        {el.field === 'prompt' && (
                                            <>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Box display="flex" alignItems="center">
                                                        <Typography mr={1} variant="h5">
                                                            {t('market.' + el.field)}
                                                        </Typography>
                                                        <Tooltip placement="top" title={t('market.promptDesc')}>
                                                            <ErrorIcon fontSize="small" />
                                                        </Tooltip>
                                                    </Box>
                                                    <Box>
                                                        <FormControlLabel
                                                            label="是否显示"
                                                            control={
                                                                <Switch
                                                                    name="promptisShow"
                                                                    onChange={(e) => {
                                                                        basisChange({ e: e.target, index, i, flag: true });
                                                                    }}
                                                                    checked={el.isShow}
                                                                />
                                                            }
                                                        />
                                                    </Box>
                                                </Box>
                                                <TextArea
                                                    className="mt-[16px]"
                                                    status={!el.value ? 'error' : ''}
                                                    ref={iptRef}
                                                    style={{ height: '200px' }}
                                                    value={el.value}
                                                    name={el.field}
                                                    onChange={(e) => {
                                                        basisChange({ e: e.target, index, i, flag: false, values: true });
                                                    }}
                                                />
                                                {!el.value ? (
                                                    <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">{'Prompt 必填'}</span>
                                                ) : (
                                                    <span className="text-[12px] mt-[5px] ml-[5px]">{el.description}</span>
                                                )}
                                                <Box mb={1}>
                                                    {variable?.map((item) => (
                                                        <Tooltip key={item.field} placement="top" title={t('market.fields')}>
                                                            <Chip
                                                                sx={{ mr: 1, mt: 1 }}
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => changePrompt(item.field, i)}
                                                                label={item.field}
                                                            ></Chip>
                                                        </Tooltip>
                                                    ))}
                                                </Box>
                                            </>
                                        )}
                                    </Grid>
                                )
                        )}
                        <MainCard sx={{ borderRadius: 0 }} contentSX={{ p: 0 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box mr={1}>{t('myApp.table')}</Box>
                                    <Tooltip title={t('market.varableDesc')}>
                                        <ErrorIcon fontSize="small" />
                                    </Tooltip>
                                </Typography>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                        setModal(index);
                                        setOpen(true);
                                        setTitle(t('myApp.add'));
                                    }}
                                    variant="outlined"
                                    startIcon={<Add />}
                                >
                                    {t('myApp.add')}
                                </Button>
                            </Box>
                            <Divider style={{ margin: '10px 0' }} />
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t('myApp.field')}</TableCell>
                                            <TableCell>{t('myApp.name')}</TableCell>
                                            <TableCell>{t('myApp.type')}</TableCell>
                                            <TableCell> {t('myApp.isShow')}</TableCell>
                                            <TableCell>{t('myApp.operation')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {variable?.map((row: Rows, i: number) => (
                                            <TableRow hover key={row.field}>
                                                <TableCell>{row.field}</TableCell>
                                                <TableCell>{row.label}</TableCell>
                                                <TableCell>{t('myApp.' + row.style.toLowerCase())}</TableCell>
                                                <TableCell>
                                                    <Switch
                                                        name={row.field}
                                                        onChange={() => {
                                                            statusChange({ i, index });
                                                        }}
                                                        checked={row?.isShow}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            editModal(row, i, index);
                                                        }}
                                                        color="primary"
                                                    >
                                                        <SettingsIcon />
                                                    </IconButton>
                                                    <Popconfirm
                                                        title={t('myApp.del')}
                                                        description={t('myApp.delDesc')}
                                                        onConfirm={() => delModal(i, index)}
                                                        onCancel={() => {}}
                                                        okText={t('myApp.confirm')}
                                                        cancelText={t('myApp.cancel')}
                                                    >
                                                        <IconButton disabled={row.group === 'SYSTEM'} color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Popconfirm>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </MainCard>
                    </Panel>
                    {handler !== 'VariableActionHandler' && handler !== 'MaterialActionHandler' && handler !== 'AssembleActionHandler' && (
                        <Panel
                            header={
                                <div className="flex items-center gap-2">
                                    {variables.every((value) => {
                                        if (value.field !== 'prompt') {
                                            return value.value;
                                        } else {
                                            return true;
                                        }
                                    }) ? (
                                        <CheckCircleIcon fontSize="small" color="success" />
                                    ) : (
                                        <CancelIcon fontSize="small" color="error" />
                                    )}

                                    <div>{t('market.model')}</div>
                                </div>
                            }
                            key="2"
                        >
                            {variables?.map((el: any, i: number) => (
                                <Grid item md={12} xs={12} key={i + 'variables'}>
                                    {el.field !== 'prompt' && el.field !== 'n' && (
                                        <FormExecute
                                            item={el}
                                            onChange={(e: any) => basisChange({ e, index, i, flag: false, values: true })}
                                            pre={pre}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Panel>
                    )}
                    {handler !== 'VariableActionHandler' && handler !== 'MaterialActionHandler' && (
                        <Panel header="响应类型" key="3">
                            <FormControl fullWidth>
                                <InputLabel color="secondary" id="responent">
                                    响应类型
                                </InputLabel>
                                <Select
                                    disabled={responent?.readOnly ? true : false}
                                    color="secondary"
                                    onChange={(e) => {
                                        basisChange({ e: e.target, index, i: 0, flag: false });
                                    }}
                                    name="type"
                                    labelId="responent"
                                    value={responent.type}
                                    label="响应类型"
                                >
                                    <MenuItem value={'TEXT'}>文本类型</MenuItem>
                                    <MenuItem value={'JSON'}>JSON 类型</MenuItem>
                                </Select>
                            </FormControl>
                            {responent.type === 'JSON' && (
                                <TextArea
                                    disabled={responent?.readOnly ? true : false}
                                    key={responent?.output?.jsonSchema}
                                    defaultValue={responent?.output?.jsonSchema}
                                    className="mt-[16px]"
                                    style={{ height: '200px' }}
                                    onBlur={(e) => {
                                        basisChange({ e: { name: 'output', value: e.target.value }, index, i: 0, flag: false });
                                    }}
                                />
                            )}
                        </Panel>
                    )}
                </Collapse>
            </form>
        </div>
    );
};

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.variable) === JSON.stringify(nextProps?.variable) &&
        JSON.stringify(prevProps?.variables) === JSON.stringify(nextProps?.variables) &&
        JSON.stringify(prevProps?.responent) === JSON.stringify(nextProps?.responent)
    );
};
export default memo(Valida, arePropsEqual);
