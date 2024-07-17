import { Modal, Form, Upload, UploadProps, Image, Input, Button, Select, Tooltip, Tag } from 'antd';
import { LoadingOutlined, PlusOutlined, CloudUploadOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { getAccessToken } from 'utils/auth';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { noteDetail } from 'api/redBook/copywriting';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
import './index.scss';
import { PicImagePick } from 'ui-component/PicImagePick';
import { EditType } from '../detail';
import { ModalForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';

export const propShow: UploadProps = {
    name: 'image',
    action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
    headers: {
        Authorization: 'Bearer ' + getAccessToken()
    }
};
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
    materialType,
    row
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
    row?: any;
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
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filedName, setFiledName] = useState('');
    const [currentRecord, setCurrentRecord] = useState(null);
    const [imageData, setImageData] = useState<any>({});

    const [imageForm] = Form.useForm();

    useEffect(() => {
        if (selectImg && imageDataIndex) {
            form.setFieldValue(imageDataIndex, selectImg?.largeImageURL);
            setImageDataIndex('');
        }
    }, [selectImg]);

    const [seleVal, setSeleVal] = useState('');
    useEffect(() => {
        const newList = columns?.find((item) => item.type === EditType.Image);
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
            width={'60%'}
            title={title}
            open={editOpen}
            styles={{
                body: {
                    height: '60vh',
                    padding: '0 8px',
                    overflow: 'auto'
                }
            }}
            onCancel={() => {
                form.resetFields();
                setEditOpen(false);
            }}
            onOk={async () => {
                const result = await form.validateFields();
                if (result?.images) {
                    result.images = fileList?.map((item: any) => item?.response?.data?.url) || [];
                }
                // result[filedName + '_description'] = imageData.description;
                // result[filedName + '_tags'] = imageData.tags;

                console.log(row, 'row');
                await formOk({ ...row, ...imageData, ...result });
            }}
        >
            <Form form={form} labelCol={{ span: 7 }}>
                {columns?.map(
                    (item, index) =>
                        item.title !== '操作' &&
                        item.title !== '序号' &&
                        item.title !== 'ID' &&
                        item.title !== '使用次数' &&
                        (item.type !== 'weburl' ? (
                            <Form.Item
                                key={index}
                                label={item.title}
                                name={item.dataIndex}
                                rules={[{ required: item.required, message: `${item.title}是必填的` }]}
                            >
                                {item.type === EditType.Image ? (
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
                                                    // preview={{
                                                    //     src: selectImg?.largeImageURL || form.getFieldValue(item.dataIndex)
                                                    // }}
                                                    preview={false}
                                                    onMouseEnter={() => setCanUpload(false)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    width={102}
                                                    height={102}
                                                    src={
                                                        form.getFieldValue(item.dataIndex) +
                                                        '?x-oss-process=image/resize,w_100/quality,q_80'
                                                    }
                                                />
                                                <div
                                                    className="absolute z-[1] cursor-pointer inset-0 bg-[rgba(0, 0, 0, 0.5)] flex justify-center items-center text-white opacity-0 hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewOpen(true);
                                                        console.log(item);
                                                        setCurrentRecord(item);
                                                        setFiledName(item.dataIndex);
                                                    }}
                                                >
                                                    <div>
                                                        <EyeOutlined />
                                                        预览
                                                    </div>
                                                </div>
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
                                ) : (
                                    <TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
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
            {previewOpen && (
                <ModalForm
                    onInit={async () => {
                        const value: any = {};
                        value[filedName + '_tags'] = imageData[filedName + '_tags'] || row[filedName + '_tags'];
                        value[filedName + '_description'] = imageData[filedName + '_description'] || row[filedName + '_description'];
                        await imageForm.setFieldsValue(value);
                    }}
                    layout="horizontal"
                    form={imageForm}
                    width={800}
                    title="预览"
                    open={previewOpen}
                    onOpenChange={setPreviewOpen}
                    onFinish={async () => {
                        const values = await imageForm.getFieldsValue();
                        setImageData({ ...imageData, ...values });
                        setPreviewOpen(false);
                    }}
                >
                    <div className="flex justify-center mb-3">
                        <Image width={500} height={500} className="object-contain" src={form.getFieldValue(filedName)} preview={false} />
                    </div>
                    <ProFormSelect mode="tags" name={filedName + '_tags'} label="标签" />
                    <ProFormTextArea name={filedName + '_description'} label="描述" />
                    {row && row[filedName + '_extend'] && (
                        <div>
                            <Tag>有扩展字段</Tag>
                        </div>
                    )}
                </ModalForm>
            )}
        </Modal>
    );
};
export default FormModal;
