import { Checkbox, Button, Input } from 'antd';
import { useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const FieldCompletion = ({
    fieldCompletionData,
    setFieldCompletionData,
    checkedList,
    selList,
    tableData,
    setSelOpen,
    editMaterial,
    setField
}: {
    fieldCompletionData: any;
    setFieldCompletionData?: (data: any) => void;
    checkedList: any[];
    setSelOpen: (data: boolean) => void;
    selList: any[];
    tableData: any[];
    editMaterial: (data: any) => void;
    setField?: (data: any) => void;
}) => {
    const { TextArea } = Input;
    const [requirementStatusOpen, setrequirementStatusOpen] = useState(false);
    const handleExe = (num: number) => {
        if (!fieldCompletionData.requirement) {
            setrequirementStatusOpen(true);
            return false;
        }
        if (fieldCompletionData.checkedFieldList?.length === 0) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'AI 补齐字段最少选一个',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            return false;
        }
        editMaterial(num);
    };
    return (
        <div>
            <div className="text-xs text-black/50">
                <p>先选择已选素材上想要补齐内容的字段，然后告诉AI你想生成的素材描述，越详细越好。</p>
                <p>AI会自动生成已选素材的空缺字段的内容。</p>
            </div>
            <div className="text-[16px] font-bold my-4">1.选择需要 AI 补齐的字段</div>
            <Checkbox.Group
                onChange={(e) => {
                    // if (fieldCompletionData.checkedFieldList.length > e.length) {
                    //     setFieldCompletionData({
                    //         ...fieldCompletionData,
                    //         checkedFieldList: e
                    //     });
                    // } else {
                    //     if (e.length > 6) {
                    //         if (checkedList?.find((item) => item.dataIndex === e[e.length - 1])?.required) {
                    //             setFieldCompletionData({
                    //                 ...fieldCompletionData,
                    //                 checkedFieldList: e
                    //             });
                    //         } else {
                    //             dispatch(
                    //                 openSnackbar({
                    //                     open: true,
                    //                     message: '最多只能选择6个字段',
                    //                     variant: 'alert',
                    //                     alert: {
                    //                         color: 'error'
                    //                     },
                    //                     anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    //                     close: false
                    //                 })
                    //             );
                    //         }
                    //     } else {
                    //         setFieldCompletionData({
                    //             ...fieldCompletionData,
                    //             checkedFieldList: e
                    //         });
                    //     }
                    // }
                }}
                value={fieldCompletionData.checkedFieldList}
            >
                {checkedList?.map((item) => (
                    <Checkbox value={item.dataIndex}>
                        {item.title}
                        {item.required ? '*' : ''}
                    </Checkbox>
                ))}
            </Checkbox.Group>
            <div className="text-[16px] font-bold my-4">2.告诉 AI 如何生成这些字段内容</div>
            <TextArea
                defaultValue={fieldCompletionData.requirement}
                status={!fieldCompletionData.requirement && requirementStatusOpen ? 'error' : ''}
                onBlur={(e) => {
                    // setFieldCompletionData({ ...fieldCompletionData, requirement: e.target.value });
                    setrequirementStatusOpen(true);
                }}
                rows={10}
            />
            {!fieldCompletionData.requirement && requirementStatusOpen && (
                <span className="text-xs text-[#ff4d4f] ml-[4px]">优化字段内容必填</span>
            )}
            <div className="text-[16px] font-bold my-4">3.如何处理素材</div>
            <Button className="mb-4" type="primary" size="small" onClick={() => setSelOpen(true)}>
                选择素材
            </Button>
            <div className="flex justify-center gap-2">
                <Button className="h-[50px]" disabled={selList?.length === 0} onClick={() => handleExe(1)} type="primary">
                    <div className="flex flex-col items-center">
                        处理选中的素材
                        <div>({selList?.length})</div>
                    </div>
                </Button>
                <Button
                    className="h-[50px]"
                    disabled={tableData?.length === 0}
                    onClick={() => {
                        handleExe(2);
                    }}
                    type="primary"
                >
                    <div className="flex flex-col items-center">
                        处理全部素材
                        <div>({tableData?.length})</div>
                    </div>
                </Button>
            </div>
            <div className="flex justify-center gap-6 mt-6">
                <Button
                    onClick={() => {
                        if (!fieldCompletionData.requirement) {
                            setrequirementStatusOpen(true);
                            return false;
                        }
                        if (fieldCompletionData.checkedFieldList?.length === 0) {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'AI 补齐字段最少选一个',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                            return false;
                        }
                        setField && setField(JSON.stringify(fieldCompletionData));
                    }}
                    type="primary"
                >
                    保存配置
                </Button>
            </div>
        </div>
    );
};
export default FieldCompletion;
