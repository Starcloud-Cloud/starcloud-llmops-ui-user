import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { UploadProps } from 'antd';
import { getAccessToken } from 'utils/auth';
const Form = ({ item, index, changeValue, flag }: { item: any; index: number; changeValue: any; flag?: boolean }) => {
    const mt = {
        marginTop: 2
    };
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const uploadButton = (
        <button style={{ border: 0, background: 'none', marginTop: 16 }} type="button">
            {loading ? <LoadingOutlined rev={undefined} /> : <PlusOutlined rev={undefined} />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        showUploadList: false,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
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
                <Upload {...props} className="mt-4">
                    {item.value ? <img className="mt-4" src={item.value} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            ) : null}
        </div>
    );
};
export default Form;
