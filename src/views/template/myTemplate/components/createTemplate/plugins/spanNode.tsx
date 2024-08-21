import { LexicalNode, TextNode, $createTextNode, $applyNodeReplacement } from 'lexical';

export class SpanNode extends TextNode {
    static getType() {
        return 'span';
    }

    static clone(node: any) {
        return new SpanNode(node.__text, node.__key);
    }

    createDOM(config: any): HTMLElement {
        const element = super.createDOM(config);
        element.classList.add('px-0.5', 'text-[#673ab7]', 'rounded-[5px]', 'align-middle', 'bg-black/20');
        return element;
    }

    updateDOM(prevNode: any, dom: any, config: any) {
        return false;
    }
}

export function $createSpanNode(text: any) {
    return $applyNodeReplacement(new SpanNode(text));
}
