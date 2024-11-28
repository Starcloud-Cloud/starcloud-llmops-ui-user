import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { PlusOutlined, SearchOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { PicImagePick } from 'ui-component/PicImagePick';
import { Upload, Tooltip, Image } from 'antd';
import type { UploadProps } from 'antd';
import { getAccessToken } from 'utils/auth';
import { origin_url } from 'utils/axios/config';
const Form = ({ item, index, changeValue, flag }: { item: any; index: number; changeValue: any; flag?: boolean }) => {
    const mt = {
        marginTop: 2
    };
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canUpload, setCanUpload] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        showUploadList: false,
        action: `${origin_url}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 1,
        onChange(info) {
            console.log(info);

            if (info.file.status === 'uploading' && loading === false) {
                setLoading(true);
                return;
            }
            if (info.file.status === 'done') {
                setLoading(false);
                changeValue({ index, value: info?.file?.response?.data?.url });
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    return (
        <div>
            {item.style === 'INPUT' ? (
                <>
                    <TextField
                        color="secondary"
                        size="small"
                        sx={mt}
                        label={item.label}
                        defaultValue={item.value}
                        placeholder={item.defaultValue}
                        id={item.field}
                        required
                        name={item.field}
                        InputLabelProps={{ shrink: true }}
                        error={!item.value && !item.defaultValue && open && !flag}
                        helperText={!item.value && !item.defaultValue && open && !flag ? `${item.label}是必填项` : ''}
                        onBlur={(e) => {
                            setOpen(true);
                            changeValue({ index, value: e.target.value });
                        }}
                        fullWidth
                    />
                </>
            ) : item.style === 'TEXTAREA' || item.style === 'MATERIAL' ? (
                <TextField
                    color="secondary"
                    size="small"
                    sx={mt}
                    label={item.label}
                    defaultValue={item.value}
                    placeholder={item.defaultValue}
                    id={item.field}
                    required
                    name={item.field}
                    multiline
                    minRows={3}
                    maxRows={3}
                    InputLabelProps={{ shrink: true }}
                    error={!item.value && !item.defaultValue && open && !flag}
                    helperText={!item.value && !item.defaultValue && open && !flag ? `${item.label}是必填项` : ''}
                    onBlur={(e) => {
                        setOpen(true);
                        changeValue({ index, value: e.target.value });
                    }}
                    fullWidth
                />
            ) : item.style === 'SELECT' ? (
                <TextField
                    sx={mt}
                    size="small"
                    color="secondary"
                    value={item.value}
                    placeholder={item.defaultValue}
                    InputLabelProps={{ shrink: true }}
                    select
                    required
                    id={item.field}
                    name={item.field}
                    label={item.label}
                    error={!item.value && !item.defaultValue && open && !flag}
                    helperText={!item.value && !item.defaultValue && open && !flag ? `${item.label}是必填项` : ''}
                    onChange={(e) => {
                        setOpen(true);
                        changeValue({ index, value: e.target.value });
                    }}
                    fullWidth
                >
                    {item.options.map((el: any) => (
                        <MenuItem key={el.value} value={el.value}>
                            {el.label}
                        </MenuItem>
                    ))}
                </TextField>
            ) : item.style === 'IMAGE' ? (
                <>
                    <div className="text-xs mt-4 mb-2">{item.label}</div>
                    <Upload {...props} disabled={!canUpload}>
                        {item.value ? (
                            <div className="relative">
                                <Image
                                    onMouseEnter={() => setCanUpload(false)}
                                    onClick={(e) => e.stopPropagation()}
                                    width={82}
                                    height={82}
                                    preview={{
                                        src: item.value
                                    }}
                                    src={item.value + '?x-oss-process=image/resize,w_100/quality,q_80'}
                                />
                                <div className="bottom-0 z-[1] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.4)]">
                                    <Tooltip title="上传">
                                        <div
                                            className="flex-1 flex justify-center"
                                            onMouseEnter={() => setCanUpload(true)}
                                            onMouseLeave={() => setCanUpload(false)}
                                        >
                                            <CloudUploadOutlined className="text-white/60 hover:text-white" />
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="搜索">
                                        <div
                                            className="flex-1 flex justify-center !cursor-pointer"
                                            onClick={(e) => {
                                                setIsModalOpen(true);
                                                e.stopPropagation();
                                            }}
                                        >
                                            <SearchOutlined className="text-white/60 hover:text-white" />
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        ) : (
                            <div
                                className=" w-[80px] h-[80px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer relative"
                                onMouseEnter={() => setCanUpload(true)}
                            >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                                <Tooltip title="搜索">
                                    <div
                                        className="bottom-0 z-[1] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.5)]"
                                        onClick={(e) => {
                                            setIsModalOpen(true);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <SearchOutlined className="text-white/80 hover:text-white" />
                                    </div>
                                </Tooltip>
                            </div>
                        )}
                    </Upload>

                    {/* <Upload {...props} className="mt-4">
                    {item.value ? <img src={item.value} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload> */}
                </>
            ) : null}
            {isModalOpen && (
                <PicImagePick
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setSelectImg={(value) => {
                        console.log(value);
                        changeValue({ index, value: value?.largeImageURL });
                    }}
                />
            )}
        </div>
    );
};
export default Form;
