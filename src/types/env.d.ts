// /// <reference types="vite/client" />

// declare module "*.vue" {
//   import { DefineComponent } from "vue";
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }

// interface ImportMetaEnv {
//   readonly VITE_APP_TITLE: string;
//   readonly VITE_PORT: number;
//   readonly VITE_OPEN: string;
//   readonly VITE_DEV: string;
//   readonly VITE_APP_CAPTCHA_ENABLE: string;
//   readonly VITE_APP_TENANT_ENABLE: string;
//   readonly VITE_BASE_URL: string;
//   readonly VITE_UPLOAD_URL: string;
//   readonly VITE_API_BASEPATH: string;
//   readonly VITE_API_URL: string;
//   readonly VITE_BASE_PATH: string;
//   readonly VITE_DROP_DEBUGGER: string;
//   readonly VITE_DROP_CONSOLE: string;
//   readonly VITE_SOURCEMAP: string;
//   readonly VITE_OUT_DIR: string;
// }

// declare global {
//   interface ImportMeta {
//     readonly env: ImportMetaEnv;
//   }
// }

interface ProcessEnv {
    readonly REACT_APP_TITLE: string;
    readonly REACT_APP_PORT: number;
    readonly REACT_APP_OPEN: string;
    readonly REACT_APP_DEV: string;
    readonly REACT_APP_CAPTCHA_ENABLE: string;
    readonly REACT_APP_TENANT_ENABLE: string;
    readonly REACT_APP_BASE_URL: string;
    readonly REACT_APP_UPLOAD_URL: string;
    readonly REACT_APP_API_BASEPATH: string;
    readonly REACT_APP_API_URL: string;
    readonly REACT_APP_BASE_PATH: string;
    readonly REACT_APP_DROP_DEBUGGER: string;
    readonly REACT_APP_DROP_CONSOLE: string;
    readonly REACT_APP_SOURCEMAP: string;
    readonly REACT_APP_OUT_DIR: string;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends ProcessEnv {}
    }
}
