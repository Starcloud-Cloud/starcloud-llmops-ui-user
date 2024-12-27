import { Table, Image, Button, Modal, Form, Input, Upload } from 'antd';
import { getMaterialTitle } from 'api/redBook/material';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { EditType } from 'views/materialLibrary/detail';
import FormModal from 'views/materialLibrary/components/formModal';
const ReTryExe = ({ tableData, formOk }: { tableData: any[]; formOk: (data: any) => void }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState<any>([]);
    const getTableTitle = async () => {
        setLoading(true);
        try {
            const result = await getMaterialTitle({ appUid: query.get('uid') });
            const list = result?.tableMeta?.map((item: any) => ({
                desc: item.columnName,
                fieldName: item.columnCode,
                type: item.columnType,
                required: item.isRequired,
                width: item.columnWidth
            }));
            const newList = list?.map((item: any) => {
                return {
                    title: item.desc,
                    align: 'center',
                    width: item.width || 400,
                    dataIndex: item.fieldName,
                    render: (text: any, row: any, index: number) => {
                        return (
                            <div className="flex justify-center items-center gap-2">
                                {item.type === EditType.Image ? (
                                    <Image
                                        width={82}
                                        height={82}
                                        preview={false}
                                        src={row[item.fieldName] + '?x-oss-process=image/resize,w_100/quality,q_80'}
                                    />
                                ) : (
                                    <div className="break-all line-clamp-4">{row[item.fieldName]}</div>
                                )}
                            </div>
                        );
                    },
                    type: item.type
                };
            });
            setColumns([
                ...newList,
                {
                    title: '操作',
                    align: 'center',
                    width: 100,
                    fixed: 'right',
                    render: (_: any, row: any, index: number) => (
                        <Button
                            type="link"
                            onClick={async () => {
                                await form.setFieldsValue(row);
                                setRow(row);
                                setOpen(true);
                            }}
                        >
                            编辑
                        </Button>
                    )
                }
            ]);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };
    React.useEffect(() => {
        getTableTitle();
    }, []);

    //编辑
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [row, setRow] = useState<any>({});

    return (
        <div>
            <Table loading={loading} columns={columns} virtual dataSource={tableData} />
            {open && (
                <FormModal
                    isrery={true}
                    getList={() => {}}
                    libraryId={''}
                    pluginConfig={undefined}
                    title={'编辑素材'}
                    editOpen={open}
                    setEditOpen={setOpen}
                    columns={columns}
                    form={form}
                    formOk={(data) => {
                        formOk(data);
                        setOpen(false);
                    }}
                    row={row}
                />
            )}
        </div>
    );
};
export default ReTryExe;
