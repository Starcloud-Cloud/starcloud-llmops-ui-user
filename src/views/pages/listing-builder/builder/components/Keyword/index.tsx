import { Button } from '@mui/material';
import React, { useRef } from 'react';
import { AddKeywordModal } from '../AddKeyworkModal';
import AddIcon from '@mui/icons-material/Add';
import { KeywordList } from './KeywordList';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useListing } from 'contexts/ListingContext';
import { delKey, saveListing } from 'api/listing/build';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { Confirm } from 'ui-component/Confirm';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';

const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: '#fff'
};

const KeyWord = () => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<any[]>([]);
    const [hiddenUse, setHiddenUse] = React.useState(false); // 隐藏已使用
    const [delOpen, setDelOpen] = React.useState(false);
    const { detail, setUpdate, uid, version, list, country, listingParam, enableAi, listingBuildType } = useListing();

    const handleClose = () => {
        setOpen(false);
    };

    const handleDel = async () => {
        // 删除前先保存下文本数据
        const result = list
            .filter((item) => item.type === ListingBuilderEnum.FIVE_DES)
            .reduce((acc: any, obj, index) => {
                acc[index + 1] = obj.value;
                return acc;
            }, {});
        const data = {
            uid,
            version,
            endpoint: country.key,
            draftConfig: {
                enableAi,
                fiveDescNum: list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES)?.length,
                aiConfigDTO: listingParam
            },
            title: list.find((item) => item.type === ListingBuilderEnum.TITLE)?.value,
            productDesc: list.find((item) => item.type === ListingBuilderEnum.PRODUCT_DES)?.value,
            searchTerm: list.find((item) => item.type === ListingBuilderEnum.SEARCH_WORD)?.value,
            fiveDesc: result,
            type: listingBuildType
        };
        const resSave = await saveListing(data);
        if (resSave) {
            const res = await delKey({
                uid,
                version,
                removeBindKey: selected
            });
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
                setDelOpen(false);
                setSelected([]);
                // 只更新关键词和打分
                setUpdate({});
            }
        }
    };

    return (
        <div className="h-full p-3 bg-white" style={containerStyle}>
            <div className="flex justify-between items-center">
                <div className="text-lg font-bold py-1">关键词</div>
                <div className="flex justify-between">
                    <Button
                        startIcon={<AddIcon />}
                        color="secondary"
                        size="small"
                        variant="contained"
                        className="ml-2"
                        onClick={() => setOpen(true)}
                    >
                        增加关键词
                    </Button>
                </div>
            </div>
            <div className={'flex justify-between items-center py-1'}>
                <div className={'flex items-center'}>
                    <span className={'mr-3'}>
                        总共{detail?.keywordResume?.length}个词/选中{selected?.length}个词
                    </span>
                    <Button
                        variant={'text'}
                        color={'secondary'}
                        size="small"
                        startIcon={!hiddenUse ? <VisibilityOffIcon className="!text-base" /> : <VisibilityIcon className="!text-base" />}
                        onClick={() => setHiddenUse(!hiddenUse)}
                    >
                        {!hiddenUse ? '隐藏已使用' : '显示已使用'}
                    </Button>
                </div>
                {selected?.length > 0 && (
                    <Button
                        variant={'text'}
                        color={'secondary'}
                        startIcon={<DeleteIcon className="!text-base" />}
                        size="small"
                        onClick={() => setDelOpen(true)}
                    >
                        删除
                    </Button>
                )}
            </div>
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
                <KeywordList selected={selected} setSelected={setSelected} hiddenUse={hiddenUse} />
            </div>

            {open && <AddKeywordModal open={open} handleClose={handleClose} />}
            <Confirm open={delOpen} handleOk={handleDel} handleClose={() => setDelOpen(false)} />
        </div>
    );
};

export default React.memo(KeyWord);
