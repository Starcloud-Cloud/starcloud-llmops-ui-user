import * as Yup from 'yup';

interface Variable {
    field: string;
    label: string;
    type: string;
    // 其他字段...
}

const generateValidationSchema = (variables: Variable[]) => {
    const validationSchemaFields: Record<string, Yup.AnySchema> = {};

    variables &&
        variables.forEach((variable: any) => {
            const { field, label } = variable;
            if (field === 'prompt') {
                validationSchemaFields[field] = Yup.string().max(10000, '最多输入10000个字符').required(`${label}不能为空`);
            } else {
                validationSchemaFields[field] = Yup.string().required(`${label}不能为空`);
            }
        });

    return Yup.object().shape(validationSchemaFields);
};
export default generateValidationSchema;
