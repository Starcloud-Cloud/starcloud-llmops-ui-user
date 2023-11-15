import { Button, Checkbox, IconButton, Tooltip } from '@mui/material';
import { Tag } from 'antd';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import MainCard from 'ui-component/cards/MainCard';

import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Divider } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import AddModal from './components/addModal';
import { schemePage, schemeDelete, schemeCopy } from 'api/redBook/copywriting';
import { listTemplates, planPage, planDelete, planCopy, planExecute } from 'api/redBook/batchIndex';

export interface DraftConfig {}

export interface ItemScore {
    matchSearchers: number;
    totalSearches: number;
}

export interface FiveDesc {}

export interface TableEnhancedCreateDataType {
    id: number;
    uid: string;
    title: string;
    endpoint: string;
    asin: string;
    keywordResume?: any;
    keywordMetaData?: any;
    draftConfig: DraftConfig;
    score?: any;
    itemScore: ItemScore;
    fiveDesc: FiveDesc;
    productDesc: string;
    searchTerm: string;
    version: number;
    status: string;
    createTime: number;
    updateTime: number;
    matchSearchers: number;
    searchersProportion: number;
    scoreProportion: number;
    type: number;
}

const headCells = [
    { id: 'title', numeric: false, disablePadding: false, label: '方案名称' },
    { id: 'endpoint', numeric: false, disablePadding: false, label: '是否公开' },
    { id: 'score', numeric: false, disablePadding: false, label: '类目' },
    { id: 'status', numeric: false, disablePadding: false, label: ' 方案标签' },
    { id: 'example', numeric: false, disablePadding: false, label: ' 文案示例' },
    { id: 'imageExample', numeric: false, disablePadding: false, label: ' 图片示例' },
    { id: 'creator', numeric: false, disablePadding: false, label: ' 创作者' },
    { id: 'createTime', numeric: false, disablePadding: false, label: '创建时间' },
    { id: 'updateTime', numeric: false, disablePadding: false, label: '更新时间' },
    { id: 'operate', numeric: false, disablePadding: false, label: '操作' }
];

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }: EnhancedTableHeadProps) {
    const createSortHandler = (property: string) => (event: React.SyntheticEvent) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ pl: 3, whiteSpace: 'nowrap' }}
                    >
                        {['updateTime', 'createTime', 'score'].includes(headCell.id) ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id && (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                )}
                            </TableSortLabel>
                        ) : (
                            headCell.label
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| TABLE - ENHANCED ||============================== //

const Copywriting: React.FC = () => {
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [delAnchorEl, setDelAnchorEl] = useState<null | HTMLElement>(null);
    const [delVisible, setDelVisible] = useState(false);
    const [delType, setDelType] = useState(0); //0.单个 1.多个
    const [row, setRow] = useState<TableEnhancedCreateDataType | null>();

    //模板选择
    const [open, setOpen] = useState(false);
    const [templateList, setTemplateList] = useState<any[]>([]);
    useEffect(() => {
        if (open) {
            listTemplates().then((res) => {
                setTemplateList(res);
            });
        }
    }, [open]);

    //创建的内容
    const [detailOpen, setDetailOpen] = useState(false);

    const delOpen = Boolean(delAnchorEl);
    const navigate = useNavigate();

    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const forceUpdate = () => setCount((pre) => pre + 1);

    useEffect(() => {
        const fetchPageData = async () => {
            const pageVO: any = { pageNo: page + 1, pageSize: rowsPerPage };
            if (orderBy) {
                pageVO.sortField = orderBy;
                pageVO.asc = order === 'asc';
            }
            schemePage({ ...pageVO }).then((res) => {
                const fetchedRows = res?.list;
                setRows([...fetchedRows]);
                setTotal(res?.total);
            });
        };
        if (!detailOpen) {
            fetchPageData();
        }
    }, [page, rowsPerPage, count, order, orderBy, detailOpen]);
    const [title, setTitle] = useState('');
    const [rows, setRows] = useState<any[]>([]);

    const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId: number[] = rows.map((n) => n.id);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: any[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
        setRowsPerPage(parseInt(event?.target.value!, 10));
        setPage(0);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const delDraft = async () => {
        const res = await schemeDelete(row?.uid);
        if (res) {
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
            setDelVisible(false);
            forceUpdate();
            setSelected([]);
        }
    };

    const [executeOpen, setExecuteOpen] = useState(false);
    const Execute = () => {
        schemeCopy({ uid: row?.uid }).then((res) => {
            if (res) {
                forceUpdate();
                setExecuteOpen(false);
                openSnackbar({
                    open: true,
                    message: '复制成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                });
            }
        });
        // planExecute({ uid: row?.uid }).then((res) => {
        setExecuteOpen(false);
        // });
    };

    const addPlan = async () => {
        setTitle('新建创作方案');
        setDetailOpen(true);
    };
    const [editUid, setEditUid] = useState('');
    const handleEdit = async (uid: string) => {
        setEditUid(uid);
        setTitle('编辑创作方案');
        setDetailOpen(true);
    };

    return (
        <MainCard
            content={false}
            title="创作方案"
            secondary={
                <div>
                    <Button color="secondary" startIcon={<AddIcon />} onClick={() => addPlan()} variant="contained" size="small">
                        新建创作方案
                    </Button>
                </div>
            }
        >
            <TableContainer>
                <Table sx={{ minWidth: 1000 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {rows.map((row, index) => {
                            if (typeof row === 'number') {
                                return null; // 忽略数字类型的行
                            }
                            const isItemSelected = isSelected(row.uid);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    key={row.id}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            onClick={(event) => handleClick(event, row.id)}
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={row.name}>
                                            <span className="line-clamp-1 w-[200px] mx-auto">{row.name}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">{row.isPublic ? '公开' : '不公开'}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div>{row.category}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">
                                            {row.tags?.map((item: string) => (
                                                <Tag color="processing" key={item}>
                                                    {item}
                                                </Tag>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">{row.example}</TableCell>
                                    <TableCell align="center">
                                        <Image
                                            width={50}
                                            height={50}
                                            src="data:image/jpeg;base64,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"
                                            preview={false}
                                        />
                                    </TableCell>
                                    <TableCell align="center">{row.creator}</TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.createTime && dayjs(row.createTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.createTime && dayjs(row.createTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.updateTime && dayjs(row.updateTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.updateTime && dayjs(row.updateTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="!w-[100px]">
                                            <Tooltip title={'编辑'}>
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => {
                                                        handleEdit(row.uid);
                                                    }}
                                                >
                                                    <EditIcon className="text-base" />
                                                </IconButton>
                                            </Tooltip>
                                            <Divider type={'vertical'} style={{ marginInline: '4px' }} />
                                            <Tooltip title={'复制'}>
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => {
                                                        setRow(row);
                                                        setExecuteOpen(true);
                                                    }}
                                                >
                                                    <ContentCopyIcon className="text-base" />
                                                </IconButton>
                                            </Tooltip>
                                            <Divider type={'vertical'} style={{ marginInline: '4px' }} />
                                            <Tooltip title={'删除'}>
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => {
                                                        setDelType(0);
                                                        setDelVisible(true);
                                                        setRow(row);
                                                    }}
                                                >
                                                    <DeleteIcon className="text-base" />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* table pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="每页行数"
            />
            <Confirm open={delVisible} handleClose={() => setDelVisible(false)} handleOk={delDraft} />
            <Confirm open={executeOpen} handleClose={() => setExecuteOpen(false)} handleOk={Execute} />
            {detailOpen && <AddModal title={title} uid={editUid} detailOpen={detailOpen} setDetailOpen={setDetailOpen} />}
        </MainCard>
    );
};

export default Copywriting;
