import * as Yup from 'yup';

interface Variable {
    key: string;
    field: string;
    label: string;
    type: string;
    // 其他字段...
}

const generateValidationSchema = (variables: Variable[]) => {
    const validationSchemaFields: Record<string, Yup.AnySchema> = {};

    variables.forEach((variable: any) => {
        const { field, label } = variable;

        validationSchemaFields[field] = Yup.string().required(`${label}不能为空`);
        // 添加其他类型的校验规则，根据需要进行扩展
    });

    return Yup.object().shape(validationSchemaFields);
};
export default generateValidationSchema;
