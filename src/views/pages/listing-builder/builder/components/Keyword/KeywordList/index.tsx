import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Checkbox,
    Paper,
    Tooltip
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import MainCard from 'ui-component/cards/MainCard';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject } from 'types';
import { getListingDetail } from 'api/listing/build';
import { useListing } from 'contexts/ListingContext';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Popover, Rate } from 'antd';
import _ from 'lodash-es';
import { COUNTRY_LIST } from 'views/pages/listing-builder/data';
import { TextWithTooltip } from '../../../../../../../ui-component/TextWithToolTip/index';

type TableEnhancedCreateDataType = {
    keyword: string;
    score: number;
    searches: number;
    searchWeeklyRank: number;
    month: string;
    updatedTime: string;
    use: any[];
    status: number;
};

// table filter
function descendingComparator(a: KeyedObject, b: KeyedObject, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order: ArrangementOrder, orderBy: string) {
    return order === 'desc'
        ? (a: KeyedObject, b: KeyedObject) => descendingComparator(a, b, orderBy)
        : (a: KeyedObject, b: KeyedObject) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: TableEnhancedCreateDataType[], comparator: (a: KeyedObject, b: KeyedObject) => number) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0] as TableEnhancedCreateDataType, b[0] as TableEnhancedCreateDataType);
        if (order !== 0) return order;
        return (a[1] as number) - (b[1] as number);
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'keyword', numeric: false, disablePadding: true, label: '关键词', align: 'left', width: '50%' },
    // { id: 'score', numeric: false, disablePadding: true, label: '分值' },
    { id: 'searches', numeric: false, disablePadding: true, label: '搜索量', align: 'left', width: '20%' },
    // { id: 'body', numeric: false, disablePadding: true, label: ' 购买率' },
    // { id: 'body', numeric: false, disablePadding: true, label: '竞争度' },
    // { id: 'body', numeric: false, disablePadding: true, label: '推荐值' },
    { id: 'use', numeric: false, disablePadding: true, label: '使用分布', align: 'right', width: '16%' }
];

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }: EnhancedTableHeadProps) {
    const createSortHandler = (property: string) => (event: React.SyntheticEvent) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell className="py-[6px] px-0 ">
                    <Checkbox
                        color="primary"
                        size="small"
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
                        component="th"
                        scope="row"
                        style={{
                            width: headCell.width
                        }}
                        key={headCell.id}
                        align={headCell.align as any}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.id == 'searches' ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
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

export const KeywordList = ({ selected, setSelected, hiddenUse, setIsLoading }: any) => {
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('calories');

    const [rows, setRows] = useState<any[]>([]);

    const { version, uid, setUpdate, update, setDetail, keywordHighlight, setItemScore, setCountry, handleReGrade, list, setEnableAi } =
        useListing();

    const [fetching, setFetching] = useState(true);

    const timeRef = React.useRef<any>(null);

    useEffect(() => {
        clearTimeout(timeRef.current);
        // 10s 之后关闭请求
        timeRef.current = setTimeout(() => {
            setFetching(false);
        }, 1000 * 10);
        return () => clearTimeout(timeRef.current);
    }, [update]);

    // 获取详情
    useEffect(() => {
        if (uid && version !== undefined) {
            setFetching(true);
            getListingDetail(uid, version)
                .then((res: any) => {
                    // 设置站点
                    const current = COUNTRY_LIST.find((item: any) => item.key === res.endpoint);
                    setCountry({
                        key: res.endpoint,
                        icon: current?.icon,
                        label: current?.label
                    });
                    const fetchedRows = res.keywordMetaData || [];
                    setRows([...fetchedRows]);
                    if (update?.type === 1) {
                        // 只做详情标签的更新(lis列表和右侧分布)和打分的跟新
                        setDetail((pre: any) => ({
                            ...pre,
                            keywordMetaData: res.keywordMetaData,
                            keywordResume: res.keywordMetaData.map((item: any) => item.keyword) || [],
                            draftConfig: res.draftConfig
                        }));
                        setItemScore(res.itemScore);
                        if (res.status === 'ANALYSIS') {
                            setUpdate({ type: 1 });
                        } else {
                            setIsLoading(false);
                        }
                    } else {
                        console.log(res.status, 'res.status');
                        // ANALYSIS 的情况不回显值
                        if (res.status !== 'ANALYSIS') {
                            setIsLoading(false);
                            setFetching(false);
                            setDetail({ ...res, keywordResume: res?.keywordMetaData?.map((item: any) => item?.keyword) || [] });
                            setEnableAi(res?.draftConfig?.enableAi);
                            setItemScore({
                                ...res.itemScore,
                                score: res.score,
                                matchSearchers: res.matchSearchers,
                                totalSearches: res.totalSearches
                            });
                        }
                        if (res.status === 'ANALYSIS') {
                            // fetching &&
                            setTimeout(() => {
                                setUpdate({});
                            }, 1000);
                        }
                    }
                })
                .catch((error: any) => {
                    setIsLoading(false);
                    console.error(error);
                });
        } else {
            setIsLoading(false);
            setFetching(false);
            // 初始化分数
            handleReGrade(list);
        }
    }, [update, version, uid]);

    // 计算use总使用量
    useEffect(() => {
        if (keywordHighlight.flat()?.filter((item) => item).length && rows.length) {
            const data: any[] = [];
            rows.forEach((item) => {
                const num = keywordHighlight
                    ?.flat()
                    ?.filter((item1: any) => item1?.text === item?.keyword)
                    ?.reduce((acc: any, obj: any) => acc + (obj.num || 0), 0);
                data.push({
                    ...item,
                    use: num
                });
                setRows(data);
            });
        }
    }, [keywordHighlight]);

    const pageList = useMemo(() => {
        let newData: any[] = [];
        if (hiddenUse && keywordHighlight.flat().filter((item) => item).length > 0) {
            return rows.filter((item) => keywordHighlight.flat().some((v) => v && v.text === item.keyword));
        } else {
            return rows;
        }
    }, [hiddenUse, rows]);

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
                const newSelectedId: string[] = pageList?.map((n) => n.keyword);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, keyword: string) => {
        const selectedIndex = selected.indexOf(keyword);
        let newSelected: any[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, keyword);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const isSelected = (keyword: string) => selected.indexOf(keyword) !== -1;

    const keywordUseModal = (keyword: string) => {
        const filterTitle =
            keywordHighlight?.flat()?.filter((item) => item?.type === ListingBuilderEnum.TITLE && item?.text === keyword) || [];
        const filterProduct =
            keywordHighlight?.flat()?.filter((item) => item?.type === ListingBuilderEnum.PRODUCT_DES && item?.text === keyword) || [];
        const filterSearch =
            keywordHighlight?.flat()?.filter((item) => item?.type === ListingBuilderEnum.SEARCH_WORD && item?.text === keyword) || [];
        const filterFive = keywordHighlight
            ?.flat()
            ?.filter((item) => item?.type === ListingBuilderEnum.FIVE_DES && item?.text === keyword)
            .map((item) => ({ ...item, index: +item!.fiveType!.slice(9) }));
        const sortedFive = _.sortBy(filterFive, ['index']);

        return (
            <div>
                <div>
                    <span>标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题：</span>
                    <span>{filterTitle?.[0]?.num || 0}次</span>
                </div>
                {sortedFive.map((item) => (
                    <div>
                        <span>{`五点描述${item.index}`}：</span>
                        <span>{item?.num || 0}次</span>
                    </div>
                ))}
                <div>
                    <span>产品描述：</span>
                    <span>{filterProduct?.[0]?.num || 0}次</span>
                </div>
                <div>
                    <span>搜&nbsp;&nbsp;索&nbsp;&nbsp;词：</span>
                    <span>{filterSearch?.[0]?.num || 0}次</span>
                </div>
            </div>
        );
    };

    const handleUse = React.useCallback(
        (keyword: string) => {
            const filterNotFive =
                keywordHighlight.flat()?.filter((item) => item?.type !== ListingBuilderEnum.FIVE_DES && item?.text === keyword) || [];
            const filterFive =
                keywordHighlight.flat()?.filter((item) => item?.type === ListingBuilderEnum.FIVE_DES && item?.text === keyword) || [];
            const fiveLen = filterFive.length ? 1 : 0;
            switch (filterNotFive.length + fiveLen) {
                case 0:
                    return null;
                case 1:
                    return (
                        <Popover content={() => keywordUseModal(keyword)} title="使用分布">
                            <RadioButtonUncheckedIcon className="cursor-pointer text-base" />
                        </Popover>
                    );
                case 2:
                    return (
                        <Popover content={() => keywordUseModal(keyword)} title="使用分布">
                            <CheckCircleIcon className="cursor-pointer text-base" />
                        </Popover>
                    );
                case 3:
                    return (
                        <Popover content={() => keywordUseModal(keyword)} title="使用分布">
                            <Rate className="!cursor-pointer text-base" allowHalf value={0.5} disabled count={1} />
                        </Popover>
                    );
                case 4:
                    return (
                        <Popover content={() => keywordUseModal(keyword)} title="使用分布">
                            <Rate className="!cursor-pointer text-base" disabled value={1} count={1} />
                        </Popover>
                    );
                default:
                    break;
            }
        },
        [keywordHighlight]
    );

    return (
        <MainCard content={false}>
            <TableContainer component={Paper}>
                <Table size={'small'} stickyHeader>
                    <EnhancedTableHead
                        size="small"
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={pageList.length}
                    />
                    <TableBody>
                        {stableSort(
                            pageList.filter((row) => typeof row !== 'number'),
                            getComparator(order, orderBy)
                        ).map((row, index) => {
                            if (typeof row === 'number') {
                                return null; // 忽略数字类型的行
                            }
                            const isItemSelected = isSelected(row.keyword);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    key={row.keyword}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                >
                                    <TableCell
                                        className="py-[6px] px-0"
                                        style={{
                                            display: 'contents'
                                        }}
                                    >
                                        <Checkbox
                                            size={'small'}
                                            color="primary"
                                            checked={isItemSelected}
                                            onClick={(event) => handleClick(event, row.keyword)}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="left" className="py-[6px] px-0" style={{ width: '50%' }}>
                                        {row.status === 10 ? (
                                            <div className="w-[180px]">{row.keyword}</div>
                                        ) : [6, 7].includes(row.status) ? (
                                            <Tooltip title={'未获取到关键词数据'}>
                                                <div className="w-[180px] text-[#bec2cc] line-through">{row.keyword}</div>
                                            </Tooltip>
                                        ) : (
                                            <div>
                                                <Tooltip title={'正在请求数据'}>
                                                    <div className="w-[180px]  text-[#bec2cc] cursor-pointer">{row.keyword}</div>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </TableCell>
                                    {/* <TableCell align="center">{row.score}</TableCell> */}
                                    <TableCell align="left" className="py-[6px] px-0" style={{ width: '20%' }}>
                                        {row.searches}
                                    </TableCell>
                                    {/* <TableCell align="center">{row.keyword}</TableCell> */}
                                    {/* <TableCell align="center">{row.keyword}</TableCell> */}
                                    {/* <TableCell align="left" className="py-[6px] px-0">
                                        {row.keyword}
                                    </TableCell> */}
                                    <TableCell align="right" className="py-[6px] px-0" style={{ width: '16%' }}>
                                        <div className="flex items-center justify-center">{handleUse(row.keyword)}</div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
};
