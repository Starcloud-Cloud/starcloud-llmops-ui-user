import { Modal, Form, Upload, UploadProps, Image, Input, Button, Select } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getAccessToken } from 'utils/auth';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { noteDetail } from 'api/redBook/copywriting';
const FormModal = ({
    title,
    editOpen,
    setEditOpen,
    columns,
    form,
    formOk,
    sourceList,
    materialType
}: {
    title: string;
    editOpen: boolean;
    setEditOpen: (data: boolean) => void;
    columns: any[];
    form: any;
    formOk: (data: any) => void;
    sourceList?: any[];
    materialType?: string;
}) => {
    const { Option } = Select;
    const [uploadLoading, setUploadLoading] = useState(false);
    const [linkLoading, setLinkLoading] = useState(false);
    const propShow: UploadProps = {
        name: 'image',
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        }
    };
    return (
        <Modal
            zIndex={9000}
            title={title}
            open={editOpen}
            onCancel={() => {
                form.resetFields();
                setEditOpen(false);
            }}
            onOk={async () => {
                const result = await form.validateFields();
                formOk(result);
            }}
        >
            <Form form={form} labelCol={{ span: 6 }}>
                {columns?.map(
                    (item, index) =>
                        item.title !== '操作' &&
                        item.title !== '序号' && (
                            <Form.Item
                                key={index}
                                label={item.title}
                                name={item.dataIndex}
                                rules={[{ required: true, message: `${item.title}是必填的` }]}
                            >
                                {item.type === 'image' ? (
                                    <Upload
                                        {...propShow}
                                        showUploadList={false}
                                        listType="picture-card"
                                        onChange={(info) => {
                                            if (info.file.status === 'uploading') {
                                                setUploadLoading(true);
                                                form.setFieldValue(item.dataIndex, undefined);
                                                return;
                                            }
                                            if (info?.file?.status === 'done') {
                                                setUploadLoading(false);
                                                form.setFieldValue(item.dataIndex, info?.file?.response?.data?.url);
                                            }
                                        }}
                                    >
                                        {form.getFieldValue(item.dataIndex) ? (
                                            <Image preview={false} width={102} height={102} src={form.getFieldValue(item.dataIndex)} />
                                        ) : (
                                            <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                                {uploadLoading ? <LoadingOutlined rev={undefined} /> : <PlusOutlined rev={undefined} />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        )}
                                    </Upload>
                                ) : item?.type === 'button' ? (
                                    <div className="flex gap-2">
                                        <Input />
                                        {form.getFieldValue('source') === 'SMALL_RED_BOOK' && (
                                            <Button
                                                loading={linkLoading}
                                                onClick={async () => {
                                                    const str = /^https:\/\/www\.xiaohongshu\.com\/explore\/[a-zA-Z0-9]{24}$/;
                                                    if (!str.test(form.getFieldValue(item.dataIndex))) {
                                                        dispatch(
                                                            openSnackbar({
                                                                open: true,
                                                                message:
                                                                    '参考链接地址格式错误，请填写https://www.xiaohongshu.com/explore/24位数字或字母',
                                                                variant: 'alert',
                                                                alert: {
                                                                    color: 'error'
                                                                },
                                                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                transition: 'SlideDown',
                                                                close: false
                                                            })
                                                        );
                                                        return false;
                                                    }
                                                    setLinkLoading(true);
                                                    try {
                                                        const result = await noteDetail({
                                                            noteUrl: form.getFieldValue([item.dataIndex]),
                                                            materialType
                                                        });
                                                        setLinkLoading(false);
                                                        console.log(result);
                                                    } catch (err) {
                                                        setLinkLoading(false);
                                                    }
                                                }}
                                                size="small"
                                                type="primary"
                                            >
                                                提取链接{item.title}
                                            </Button>
                                        )}
                                    </div>
                                ) : item.type === 'select' ? (
                                    <Select>
                                        {sourceList?.map((item) => (
                                            <Option key={item.label} value={item.label}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                ) : (
                                    <>
                                        <Input />
                                        <Button
                                            loading={linkLoading}
                                            onClick={async () => {
                                                const str = /^https:\/\/www\.xiaohongshu\.com\/explore\/[a-zA-Z0-9]{24}$/;
                                                console.log(form.getFieldValue(item.dataIndex));

                                                if (!str.test(form.getFieldValue(item.dataIndex))) {
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message:
                                                                '参考链接地址格式错误，请填写https://www.xiaohongshu.com/explore/24位数字或字母',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'error'
                                                            },
                                                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                            transition: 'SlideDown',
                                                            close: false
                                                        })
                                                    );
                                                    return false;
                                                }
                                                setLinkLoading(true);
                                                try {
                                                    const result = await noteDetail({
                                                        noteUrl: form.getFieldValue(item.dataIndex),
                                                        materialType
                                                    });
                                                    setLinkLoading(false);
                                                    console.log(result);
                                                } catch (err) {
                                                    setLinkLoading(false);
                                                }
                                            }}
                                            size="small"
                                            type="primary"
                                        >
                                            提取链接{item.title}
                                        </Button>
                                    </>
                                )}
                            </Form.Item>
                        )
                )}
            </Form>
        </Modal>
    );
};
export default FormModal;
