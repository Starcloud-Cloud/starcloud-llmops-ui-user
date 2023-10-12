import marketStore from 'store/market';

const recursion = (data: any[], category: any) => {
    data.filter((item) => {
        if (item.children && item.children.length > 0) {
            recursion(item.children, category);
        }
        return item.code === category;
    });
};
const getCategory = (category: any) => {
    const { categoryTree } = marketStore();
    const aaa = recursion(categoryTree, category);
    console.log(aaa);
    return aaa;
};
export default getCategory;
