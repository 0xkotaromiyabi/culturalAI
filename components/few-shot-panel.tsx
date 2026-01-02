'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fewShotExamples, type FewShotExample } from '@/lib/few-shot-examples';
import { BookOpen, Brain, MessageSquare, AlertCircle, Lightbulb } from 'lucide-react';

const categoryIcons: Record<string, any> = {
    'Cultural–Linguistic Reasoning': MessageSquare,
    'Linguistic–Semantic Reasoning': Brain,
    'Cultural Reasoning in Literature': BookOpen,
    'Linguistic Error Analysis': AlertCircle,
    'Defining Cultural Reasoning': Lightbulb,
};

interface FewShotPanelProps {
    onSelectExample: (example: FewShotExample) => void;
}

export function FewShotPanel({ onSelectExample }: FewShotPanelProps) {
    const [selectedExample, setSelectedExample] = useState<FewShotExample | null>(null);

    const handleSelect = (example: FewShotExample) => {
        setSelectedExample(example);
        onSelectExample(example);
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Few-Shot Dataset
                </CardTitle>
                <CardDescription>
                    Cultural-Linguistic Reasoning Examples
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="all">All Examples</TabsTrigger>
                        <TabsTrigger value="selected">Selected</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-3 mt-4 max-h-[500px] overflow-y-auto">
                        {fewShotExamples.map((example) => {
                            const Icon = categoryIcons[example.category] || Brain;
                            return (
                                <Card
                                    key={example.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${selectedExample?.id === example.id ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => handleSelect(example)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Badge variant="secondary" className="mb-2">
                                                    <Icon className="w-3 h-3 mr-1" />
                                                    {example.category}
                                                </Badge>
                                                <CardTitle className="text-sm">{example.subcategory}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {example.input}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </TabsContent>

                    <TabsContent value="selected" className="mt-4">
                        {selectedExample ? (
                            <div className="space-y-4">
                                <div>
                                    <Badge variant="default" className="mb-2">
                                        {selectedExample.category}
                                    </Badge>
                                    <h3 className="font-semibold text-sm mb-2">{selectedExample.subcategory}</h3>
                                    <p className="text-sm bg-muted p-3 rounded-lg mb-4">
                                        <strong>Question:</strong> {selectedExample.input}
                                    </p>
                                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                                            {selectedExample.output.split('\n').map((line, idx) => (
                                                <p key={idx} className="mb-2 last:mb-0">{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedExample(null)}
                                    className="w-full"
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Select an example to view details</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
