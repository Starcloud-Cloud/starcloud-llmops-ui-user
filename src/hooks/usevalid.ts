import * as Yup from 'yup';

interface Variable {
    field: string;
    label: string;
    type: string;
    isShow: boolean;
    // 其他字段...
}

const generateValidationSchema = (variables: Variable[], flag: boolean = false, prompt = false) => {
    const validationSchemaFields: Record<string, Yup.AnySchema> = {};

    variables &&
        variables.forEach((variable: any) => {
            const { field, label, isShow } = variable;
            if (isShow && field === 'prompt' && prompt) {
                validationSchemaFields[field] = Yup.string().max(10, '最多输入10000个字符').required(`${label}不能为空`);
            } else {
                validationSchemaFields[field] = Yup.string().required(`${label}不能为空`);
            }
            if (flag && field === 'prompt' && prompt) {
                validationSchemaFields[field] = Yup.string().max(10, '最多输入10000个字符').required(`${label}不能为空`);
            } else if (flag) {
                validationSchemaFields[field] = Yup.string().required(`${label}不能为空`);
            }
        });

    return Yup.object().shape(validationSchemaFields);
};
export default generateValidationSchema;
