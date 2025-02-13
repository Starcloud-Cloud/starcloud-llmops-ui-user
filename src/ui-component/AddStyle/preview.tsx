import { Modal, Button } from 'antd';
import { useState, useEffect } from 'react';
import Goods from 'views/pages/batchSmallRedBooks/good';
import { DetailModal } from 'views/pages/redBookContentList/component/detailModal';
import { getContentDetail } from 'api/redBook';

const Preview = ({ demoId, open, setOpen }: { demoId: string; open: boolean; setOpen: (open: boolean) => void }) => {
    const [businessUid, setBusinessUid] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState<boolean>(false);

    const [content, setContent] = useState<any>(null);
    useEffect(() => {
        if (demoId) {
            console.log(demoId);

            const res = demoId.split(/[,，]/).map(async (item) => {
                return await getContentDetail(item);
            });
            Promise.all(res).then((res) => {
                setContent(res);
            });
        }
    }, [demoId]);
    return (
        <Modal width={800} open={open} onCancel={() => setOpen(false)} footer={null}>
            <div className="bg-white p-4">
                <div className="flex gap-4 items-center">
                    <div className="flex-1 flex flex-col items-start text-left">
                        <div className="text-2xl font-bold mb-4">升级Canva可画高级版，开启极致体验</div>

                        <p className="text-gray-600 mb-6">全站资源尽在Canva可画高级版，点点鼠标，出手就是设计高手</p>

                        <div className="space-y-6">
                            <div className="flex">
                                <svg
                                    className="mr-3"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="7699"
                                    width="20"
                                    height="20"
                                >
                                    <path
                                        d="M128 853.333333h768.064L896 170.666667H127.936L128 853.333333zM127.936 128h768.128C919.594667 128 938.666667 146.986667 938.666667 170.666667v682.666666c0 23.573333-19.029333 42.666667-42.602667 42.666667H127.936A42.56 42.56 0 0 1 85.333333 853.333333V170.666667c0-23.573333 19.029333-42.666667 42.602667-42.666667z m200.128 527.082667c22.890667-19.626667 68.48-36.416 98.794667-36.416h20.949333c40.533333 0 95.914667-20.437333 126.549333-46.698667l52.373334-44.885333c22.890667-19.626667 68.48-36.416 98.794666-36.416H810.666667a21.333333 21.333333 0 0 0 0-42.666667h-85.12c-40.533333 0-95.936 20.437333-126.570667 46.698667l-52.373333 44.885333C523.690667 559.210667 478.165333 576 447.786667 576h-20.949334c-40.490667 0-95.914667 20.437333-126.549333 46.698667L199.445333 709.12a21.333333 21.333333 0 1 0 27.776 32.384l100.842667-86.442667z"
                                        fill="#3D3D3D"
                                        p-id="7700"
                                    ></path>
                                    <path
                                        d="M352 373.333333m-53.333333 0a53.333333 53.333333 0 1 0 106.666666 0 53.333333 53.333333 0 1 0-106.666666 0Z"
                                        fill="#3D3D3D"
                                        p-id="7701"
                                    ></path>
                                </svg>
                                <div>
                                    <h3 className="font-semibold mb-1">尽享全站高级模板及素材</h3>
                                    <p className="text-gray-600">解锁全站7000万+设计资源、10万+设计模板，全渠道商用授权，版权无忧</p>
                                </div>
                            </div>

                            <div className="flex">
                                <svg
                                    className="mr-3"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="12186"
                                    width="20"
                                    height="20"
                                >
                                    <path
                                        d="M795.694545 395.636364a289.047273 289.047273 0 0 0-567.38909 0 197.585455 197.585455 0 0 0 18.385454 395.636363h30.952727a23.272727 23.272727 0 0 0 0-46.545454H246.690909a151.272727 151.272727 0 1 1-2.327273-302.545455l23.272728 5.352727 3.025454-25.6a242.269091 242.269091 0 0 1 480.814546 0l4.654545 25.134546 23.272727-4.887273a151.272727 151.272727 0 1 1-2.327272 302.545455h-34.909091a23.272727 23.272727 0 0 0 0 46.545454h35.141818a197.585455 197.585455 0 0 0 18.385454-395.636363z"
                                        p-id="12187"
                                    ></path>
                                    <path
                                        d="M528.523636 480.349091a23.272727 23.272727 0 0 0-33.047272 0l-131.490909 131.490909a23.272727 23.272727 0 0 0 0 33.047273 23.272727 23.272727 0 0 0 32.814545 0L488.727273 552.96V837.818182a23.272727 23.272727 0 0 0 46.545454 0V552.96l93.090909 91.927273a23.272727 23.272727 0 0 0 16.523637 6.749091 23.272727 23.272727 0 0 0 16.290909-39.796364z"
                                        p-id="12188"
                                    ></path>
                                </svg>
                                <div>
                                    <h3 className="font-semibold mb-1">解锁高级编辑导出功能</h3>
                                    <p className="text-gray-600">无限次智能AI抠图、高清多格式导出、一图变多尺寸、批量创建等</p>
                                </div>
                            </div>

                            <div className="flex">
                                <svg
                                    className="mr-3 "
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="13223"
                                    width="20"
                                    height="20"
                                >
                                    <path
                                        d="M512 42.666667C252.793333 42.666667 42.666667 252.793333 42.666667 512s210.126667 469.333333 469.333333 469.333333 469.333333-210.126667 469.333333-469.333333S771.206667 42.666667 512 42.666667z m0 896c-235.64 0-426.666667-191.026667-426.666667-426.666667s191.026667-426.666667 426.666667-426.666667 426.666667 191.026667 426.666667 426.666667-191.026667 426.666667-426.666667 426.666667z m353.813333-576.14a384.406667 384.406667 0 1 0-106.353333 443.113333 21.333333 21.333333 0 0 0-27.506667-32.613333A341.553333 341.553333 0 0 1 512 853.333333c-188.213333 0-341.333333-153.12-341.333333-341.333333s153.12-341.333333 341.333333-341.333333 341.333333 153.12 341.333333 341.333333v42.666667a85.333333 85.333333 0 0 1-170.666666 0V362.666667a21.333333 21.333333 0 0 0-42.666667 0v36.433333q-3.526667-4-7.333333-7.78a170.666667 170.666667 0 1 0 0 241.333333 172.153333 172.153333 0 0 0 19.58-23.333333c20.533333 43.333333 64.666667 73.333333 115.74 73.333333 70.58 0 128-57.42 128-128V512a381.513333 381.513333 0 0 0-30.173334-149.473333zM512 640c-70.58 0-128-57.42-128-128s57.42-128 128-128 128 57.42 128 128-57.42 128-128 128z"
                                        fill="#5C5C66"
                                        p-id="13224"
                                    ></path>
                                </svg>
                                <div>
                                    <h3 className="font-semibold mb-1">全渠道商用版权及服务保障</h3>
                                    <p className="text-gray-600">全渠道商用授权书、提供发票可报销、专业人工客服支持</p>
                                </div>
                            </div>
                            <Button type="primary" className="mt-4 w-full">
                                立即升级
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 flex gap-4">
                        {content?.map((item: any) => (
                            <div className="w-[250px]">
                                <Goods item={item} setBusinessUid={setBusinessUid} setDetailOpen={setDetailOpen} show={true} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full text-lg font-semibold mt-4 mb-2 text-left">更多相似内容</div>
                <div className="w-full flex gap-4 flex-wrap overflow-x-auto"></div>
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
        </Modal>
    );
};

export default Preview;
