import { Tooltip, Popconfirm, Button } from 'antd';
import {
    Box,
    Chip,
    Typography,
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
import { Error, Delete, Settings } from '@mui/icons-material';
import { t } from 'hooks/web/useI18n';
import { useState, memo, useEffect } from 'react';
import _ from 'lodash-es';
import VariableModal from '../variableModal';
import { appFieldCode } from 'api/redBook/batchIndex';
interface Variable {
    rows: any[];
    setRows: (data: any[]) => void;
}

const CreateVariable = ({ rows, setRows }: Variable) => {
    const [title, setTitle] = useState('');
    const [variableOpen, setVariableOpen] = useState(false);
    const [varIndex, setVarIndex] = useState(-1);
    const [itemData, setItemData] = useState<any>({});
    const [tableData, setTableData] = useState<any[]>([]);
    const saveContent = (data: any) => {
        if (title === '增加变量') {
            if (tableData) {
                setTableData([data, ...tableData]);
                setVariableOpen(false);
            } else {
                setTableData([data]);
                setVariableOpen(false);
            }
        } else {
            const newList = _.cloneDeep(tableData);
            newList[varIndex] = data;
            setTableData(newList);
            setVariableOpen(false);
        }
    };
    const [saveLoading, setSaveLoading] = useState(false);
    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const result = await appFieldCode({
                variables: tableData
            });
            setSaveLoading(false);
            setRows(result);
        } catch (err) {
            setSaveLoading(false);
        }
    };
    useEffect(() => {
        setTableData(rows);
    }, []);
    useEffect(() => {
        if (!variableOpen) {
            setItemData({});
        }
    }, [variableOpen]);
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
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            onClick={() => {
                                setTitle('增加变量');
                                setVariableOpen(true);
                            }}
                        >
                            {t('myApp.add')}
                        </Button>
                    </div>
                </Box>
                <Divider style={{ margin: '10px 0' }} />
                <TableContainer>
                    <Tables size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('myApp.name')}</TableCell>
                                <TableCell>{t('myApp.type')}</TableCell>
                                <TableCell>{t('myApp.operation')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData?.length > 0 &&
                                tableData?.map((row: any, i: number) => (
                                    <TableRow hover key={i}>
                                        <TableCell>{row.label}</TableCell>
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
                                                    const newList = _.cloneDeep(tableData);
                                                    newList?.splice(i, 1);
                                                    setTableData(newList);
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
                <div className="flex justify-center mt-4">
                    <Button loading={saveLoading} type="primary" onClick={handleSave}>
                        保存
                    </Button>
                </div>
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
