import { Modal, Form, Upload, UploadProps, Image, Input, Button, Select } from 'antd';
import { LoadingOutlined, PlusOutlined, EyeOutlined, SelectOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { getAccessToken } from 'utils/auth';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { noteDetail } from 'api/redBook/copywriting';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
import '../index.scss';
import { PicImagePick } from '../../../../ui-component/PicImagePick/index';

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
    const { TextArea } = Input;
    const uploadRef = useRef<any>([]);
    const [uploadLoading, setUploadLoading] = useState([]);
    const [linkLoading, setLinkLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectImg, setSelectImg] = useState<any>(null);

    const propShow: UploadProps = {
        name: 'image',
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        }
    };
    const [seleVal, setSeleVal] = useState('');
    useEffect(() => {
        const newList = columns?.find((item) => item.type === 'listImage');
        if (newList) {
            setFileList(
                form.getFieldValue('images')?.map((item: any) => ({
                    uid: uuidv4(),
                    thumbUrl: item,
                    response: {
                        data: {
                            url: item
                        }
                    }
                }))
            );
            form.setFieldValue(
                'images',
                form.getFieldValue('images')?.map((item: any) => item)
            );
        }
    }, []);
    useEffect(() => {
        if (title === '编辑') {
            setSeleVal('SMALL_RED_BOOK');
        }
    }, []);
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [fileList, setFileList] = useState<any[]>([]);

    return (
        <Modal
            zIndex={1000}
            title={title}
            open={editOpen}
            onCancel={() => {
                form.resetFields();
                setEditOpen(false);
            }}
            onOk={async () => {
                const result = await form.validateFields();
                if (result?.images) {
                    result.images = fileList?.map((item: any) => item?.response?.data?.url) || [];
                }
                formOk(result);
            }}
        >
            <Form form={form} labelCol={{ span: 6 }}>
                {columns?.map(
                    (item, index) =>
                        item.title !== '操作' &&
                        item.title !== '序号' &&
                        (item.type !== 'weburl' ? (
                            <Form.Item
                                key={index}
                                label={item.title}
                                name={item.dataIndex}
                                rules={[{ required: item.required, message: `${item.title}是必填的` }]}
                            >
                                {item.type === 'image' ? (
                                    <Upload
                                        {...propShow}
                                        showUploadList={false}
                                        listType="picture-card"
                                        onChange={(info) => {
                                            if (info.file.status === 'uploading') {
                                                const newList = _.cloneDeep(uploadRef.current);
                                                newList[index] = true;
                                                uploadRef.current = newList;
                                                setUploadLoading(uploadRef.current);
                                                form.setFieldValue(item.dataIndex, undefined);
                                                return;
                                            }
                                            if (info?.file?.status === 'done') {
                                                const newList = _.cloneDeep(uploadRef.current);
                                                newList[index] = false;
                                                uploadRef.current = newList;
                                                setUploadLoading(uploadRef.current);
                                                form.setFieldValue(item.dataIndex, info?.file?.response?.data?.url);
                                            }
                                        }}
                                    >
                                        {form.getFieldValue(item.dataIndex) ? (
                                            <div className="relative">
                                                <Image
                                                    preview={false}
                                                    width={102}
                                                    height={102}
                                                    src={
                                                        selectImg?.largeImageURL ||
                                                        form.getFieldValue(item.dataIndex) +
                                                            '?x-oss-process=image/resize,w_300/quality,q_80'
                                                    }
                                                />
                                                <div className="top-0 left-0 z-[100] absolute w-full h-full hover:bg-black/30 flex justify-center items-center opacity-0 hover:opacity-100">
                                                    <EyeOutlined
                                                        onClick={(e) => {
                                                            setImageUrl(selectImg?.largeImageURL || form.getFieldValue(item.dataIndex));
                                                            setOpen(true);
                                                            e.stopPropagation();
                                                        }}
                                                        rev={undefined}
                                                        className="text-white/60 hover:text-white"
                                                    />
                                                    <SelectOutlined
                                                        rev={undefined}
                                                        className="text-white/60 hover:text-white ml-3"
                                                        onClick={(e) => {
                                                            setIsModalOpen(true);
                                                            e.stopPropagation();
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                                {uploadLoading[index] ? (
                                                    <LoadingOutlined rev={undefined} />
                                                ) : (
                                                    <PlusOutlined rev={undefined} />
                                                )}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        )}
                                    </Upload>
                                ) : item.type === 'listImage' ? (
                                    <Upload
                                        {...propShow}
                                        fileList={fileList}
                                        showUploadList={true}
                                        listType="picture-card"
                                        onChange={(info) => {
                                            if (info.file.status === 'uploading') {
                                                setFileList(info.fileList);
                                                form.setFieldValue(item.dataIndex, undefined);
                                                return;
                                            }
                                            if (info?.file?.status === 'done') {
                                                setFileList(info.fileList);
                                                form.setFieldValue(
                                                    item.dataIndex,
                                                    info?.fileList?.map((item) => item?.response?.data?.url)
                                                );
                                            }
                                        }}
                                        onRemove={(file) => {
                                            const newList = _.cloneDeep(fileList);
                                            newList?.splice(
                                                newList?.findIndex((item) => item.uid === file.uid),
                                                1
                                            );
                                            setFileList(newList);
                                            return;
                                        }}
                                    >
                                        <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                            {uploadLoading[index] ? <LoadingOutlined rev={undefined} /> : <PlusOutlined rev={undefined} />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                ) : item.type === 'select' ? (
                                    <Select
                                        onChange={(data) => {
                                            setSeleVal(data);
                                        }}
                                        options={sourceList}
                                        allowClear
                                    />
                                ) : item.title === '内容' || item.type === 'textBox' ? (
                                    <TextArea rows={8} />
                                ) : item.type === 'listStr' ? (
                                    <Select mode="tags" options={[]} />
                                ) : (
                                    <Input />
                                )}
                            </Form.Item>
                        ) : (
                            <Form.Item label={item.title}>
                                <div className="flex gap-2">
                                    <Form.Item
                                        className="flex-1"
                                        noStyle
                                        name={item.dataIndex}
                                        rules={[{ required: item.required, message: `${item.title}是必填的` }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    {seleVal === 'SMALL_RED_BOOK' && (
                                        <Button
                                            className="mt-[4px]"
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
                                                    form.setFieldsValue(result);
                                                } catch (err) {
                                                    setLinkLoading(false);
                                                }
                                            }}
                                            size="small"
                                            type="primary"
                                        >
                                            提取链接
                                        </Button>
                                    )}
                                </div>
                            </Form.Item>
                        ))
                )}
            </Form>
            <Image
                className="hidden"
                width={400}
                preview={{
                    visible: open,
                    onVisibleChange: (visible) => {
                        setOpen(visible);
                    }
                }}
                src={imageUrl}
            />
            {isModalOpen && <PicImagePick isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setSelectImg={setSelectImg} />}
        </Modal>
    );
};
export default FormModal;
