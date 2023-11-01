import { useState } from 'react';
import { Button, message, Steps } from 'antd';
const SmallRedBook = () => {
    const steps = [
        {
            title: 'First',
            content: 'First-content'
        },
        {
            title: 'Second',
            content: 'Second-content'
        },
        {
            title: 'Last',
            content: 'Last-content'
        }
    ];
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    return (
        <div className="h-full bg-[#fff] p-[20px]">
            <Steps current={current} items={[{ title: '第一步' }, { title: '第二步' }, { title: '第三步' }]} />
            <div className="min-h-[500px] my-[20px] rounded border border-dashed border-[#d4d4d4] p-[20px]">
                {current === 0 && <div>步骤一</div>}
                {current === 1 && <div>步骤二</div>}
                {current === 2 && <div>步骤三</div>}
            </div>
            <div>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        执行
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
            </div>
        </div>
    );
};
export default SmallRedBook;
