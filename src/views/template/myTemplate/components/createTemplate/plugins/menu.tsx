import { LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { MenuRenderFn } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $getSelection, $createTextNode, $isRangeSelection, $getNodeByKey, createCommand, $insertNodes } from 'lexical';
import { $createSpanNode } from './spanNode';
import { useRef, useEffect, Fragment, useCallback, useState } from 'react';
import { useBasicTypeaheadTriggerMatch, PickerBlockMenuOption } from '../hooks/menuHooks';
import ReactDOM from 'react-dom';
import { flip, offset, shift, useFloating } from '@floating-ui/react';
import { Menu as Menus } from 'antd';

const Menu = () => {
    const { refs, floatingStyles, isPositioned } = useFloating({
        placement: 'bottom-start',
        middleware: [
            offset(0), // fix hide cursor
            shift({
                padding: 8
            }),
            flip()
        ]
    });
    const [queryString, setQueryString] = useState<string | null>(null);
    const [editor] = useLexicalComposerContext();
    const editorRef = useRef<any>(null);
    useEffect(() => {
        console.log(111111);

        const handleKeyDown = (event: any) => {
            if (event.key === 'Delete') {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const { focus } = selection;
                    const node = $getNodeByKey(focus.key);

                    if (node && node.getType() === 'span') {
                        // 阻止默认删除行为
                        event.preventDefault();

                        // 删除整个 span 节点
                        const parent = node.getParent();
                        if (parent) {
                            parent.remove();
                        }
                    }
                }
            }
        };

        // 确保 editorRef 指向编辑器的 DOM 元素
        if (editorRef.current) {
            editorRef.current.addEventListener('keydown', handleKeyDown);
        }

        // 清理事件监听器
        return () => {
            if (editorRef.current) {
                editorRef.current.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [editor]);
    const onSelectOption = useCallback(
        (selectedOption: PickerBlockMenuOption, nodeToRemove: any, closeMenu: () => void) => {
            editor.update(() => {
                if (nodeToRemove && selectedOption?.key) nodeToRemove.remove();
                editor.update(() => {
                    const selection = $getSelection();
                    if (selection) {
                        // const spanNode = $createSpanNode(selectedOption.key);
                        // selection.insertNodes([spanNode]);
                        // spanNode.selectEnd();
                        // const textNode = $createTextNode('');
                        // selection.insertNodes([textNode]);
                        // textNode.select();
                        // editor.registerCommand(
                        //     createCommand('INSERT_QUERY_BLOCK_COMMAND'),
                        //     () => {
                        //       const contextBlockNode = $createSpanNode('span')
                        //       $insertNodes([contextBlockNode])
                        //       if (onInsert)
                        //         onInsert()
                        //       return true
                        //     },
                        //     COMMAND_PRIORITY_EDITOR,
                        //   ),
                        //   editor.registerCommand(
                        //     DELETE_QUERY_BLOCK_COMMAND,
                        //     () => {
                        //       if (onDelete)
                        //         onDelete()
                        //       return true
                        //     },
                        //     COMMAND_PRIORITY_EDITOR,
                        //   ),
                    }
                });
                closeMenu();
            });
        },
        [editor]
    );
    const items = [
        {
            label: 'Navigation One',
            key: 'mail'
        },
        {
            label: 'Navigation Two',
            key: 'app'
        }
    ];
    const renderMenu = useCallback<MenuRenderFn<PickerBlockMenuOption>>(
        (anchorElementRef: any, { options, selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }: any) => {
            if (!anchorElementRef.current) return null;
            refs.setReference(anchorElementRef.current);
            return (
                <>
                    {ReactDOM.createPortal(
                        <div className="w-0 h-0">
                            <div
                                className="p-1 w-[260px] bg-white rounded-lg border-[0.5px] border-gray-200 shadow-lg overflow-y-auto overflow-x-hidden"
                                style={{
                                    ...floatingStyles,
                                    visibility: isPositioned ? 'visible' : 'hidden',
                                    maxHeight: 'calc(1 / 3 * 100vh)'
                                }}
                                ref={refs.setFloating}
                            >
                                <Menus
                                    mode="inline"
                                    onClick={(e) => {
                                        selectOptionAndCleanUp(items.find((item) => item.key === e.key));
                                    }}
                                    items={items}
                                />
                            </div>
                        </div>,
                        anchorElementRef.current
                    )}
                </>
            );
        },
        [refs, isPositioned, floatingStyles, queryString]
    );

    return (
        <div>
            <LexicalTypeaheadMenuPlugin
                options={
                    [
                        { key: '1111', title: '222222', label: '3333', render: ({ _, onSelect }: any) => <div>111111</div> },
                        { key: '222' }
                    ] as any
                }
                onQueryChange={setQueryString}
                onSelectOption={onSelectOption}
                menuRenderFn={renderMenu}
                triggerFn={useBasicTypeaheadTriggerMatch('/', {
                    minLength: 0,
                    maxLength: 0
                })}
                anchorClassName="z-[999999] translate-y-[calc(-100%-3px)]"
            />
        </div>
    );
};
export default Menu;
