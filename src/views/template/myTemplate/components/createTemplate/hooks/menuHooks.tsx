import { useCallback, Fragment } from 'react';
import type { LexicalEditor } from 'lexical';
import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';
export const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
export type MenuTextMatch = {
    leadOffset: number;
    matchingString: string;
    replaceableString: string;
};
export type TriggerFn = (text: string, editor: LexicalEditor) => MenuTextMatch | null;
export function useBasicTypeaheadTriggerMatch(
    trigger: string,
    { minLength = 1, maxLength = 75 }: { minLength?: number; maxLength?: number }
): TriggerFn {
    return useCallback(
        (text: string) => {
            const validChars = `[${PUNCTUATION}\\s]`;
            const TypeaheadTriggerRegex = new RegExp('(.*)(' + `[${trigger}]` + `((?:${validChars}){0,${maxLength}})` + ')$');
            const match = TypeaheadTriggerRegex.exec(text);
            if (match !== null) {
                const maybeLeadingWhitespace = match[1];
                const matchingString = match[3];
                if (matchingString.length >= minLength) {
                    return {
                        leadOffset: match.index + maybeLeadingWhitespace.length,
                        matchingString,
                        replaceableString: match[2]
                    };
                }
            }
            return null;
        },
        [maxLength, minLength, trigger]
    );
}

type MenuOptionRenderProps = {
    isSelected: boolean;
    onSelect: () => void;
    onSetHighlight: () => void;
    queryString: string | null;
};
export class PickerBlockMenuOption extends MenuOption {
    public group?: string;

    constructor(
        private data: {
            key: string;
            group?: string;
            onSelect?: () => void;
            render: (menuRenderProps: MenuOptionRenderProps) => JSX.Element;
        }
    ) {
        super(data.key);
        this.group = data.group;
    }

    public onSelectMenuOption = () => this.data.onSelect?.();
    public renderMenuOption = (menuRenderProps: MenuOptionRenderProps) => (
        <Fragment key={this.data.key}>{this.data.render(menuRenderProps)}</Fragment>
    );
}
