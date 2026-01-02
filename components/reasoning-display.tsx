'use client';

import { useState } from 'react';
import type { CulturalReasoningOutput } from '@/lib/core/schema';
import {
    ChevronDown,
    ChevronRight,
    Brain,
    Globe,
    Scale,
    Users,
    MessageCircle,
    ShieldCheck,
    BookOpen
} from 'lucide-react';

interface ReasoningDisplayProps {
    data: CulturalReasoningOutput;
}

export function ReasoningDisplay({ data }: ReasoningDisplayProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mt-4 border rounded-xl overflow-hidden bg-background/50 shadow-sm">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground/80">
                        Epistemic Reasoning Analysis
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            {isExpanded && (
                <div className="p-4 space-y-6 text-sm">
                    {/* Main Answer */}
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <h3 className="text-base font-semibold text-primary">{data.answer}</h3>
                    </div>

                    <div className="grid gap-4">
                        {/* (a) Contextual Application */}
                        <Section
                            icon={<Globe className="w-4 h-4" />}
                            title="(a) Contextual Application"
                            content={data.contextual_application}
                            color="text-blue-500"
                        />

                        {/* (b) Cultural Justification */}
                        <Section
                            icon={<BookOpen className="w-4 h-4" />}
                            title="(b) Cultural Justification"
                            content={data.cultural_justification}
                            color="text-purple-500"
                        />

                        {/* (c) Conflict Reconciliation */}
                        <Section
                            icon={<Scale className="w-4 h-4" />}
                            title="(c) Conflict Reconciliation"
                            content={data.conflict_reconciliation}
                            color="text-orange-500"
                        />

                        {/* (d) Intra-Cultural Variation */}
                        <Section
                            icon={<Users className="w-4 h-4" />}
                            title="(d) Intra-Cultural Variation"
                            content={data.intra_cultural_variation}
                            color="text-green-500"
                        />

                        {/* (e) Pragmatic Interpretation */}
                        <Section
                            icon={<MessageCircle className="w-4 h-4" />}
                            title="(e) Pragmatic Interpretation"
                            content={data.pragmatic_interpretation}
                            color="text-pink-500"
                        />

                        {/* (f) Stability & Consistency */}
                        <Section
                            icon={<ShieldCheck className="w-4 h-4" />}
                            title="(f) Stability & Consistency"
                            content={data.stability_note}
                            color="text-slate-500"
                        />
                    </div>

                    {/* References */}
                    {data.references_used && data.references_used.length > 0 && (
                        <div className="pt-4 border-t">
                            <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                References Used
                            </h4>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                                {data.references_used.map((ref, i) => (
                                    <li key={i}>{ref}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Section({ icon, title, content, color }: { icon: any, title: string, content: string, color: string }) {
    return (
        <div className="group">
            <h4 className={`flex items-center gap-2 font-medium mb-1 ${color}`}>
                {icon}
                {title}
            </h4>
            <p className="text-muted-foreground leading-relaxed pl-6 border-l-2 border-muted group-hover:border-primary/20 transition-colors">
                {content}
            </p>
        </div>
    );
}
