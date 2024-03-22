import { Tooltip, Popconfirm } from 'antd';
import {
    Box,
    Chip,
    Typography,
    Button as Buttons,
    Divider,
    TableContainer,
    Table as Tables,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { Error, Add, Delete, Settings } from '@mui/icons-material';
import { t } from 'hooks/web/useI18n';
import { useState, memo } from 'react';
import _ from 'lodash-es';
import VariableModal from '../variableModal';
interface Variable {
    rows: any[];
    setRows: (data: any[]) => void;
}

const CreateVariable = ({ rows, setRows }: Variable) => {
    const [title, setTitle] = useState('');
    const [variableOpen, setVariableOpen] = useState(false);
    const [varIndex, setVarIndex] = useState(-1);
    const [itemData, setItemData] = useState<any>({});
    const saveContent = (data: any) => {
        if (title === '增加变量') {
            if (rows) {
                setRows([...rows, data]);
                setVariableOpen(false);
            } else {
                setRows([data]);
                setVariableOpen(false);
            }
        } else {
            const newList = _.cloneDeep(rows);
            newList[varIndex] = data;
            setRows(newList);
            setVariableOpen(false);
        }
    };
    return (
        <>
            <MainCard sx={{ borderRadius: 0 }} contentSX={{ p: 0 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box mr={1}>{t('myApp.table')}</Box>
                        <Tooltip placement="top" title={t('market.varableDesc')}>
                            <Error sx={{ cursor: 'pointer' }} fontSize="small" />
                        </Tooltip>
                    </Typography>
                    <Buttons
                        size="small"
                        color="secondary"
                        onClick={() => {
                            setTitle('增加变量');
                            setVariableOpen(true);
                        }}
                        variant="outlined"
                        startIcon={<Add />}
                    >
                        {t('myApp.add')}
                    </Buttons>
                </Box>
                <Divider style={{ margin: '10px 0' }} />
                <TableContainer>
                    <Tables size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('myApp.field')}</TableCell>
                                <TableCell>{t('myApp.name')}</TableCell>
                                <TableCell>变量默认值</TableCell>
                                <TableCell>{t('myApp.type')}</TableCell>
                                <TableCell>{t('myApp.operation')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.length > 0 &&
                                rows?.map((row: any, i: number) => (
                                    <TableRow hover key={row.field}>
                                        <TableCell>{row.field}</TableCell>
                                        <TableCell>{row.label}</TableCell>
                                        <TableCell>{row.defaultValue}</TableCell>
                                        <TableCell>{t('myApp.' + row.style?.toLowerCase())}</TableCell>
                                        <TableCell sx={{ width: 120 }}>
                                            <IconButton
                                                onClick={() => {
                                                    setVarIndex(i);
                                                    setItemData(row);
                                                    setTitle('编辑变量');
                                                    setVariableOpen(true);
                                                }}
                                                color="primary"
                                            >
                                                <Settings />
                                            </IconButton>
                                            <Popconfirm
                                                title={t('myApp.del')}
                                                description={t('myApp.delDesc')}
                                                onConfirm={() => {
                                                    const newList = _.cloneDeep(rows);
                                                    newList?.splice(i, 1);
                                                    setRows(newList);
                                                }}
                                                onCancel={() => {}}
                                                okText={t('myApp.confirm')}
                                                cancelText={t('myApp.cancel')}
                                            >
                                                <IconButton disabled={row?.group === 'ADVANCED'} color="error">
                                                    <Delete />
                                                </IconButton>
                                            </Popconfirm>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Tables>
                </TableContainer>
            </MainCard>
            {variableOpen && (
                <VariableModal title={title} open={variableOpen} setOpen={setVariableOpen} itemData={itemData} saveContent={saveContent} />
            )}
        </>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.pre) === JSON.stringify(nextProps?.pre) &&
        JSON.stringify(prevProps?.model) === JSON.stringify(nextProps?.model) &&
        JSON.stringify(prevProps?.value) === JSON.stringify(nextProps?.value) &&
        JSON.stringify(prevProps?.rows) === JSON.stringify(nextProps?.rows)
    );
};
export default memo(CreateVariable, arePropsEqual);
