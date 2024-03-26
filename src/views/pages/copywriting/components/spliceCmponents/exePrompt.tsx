import { Popover } from 'antd';
import { Tooltip, Chip, Button } from '@mui/material';
import { t } from 'hooks/web/useI18n';
const ExePrompt = ({ dictList, changePrompt, flag }: { dictList?: any[]; changePrompt: (data: any) => void; flag?: boolean }) => {
    return (
        <Popover
            trigger={'click'}
            content={
                <div className="w-[200px] flex gap-2 flex-wrap">
                    {dictList?.map((item) => (
                        <Tooltip key={item.value} placement="top" title={t('market.fields')}>
                            <Chip
                                sx={{ mr: 1, mt: 1 }}
                                size="small"
                                color="primary"
                                onClick={() => changePrompt(item.value)}
                                label={item.label}
                            ></Chip>
                        </Tooltip>
                    ))}
                </div>
            }
        >
            <Button
                variant="contained"
                size="small"
                style={{ right: flag ? '52px' : '0.5rem' }}
                className={`absolute top-2 z-[1000]`}
                color="secondary"
            >
                示例 prompt
            </Button>
        </Popover>
    );
};
export default ExePrompt;
