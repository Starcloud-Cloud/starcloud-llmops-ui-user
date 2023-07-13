import { Tooltip, IconButton, Button, Box } from '@mui/material';
import AlbumIcon from '@mui/icons-material/Album';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
// import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { t } from 'hooks/web/useI18n';
import { useRef } from 'react';
import CarrOut from './carrOut';
function Perform({ config, changeSon, source, loadings, isallExecute, variableChange, promptChange }: any) {
    const refs = useRef<any>([]);
    //子组件返回的值
    const callBack = (data: any) => {
        isallExecute(false);
        changeSon({ stepId: data.item, index: data.steps });
    };
    //点击全部执行
    const allExecute = async () => {
        const status = refs?.current?.map((item: any) => {
            return item.submit();
        });
        if (status.every((item: boolean) => item !== false)) {
            isallExecute(true);
            changeSon({ stepId: config.steps[0].field, index: 0 });
        }
    };
    return (
        <Box>
            {config?.steps.length > 1 ? (
                <Box mb={1}>
                    <Button color="secondary" startIcon={<AlbumIcon />} variant="contained" onClick={allExecute}>
                        {t('market.allExecute')}
                    </Button>
                    <Tooltip title={t('market.allStepTips')}>
                        <IconButton size="small">
                            <ErrorOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ) : null}
            {config?.steps?.map(
                (item: any, steps: number) =>
                    item.flowStep?.response.style !== 'BUTTON' && (
                        <CarrOut
                            source={source}
                            loadings={loadings}
                            variableChange={variableChange}
                            promptChange={promptChange}
                            config={config}
                            ref={(el) => (refs.current[steps] = el)}
                            key={steps}
                            items={item}
                            steps={steps}
                            callBack={callBack}
                        />
                    )
            )}
        </Box>
    );
}
export default Perform;
