import { isUrl } from 'utils/is';
// import { componentModules } from 'router/routes';
import { AppCustomRouteRecordRaw, AppRouteRecordRaw, MUIRoutes } from 'types/router';
import Loadable from 'ui-component/Loadable';
// import { RouteMeta } from 'types/router';
// import { useLocation, useParams } from 'react-router-dom';
import React from 'react';
import { Icon } from '@mui/material';
const modules: any = require.context('../views', true, /\.(tsx)$/);

export const transformRoutes = (appRoutes: AppRouteRecordRaw[], parentPath = ''): MUIRoutes[] => {
    const transformRoute = (route: AppRouteRecordRaw) => {
        let myicon: React.ReactNode = null;
        if (typeof route.meta.icon === 'string') {
            // 如果icon是字符串，使用MUI的Icon组件将其渲染为Material图标
            myicon = <Icon fontSize="small">{route.meta.icon}</Icon>;
        } else if (React.isValidElement(route.meta.icon)) {
            // 如果icon是一个React节点，直接将其作为新路由的icon
            myicon = route.meta.icon;
        } else {
            // 其他情况，你可能需要做额外的处理，或者将icon设置为null
            myicon = null;
        }
        let newRoute: MUIRoutes = {
            type: route.children ? 'collapse' : 'route',
            key: route.path.split('/').join('-'),
            name: route.meta.title,
            icon: myicon
        };
        if (route.children) {
            newRoute.collapse = transformRoutes(route.children, route.path);
        } else {
            newRoute.route = parentPath + route.path;
            newRoute.component = route.element;
        }
        return newRoute;
    };

    return appRoutes.map(transformRoute);
};

// export const getRawRoute = (): RouteInfo => {
//     const location = useLocation();
//     const params = useParams();
//     // const meta = routeMeta[location.pathname];

//     return {
//         pathname: location.pathname,
//         search: location.search,
//         hash: location.hash,
//         state: location.state,
//         params: params
//         // meta: meta,
//     };
// };

// /**
//  * 注册一个异步组件
//  * @param componentPath 例:/bpm/oa/leave/detail
//  */
// export const registerComponent = (componentPath: string) => {
//   for (const item in modules) {
//     if (item.includes(componentPath)) {
//       // 使用异步组件的方式来动态加载组件
//       // @ts-ignore
//       return defineAsyncComponent(modules[item]);
//     }
//   }
// };
// /* Layout */
// export const Layout = () => import("@/layout/Layout.vue");

// export const getParentLayout = () => {
//   return () =>
//     new Promise((resolve) => {
//       resolve({
//         name: "ParentLayout",
//       });
//     });
// };

// 按照路由中meta下的rank等级升序来排序路由
export const getRedirect: any = (parentPath: string, children: AppCustomRouteRecordRaw[]) => {
    if (!children || children.length === 0) {
        return parentPath;
    }
    const path = generateRoutePath(parentPath, children[0].path);
    // 递归子节点
    if (children[0].children) return getRedirect(path, children[0].children);
};
const generateRoutePath = (parentPath: string, path: string) => {
    if (parentPath.endsWith('/')) {
        parentPath = parentPath.slice(0, -1); // 移除默认的 /
    }
    if (!path.startsWith('/')) {
        path = '/' + path;
    }
    return parentPath + path;
};
export const ascending = (arr: any[]) => {
    arr.forEach((v) => {
        if (v?.meta?.rank === null) v.meta.rank = undefined;
        if (v?.meta?.rank === 0) {
            if (v.name !== 'home' && v.path !== '/') {
                console.warn('rank only the home page can be 0');
            }
        }
    });
    return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
        return a?.meta?.rank - b?.meta?.rank;
    });
};

// import Layout from "./Layout";
// import Page1 from "./Page1";
// import Page2 from "./Page2";
// import React from "react";
// // 其他路由组件...

// const componentModules = {
//   Layout,
//   Page1,
//   Page2,
//   // 其他路由组件...
// };

//若依
export const Layout = () => import('views/pages/landing');
export const generateRoute = (routesList: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
    const res: AppRouteRecordRaw[] = [];
    const modulesRoutesKeys: string[] = modules.keys();
    function changeRoute(routes: AppCustomRouteRecordRaw[]) {
        if (routes?.length > 0) {
            for (const route of routes) {
                // const meta = {
                //     title: route.name,
                //     icon: route.icon,
                //     hidden: !route.visible,
                //     noCache: !route.keepAlive,
                //     alwaysShow: route.children && route.children.length === 1 && (route.alwaysShow !== undefined ? route.alwaysShow : true)
                // };
                // 路由地址转首字母大写驼峰，作为路由名称，适配keepAlive
                let data: any = {
                    path: route.path
                    // redirect: route.redirect,
                    // meta: meta
                };
                //处理顶级非目录路由
                if (!route.children && route.parentId === 0 && route.component) {
                    data.component = Layout;
                    // data.meta = {};
                    // data.name = toCamelCase(route.path, true) + 'Parent';
                    // data.redirect = '';
                    // meta.alwaysShow = true;
                    const childrenData: any = {
                        path: ''
                        // name: toCamelCase(route.path, true),
                        // redirect: route.redirect,
                        // meta: meta
                    };
                    // const index = route?.component
                    //     ? modulesRoutesKeys.findIndex((ev: any) => ev.includes(route.component))
                    //     : modulesRoutesKeys.findIndex((ev: any) => ev.includes(route.path));
                    // childrenData.component = modules.keys()[modulesRoutesKeys[index]];
                    data.children = [childrenData];
                } else {
                    const index = route?.component
                        ? modulesRoutesKeys.findIndex((ev: any) => ev.includes(route.component))
                        : modulesRoutesKeys.findIndex((ev: any) => ev.includes(route.path));
                    // 目录
                    if (!route.children && route.component && route.component !== '') {
                        const Element = Loadable(React.lazy(() => import(`views/${modulesRoutesKeys[index]?.split('./')[1]}`)));
                        data.element = <Element />;
                    }
                    if (route.children) {
                        changeRoute(route.children);
                    }
                }
                res.push(data as AppRouteRecordRaw);
            }
        }
    }
    changeRoute(routesList);
    return res;
};

// 后端控制路由生成
// export const generateRoute = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
//     const res: AppRouteRecordRaw[] = [];
//     for (const route of routes) {
//       const meta = {
//         title: route.name,
//         icon: route.icon,
//         hidden: !route.visible,
//         noCache: !route.keepAlive,
//         alwaysShow:
//           route.children &&
//           route.children.length === 1 &&
//           (route.alwaysShow !== undefined ? route.alwaysShow : true),
//       } as RouteMeta;
//       // 路由地址转首字母大写驼峰，作为路由名称，适配keepAlive
//       let data: AppRouteRecordRaw = {
//         path: route.path,
//         element:
//           route?.componentName && route?.componentName?.length > 0
//             ? React.createElement(componentModules[route.componentName])
//             : React.createElement(componentModules[toCamelCase(route.path, true)]),
//         meta: meta,
//       };

//       //处理顶级非目录路由
//       if (!route.children && route.parentId == 0 && route.component) {
//         data.element = React.createElement(componentModules["Layout"]);
//         data.meta = {};
//         data.path = "";
//         meta.alwaysShow = true;
//         const childrenData = {
//           path: route.path,
//           element: React.createElement(
//             componentModules[route?.component ?? toCamelCase(route.path, true)]
//           ),
//           meta: meta,
//         };
//         data.children = [childrenData];
//       } else {
//         // 目录
//         if (route.children) {
//           data.element = React.createElement(componentModules["Layout"]);
//           data.children = generateRoute(route.children);
//           // 外链
//         } else if (isUrl(route.path)) {
//           data = {
//             path: "/external-link",
//             element: React.createElement(componentModules["Layout"]),
//             meta: {
//               name: route.name,
//             },
//             children: [
//               {
//                 ...data,
//                 path: route.path,
//               },
//             ],
//           } as AppRouteRecordRaw;
//           // 菜单
//         } else {
//           // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会根path保持一致）
//           data.element = React.createElement(componentModules[route.component || route.path]);
//         }
//       }
//       res.push(data);
//     }
//     return res;
// };

// export const transformRoutes = (appRoutes: AppRouteRecordRaw[], parentPath = ""): MUIRoutes[] => {
//   const transformRoute = (route: AppRouteRecordRaw) => {
//     let newRoute: MUIRoutes = {
//       key: route.path.split("/").join("-"),
//     };
//     newRoute.type = route.children ? "collapse" : "route";
//     newRoute.name = route.meta.title;
//     let myicon: React.ReactNode = null;
//     if (typeof route.meta.icon === "string") {
//       // 如果icon是字符串，使用MUI的Icon组件将其渲染为Material图标
//       myicon = <Icon>route?.meta?.icon</Icon>;
//     } else if (React.isValidElement(route.meta.icon)) {
//       // 如果icon是一个React节点，直接将其作为新路由的icon
//       myicon = route?.meta?.icon;
//     } else {
//       // 其他情况，你可能需要做额外的处理，或者将icon设置为null
//       myicon = null;
//     }
//     newRoute.icon = myicon;
//     if (route.children) {
//       newRoute.collapse = transformRoutes(route.children, route.path);
//     } else {
//       newRoute.route = parentPath + route.path;
//       newRoute.component = route.element;
//     }
//     return newRoute;
//   };

//   return appRoutes.map(transformRoute);
// };

// export const getRedirect = (parentPath: string, children: AppCustomRouteRecordRaw[]) => {
//   if (!children || children.length == 0) {
//     return parentPath;
//   }
//   const path = generateRoutePath(parentPath, children[0].path);
//   // 递归子节点
//   if (children[0].children) return getRedirect(path, children[0].children);
// };

// const generateRoutePath = (parentPath: string, path: string) => {
//   if (parentPath.endsWith("/")) {
//     parentPath = parentPath.slice(0, -1); // 移除默认的 /
//   }
//   if (!path.startsWith("/")) {
//     path = "/" + path;
//   }
//   return parentPath + path;
// };

export const pathResolve = (parentPath: string, path: string) => {
    if (isUrl(path)) return path;
    const childPath = path.startsWith('/') || !path ? path : `/${path}`;
    return `${parentPath}${childPath}`.replace(/\/\//g, '/');
};

// function toCamelCase(path: string, arg1: boolean) {
//     throw new Error('Function not implemented.');
// }
// // 路由降级
// export const flatMultiLevelRoutes = (routes: AppRouteRecordRaw[]) => {
//   const modules: AppRouteRecordRaw[] = cloneDeep(routes);
//   for (let index = 0; index < modules.length; index++) {
//     const route = modules[index];
//     if (!isMultipleRoute(route)) {
//       continue;
//     }
//     promoteRouteLevel(route);
//   }
//   return modules;
// };

// // 层级是否大于2
// const isMultipleRoute = (route: AppRouteRecordRaw) => {
//   if (!route || !Reflect.has(route, "children") || !route.children?.length) {
//     return false;
//   }

//   const children = route.children;

//   let flag = false;
//   for (let index = 0; index < children.length; index++) {
//     const child = children[index];
//     if (child.children?.length) {
//       flag = true;
//       break;
//     }
//   }
//   return flag;
// };

// // 生成二级路由
// const promoteRouteLevel = (route: AppRouteRecordRaw) => {
//   let router: Router | null = createRouter({
//     routes: [route as RouteRecordRaw],
//     history: createWebHashHistory(),
//   });

//   const routes = router.getRoutes();
//   addToChildren(routes, route.children || [], route);
//   router = null;

//   route.children = route.children?.map((item) => omit(item, "children"));
// };

// // 添加所有子菜单
// const addToChildren = (
//   routes: RouteRecordNormalized[],
//   children: AppRouteRecordRaw[],
//   routeModule: AppRouteRecordRaw
// ) => {
//   for (let index = 0; index < children.length; index++) {
//     const child = children[index];
//     const route = routes.find((item) => item.name === child.name);
//     if (!route) {
//       continue;
//     }
//     routeModule.children = routeModule.children || [];
//     if (!routeModule.children.find((item) => item.name === route.name)) {
//       routeModule.children?.push(route as unknown as AppRouteRecordRaw);
//     }
//     if (child.children?.length) {
//       addToChildren(routes, child.children, routeModule);
//     }
//   }
// };
// const toCamelCase = (str: string, upperCaseFirst: boolean) => {
//     str = (str || '')
//         .replace(/-(.)/g, function (group1: string) {
//             return group1.toUpperCase();
//         })
//         .replaceAll('-', '');

//     if (upperCaseFirst && str) {
//         str = str.charAt(0).toUpperCase() + str.slice(1);
//     }

//     return str;
// };
