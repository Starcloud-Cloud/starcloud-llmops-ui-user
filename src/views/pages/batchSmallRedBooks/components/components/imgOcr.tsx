import { Checkbox, Button, Switch } from 'antd';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
const ImgOcr = ({
    imgCheckedList,
    ocrData,
    setOcrData,
    setSelOpen,
    selList,
    tableDataLength,
    handleOCR
}: {
    imgCheckedList: any[];
    ocrData: any;
    setOcrData: (data: any) => void;
    setSelOpen: (data: boolean) => void;
    selList: any[];
    tableDataLength: number;
    handleOCR: (type: number) => void;
}) => {
    const handleExe = (num: number) => {
        if (ocrData.checkedFieldList?.length === 0) {
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
        handleOCR(num);
        // editMaterial(num);
    };
    return (
        <div>
            <div className="text-[16px] font-bold mb-4">1.选择需要 OCR 补齐的图片字段</div>
            <Checkbox.Group
                onChange={(e) => {
                    setOcrData({
                        ...ocrData,
                        checkedFieldList: e
                    });
                }}
                value={ocrData.checkedFieldList}
            >
                {imgCheckedList?.map((item) => (
                    <Checkbox value={item.dataIndex}>{item.title}</Checkbox>
                ))}
            </Checkbox.Group>
            <div className="flex items-center pt-2">
                <span className="text-sm font-medium mr-2">OCR内容清洗:</span>
                <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked
                    checked={ocrData.cleansing}
                    onChange={(value) =>
                        setOcrData({
                            ...ocrData,
                            cleansing: value
                        })
                    }
                />
            </div>
            <div className="text-[16px] font-bold my-4">2.如何处理素材</div>
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
                    disabled={tableDataLength === 0}
                    onClick={() => {
                        handleExe(2);
                    }}
                    type="primary"
                >
                    <div className="flex flex-col items-center">
                        处理全部素材
                        <div>({tableDataLength})</div>
                    </div>
                </Button>
            </div>
        </div>
    );
};
export default ImgOcr;
