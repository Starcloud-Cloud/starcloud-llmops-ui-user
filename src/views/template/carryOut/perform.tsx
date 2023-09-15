import { Tooltip, IconButton, Button, Box } from '@mui/material';
import AlbumIcon from '@mui/icons-material/Album';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
// import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { El } from 'types/template';
import { t } from 'hooks/web/useI18n';
import { useRef, memo } from 'react';
import CarrOut from './carrOut';
import _ from 'lodash-es';
function Perform({
    config,
    changeSon,
    source,
    loadings,
    isallExecute,
    variableChange,
    promptChange,
    changeanswer,
    history = false,
    isShows
}: any) {
    const refs = useRef<any>([]);
    //子组件返回的值
    const callBack = (data: any) => {
        isallExecute(false);
        changeSon({ stepId: data.item, index: data.steps });
    };
    //点击全部执行
    const allExecute = async () => {
        // const status = refs?.current?.map((item: any) => {
        //     return item.submit();
        // });
        const promises = [];
        for (const item of refs.current) {
            promises.push(item.submit());
        }
        isallExecute(true);
        await Promise.all(promises);
        // if (status.every((item: boolean) => item !== false)) {
        await changeSon({ stepId: config.steps[0].field, index: 0 });
        // }
    };
    //是否全部禁用
    const allDisable = () => {
        const flag = config?.steps?.map((item: any) => {
            const model = item.flowStep.variable?.variables.map((el: El) => {
                if (el.isShow) {
                    return el.value || el.value === false || el.defaultValue || el.defaultValue === false ? false : true;
                } else {
                    return el.defaultValue || el.defaultValue === false ? false : true;
                }
            });
            const variable = item?.variable?.variables.map((el: El) => {
                if (el.isShow) {
                    return el.value || el.value || el.defaultValue || el.defaultValue === false ? false : true;
                } else {
                    return false;
                }
            });
            return model?.some((value: boolean) => value === true) || variable?.some((value: boolean) => value === true);
        });
        return flag?.some((value: boolean) => value === true);
    };
    return (
        <Box>
            {config?.steps.length > 1 && (
                <Box mb={1}>
                    <Button
                        disabled={allDisable() || history}
                        color="secondary"
                        startIcon={<AlbumIcon />}
                        variant="contained"
                        onClick={allExecute}
                    >
                        {t('market.allExecute')}
                    </Button>
                    <Tooltip title={t('market.allStepTips')}>
                        <IconButton size="small">
                            <ErrorOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
            {config?.steps?.map(
                (item: any, steps: number) =>
                    item.flowStep?.response.style !== 'BUTTON' && (
                        <CarrOut
                            isShows={isShows}
                            history={history}
                            source={source}
                            loadings={loadings}
                            variableChange={variableChange}
                            promptChange={promptChange}
                            config={config}
                            ref={(el) => (refs.current[steps] = el)}
                            key={steps}
                            item={_.cloneDeep(item)}
                            steps={steps}
                            callBack={callBack}
                            changeanswer={changeanswer}
                        />
                    )
            )}
        </Box>
    );
}

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.config?.steps) === JSON.stringify(nextProps?.config?.steps) &&
        JSON.stringify(prevProps?.loadings) === JSON.stringify(nextProps?.loadings) &&
        JSON.stringify(prevProps?.isShows) === JSON.stringify(nextProps?.isShows)
    );
};
export default memo(Perform, arePropsEqual);
