import * as Yup from 'yup';

interface Variable {
    field: string;
    label: string;
    type: string;
    isShow: boolean;
    // 其他字段...
}

const generateValidationSchema = (variables: Variable[], flag: boolean = false) => {
    const validationSchemaFields: Record<string, Yup.AnySchema> = {};

    variables &&
        variables.forEach((variable: any) => {
            const { field, label, isShow } = variable;
            if (isShow) validationSchemaFields[field] = Yup.string().required(`${label}不能为空`);
            if (flag) validationSchemaFields[field] = Yup.string().required(`${label}不能为空`);
        });

    return Yup.object().shape(validationSchemaFields);
};
export default generateValidationSchema;
