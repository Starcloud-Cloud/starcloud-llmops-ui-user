import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';
import { Image } from 'antd';
const EditStyle = ({
    tabImage,
    label,
    detailImage
}: {
    tabImage: any;
    label: any;
    detailImage: (label: string, index: number) => void;
}) => {
    return (
        <div className="flex min-h-[250px]">
            <div className="flex-1">
                <FormControl sx={{ flex: 1 }} color="secondary" fullWidth>
                    <InputLabel id="type">风格</InputLabel>
                    <Select labelId="type" label="风格">
                        <MenuItem value={10}>单图</MenuItem>
                        <MenuItem value={20}>四宫格</MenuItem>
                        <MenuItem value={30}>五宫格</MenuItem>
                    </Select>
                </FormControl>
                <div className="mt-[20px] flex flex-wrap gap-2">
                    {tabImage?.map((item: any, index: number) => (
                        <div key={item.uid} className="rounded-[8px] overflow-hidden relative">
                            <Image className="rounded" width={100} height={100} preview={false} src={item.url} />
                            <div className="absolute w-full h-full top-0  opacity-50 z-1 flex justify-center text-[transparent] items-center hover:bg-[#000] hover:text-[#fff]">
                                <DeleteOutlined
                                    onClick={() => {
                                        detailImage(label, index);
                                    }}
                                    className="cursor-pointer hover:text-[red]"
                                    rev={undefined}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default EditStyle;
