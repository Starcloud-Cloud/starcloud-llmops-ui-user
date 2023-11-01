import { useState } from 'react';
import { Button, message, Steps, Upload, UploadProps, Divider } from 'antd';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
const SmallRedBook = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        listType: 'picture-card',
        fileList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/uploadLimitPixel`,
        data: {},
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange(info) {
            if (info.fileList.every((value) => value.status !== 'uploading')) {
                const errMsg = info.fileList.map((item: any) => {
                    setFileList(info.fileList);
                });
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    const steps = [
        {
            title: 'First',
            content: 'First-content'
        },
        {
            title: 'Second',
            content: 'Second-content'
        },
        {
            title: 'Last',
            content: 'Last-content'
        }
    ];
    const [current, setCurrent] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    return (
        <div className="h-full bg-[#fff] p-[20px]">
            <Steps current={current} items={[{ title: '第一步' }, { title: '第二步' }, { title: '第三步' }]} />
            <div className="min-h-[500px] my-[20px] rounded border border-dashed border-[#d4d4d4] p-[20px]">
                {current === 0 && (
                    <div>
                        <FormControl color="secondary" fullWidth>
                            <InputLabel id="type">类型</InputLabel>
                            <Select labelId="type" label="类型">
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}
                {current === 1 && (
                    <div>
                        <Upload {...props}>
                            <div>
                                <PlusOutlined rev={undefined} />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                        <Divider />
                    </div>
                )}
                {current === 2 && <div>步骤三</div>}
            </div>
            <div>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        执行
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
            </div>
        </div>
    );
};
export default SmallRedBook;
