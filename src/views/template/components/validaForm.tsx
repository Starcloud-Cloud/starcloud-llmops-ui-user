import { TextField, MenuItem } from '@mui/material';
import { useState, memo } from 'react';
import { Table, Button } from 'antd';
import { t } from 'i18next';
import _ from 'lodash-es';
export const verifyJSON = (value: any) => {
    const newValue = value?.replace(/'/g, '"');
    let parsedJson;
    try {
        JSON.parse(newValue);
        parsedJson = true;
    } catch (error) {
        parsedJson = false;
    }
    return parsedJson;
};
export const changeJSONValue = (value: string) => {
    let parsedJson: any = value?.replace(/'/g, '"');
    try {
        parsedJson = JSON.stringify(JSON.parse(parsedJson), null, 2);
    } catch (error) {}
    return parsedJson;
};
function FormExecute({ item, onChange, columns = [], setEditOpen, setTitle, setStep }: any) {
    const mt = {
        marginTop: 2
    };
    const [value, setValue] = useState(false);
    return (
        <>
            {item.style === 'INPUT' ? (
                <TextField
                    sx={mt}
                    size="small"
                    color="secondary"
                    label={item.label === 'Max Tokens' ? '最大返回Tokens' : item.label === 'Temperature' ? '温度值' : item.label}
                    value={item.value}
                    id={item.field}
                    required
                    name={item.field}
                    InputLabelProps={{ shrink: true }}
                    placeholder={item.defaultValue ? String(item.defaultValue) : ''}
                    error={!item.value && value}
                    helperText={!item.value && value ? `${item.label}必填` : item.description}
                    onChange={(e) => {
                        setValue(true);
                        onChange(e.target);
                    }}
                    fullWidth
                />
            ) : item.style === 'TEXTAREA' ? (
                <TextField
                    sx={mt}
                    size="small"
                    color="secondary"
                    label={item.label === 'Prompt' ? t('market.' + item.field) : item.label}
                    value={item.value}
                    id={item.field}
                    required
                    name={item.field}
                    multiline
                    minRows={3}
                    maxRows={3}
                    InputLabelProps={{ shrink: true }}
                    placeholder={item.defaultValue ? String(item.defaultValue) : ''}
                    error={!item.value && value}
                    helperText={!item.value && value ? `${item.label}必填` : item.description}
                    onChange={(e) => {
                        setValue(true);
                        onChange(e.target);
                    }}
                    fullWidth
                />
            ) : item.style === 'JSON' ? (
                <TextField
                    sx={mt}
                    size="small"
                    color="secondary"
                    label={item.label === 'Prompt' ? t('market.' + item.field) : item.label}
                    value={item.value}
                    id={item.field}
                    required
                    name={item.field}
                    multiline
                    minRows={3}
                    maxRows={3}
                    InputLabelProps={{ shrink: true }}
                    placeholder={item.defaultValue ? String(item.defaultValue) : ''}
                    error={!verifyJSON(item.value) && value}
                    helperText={!verifyJSON(item.value) && value ? `${item.label}必须为 JSON 格式` : item.description}
                    onChange={(e) => {
                        setValue(true);
                        onChange(e.target);
                    }}
                    onBlur={(e) => {
                        onChange({ name: item.field, value: changeJSONValue(e.target.value) });
                    }}
                    fullWidth
                />
            ) : item.style === 'SELECT' ? (
                <TextField
                    sx={mt}
                    size="small"
                    color="secondary"
                    value={item.value}
                    InputLabelProps={{ shrink: true }}
                    select
                    required
                    id={item.field}
                    name={item.field}
                    label={item.label === 'Model' ? '推荐模型' : item.label}
                    placeholder={item.defaultValue ? String(item.defaultValue) : ''}
                    error={!item.value && value}
                    helperText={!item.value && value ? `${item.label}必填` : item.description}
                    onChange={(e) => {
                        setValue(true);
                        onChange(e.target);
                    }}
                    fullWidth
                >
                    {item.options.map((el: any) => (
                        <MenuItem key={el.value} value={el.value}>
                            {el.label}
                        </MenuItem>
                    ))}
                </TextField>
            ) : (
                <div>
                    <div className="flex justify-end">
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                                setStep();
                                setTitle('新增');
                                setEditOpen(true);
                            }}
                        >
                            新增
                        </Button>
                    </div>
                    <Table rowKey={(_, index) => String(index)} columns={columns} dataSource={item.value} />
                </div>
            )}
        </>
    );
}
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.item) === JSON.stringify(nextProps?.item) &&
        JSON.stringify(prevProps?.columns) === JSON.stringify(nextProps?.columns)
    );
};
export default memo(FormExecute, arePropsEqual);
