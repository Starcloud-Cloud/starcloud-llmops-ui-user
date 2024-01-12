import request from 'utils/axios';
//获取登录用户所在部门
export const deptList = () => {
    return request.get({ url: `llm/space/dept/list` });
};
//获取部门详情
export const spaceDetail = (deptId: any) => {
    return request.get({ url: `llm/space/detail/${deptId}` });
};
//获取部门用户列表
export const spaceUserList = (deptId: any) => {
    return request.get({ url: `llm/space/userList/${deptId}` });
};
