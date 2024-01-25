import { Popover, Input, Tooltip, Popconfirm } from 'antd';
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
import { useEffect, useRef, useState, memo } from 'react';
import _ from 'lodash-es';
import VariableModal from '../variableModal';
interface Variable {
    pre: number;
    model: string;
    value: any;
    setValue: (data: any) => void;
    rows: any[];
    setRows: (data: any[]) => void;
}

const CreateVariable = ({ pre, model, value, setValue, rows, setRows }: Variable) => {
    const { TextArea } = Input;
    const iptRef: any = useRef(null);
    const [demandOpen, setDemandOpen] = useState(false);
    useEffect(() => {
        if (pre > 1) {
            setDemandOpen(true);
        }
    }, [pre]);

    const [title, setTitle] = useState('');
    const [variableOpen, setVariableOpen] = useState(false);
    const [varIndex, setVarIndex] = useState(-1);
    const [itemData, setItemData] = useState<any>({});
    const saveContent = (data: any) => {
        if (title === '增加变量') {
            setRows([...rows, data]);
            setVariableOpen(false);
        } else {
            const newList = _.cloneDeep(rows);
            newList[varIndex] = data;
            setRows(newList);
            setVariableOpen(false);
        }
    };
    return (
        <>
            <div className="mt-[20px] mb-[10px] text-[16px] font-[600] flex items-end">
                文案生成要求
                <span className="text-[12px] text-[#15273799]">（对生成的文案内容就行自定义要求，直接告诉AI你想怎么改文案）</span>
                <Popover
                    placement="top"
                    title="可以这样提要求"
                    content={
                        <div>
                            <div>把品牌替换为 "xxxxxx"</div>
                            <div>把价格替换为 "20-50元"</div>
                            <div>使用更夸张的表达方式</div>
                        </div>
                    }
                >
                    <Error sx={{ cursor: 'pointer', fontSize: '16px' }} fontSize="small" />
                </Popover>
            </div>
            <TextArea
                status={demandOpen && !value && model === 'AI_CUSTOM' ? 'error' : ''}
                ref={iptRef}
                style={{ height: '200px' }}
                key={value}
                defaultValue={value}
                onBlur={(e) => {
                    setDemandOpen(true);
                    setValue(e.target.value);
                }}
            />
            {demandOpen && !value && model === 'AI_CUSTOM' && (
                <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">文案生成要求必填</span>
            )}
            <Box mb={1}>
                <div className="my-[10px] font-[600]">点击变量，增加到文案生成要求</div>
                {rows.length > 0 &&
                    rows?.map((item, index: number) => (
                        <Tooltip key={index} placement="top" title={t('market.fields')}>
                            <Chip
                                sx={{ mr: 1, mt: 1 }}
                                size="small"
                                color="primary"
                                onClick={() => {
                                    const newVal = _.cloneDeep(value);
                                    if (newVal) {
                                        const part1 = newVal?.slice(0, iptRef?.current?.resizableTextArea?.textArea?.selectionStart);
                                        const part2 = newVal?.slice(iptRef?.current?.resizableTextArea?.textArea?.selectionStart);
                                        setValue(`${part1}{${item.field}}${part2}`);
                                    } else {
                                        setValue(`{${item.field}}`);
                                    }
                                }}
                                label={item.field}
                            ></Chip>
                        </Tooltip>
                    ))}
            </Box>
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
                            {rows.length > 0 &&
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
                                                <IconButton color="error">
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
