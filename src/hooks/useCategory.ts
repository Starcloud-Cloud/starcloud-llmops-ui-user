const getCategory = (categoryTree: any[], category: any) => {
    let obj: any = {};
    categoryTree?.map((item) => {
        item.children?.map((el: any) => {
            if (el.code === category) {
                obj = el;
            }
        });
    });
    return obj;
};
export default getCategory;
