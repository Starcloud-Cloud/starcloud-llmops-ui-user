import { Checkbox, Radio, Button } from 'antd';
const Sensitive_words = ({ wordsValue, setWordsValue, checkedList, selList, tableDataLength, handleWords }: any) => {
    return (
        <div>
            {/* <div className="text-[16px] font-bold mb-4">1.选择要检查敏感词的字段</div>
            <Checkbox.Group onChange={setWordsValue} value={wordsValue}>
                {checkedList?.map((item) => (
                    <Checkbox key={item.dataIndex} value={item.dataIndex}>
                        {item.title}
                        {item.required ? '*' : ''}
                    </Checkbox>
                ))}
            </Checkbox.Group>
            <div className="text-[16px] font-bold mb-4">2.选择敏感词处理方式</div>
            <Radio.Group onChange={(e) => setSensitiveWords(e.target.value)} value={sensitiveWords}>
                <Radio value={1}>替换为*</Radio>
                <Radio value={2}>替换为同音字</Radio>
                <Radio value={3}>替换为拼音</Radio>
                <Radio value={4}>去除</Radio>
            </Radio.Group>
            <div className="text-[16px] font-bold mb-4">3.选择要处理的素材</div>
            <Button className="mb-4" type="primary" size="small" onClick={() => setSelOpen(true)}>
                选择素材
            </Button>
            <div className="flex justify-center gap-2">
                <Button className="h-[50px]" disabled={selList?.length === 0} onClick={() => handleExe(1)} type="primary">
                    <div className="flex flex-col items-center">
                        处理选中的素材
                        <div>({selList?.length})</div>
                    </div>
                </Button>
                <Button
                    className="h-[50px]"
                    disabled={tableDataLength === 0}
                    onClick={() => {
                        handleExe(2);
                    }}
                    type="primary"
                >
                    <div className="flex flex-col items-center">
                        处理全部素材
                        <div>({tableDataLength})</div>
                    </div>
                </Button>
            </div> */}
        </div>
    );
};
export default Sensitive_words;
