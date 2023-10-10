import { Descriptions } from 'antd';
interface Result {
    errorCode?: string;
    errorMessage?: string;
}
const DetailErr = ({ result }: any) => {
    console.log(result);

    return (
        <Descriptions layout="vertical" bordered>
            <Descriptions.Item className="w-[150px]" label="错误码">
                {result?.errorCode}
            </Descriptions.Item>
            <Descriptions.Item label="错误信息">{result?.errorMessage}</Descriptions.Item>
        </Descriptions>
    );
};
export default DetailErr;
