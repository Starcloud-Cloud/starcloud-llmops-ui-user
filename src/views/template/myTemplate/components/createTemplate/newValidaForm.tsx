import {
    Box,
    Typography,
    Grid,
    Button,
    IconButton,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    Chip,
    FormControlLabel
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { t } from 'hooks/web/useI18n';
import { Divider, Popconfirm, Input, Collapse, Table } from 'antd';
import type { TableProps } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import Add from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import _ from 'lodash-es';
import { Validas } from 'types/template';
import FormExecute from 'views/template/components/newValidaForm';
import NewPrompt from './newPrompt';
import { dictData } from 'api/template/index';
import { useState, memo, useEffect, useRef, useMemo } from 'react';
const Valida = ({
    handler,
    variable,
    variables,
    responent,
    fields,
    variableStyle,
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
    const columns: TableProps<any>['columns'] = [
        {
            title: '变量 KEY',
            dataIndex: 'field',
            align: 'center'
        },
        {
            title: '变量名称',
            dataIndex: 'label',
            align: 'center'
        },
        {
            title: '变量类型',
            align: 'center',
            render: (_, row) => <span>{variableStyle?.find((item) => item.value === row.style)?.label}</span>
        },
        {
            title: '变量默认值',
            align: 'center',
            render: (_, row) => <div className="line-clamp-3">{row?.defaultValue}</div>
        },
        {
            title: '是否显示',
            align: 'center',
            render: (_, row, i) => (
                <Switch
                    name={row.field}
                    onChange={() => {
                        statusChange({ i, index });
                    }}
                    checked={row?.isShow}
                />
            )
        },
        {
            title: '操作',
            align: 'center',
            render: (_, row, i) => (
                <div>
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
                </div>
            )
        }
    ];
    const [pre, setPre] = useState(0);
    useEffect(() => {
        if (variables.some((value: any) => !value.value)) {
            setPre(pre + 1);
        }
    }, [allvalida]);

    const [dictList, setDictList] = useState<any[]>([]);
    useEffect(() => {
        dictData().then((res) => {
            setDictList(res.list);
        });
    }, []);
    const getTable = useMemo(() => {
        return variable;
    }, [variable]);
    return (
        <div className="py-2">
            <Collapse defaultActiveKey={['1']}>
                <Panel
                    header={
                        <div className="flex items-center gap-2">
                            {handler === 'VariableActionHandler' ||
                            handler === 'MaterialActionHandler' ||
                            handler === 'AssembleActionHandler' ||
                            variables?.find((item) => item.field === 'prompt')?.value ? (
                                <CheckCircleIcon fontSize="small" color="success" />
                            ) : (
                                <CancelIcon fontSize="small" color="error" />
                            )}
                            <div>
                                {handler === 'VariableActionHandler' ||
                                handler === 'MaterialActionHandler' ||
                                handler === 'AssembleActionHandler'
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
                                        <NewPrompt
                                            el={el}
                                            handler={handler}
                                            dictList={dictList}
                                            variable={variable}
                                            fields={fields}
                                            index={index}
                                            i={i}
                                            variables={variables}
                                            basisChange={basisChange}
                                        />
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
                        <Table rowKey={(record: any) => record.field} columns={columns} dataSource={getTable} pagination={false} />
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
