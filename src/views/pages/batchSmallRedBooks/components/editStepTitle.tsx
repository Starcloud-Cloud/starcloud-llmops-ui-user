import { Modal, Tabs, Form, Input } from 'antd';
import FormExecute from 'views/template/components/newValidaForm';
import { useEffect, useState } from 'react';
import _ from 'lodash-es';
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
    const [active, setActive] = useState('1');
    const [variables, setVariables] = useState<any[]>([]);
    useEffect(() => {
        if (stepTitData) {
            const { name, description } = stepTitData;
            form.setFieldsValue({ name, description });
            setVariables(stepTitData?.flowStep?.variable?.variables);
        }
    }, [stepTitData]);
    return (
        <Modal
            title="编辑"
            open={steptitOpen}
            onCancel={() => setSteotitOpen(false)}
            onOk={async () => {
                try {
                    const result = await form.validateFields();
                    if (variables?.some((item) => !item.value)) {
                        setActive('2');
                        return false;
                    }
                    setData({ ...result, variables });
                    setSteotitOpen(false);
                } catch (err) {
                    setActive('1');
                }
            }}
        >
            <Tabs activeKey={active} onChange={setActive}>
                <Tabs.TabPane tab="基础信息" key="1">
                    <Form form={form} labelCol={{ span: 6 }}>
                        <Form.Item label="步骤名称" name="name" rules={[{ required: true, message: '步骤名称必填' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="步骤描述" name="description">
                            <TextArea rows={10} />
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
                <Tabs.TabPane tab="大模型" key="2">
                    {variables?.map((el: any, i: number) => (
                        <div key={i + 'variables'}>
                            {el.field !== 'prompt' && el.field !== 'n' && el.field !== 'SYSTEM_POSTER_STYLE_CONFIG' && (
                                <FormExecute
                                    item={el}
                                    onChange={(e: any) => {
                                        const newList = _.cloneDeep(variables);
                                        newList[i].value = e.value;
                                        setVariables(newList);
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </Tabs.TabPane>
                {/* <Tabs.TabPane tab="返回结果" key="3"></Tabs.TabPane> */}
            </Tabs>
        </Modal>
    );
};
export default EditStepTitle;
