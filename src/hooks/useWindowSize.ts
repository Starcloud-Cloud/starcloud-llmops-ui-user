import { useCallback, useEffect, useState } from 'react';

/**
 * 监听视口hooks
 * @returns
 */
export function useWindowSize() {
    const [size, setSize] = useState<{
        width: number;
        height: number;
    }>({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    });

    const onResize = useCallback(() => {
        setSize({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return size;
}
