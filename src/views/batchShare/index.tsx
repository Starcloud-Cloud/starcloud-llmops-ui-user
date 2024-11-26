import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { shareList } from 'api/redBook/batchIndex';
import Good from '../pages/batchSmallRedBooks/good';
import { QRCode } from 'antd';
import { DetailModal } from '../pages/redBookContentList/component/detailModal';
const BatchShare = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [detailOpen, setDetailOpen] = useState(false);
    const [businessUid, setBusinessUid] = useState('');
    const [redList, setRedList] = useState<any[]>([]);
    const getList = async () => {
        const result = await shareList(params.get('uid'));
        setRedList(result.list);
    };
    useEffect(() => {
        getList();
    }, []);
    return (
        <div className="p-4">
            <div>
                <div className="text-xl inline-block align-bottom mr-2 font-[600]">每天学点金融学</div>
                <div className="text-xs inline-block font-[400]">生成时间：2024-10-20 21:12:10</div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 5xl:grid-cols-9 gap-4 mt-6">
                {redList?.map((item: any) => (
                    <div key={item?.businessUid}>
                        <Good
                            item={item}
                            setBusinessUid={(data: any) => {
                                setBusinessUid(data);
                                setDetailOpen(true);
                            }}
                            setDetailOpen={setDetailOpen}
                            show={true}
                        />
                        <div className="w-full flex justify-center mt-2">
                            <QRCode
                                size={200}
                                value={process.env.REACT_APP_SHARE_URL || 'https://cn-test.mofabiji.com' + '/share?uid=' + item?.uid}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {detailOpen && (
                <DetailModal
                    open={detailOpen}
                    isFlag={true}
                    changeList={() => {}}
                    handleClose={() => setDetailOpen(false)}
                    businessUid={businessUid}
                />
            )}
        </div>
    );
};
export default BatchShare;
