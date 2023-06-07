import useRouteStore from "store/router";

const resetWhiteNameList = ["Sign In"];

export function resetRouter() {
  const { routes, setRoutes } = useRouteStore.getState();

  const newRoutes = routes.map((route) => {
    if (route?.name && !resetWhiteNameList.includes(route.name)) {
      return { ...route, hiden: true };
    }
    return route;
  });

  setRoutes(newRoutes);
}
