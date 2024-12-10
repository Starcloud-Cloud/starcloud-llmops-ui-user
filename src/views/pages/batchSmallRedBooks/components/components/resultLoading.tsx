import { Modal, Progress, Tag, Table, Button } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import _ from 'lodash-es';

const ResultLoading = ({
    tagFlag,
    canExecute,
    materialExecutionOpen,
    setMaterialExecutionOpen,
    timeSpent,
    materialPre,
    executionCount,
    totalCount,
    successCount,
    errorCount,
    columns,
    materialzanList,
    errorMessage,
    resetExe,
    reTryExe,
    handleSave,
    handleCancel
}: {
    tagFlag?: boolean;
    canExecute?: boolean;
    materialExecutionOpen: boolean;
    setMaterialExecutionOpen: (data: boolean) => void;
    materialPre: number;
    timeSpent?: number;
    executionCount: number;
    totalCount: number;
    successCount: number;
    errorCount: number;
    columns: any[];
    materialzanList: any[];
    resetExe: () => void;
    errorMessage: any[];
    reTryExe: () => void;
    handleSave: (flag?: boolean) => void;
    handleCancel: () => void;
}) => {
    return (
        <Modal
            title="笔记素材智能生成"
            width={'80%'}
            open={materialExecutionOpen}
            onCancel={() => setMaterialExecutionOpen(false)}
            footer={false}
        >
            <div className="flex justify-center ">
                <Progress percent={materialPre} type="circle" />
            </div>
            {executionCount !== 0 && (
                <>
                    <div className="flex justify-center">
                        <div className="font-bold mt-4 loader"></div>
                    </div>
                    <div className="flex justify-center gap-2 text-[14px] ">
                        <HistoryOutlined /> 预计耗时：{timeSpent || 40}s
                    </div>
                </>
            )}
            <div className="my-4">
                {errorMessage?.length > 0 &&
                    errorMessage?.map((item, i) => (
                        <div className="mb-2 text-[#ff4d4f] text-xs flex justify-center">
                            <span className="font-bold">错误信息 {i + 1}：</span>
                            {item}
                        </div>
                    ))}
            </div>

            {totalCount === successCount + errorCount && successCount !== 0 && (
                <div className="my-4 text-xs flex justify-center">
                    <span className="font-bold">已经生成完成，点击确认导入素材</span>
                </div>
            )}
            {!tagFlag && (
                <div className="flex gap-2 justify-center mt-4 text-xs">
                    <div>
                        <Tag>全部：{totalCount}</Tag>
                    </div>
                    <div>
                        <Tag color="processing">待执行：{totalCount - successCount - errorCount - executionCount}</Tag>
                    </div>
                    <div>
                        <Tag color="processing">执行中：{executionCount}</Tag>
                    </div>
                    <div>
                        <Tag color="success">执行完成：{successCount}</Tag>
                    </div>
                    <div>
                        <Tag color="error">执行失败：{errorCount}</Tag>
                    </div>
                </div>
            )}
            <div className="material-index mt-4">
                <Table columns={columns} virtual={true} dataSource={materialzanList} />
            </div>
            <div className="flex justify-center gap-2 mt-4">
                {executionCount === 0 && (
                    <>
                        {/* <Button className="w-[100px]" size="small" onClick={resetExe}>
                            重新执行
                        </Button> */}
                        {errorMessage?.length > 0 && (
                            <Button className="w-[100px]" size="small" onClick={reTryExe}>
                                失败重试
                            </Button>
                        )}
                        {materialzanList?.length > 0 && (
                            <Button onClick={() => handleSave()} className="w-[100px]" size="small" type="primary">
                                确认
                            </Button>
                        )}
                        {canExecute && successCount > 0 && (
                            <Button onClick={() => handleSave(true)} className="w-[100px]" size="small" type="primary">
                                直接生成
                            </Button>
                        )}
                    </>
                )}
                {executionCount > 0 && (
                    <Button size="small" type="primary" onClick={handleCancel}>
                        取消执行
                    </Button>
                )}
            </div>
        </Modal>
    );
};
export default ResultLoading;
