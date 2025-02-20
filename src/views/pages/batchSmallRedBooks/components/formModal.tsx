import { Modal, Form, Upload, UploadProps, Image, Input, Button, Select, Tooltip } from 'antd';
import { LoadingOutlined, PlusOutlined, CloudUploadOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { getAccessToken } from 'utils/auth';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { noteDetail } from 'api/redBook/copywriting';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
import '../index.scss';
import { PicImagePick } from '../../../../ui-component/PicImagePick/index';
import { origin_url } from 'utils/axios/config';

export const propShow: UploadProps = {
    name: 'image',
    action: `${origin_url}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
    headers: {
        Authorization: 'Bearer ' + getAccessToken()
    }
};

// @Deprecated
const FormModal = ({
    getList,
    materialList,
    details,
    allData,
    title,
    editOpen,
    setEditOpen,
    columns,
    form,
    formOk,
    sourceList,
    materialType
}: {
    getList?: any;
    materialList?: any;
    details?: any;
    allData?: any;
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
    const [rowIndex, setRowIndex] = useState(-1);
    const [selectImg, setSelectImg] = useState<any>(null);
    const [imageDataIndex, setImageDataIndex] = useState<string>('');
    const [canUpload, setCanUpload] = useState(true);
    const [values, setValues] = useState({});

    useEffect(() => {
        if (selectImg && imageDataIndex) {
            form.setFieldValue(imageDataIndex, selectImg?.largeImageURL);
            setImageDataIndex('');
        }
    }, [selectImg]);

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

    console.log(columns, 'columns');

    return (
        <Modal
            zIndex={1000}
            width={'60%'}
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
            <Form form={form} labelCol={{ span: 7 }}>
                {columns?.map(
                    (item, index) =>
                        item.title !== '操作' &&
                        item.title !== '序号' &&
                        (item.type !== 'weburl' ? (
                            <Form.Item
                                key={index}
                                label={item.title}
                                name={item.dataIndex}
                                initialValue={item.title === '参考来源' ? 'SMALL_RED_BOOK' : undefined}
                                rules={[{ required: item.required, message: `${item.title}是必填的` }]}
                            >
                                {item.type === 'image' ? (
                                    <Upload
                                        {...propShow}
                                        showUploadList={false}
                                        disabled={!canUpload}
                                        listType="picture-card"
                                        maxCount={1}
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
                                                setSelectImg({
                                                    largeImageURL: info?.file?.response?.data?.url
                                                });
                                            }
                                        }}
                                    >
                                        {form.getFieldValue(item.dataIndex) ? (
                                            <div className="relative">
                                                <Image
                                                    preview={{
                                                        src: selectImg?.largeImageURL || form.getFieldValue(item.dataIndex)
                                                    }}
                                                    onMouseEnter={() => setCanUpload(false)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    width={102}
                                                    height={102}
                                                    src={
                                                        form.getFieldValue(item.dataIndex) +
                                                        '?x-oss-process=image/resize,w_100/quality,q_80'
                                                    }
                                                />
                                                <div className="bottom-0 z-[100] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.5)]">
                                                    <Tooltip title="上传">
                                                        <div
                                                            className="flex-1 flex justify-center !cursor-pointer"
                                                            onMouseEnter={() => setCanUpload(true)}
                                                            onMouseLeave={() => setCanUpload(false)}
                                                        >
                                                            <CloudUploadOutlined className="text-white/80 hover:text-white !cursor-pointer" />
                                                        </div>
                                                    </Tooltip>
                                                    <Tooltip title="搜索">
                                                        <div
                                                            className="flex-1 flex justify-center !cursor-pointer"
                                                            onClick={async (e) => {
                                                                setIsModalOpen(true);
                                                                e.stopPropagation();
                                                                setImageDataIndex(item.dataIndex);
                                                                const result = await form.getFieldsValue();
                                                                setValues(result);
                                                            }}
                                                        >
                                                            <SearchOutlined className="text-white/80 hover:text-white" />
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer relative"
                                                onMouseEnter={() => setCanUpload(true)}
                                            >
                                                {uploadLoading[index] ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                                <Tooltip title="搜索">
                                                    <div
                                                        className="bottom-0 z-[100] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.5)]"
                                                        onClick={async (e) => {
                                                            setIsModalOpen(true);
                                                            e.stopPropagation();
                                                            setImageDataIndex(item.dataIndex);
                                                        }}
                                                    >
                                                        <SearchOutlined className="text-white/80 hover:text-white" />
                                                    </div>
                                                </Tooltip>
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
                                            {uploadLoading[index] ? <LoadingOutlined /> : <PlusOutlined />}
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
                                    <Input disabled={item.type === 'document'} />
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
            {isModalOpen && (
                <PicImagePick
                    getList={getList}
                    materialList={materialList}
                    allData={allData}
                    details={details}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setSelectImg={setSelectImg}
                    columns={columns}
                    values={values}
                />
            )}
        </Modal>
    );
};
export default FormModal;
