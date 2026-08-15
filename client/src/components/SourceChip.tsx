
import type { SourceRef } from '../type';
import { FileText, Youtube, Globe } from 'lucide-react';

type Props = {
    source: SourceRef;
};

const iconFor: Record<SourceRef['type'], typeof FileText> = {
    pdf: FileText,
    youtube: Youtube,
    web: Globe,
    ddg_search: Globe,
};

export default function SourceChip({ source }: Props) {
    const Icon = iconFor[source.type];

    const content = (
        <span className="locator-chip" data-source={source.type}>
            <Icon size={11} />
            {source.title ? `${source.title} · ` : ''}
            {source.label}
        </span>
    );

    if (!source.link) return content;

    return (
        <a href={source.link} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
            {content}
        </a>
    );
}