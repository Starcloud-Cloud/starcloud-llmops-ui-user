import { useState, useEffect, createContext, ReactNode, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { appCreate, appModify, getApp, getRecommendApp } from 'api/template/index';
import { materialTemplate } from 'api/redBook/batchIndex';
import { schemeMetadata } from 'api/redBook/copywriting';
import { Image, Button, Popconfirm } from 'antd';
const MyApp = createContext<any>(null);
interface Variabe {
    variables?: {
        defaultValue?: string;
        description?: string;
        label?: string;
        field?: string;
        style?: string;
        isShow?: boolean;
        options?: any[];
        value: string | any[];
    }[];
}
interface Detail {
    name?: string;
    appUid?: string;
    model?: string;
    description?: string;
    publishUid?: string;
    configuration?: {};
    category?: string;
    scenes?: string[];
    tags?: string[];
    images?: string[];
    uid?: string;
    workflowConfig?: {
        steps?: {
            buttonLabel?: string;
            description?: string;
            name?: string;
            field?: string;
            flowStep?: {
                description?: string;
                response?: {
                    isShow?: boolean;
                    readonly?: boolean;
                    style?: string;
                    answer?: string;
                };
                variable?: Variabe;
            };
            variable?: Variabe;
        }[];
    };
}
const MyAppProvider = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const detailRef = useRef<Detail>({});
    const [detail, setDetail] = useState<Detail>({});
    //获取页面数据
    const getList = async () => {
        const res = await schemeMetadata();
        refersSourceRef.current = res.refersSource;
        setRefersSource(refersSourceRef.current);
        if (searchParams.get('uid')) {
            const result = await getApp({ uid: searchParams.get('uid') });
            resToJSON(result);
            return;
        }
        const result = await getRecommendApp({ recommend: searchParams.get('recommend') });
        resToJSON(result);
    };
    //将获取的数据包含素材转化成 JSON
    const resToJSON = (result: Detail) => {
        const newData = result;
        newData?.workflowConfig?.steps?.forEach((item: any) => {
            const arr = item?.variable?.variables;
            if (
                arr?.find((el: any) => el.field === 'MATERIAL_TYPE') &&
                arr?.find((el: any) => el.field === 'REFERS') &&
                arr?.find((el: any) => el.field === 'REFERS')?.value
            ) {
                let list: any;

                try {
                    list = JSON.parse(arr?.find((el: any) => el.field === 'REFERS')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.field === 'REFERS')?.value;
                }
                arr.find((el: any) => el.field === 'REFERS').value = list;
            }
        });
        if (newData?.workflowConfig?.steps?.length === 1) {
            // setAiModel(
            //     newData?.workflowConfig?.steps[0].flowStep?.variable?.variables?.find((item: any) => item?.field === 'model')?.value ||
            //         'gpt-3.5-turbo-1106'
            // );
        }
        detailRef.current = newData;
        setDetail(detailRef.current);
        getStepMater();
    };
    //获取哪个步骤有素材
    const stepMarRef = useRef<any[]>([]);
    const [stepMaterial, setStepMaterial] = useState<any[]>([]);
    const getStepMater = async () => {
        const arr: any[] = [];
        const newList = detailRef.current?.workflowConfig?.steps?.map((item: any) => {
            const arr = item?.variable?.variables;
            return arr?.find((i: any) => i?.field === 'MATERIAL_TYPE')?.value;
        });
        const allper =
            newList?.map(async (el: any, index: number) => {
                if (el) {
                    const res = await materialTemplate(el);
                    // arr[index] = getHeader(res?.fieldDefine, index);
                }
            }) || [];
        await Promise.all(allper);
        stepMarRef.current = arr;
        setStepMaterial(stepMarRef?.current);
    };
    const refersSourceRef = useRef<any>(null);
    const [refersSource, setRefersSource] = useState<any[]>([]);
    //获取数据表头
    // const getHeader = (data: any, i: number) => {
    //     const newList = data.map((item: any) => ({
    //         title: item.desc,
    //         align: 'center',
    //         width: 200,
    //         dataIndex: item.fieldName,
    //         render: (_: any, row: any) => (
    //             <div className="flex justify-center items-center flex-wrap break-all gap-2">
    //                 <div className="line-clamp-5">
    //                     {item.type === 'image' ? (
    //                         <Image width={50} height={50} preview={false} src={row[item.fieldName]} />
    //                     ) : item.fieldName === 'source' ? (
    //                         <>
    //                             {row[item.fieldName] === 'OTHER'
    //                                 ? refersSourceRef.current?.find((item: any) => item.value === 'OTHER')?.label
    //                                 : row[item.fieldName] === 'SMALL_RED_BOOK'
    //                                 ? refersSourceRef.current?.find((item: any) => item.value === 'SMALL_RED_BOOK')?.label
    //                                 : row[item.fieldName]}
    //                         </>
    //                     ) : (
    //                         row[item.fieldName]
    //                     )}
    //                 </div>
    //             </div>
    //         ),
    //         type: item.type
    //     }));
    //     return [
    //         ...newList,
    //         {
    //             title: '操作',
    //             align: 'center',
    //             width: 100,
    //             fixed: 'right',
    //             render: (_: any, row: any, index: number) => (
    //                 <div className="flex justify-center">
    //                     <Button
    //                         onClick={() => {
    //                             handleEdit(row, index, i);
    //                         }}
    //                         size="small"
    //                         type="link"
    //                     >
    //                         编辑
    //                     </Button>
    //                     <Popconfirm
    //                         title="提示"
    //                         description="请再次确认是否删除？"
    //                         okText="确认"
    //                         cancelText="取消"
    //                         onConfirm={() => handleDel(index, i)}
    //                     >
    //                         <Button size="small" type="link" danger>
    //                             删除
    //                         </Button>
    //                     </Popconfirm>
    //                 </div>
    //             )
    //         }
    //     ];
    // };
    // const getHeaders = (data: any, i: number) => {
    //     const newList = data;
    //     newList?.splice(newList?.length - 1, 1);
    //     return [
    //         ...newList,
    //         {
    //             title: '操作',
    //             align: 'center',
    //             width: 100,
    //             fixed: 'right',
    //             render: (_: any, row: any, index: number) => (
    //                 <div className="flex justify-center">
    //                     <Button
    //                         onClick={() => {
    //                             handleEdit(row, index, i);
    //                         }}
    //                         size="small"
    //                         type="link"
    //                     >
    //                         编辑
    //                     </Button>
    //                     <Popconfirm
    //                         title="提示"
    //                         description="请再次确认是否删除？"
    //                         okText="确认"
    //                         cancelText="取消"
    //                         onConfirm={() => handleDel(index, i)}
    //                     >
    //                         <Button size="small" type="link" danger>
    //                             删除
    //                         </Button>
    //                     </Popconfirm>
    //                 </div>
    //             )
    //         }
    //     ];
    // };
    useEffect(() => {
        getList();
    }, []);
    return <MyApp.Provider value={{ detail, setDetail }}>{children}</MyApp.Provider>;
};
export default MyAppProvider;
