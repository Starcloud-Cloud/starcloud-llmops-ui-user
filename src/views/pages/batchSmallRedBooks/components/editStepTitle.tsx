import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';

const EditStepTitle = ({
    steptitOpen,
    stepTitData,
    setSteotitOpen,
    setData
}: {
    steptitOpen: boolean;
    stepTitData: any;
    setSteotitOpen: (data: boolean) => void;
    setData: (data: any) => void;
}) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    useEffect(() => {
        if (stepTitData) {
            form.setFieldsValue(stepTitData);
        }
    }, [stepTitData]);
    return (
        <Modal
            title="编辑"
            open={steptitOpen}
            onCancel={() => setSteotitOpen(false)}
            onOk={async () => {
                const result = await form.validateFields();
                setData(result);
                setSteotitOpen(false);
            }}
        >
            <Form form={form} labelCol={{ span: 6 }}>
                <Form.Item label="步骤名称" name="name" rules={[{ required: true, message: '步骤名称必填' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="步骤描述" name="description">
                    <TextArea rows={10} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default EditStepTitle;
