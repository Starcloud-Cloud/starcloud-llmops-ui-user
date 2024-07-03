import { Select, Input, Row, Col, Tabs, Table, Space, Button } from 'antd';
import type { TabsProps, TableProps } from 'antd';
import { useState } from 'react';
import PlugMarket from './components/plugMarket';
const MaterialLibrary = () => {
    const { Option } = Select;
    const columns: TableProps<any>['columns'] = [
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name'
        },
        {
            title: '类型',
            align: 'center',
            dataIndex: 'type'
        },
        {
            title: '数量',
            align: 'center',
            dataIndex: 'num'
        },
        {
            title: '创建时间',
            align: 'center',
            dataIndex: 'num'
        },
        {
            title: '操作',
            width: 100,
            align: 'center',
            render: (_, row) => (
                <Space>
                    <Button type="link">编辑</Button>
                    <Button danger type="link">
                        删除
                    </Button>
                </Space>
            )
        }
    ];
    const [tableData, setTableData] = useState<any[]>([{}]);
    const TabsItems: TabsProps['items'] = [
        {
            label: '我的素材库',
            key: '1',
            children: (
                <div>
                    <Table columns={columns} dataSource={tableData} />
                </div>
            )
        },
        { label: '系统素材库', key: '2', children: <div>222</div> }
    ];
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white h-full p-4">
            <Button onClick={() => setOpen(true)}>aaaaa</Button>
            <Row gutter={[16, 16]}>
                <Col xxl={4} lg={6} md={8} xs={12} sm={24}>
                    <Input placeholder="搜索" />
                </Col>
                <Col xxl={4} lg={6} md={8} xs={12} sm={24}>
                    <Select className="w-full">
                        <Option value={1}>123</Option>
                    </Select>
                </Col>
            </Row>
            <Tabs items={TabsItems}></Tabs>
            <PlugMarket open={open} setOpen={setOpen} />
        </div>
    );
};
export default MaterialLibrary;
