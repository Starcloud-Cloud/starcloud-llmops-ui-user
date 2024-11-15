import { getTenant, ENUM_TENANT } from 'utils/permission';
import { Button, Image, Popconfirm, Form, Tabs, InputNumber, Tag, Tour, List, Drawer, Tooltip } from 'antd';
import type { TourProps } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { AccordionDetails, AccordionSummary, Accordion } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { SaveOutlined, InfoCircleOutlined, RightOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
import { useState, useEffect, useRef, useMemo } from 'react';
import { materialTemplate, getPlan, planModify, planUpgrade, planModifyConfig } from 'api/redBook/batchIndex';
import FormModal from './formModal';
import MarketForm from '../../../template/components/marketForm';
import AddStyleApp from 'ui-component/AddStyle/indexApp';
import AddStyle from 'ui-component/AddStyle/index';
import { useLocation } from 'react-router-dom';
import Forms from '../../smallRedBook/components/form';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useAllDetail } from 'contexts/JWTContext';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
import { useNavigate } from 'react-router-dom';
import './newLeft.scss';
import MaterialTable from './materialTable';
import { appModify } from 'api/template/index';
import { useCache, CACHE_KEY } from 'hooks/web/useCache';

const Lefts = ({
    detailShow = true,
    planState,
    pre,
    updataTip,
    versionPre,
    tableTitle,
    imageStylePre,
    isMyApp,
    changePre,
    updataDataPre,
    detail,
    data,
    saveLoading,
    setCollData,
    setGetData,
    setImageMoke,
    newSave,
    setDetail,
    setPlanUid,
    leftWidth,
    setWidth,
    setAppInfo,
    getAppList,
    setPlanUidRef,
    setTotalCountRef,
    setImageStyleList
}: {
    detailShow?: boolean;
    planState?: number;
    isMyApp?: boolean;
    tableTitle?: number;
    pre?: number;
    updataTip?: string;
    versionPre?: number;
    imageStylePre?: number;
    changePre?: number;
    updataDataPre?: number;
    detail?: any;
    data?: any;
    saveLoading?: boolean;
    leftWidth?: any;
    setCollData?: (data: any) => void;
    setGetData?: (data: any) => void;
    setImageMoke?: (data: any) => void;
    newSave: (data: any) => void;
    setDetail?: (data: any, fieldShow?: boolean) => void;
    setPlanUid: (data: any) => void;
    setWidth?: () => void;
    setAppInfo?: (data: any) => void;
    getAppList?: () => void;
    setPlanUidRef: (data: string) => void;
    setTotalCountRef: (data: number) => void;
    setImageStyleList: (data: any[]) => void;
}) => {
    const { wsCache } = useCache();
    const navigate = useNavigate();
    const { allDetail: all_detail }: any = useAllDetail();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    //存储的数据
    const appRef = useRef<any>(null);
    const [appData, setAppData] = useState<any>(null);
    //上传素材
    const [materialType, setMaterialType] = useState('');
    const materialStatus = useMemo(() => {
        console.log(123);
        return (
            appData?.configuration?.appInformation?.workflowConfig?.steps
                ?.find((item: any) => item.flowStep.handler === 'MaterialActionHandler')
                ?.variable?.variables?.find((el: any) => el.field === 'BUSINESS_TYPE')?.value || 'default'
        );
    }, [
        appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item.flowStep.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((el: any) => el.field === 'BUSINESS_TYPE')?.value
    ]);
    //获取表头数据
    const typeList = [
        { label: '小红书', value: 'SMALL_RED_BOOK' },
        { label: '其他', value: 'OTHER' }
    ];
    //笔记生成
    const generRef = useRef<any>(null);
    const [generateList, setGenerateList] = useState<any[]>([]); //笔记生成
    const imageRef = useRef<any>(null);
    const [imageMater, setImagMater] = useState<any>(null); //图片上传
    const [selectImgLoading, setSelectImgLoading] = useState(false);
    const getList = async (flag?: boolean, appUpdate?: boolean, saveUpdate?: boolean) => {
        let result;
        let newList: any;
        if (data) {
            result = _.cloneDeep(data);
            newList = _.cloneDeep(result?.executeParam?.appInformation);
        } else if (appUpdate) {
            if (searchParams.get('appUid')) {
                setSelectImgLoading(true);
                result = await getPlan({ appUid: searchParams.get('appUid'), uid: searchParams.get('uid'), source: 'MARKET' });
                setPlanUidRef && setPlanUidRef(result?.uid);
                setTotalCountRef && setTotalCountRef(result?.totalCount);
                setSelectImgLoading(false);
                newList = _.cloneDeep(result?.configuration?.appInformation);
            } else {
                setSelectImgLoading(true);
                result = await getPlan({ appUid: searchParams.get('uid'), source: 'APP' });
                setPlanUidRef && setPlanUidRef(result?.uid);
                setTotalCountRef && setTotalCountRef(result?.totalCount);
                setSelectImgLoading(false);
                newList = _.cloneDeep(result?.configuration?.appInformation);
            }
        } else if (detail) {
            setSelectImgLoading(true);
            result = await getPlan({ appUid: searchParams.get('uid'), source: 'APP' });
            setPlanUidRef && setPlanUidRef(result?.uid);
            setTotalCountRef && setTotalCountRef(result?.totalCount);
            setSelectImgLoading(false);
            if (saveUpdate) {
                newList = result?.configuration?.appInformation;
            } else {
                newList = _.cloneDeep(detail);
            }
            newList?.workflowConfig?.steps?.forEach((item: any) => {
                const arr = item?.variable?.variables;
                const arr1 = item?.flowStep?.variable?.variables;
                arr?.forEach((el: any) => {
                    if (el.value && typeof el.value === 'object') {
                        el.value = JSON.stringify(el.value);
                    }
                });
                arr1?.forEach((el: any) => {
                    if (el.value && typeof el.value === 'object') {
                        el.value = JSON.stringify(el.value);
                    }
                });
            });
        } else {
            setSelectImgLoading(true);
            result = await getPlan({ appUid: searchParams.get('appUid'), uid: searchParams.get('uid'), source: 'MARKET' });
            setSelectImgLoading(false);
            newList = _.cloneDeep(result?.configuration?.appInformation);
            newList?.workflowConfig?.steps?.forEach((item: any) => {
                if (item?.flowStep?.handler === 'CustomActionHandler') {
                    const num = item.variable.variables?.findIndex((item: any) => item.field === 'CUSTOM_REQUIREMENT');
                    const num1 = item.variable.variables?.findIndex((item: any) => item.style === 'MATERIAL');
                    const num2 = item.variable.variables?.findIndex((item: any) => item.field === 'PARODY_REQUIREMENT');
                    if (item.type === 'RANDOM') {
                        item.variable.variables[num].isShow = false;
                        item.variable.variables[num1].isShow = true;
                        item.variable.variables[num2].isShow = false;
                    } else if (item.type === 'AI_PARODY') {
                        item.variable.variables[num].isShow = false;
                        item.variable.variables[num1].isShow = true;
                        item.variable.variables[num2].isShow = true;
                    } else {
                        item.variable.variables[num].isShow = true;
                        item.variable.variables[num1].isShow = false;
                        item.variable.variables[num2].isShow = false;
                    }
                }
            });
            const collData: any = result?.configuration?.appInformation?.example;
            if (collData) {
                setCollData && setCollData(collData.split(','));
            }
            navigate('/batchSmallRedBook?appUid=' + searchParams.get('appUid') + '&uid=' + result.uid + '&source=' + 'MARKET', {
                replace: true
            });
        }
        setTotalCount(result?.totalCount);
        setPlanUid(result?.uid);
        appRef.current = result;
        setAppInfo &&
            setAppInfo({
                name: appRef.current?.configuration?.appInformation?.name,
                version: appRef.current.version,
                status: appRef.current.status,
                updateTime: appRef.current.updateTime
            });
        if (data) {
            appRef.current.executeParam.appInformation = newList;
        } else {
            appRef.current.configuration.appInformation = newList;
        }
        setAppData(appRef.current);

        newList?.workflowConfig?.steps.forEach((item: any) => {
            const arr: any[] = item?.variable?.variables;

            if (arr?.find((el: any) => el.style === 'MATERIAL')?.value) {
                let list: any;

                try {
                    list = JSON.parse(arr?.find((el: any) => el.style === 'MATERIAL')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.style === 'MATERIAL')?.value;
                }
                arr.find((el: any) => el.style === 'MATERIAL').value = list;
            }
            if (arr?.find((el: any) => el.style === 'CHECKBOX')) {
                let list: any;

                try {
                    list = JSON.parse(arr?.find((el: any) => el.style === 'CHECKBOX')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.style === 'CHECKBOX')?.value;
                }
                arr.find((el: any) => el.style === 'CHECKBOX').value = list;
            }
            if (arr?.find((el: any) => el.style === 'TAG_BOX')) {
                let list: any;

                try {
                    list = JSON.parse(arr?.find((el: any) => el.style === 'TAG_BOX')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.style === 'TAG_BOX')?.value;
                }
                arr.find((el: any) => el.style === 'TAG_BOX').value = list;
            }
            if (arr?.find((el: any) => el.style === 'IMAGE_LIST')) {
                let list: any;

                try {
                    list = JSON.parse(arr?.find((el: any) => el.style === 'IMAGE_LIST')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.style === 'IMAGE_LIST')?.value;
                }
                arr.find((el: any) => el.style === 'IMAGE_LIST').value = list;
            }
            if (item?.flowStep?.handler === 'PosterActionHandler' && arr?.find((el: any) => el.field === 'POSTER_STYLE_CONFIG')) {
                let list: any;
                try {
                    list = JSON.parse(arr?.find((el: any) => el.field === 'POSTER_STYLE_CONFIG')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.field === 'POSTER_STYLE_CONFIG')?.value;
                }
                arr.find((el: any) => el.field === 'POSTER_STYLE_CONFIG').value = list;
            }
        });
        const materiallist = newList?.workflowConfig?.steps?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables;
        const newMater = materiallist?.find((item: any) => item.field === 'MATERIAL_TYPE')?.value;
        setMaterialType(newMater);
        generRef.current = _.cloneDeep(
            newList?.workflowConfig?.steps?.filter(
                (item: any) => item?.flowStep?.handler !== 'MaterialActionHandler' && item?.flowStep?.handler !== 'PosterActionHandler'
            )
        );
        console.log(generRef.current);
        setGenerateList(generRef.current);
        getStepMater();
        const newImage = newList?.workflowConfig?.steps?.find((item: any) => item?.flowStep?.handler === 'PosterActionHandler');
        newImage?.flowStep?.variable?.variables?.forEach((item: any) => {
            if (item.field === 'SYSTEM_POSTER_STYLE_CONFIG' && item.value && typeof item.value === 'string') {
                item.value = JSON.parse(item.value);
            }
        });
        // if (result?.configuration?.imageStyleList?.length > 0) {
        newImage.variable.variables.find((item: any) => item.field === 'POSTER_STYLE_CONFIG').value =
            result?.configuration?.imageStyleList || [];
        // }
        setImagMater(newImage);
        const newMember = wsCache.get('newMember');
        if (!newMember) {
            setTimeout(() => {
                setTourOpen(true);
            }, 500);
        }
    };
    const getStepMater = async () => {
        const arr: any[] = [];
        const newList = generRef.current?.map((item: any) => {
            const arr = item?.variable?.variables;
            return (
                arr?.find((i: any) => i?.field === 'MATERIAL_TYPE')?.value ||
                arr?.find((i: any) => i?.field === 'MATERIAL_TYPE')?.defaultValue
            );
        });
        const allper = newList?.map(async (el: any, index: number) => {
            if (el) {
                const res = await materialTemplate(el);
                arr[index] = getHeader(res?.fieldDefine, index);
            } else {
                arr[index] = undefined;
            }
        });
        await Promise.all(allper);
        stepMarRef.current = arr;
        setStepMaterial(stepMarRef?.current);
    };
    const getOtherList = () => {};
    //页面进入给 Tabs 分配值
    useEffect(() => {
        console.log(2);
        getList();
        getOtherList();
    }, []);
    //笔记生成的表头
    const stepRef = useRef(0);
    const [step, setStep] = useState(0);
    const [materialTypes, setMaterialTypes] = useState('');
    //改变值请求新的表头
    const stepMarRef = useRef<any[]>([]);
    const [stepMaterial, setStepMaterial] = useState<any[]>([]);
    const setTableDatas = async (type: string, steps: number) => {
        const res = await materialTemplate(type);
        const newList = _.cloneDeep(stepMarRef.current);
        newList[steps] = getHeaders(getHeader(res?.fieldDefine, steps), steps);
        stepMarRef.current = newList;
        setStepMaterial(stepMarRef.current);
    };
    //获取数据表头
    const getHeader = (data: any, i: number) => {
        const newList = data.map((item: any) => ({
            title: item.desc,
            align: 'center',
            width: item.fieldName === 'source' ? 100 : item.width || 200,
            fixed: item.fieldName === 'source' ? true : false,
            dataIndex: item.fieldName,
            render: (_: any, row: any) => (
                <div className="flex justify-center items-center flex-wrap break-all gap-2">
                    <div className="line-clamp-5">
                        {item.type === 'image' ? (
                            row[item.fieldName] ? (
                                <Image
                                    fallback={
                                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='
                                    }
                                    width={50}
                                    height={50}
                                    preview={false}
                                    src={row[item.fieldName] + '?x-oss-process=image/resize,w_100/quality,q_80'}
                                />
                            ) : (
                                <div className="w-[50px] h-[50px] rounded-md border border-solid border-black/10"></div>
                            )
                        ) : item.type === 'listImage' ? (
                            <div className="flex gap-1 flex-wrap">
                                {row[item.fieldName]?.map((item: any) => (
                                    <Image
                                        width={50}
                                        height={50}
                                        preview={false}
                                        src={item + '?x-oss-process=image/resize,w_100/quality,q_80'}
                                    />
                                ))}
                            </div>
                        ) : item.type === 'listStr' ? (
                            <div className="flex gap-1 flex-wrap">
                                {row[item.fieldName]?.map((item: any) => (
                                    <Tag color="processing">{item}</Tag>
                                ))}
                            </div>
                        ) : item.fieldName === 'source' ? (
                            typeList?.find((i) => i.value === row[item.fieldName])?.label
                        ) : (
                            row[item.fieldName]
                        )}
                    </div>
                </div>
            ),
            required: item.required,
            type: item.type
        }));

        return [
            ...newList,
            {
                title: '操作',
                align: 'center',
                width: 100,
                fixed: 'right',
                render: (_: any, row: any, index: number) => (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                handleEdits(row, index, i);
                            }}
                            size="small"
                            type="link"
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            zIndex={9999}
                            title="提示"
                            description="请再次确认是否删除？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => handleDels(index, i)}
                        >
                            <Button size="small" type="link" danger>
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ];
    };
    const getHeaders = (data: any, i: number) => {
        const newList = data;
        newList?.splice(newList?.length - 1, 1);
        return [
            ...newList,
            {
                title: '操作',
                align: 'center',
                width: 100,
                fixed: 'right',
                render: (_: any, row: any, index: number) => (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                handleEdits(row, index, i);
                            }}
                            size="small"
                            type="link"
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            zIndex={9999}
                            title="提示"
                            description="请再次确认是否删除？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => handleDels(index, i)}
                        >
                            <Button size="small" type="link" danger>
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ];
    };
    //删除
    const handleDels = (index: number, i: number) => {
        if (i) {
            stepRef.current = i;
            setStep(stepRef.current);
        }
        const newValue = _.cloneDeep(generRef.current);
        const newList =
            newValue[i].variable.variables[newValue[i].variable.variables?.findIndex((item: any) => item.style === 'MATERIAL')].value;
        newList.splice(index, 1);
        generRef.current = newValue;
        setGenerateList(generRef.current);
    };
    const [forms] = Form.useForm();
    const [titles, setTitles] = useState('');
    //编辑
    const [editOpens, setEditOpens] = useState(false);
    const [rowIndexs, setRowIndexs] = useState(0);
    const handleEdits = (row: any, index: number, i?: number) => {
        if (i || i === 0) {
            let newData = _.cloneDeep(stepRef.current);
            newData = i;
            stepRef.current = newData;
            setStep(stepRef.current);
        }
        setTitles('编辑');
        setMaterialTypes(row.type);
        forms.setFieldsValue(row);
        setRowIndexs(index);
        setEditOpens(true);
    };
    const formOks = (result: any) => {
        const newValue = _.cloneDeep(generRef.current);
        const pubilcList = newValue[stepRef.current].variable.variables;
        let newList = pubilcList[pubilcList?.findIndex((item: any) => item.style === 'MATERIAL')]?.value;
        if (titles === '编辑') {
            newList.splice(rowIndexs, 1, { ...result, type: materialTypes });
        } else {
            if (!newList) {
                newList = [];
            }
            newList.unshift({
                ...result,
                type: materialTypes
            });
        }
        pubilcList[pubilcList?.findIndex((item: any) => item.style === 'MATERIAL')].value = newList;
        generRef.current = newValue;
        setGenerateList(generRef.current);
        setAppDataGen();
        setEditOpens(false);
        forms.resetFields();
    };
    // 基础数据
    const [totalCount, setTotalCount] = useState<number>(1);
    useEffect(() => {
        console.log(3);

        const getStatus = async () => {
            setSelectImgLoading(true);
            const result = await getPlan({
                appUid: searchParams.get('appUid') || searchParams.get('uid'),
                uid: searchParams.get('appUid') ? searchParams.get('uid') : undefined,
                source: searchParams.get('appUid') ? 'MARKET' : detail ? 'APP' : 'MARKET'
            });
            setSelectImgLoading(false);
            const newData = _.cloneDeep(appRef.current);
            newData.status = result?.status;
            appRef.current = newData;
            setAppData(appRef.current);
        };
        if (pre && pre > 0) {
            getStatus();
        }
    }, [pre]);
    const planAppRef = useRef<any>(0);
    useEffect(() => {
        console.log(planState);
        if (planState && planState > 0) {
            if (planAppRef.current === 0) {
                const newData = _.cloneDeep(appRef.current);
                newData.configuration.appInformation.workflowConfig.steps
                    .find((item: any) => item.flowStep.handler === 'MaterialActionHandler')
                    .variable.variables.find((item: any) => item.field === 'MATERIAL_USAGE_MODEL').value = 'FILTER_USAGE';
                appRef.current = newData;
            }
            handleSaveClick(exeState);
        } else if (planState && planState < 0) {
            handleSaveClick(exeState, false, true);
        }
    }, [planState]);
    const [exeState, setExeState] = useState(false);
    const [errMessageList, setErrMessageList] = useState<any[]>([]);
    const [errMessageOpen, setMessageOpen] = useState(false);

    //保存
    const handleSaveClick = async (flag: boolean, detailShow?: boolean, fieldShow?: boolean) => {
        planAppRef.current = 0;
        const newList = _.cloneDeep(generRef.current);
        newList?.forEach((item: any) => {
            item?.variable?.variables?.forEach((el: any) => {
                if (el.value && typeof el.value === 'object') {
                    el.value = JSON.stringify(el.value);
                }
            });
            item?.flowStep?.variable?.variables?.forEach((el: any) => {
                if (el.value && typeof el.value === 'object') {
                    el.value = JSON.stringify(el.value);
                }
            });
        });
        if (detailShow) {
            const data = _.cloneDeep(appRef.current);
            const upData = data?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
            );
            data.executeParam.appInformation.workflowConfig.steps = [
                upData,
                ...newList,
                imageRef.current
                    ? imageRef.current?.record
                    : appRef.current.executeParam.appInformation.workflowConfig.steps?.find(
                          (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                      )
            ];
            newSave(data);
        } else {
            const newMem = imageRef.current
                ? imageRef.current?.record
                : appRef.current.configuration.appInformation.workflowConfig.steps?.find(
                      (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                  );
            let styleData = newMem?.variable?.variables?.find((item: any) => item.field === 'POSTER_STYLE_CONFIG')?.value;
            if (typeof styleData === 'string') {
                styleData = JSON.parse(styleData);
            }
            const data = {
                uid: appRef.current?.uid,
                totalCount,
                configuration: {
                    imageStyleList: styleData
                        ? styleData?.map((item: any, index: number) => ({
                              ...item,
                              id: undefined,
                              code: item.id,
                              index: index + 1
                          }))
                        : imageMater?.variable?.variables?.find((item: any) => item?.field === 'POSTER_STYLE_CONFIG')?.value,
                    appInformation: {
                        ...appRef.current.configuration.appInformation,
                        workflowConfig: {
                            steps: [
                                ...appRef.current.configuration.appInformation.workflowConfig.steps?.filter(
                                    (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                                ),
                                ...newList,
                                imageRef.current
                                    ? imageRef.current?.record
                                    : appRef.current.configuration.appInformation.workflowConfig.steps?.find(
                                          (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                                      )
                            ]
                        }
                    }
                },
                source: detail ? 'APP' : 'MARKET'
            };

            const values = data?.configuration?.appInformation?.workflowConfig?.steps
                ?.find((item: any) => item?.flowStep?.handler === 'PosterActionHandler')
                ?.flowStep?.variable?.variables?.find((item: any) => item?.field === 'SYSTEM_POSTER_STYLE_CONFIG')?.value;
            if (typeof values !== 'string') {
                data.configuration.appInformation.workflowConfig.steps
                    .find((item: any) => item.flowStep.handler === 'PosterActionHandler')
                    .flowStep.variable.variables.find((item: any) => item.field === 'SYSTEM_POSTER_STYLE_CONFIG').value =
                    JSON.stringify(values);
            }

            let result;

            if (!fieldShow) {
                result = await planModify(data);
                if (result && result.verificationList?.length === 0) {
                    getList(false, true);
                } else {
                    setErrMessageList(result?.verificationList);
                    setMessageOpen(true);
                    return false;
                }
            } else {
                result = await planModifyConfig(data);
            }
            dispatch(
                openSnackbar({
                    open: true,
                    message: '创作计划保存成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            if (flag) {
                newSave(appRef.current);
            }
            setExeState(false);
        }
    };
    const [tabKey, setTabKey] = useState('1');
    const [updataTable, setUpdataTable] = useState(0);
    const upDateVersion = async () => {
        const result = await planUpgrade({
            uid: appData?.uid,
            appUid: searchParams.get('appUid'),
            configuration: appData?.configuration,
            totalCount,
            isFullCover: updataTip === '0' ? undefined : true
        });
        dispatch(
            openSnackbar({
                open: true,
                message: '更新成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
        getList(true);
        setUpdataTable(updataTable + 1);
    };
    useEffect(() => {
        console.log(111);
        if (versionPre) {
            upDateVersion();
        }
    }, [versionPre]);
    useEffect(() => {
        if (generateList?.length > 0) {
            setGetData && setGetData(generateList);
        }
    }, [generateList]);
    const [imageVar, setImageVar] = useState<any>(null);
    useEffect(() => {
        setImageMoke && setImageMoke(imageVar || imageMater);
    }, [imageVar]);
    const headerSaveAll = (data?: any) => {
        const newData = _.cloneDeep(detail);
        let arr = newData?.workflowConfig?.steps;
        const a = appRef.current.configuration?.appInformation?.workflowConfig?.steps?.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        );
        if (a) {
            arr[
                appRef.current.configuration?.appInformation?.workflowConfig?.steps?.findIndex(
                    (item: any) => item.flowStep.handler === 'MaterialActionHandler'
                )
            ] = a;
        }
        let b = _.cloneDeep(imageRef.current?.record);
        if (!b) {
            b = appRef.current.configuration?.appInformation?.workflowConfig?.steps?.find(
                (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
            );
        }
        console.log(b);

        arr = [arr.find((item: any) => item.flowStep.handler === 'MaterialActionHandler'), ..._.cloneDeep(generRef.current), b];
        return arr;
    };

    // 我的应用保存
    const saveTemplate = () => {
        // setExeState(false);
        // const arr = headerSaveAll();
        // console.log(arr);

        // setDetail &&
        //     setDetail({
        //         ...detail,
        //         workflowConfig: {
        //             steps: arr?.filter((item: any) => item)
        //         }
        //     });
        gessaveApp('FILTER_USAGE', false);
    };

    //新的应用保存

    //素材字段配置弹框
    const gessaveApp = async (data: string, execute = true) => {
        let arr = headerSaveAll();
        arr
            .find((item: any) => item.flowStep.handler === 'MaterialActionHandler')
            .variable.variables.find((item: any) => item.field === 'MATERIAL_USAGE_MODEL').value = data;
        const newData =
            imageRef.current?.record?.variable?.variables?.find((item: any) => item?.field === 'POSTER_STYLE_CONFIG')?.value || '[]';
        await appModify({
            ...detail,
            e: 2,
            workflowConfig: {
                steps: arr?.filter((item: any) => item)
            },
            planRequest: {
                uid: appRef.current?.uid,
                source: 'APP',
                totalCount,
                configuration: {
                    imageStyleList: JSON.parse(newData)
                }
            }
        });
        dispatch(
            openSnackbar({
                open: true,
                message: '创作计划保存成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
        if (execute) {
            newSave(appRef.current);
        }
        // setExeState(true);
        // setDetail &&
        //     setDetail({
        //         ...detail,
        //         workflowConfig: {
        //             steps: arr?.filter((item: any) => item)
        //         }
        //     });
    };
    const addName: any = (name: string) => {
        const nameList = appRef.current.configuration?.appInformation?.workflowConfig?.steps?.map((item: any) => item.name);

        if (nameList.includes(name)) {
            const nameParts = name.match(/(.*?)(\d*)$/);
            console.log(nameParts);
            if (nameParts) {
                // 如果有数字，则解析出数字并加1
                let prefix = nameParts[1];
                let numberPart = nameParts[2];
                let incrementedNumber = numberPart ? parseInt(numberPart, 10) + 1 : 1;
                return addName(`${prefix}${incrementedNumber > 0 ? incrementedNumber : ''}`);
            } else {
                // 如果没有数字，就默认从1开始
                return addName(`${name}1`);
            }
        } else {
            return name;
        }
    };
    //改变给 sppData 赋值
    const setAppDataGen = () => {
        const variable = appRef.current.configuration.appInformation.workflowConfig.steps;
        const appOne = _.cloneDeep(variable[0]);
        const applast = _.cloneDeep(variable[variable?.length - 1]);
        const newappList = _.cloneDeep(appRef.current);
        newappList.configuration.appInformation.workflowConfig.steps = [appOne, ...generRef.current, applast];
        appRef.current = newappList;
        setAppData(appRef.current);
    };
    useEffect(() => {
        console.log(7);
        if (changePre && appRef.current) {
            appRef.current.configuration.appInformation = detail;
            setAppData(appRef.current);
            generRef.current = appRef.current?.configuration?.appInformation?.workflowConfig?.steps?.filter((item: any) => {
                return item?.flowStep?.handler !== 'MaterialActionHandler' && item?.flowStep?.handler !== 'PosterActionHandler';
            });
            setGenerateList(generRef.current);
            getStepMater();
        }
    }, [changePre]);
    const [imgPre, setImgPre] = useState(0);
    useEffect(() => {
        if (imgPre === 1) {
            getList(true);
            setImgPre(0);
        }
    }, [detail]);
    useEffect(() => {
        if (imageStylePre) {
            getList(true, false, true);
        }
    }, [imageStylePre]);
    useEffect(() => {
        if (updataDataPre) {
            getList(true, false);
        }
    }, [updataDataPre]);
    //选中保存
    const seleSave = (data: string, arr: any) => {
        const newData = _.cloneDeep(appRef.current);
        newData.configuration.appInformation.workflowConfig.steps[0].variable.variables.find(
            (item: any) => item.field === 'MATERIAL_USAGE_MODEL'
        ).value = data;
        const newQuery = newData.configuration.appInformation.workflowConfig.steps[0].variable.variables.find(
            (item: any) => item.field === 'SELECT_MATERIAL_QUERY'
        )?.value;
        let queryList;
        if (newQuery) {
            queryList = JSON.parse(newQuery);
        } else {
            queryList = { sliceIdList: [] };
        }
        if (newQuery) {
            queryList.sliceIdList = arr;
            newData.configuration.appInformation.workflowConfig.steps[0].variable.variables.find(
                (item: any) => item.field === 'SELECT_MATERIAL_QUERY'
            ).value = JSON.stringify(queryList);
        }

        appRef.current = newData;
        setAppData(appRef.current);
        if (data === 'SELECT') {
            planAppRef.current = 1;
        }
        if (!detail) {
            handleSaveClick(true);
        } else {
            gessaveApp(data);
        }
    };

    const [tourOpen, setTourOpen] = useState(false);
    const steps1 = useRef(null);
    const steps2 = useRef(null);
    const steps3 = useRef(null);
    const steps4 = useRef(null);
    const tourStep: TourProps['steps'] = [
        {
            title: '第一步',
            description: '可上传自己的图片和内容等，进行笔记生成',
            target: () => steps1.current
        },
        {
            title: '第二步',
            description: '配置笔记图片生成的图片模版，支持不同风格模版组合生成',
            target: () => steps2.current
        },
        {
            title: '第三步',
            description: '配置 AI 生成规则，灵活定制生成的内容',
            target: () => steps3.current
        },
        {
            title: '第四步',
            description: '点击立即生成小红书内容',
            target: () => steps4.current
        }
    ];

    return (
        <>
            <div className="relative h-full">
                <Tooltip title={!leftWidth ? '展开' : '收缩'}>
                    <Button
                        style={{
                            transform: leftWidth ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                        className={`absolute top-3 right-[-10px] z-[1000] duration-700`}
                        onClick={() => setWidth && setWidth()}
                        size="small"
                        shape="circle"
                    >
                        <RightOutlined />
                    </Button>
                </Tooltip>
                <div className="absolute top-4 right-5 z-[1000] text-xs text-[#673ab7] cursor-pointer" onClick={() => setTourOpen(true)}>
                    指导
                </div>
                <div
                    style={{
                        height: detailShow
                            ? getTenant() === ENUM_TENANT.AI
                                ? 'calc(100% - 118px)'
                                : 'calc(100% - 68px)'
                            : 'calc(100% - 14px)',
                        scrollbarGutter: 'stable'
                    }}
                    className=" box-border overflow-y-auto pr-2 mr-[-4px]"
                >
                    <Tabs activeKey={tabKey} onChange={(key) => setTabKey(key)}>
                        {(appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
                            (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                        ) ||
                            appData?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                                (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                            )) && (
                            <Tabs.TabPane key={'1'} tab="素材上传">
                                <div ref={steps1}>
                                    <MaterialTable
                                        materialStatus={materialStatus}
                                        updataTable={updataTable}
                                        appUid={detail ? appData.appUid : appData.uid}
                                        bizUid={appData.appUid}
                                        bizType={detail ? 'APP' : 'APP_MARKET'}
                                        uid={appData.uid}
                                        tableTitle={tableTitle}
                                        handleExecute={(data: number[]) => {
                                            seleSave('SELECT', data);
                                        }}
                                    />
                                </div>

                                {appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
                                    (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                                ) && (
                                    <div className="mt-6">
                                        {detail ? (
                                            <div ref={steps2}>
                                                <AddStyle
                                                    selectImgLoading={selectImgLoading}
                                                    materialStatus={materialStatus}
                                                    saveTemplate={saveTemplate}
                                                    details={appData?.configuration?.appInformation}
                                                    hasAddStyle={detail || !detailShow ? false : true}
                                                    setImageVar={setImageVar}
                                                    appUid={appData?.appUid}
                                                    ref={imageRef}
                                                    record={imageMater}
                                                    getList={() => getList(true)}
                                                    materialType={materialType}
                                                />
                                            </div>
                                        ) : (
                                            <div ref={steps2}>
                                                <AddStyleApp
                                                    selectImgLoading={selectImgLoading}
                                                    allData={appData}
                                                    materialStatus={materialStatus}
                                                    details={appData?.configuration?.appInformation}
                                                    hasAddStyle={detail || !detailShow ? false : true}
                                                    setImageVar={setImageVar}
                                                    getList={() => getList(true)}
                                                    appUid={appData?.appUid}
                                                    ref={imageRef}
                                                    record={imageMater}
                                                    materialType={materialType}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {generateList?.map(
                                    (item: any, index: number) =>
                                        item?.flowStep?.handler === 'VariableActionHandler' && (
                                            <div key={item.field + index}>
                                                <Accordion defaultExpanded={index === 0} className="before:border-none !m-0 !mt-4">
                                                    <AccordionSummary
                                                        className="border-b border-solid border-black/20 p-0 !min-h-[0]"
                                                        sx={{
                                                            '& .Mui-expanded': {
                                                                my: '12px !important'
                                                            },
                                                            '& .Mui-expanded .aaa': {
                                                                transition: 'transform 0.4s',
                                                                transform: 'rotate(0deg)'
                                                            }
                                                        }}
                                                    >
                                                        <div className="w-full flex items-center">
                                                            <ExpandMore className="aaa -rotate-90" />
                                                            <span className="text-base font-semibold">{item.name}</span>
                                                        </div>
                                                    </AccordionSummary>
                                                    <AccordionDetails className="!px-0">
                                                        <div>
                                                            <div className="text-xs text-black/50">{item?.description}</div>
                                                            {item?.variable?.variables?.map((dt: any, de: number) => (
                                                                <Forms
                                                                    key={dt.value + de.toString()}
                                                                    item={dt}
                                                                    index={de}
                                                                    changeValue={(data: any) => {
                                                                        const newList = _.cloneDeep(generRef.current);
                                                                        newList[index].variable.variables[de].value = data.value;
                                                                        console.log(newList);

                                                                        generRef.current = newList;
                                                                        setGenerateList(generRef.current);
                                                                        setAppDataGen();
                                                                    }}
                                                                    flag={false}
                                                                />
                                                            ))}
                                                        </div>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        )
                                )}
                                {detailShow && (
                                    <div className="mt-6">
                                        <div className="text-base font-semibold mb-2">生成数量</div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative max-w-[300px]">
                                                <InputNumber
                                                    className="bg-[#f8fafc] w-full"
                                                    size="large"
                                                    value={totalCount}
                                                    onChange={(e: any) => {
                                                        setTotalCount(e);
                                                        setTotalCountRef && setTotalCountRef(e);
                                                    }}
                                                    min={1}
                                                    max={32}
                                                />
                                                {/* <span className="text-[#697586] block bg-gradient-to-b from-[#fff] to-[#f8fafc] px-[5px] absolute top-[-9px] left-2 text-[12px]">
                                                生成数量
                                            </span> */}
                                            </div>
                                            <Tooltip title="单次最多 32 条，如需更多可分批执行">
                                                <ExclamationCircleOutlined className="cursor-pointer" />
                                            </Tooltip>
                                        </div>
                                    </div>
                                )}
                            </Tabs.TabPane>
                        )}
                        <Tabs.TabPane
                            key={
                                appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
                                    (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                                ) ||
                                appData?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                                    (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                                )
                                    ? '2'
                                    : '1'
                            }
                            tab={<div ref={steps3}>笔记生成</div>}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <InfoCircleOutlined />
                                    <span className="text-sm ml-1 text-stone-600">配置 AI生成规则，灵活定制生成的内容</span>
                                </div>
                            </div>

                            {generateList?.map(
                                (item: any, index: number) =>
                                    item?.flowStep?.handler !== 'VariableActionHandler' && (
                                        <div key={item.field + index}>
                                            <Accordion defaultExpanded={true} className="before:border-none !m-0">
                                                <AccordionSummary
                                                    className="border-b border-solid border-black/20 p-0 !min-h-[0]"
                                                    sx={{
                                                        '& .Mui-expanded': {
                                                            my: '12px !important'
                                                        },
                                                        '& .Mui-expanded .aaa': {
                                                            transition: 'transform 0.4s',
                                                            transform: 'rotate(0deg)'
                                                        }
                                                    }}
                                                >
                                                    <div className="w-full flex items-center">
                                                        <ExpandMore className="aaa -rotate-90" />
                                                        {item.name}
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails className="!px-0">
                                                    <div className="text-xs text-black/50">{item?.description}</div>
                                                    {item?.variable?.variables?.map((el: any, i: number) => (
                                                        <div key={el.field}>
                                                            {el.field === 'REFERS'
                                                                ? (item?.variable?.variables?.find(
                                                                      (dt: any) => dt.field === 'GENERATE_MODE'
                                                                  ).value === 'AI_PARODY' ||
                                                                      item?.variable?.variables?.find(
                                                                          (dt: any) => dt.field === 'GENERATE_MODE'
                                                                      ).value === 'RANDOM') && (
                                                                      <MarketForm
                                                                          item={el}
                                                                          materialType={''}
                                                                          details={
                                                                              appData?.configuration?.appInformation ||
                                                                              appData?.executeParam?.appInformation
                                                                          }
                                                                          materialList={
                                                                              item?.variable?.variables?.find(
                                                                                  (item: any) => item?.field === 'MATERIAL_TYPE'
                                                                              )?.options || []
                                                                          }
                                                                          materialValue={
                                                                              item?.variable?.variables?.find(
                                                                                  (item: any) => item?.field === 'MATERIAL_TYPE'
                                                                              )?.value ||
                                                                              item?.variable?.variables?.find(
                                                                                  (item: any) => item?.field === 'MATERIAL_TYPE'
                                                                              )?.defaultValue
                                                                          }
                                                                          stepCode={item?.field}
                                                                          model={''}
                                                                          handlerCode={item?.flowStep?.handler}
                                                                          history={false}
                                                                          promptShow={true}
                                                                          setEditOpen={setEditOpens}
                                                                          setTitle={setTitles}
                                                                          setStep={() => {
                                                                              stepRef.current = index;
                                                                              setStep(stepRef.current);
                                                                          }}
                                                                          columns={stepMaterial[index]}
                                                                          setMaterialType={(e: any) => {
                                                                              if (e) {
                                                                                  setMaterialTypes(e);
                                                                                  const newList = _.cloneDeep(generRef.current);
                                                                                  newList[index].variable.variables.find(
                                                                                      (dt: any) => dt.field === 'MATERIAL_TYPE'
                                                                                  ).value = e;
                                                                                  generRef.current = newList;
                                                                                  setGenerateList(generRef.current);
                                                                                  newList[index].variable.variables[
                                                                                      item.variable.variables?.findIndex(
                                                                                          (item: any) => item.style === 'MATERIAL'
                                                                                      )
                                                                                  ].value = [];
                                                                                  stepRef.current = index;
                                                                                  setStep(stepRef.current);
                                                                                  setTableDatas(e, index);
                                                                              } else {
                                                                                  setMaterialTypes(
                                                                                      item?.variable?.variables?.find(
                                                                                          (i: any) => i.field === 'MATERIAL_TYPE'
                                                                                      )?.value
                                                                                  );
                                                                              }
                                                                          }}
                                                                          onChange={(e: any) => {
                                                                              const newList = _.cloneDeep(generRef.current);
                                                                              const type = e.name === 'MATERIAL_TYPE' ? e.value : undefined;
                                                                              const code = item?.flowStep?.handler;
                                                                              newList[index].variable.variables[i].value = e.value;
                                                                              if (
                                                                                  type &&
                                                                                  item.variable.variables?.find(
                                                                                      (item: any) => item.style === 'MATERIAL'
                                                                                  )
                                                                              ) {
                                                                                  newList[index].variable.variables[
                                                                                      item.variable.variables?.findIndex(
                                                                                          (item: any) => item.style === 'MATERIAL'
                                                                                      )
                                                                                  ].value = [];
                                                                                  stepRef.current = index;
                                                                                  setStep(stepRef.current);
                                                                                  setTableDatas(type, index);
                                                                              }
                                                                              if (
                                                                                  code === 'CustomActionHandler' &&
                                                                                  e.name === 'GENERATE_MODE'
                                                                              ) {
                                                                                  const num = item.variable.variables?.findIndex(
                                                                                      (item: any) => item.field === 'CUSTOM_REQUIREMENT'
                                                                                  );
                                                                                  const num1 = item.variable.variables?.findIndex(
                                                                                      (item: any) => item.style === 'MATERIAL'
                                                                                  );
                                                                                  const num2 = item.variable.variables?.findIndex(
                                                                                      (item: any) => item.field === 'PARODY_REQUIREMENT'
                                                                                  );
                                                                                  if (e.value === 'RANDOM') {
                                                                                      newList[index].variable.variables[num].isShow = false;
                                                                                      newList[index].variable.variables[num1].isShow = true;
                                                                                      newList[index].variable.variables[num2].isShow =
                                                                                          false;
                                                                                  } else if (e.value === 'AI_PARODY') {
                                                                                      newList[index].variable.variables[num].isShow = false;
                                                                                      newList[index].variable.variables[num1].isShow = true;
                                                                                      newList[index].variable.variables[num2].isShow = true;
                                                                                  } else {
                                                                                      newList[index].variable.variables[num].isShow = true;
                                                                                      newList[index].variable.variables[num1].isShow =
                                                                                          false;
                                                                                      newList[index].variable.variables[num2].isShow =
                                                                                          false;
                                                                                  }
                                                                              }
                                                                              generRef.current = newList;
                                                                              setGenerateList(generRef.current);
                                                                              setAppDataGen();
                                                                              setAppData(appRef.current);
                                                                          }}
                                                                      />
                                                                  )
                                                                : el?.isShow && (
                                                                      <MarketForm
                                                                          item={el}
                                                                          materialType={''}
                                                                          details={
                                                                              appData?.configuration?.appInformation ||
                                                                              appData?.executeParam?.appInformation
                                                                          }
                                                                          materialList={
                                                                              item?.variable?.variables?.find(
                                                                                  (item: any) => item?.field === 'MATERIAL_TYPE'
                                                                              )?.options || []
                                                                          }
                                                                          materialValue={
                                                                              item?.variable?.variables?.find(
                                                                                  (item: any) => item?.field === 'MATERIAL_TYPE'
                                                                              )?.value ||
                                                                              item?.variable?.variables?.find(
                                                                                  (item: any) => item?.field === 'MATERIAL_TYPE'
                                                                              )?.defaultValue
                                                                          }
                                                                          stepCode={item?.field}
                                                                          model={''}
                                                                          handlerCode={item?.flowStep?.handler}
                                                                          history={false}
                                                                          promptShow={true}
                                                                          setEditOpen={setEditOpens}
                                                                          setTitle={setTitles}
                                                                          setStep={() => {
                                                                              stepRef.current = index;
                                                                              setStep(stepRef.current);
                                                                          }}
                                                                          columns={stepMaterial[index]}
                                                                          setMaterialType={(e: any) => {
                                                                              if (e) {
                                                                                  setMaterialTypes(e);
                                                                                  const newList = _.cloneDeep(generRef.current);
                                                                                  newList[index].variable.variables.find(
                                                                                      (dt: any) => dt.field === 'MATERIAL_TYPE'
                                                                                  ).value = e;
                                                                                  generRef.current = newList;
                                                                                  setGenerateList(generRef.current);
                                                                                  newList[index].variable.variables[
                                                                                      item.variable.variables?.findIndex(
                                                                                          (item: any) => item.style === 'MATERIAL'
                                                                                      )
                                                                                  ].value = [];
                                                                                  stepRef.current = index;
                                                                                  setStep(stepRef.current);
                                                                                  setTableDatas(e, index);
                                                                              } else {
                                                                                  setMaterialTypes(
                                                                                      item?.variable?.variables?.find(
                                                                                          (i: any) => i.field === 'MATERIAL_TYPE'
                                                                                      )?.value
                                                                                  );
                                                                              }
                                                                          }}
                                                                          onChange={(e: any) => {
                                                                              const newList = _.cloneDeep(generRef.current);
                                                                              const type = e.name === 'MATERIAL_TYPE' ? e.value : undefined;
                                                                              const code = item?.flowStep?.handler;
                                                                              newList[index].variable.variables[i].value = e.value;
                                                                              if (
                                                                                  type &&
                                                                                  item.variable.variables?.find(
                                                                                      (item: any) => item.style === 'MATERIAL'
                                                                                  )
                                                                              ) {
                                                                                  newList[index].variable.variables[
                                                                                      item.variable.variables?.findIndex(
                                                                                          (item: any) => item.style === 'MATERIAL'
                                                                                      )
                                                                                  ].value = [];
                                                                                  stepRef.current = index;
                                                                                  setStep(stepRef.current);
                                                                                  setTableDatas(type, index);
                                                                              }
                                                                              if (
                                                                                  code === 'CustomActionHandler' &&
                                                                                  e.name === 'GENERATE_MODE'
                                                                              ) {
                                                                                  const num = item.variable.variables?.findIndex(
                                                                                      (item: any) => item.field === 'CUSTOM_REQUIREMENT'
                                                                                  );
                                                                                  const num1 = item.variable.variables?.findIndex(
                                                                                      (item: any) => item.style === 'MATERIAL'
                                                                                  );
                                                                                  const num2 = item.variable.variables?.findIndex(
                                                                                      (item: any) => item.field === 'PARODY_REQUIREMENT'
                                                                                  );
                                                                                  if (e.value === 'RANDOM') {
                                                                                      newList[index].variable.variables[num].isShow = false;
                                                                                      newList[index].variable.variables[num1].isShow = true;
                                                                                      newList[index].variable.variables[num2].isShow =
                                                                                          false;
                                                                                  } else if (e.value === 'AI_PARODY') {
                                                                                      newList[index].variable.variables[num].isShow = false;
                                                                                      newList[index].variable.variables[num1].isShow = true;
                                                                                      newList[index].variable.variables[num2].isShow = true;
                                                                                  } else {
                                                                                      newList[index].variable.variables[num].isShow = true;
                                                                                      newList[index].variable.variables[num1].isShow =
                                                                                          false;
                                                                                      newList[index].variable.variables[num2].isShow =
                                                                                          false;
                                                                                  }
                                                                              }
                                                                              generRef.current = newList;
                                                                              setGenerateList(generRef.current);
                                                                              setAppDataGen();
                                                                              setAppData(appRef.current);
                                                                          }}
                                                                      />
                                                                  )}
                                                        </div>
                                                    ))}
                                                </AccordionDetails>
                                            </Accordion>
                                        </div>
                                    )
                            )}
                        </Tabs.TabPane>
                    </Tabs>
                </div>
                <div className="z-[1000] absolute bottom-0 flex gap-2 bg-[#fff] py-4 w-[calc(100%-8px)]">
                    {detailShow && (
                        <Button
                            ref={steps4}
                            className="w-full"
                            type="primary"
                            onClick={() => {
                                seleSave('FILTER_USAGE', null);
                            }}
                        >
                            立即生成
                        </Button>
                    )}
                    {!detailShow && (
                        <Button loading={saveLoading} className="w-full" onClick={() => handleSaveClick(false, true)} type="primary">
                            保存并重新生成
                        </Button>
                    )}
                </div>

                <Drawer title="错误信息" placement="right" onClose={() => setMessageOpen(false)} open={errMessageOpen} mask={false}>
                    <List
                        itemLayout="horizontal"
                        dataSource={errMessageList}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item?.bizCode}
                                    description={<div className="text-xs text-[red]">{item?.message}</div>}
                                />
                            </List.Item>
                        )}
                    />
                </Drawer>
            </div>
            {editOpens && (
                <FormModal
                    getList={() => getList(true)}
                    allData={appData}
                    details={appData?.configuration?.appInformation}
                    title={titles}
                    materialType={materialTypes}
                    editOpen={editOpens}
                    setEditOpen={setEditOpens}
                    columns={stepMarRef.current[stepRef.current]}
                    form={forms}
                    formOk={formOks}
                    sourceList={typeList}
                />
            )}
            <Tour
                open={tourOpen}
                closeIcon={false}
                onClose={() => setTourOpen(false)}
                steps={tourStep}
                onFinish={() => {
                    wsCache.set('newMember', true);
                }}
            />
        </>
    );
};

export default Lefts;
