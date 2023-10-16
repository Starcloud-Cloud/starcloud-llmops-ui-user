import React, { useEffect, useState } from 'react';

const getCaretPosition = (input: any, selection = 'selectionStart') => {
    const { scrollLeft, scrollTop } = input;
    const selectionPoint = input[selection] || input.selectionStart;
    const { height, width, left, top } = input.getBoundingClientRect();
    const div = document.createElement('div');
    const copyStyle: any = getComputedStyle(input);
    for (const prop of copyStyle) {
        div.style[prop] = copyStyle[prop];
    }
    const swap = '.';
    const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value;
    const textContent = inputValue.substr(0, selectionPoint);
    div.textContent = textContent;
    if (input.tagName === 'TEXTAREA') div.style.height = 'auto';
    if (input.tagName === 'INPUT') div.style.width = 'auto';
    div.style.position = 'absolute';
    const span = document.createElement('span');
    span.textContent = inputValue.substr(selectionPoint) || '.';
    div.appendChild(span);
    document.body.appendChild(div);
    const { offsetLeft: spanX, offsetTop: spanY } = span;
    document.body.removeChild(div);
    let x = left + spanX;
    let y = top + spanY;
    const { lineHeight, paddingRight } = copyStyle;
    x = Math.min(x - scrollLeft, left + width - parseInt(paddingRight, 10));
    y = Math.min(y - scrollTop, top + height - parseInt(lineHeight, 10)) + window.scrollY;
    return {
        x,
        y
    };
};

const getSelectionPosition = (input: any) => {
    const { y: startY, x: startX } = getCaretPosition(input, 'selectionStart');
    const { x: endX } = getCaretPosition(input, 'selectionEnd');
    const x = startX + (endX - startX) / 2;
    const y = startY;
    return {
        x,
        y
    };
};

const useCaretPosition = (element: any) => {
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);

    const getPosition = (element: any) => {
        if (element.current) {
            const { x, y } = getCaretPosition(element.current);
            setX(x);
            setY(y);
        }
    };

    const getSelection = (element: any) => {
        if (element.current) {
            const { x, y } = getSelectionPosition(element.current);
            setX(x);
            setY(y);
        }
    };

    return { x, y, getPosition, getSelection };
};

export default useCaretPosition;
