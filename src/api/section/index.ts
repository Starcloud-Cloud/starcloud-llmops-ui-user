import request from 'utils/axios';
//获取登录用户所在部门
export const deptList = () => {
    return request.get({ url: `/llm/space/dept/list` });
};
//获取部门信息
export const spaceDetail = (deptId: any) => {
    return request.get({ url: `/llm/space/detail/${deptId}` });
};
//更新部门信息
export const spaceUpdate = (data: any) => {
    return request.put({ url: `/llm/space/update`, data });
};
//获取部门用户列表
export const spaceUserList = (deptId: any) => {
    return request.get({ url: `/llm/space/userList/${deptId}` });
};
//查询角色数据
export const spaceMetadata = () => {
    return request.get({ url: `/llm/space/metadata` });
};
//修改用户角色
export const spaceRole = (userDeptId: any, role: any) => {
    return request.put({ url: `/llm/space/role/${userDeptId}/${role}` });
};
//移除用户
export const spaceRemove = (userDeptId: any) => {
    return request.delete({ url: `/llm/space/remove/${userDeptId}` });
};
//获取部门精简信息
export const spaceSimple = (inviteCode: any) => {
    return request.get({ url: `/llm/space/simple/${inviteCode}` });
};
//加入部门
export const spaceJoin = (inviteCode: any) => {
    return request.put({ url: `/llm/space/join/${inviteCode}` });
};
//切换部门
export const spaceCheckout = (deptId: any) => {
    return request.put({ url: `/llm/space/checkout/${deptId}` });
};
