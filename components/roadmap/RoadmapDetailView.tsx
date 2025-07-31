// components/roadmap/RoadmapDetailView.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Link as LinkIcon, Video } from "lucide-react";

const getIconForResourceType = (type: string) => {
    if (type.toLowerCase().includes('sách')) return <Book className="w-4 h-4 mr-2" />;
    if (type.toLowerCase().includes('khóa học')) return <Video className="w-4 h-4 mr-2" />;
    return <LinkIcon className="w-4 h-4 mr-2" />;
};

export default function RoadmapDetailView({ roadmap, forceOpenAll }: { roadmap: any[], forceOpenAll?: boolean }) {
    const allItemValues = roadmap.map((phase) => `phase-${phase.phase}`);
    if (forceOpenAll) {
        return (
            <Accordion
                type="multiple"
                defaultValue={allItemValues}
                className="w-full"
                data-slot="accordion"
            >
                {roadmap.map((phase) => (
                    <AccordionItem value={`phase-${phase.phase}`} key={phase._id}>
                        <AccordionTrigger className="text-xl font-semibold">
                            {phase.title}
                            <Badge variant="outline" className="ml-4">{phase.duration}</Badge>
                        </AccordionTrigger>
                        <AccordionContent className="pl-2 space-y-4">
                            {phase.topics.map((topic: any) => (
                                <Card key={topic._id} className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{topic.name}</CardTitle>
                                        <CardDescription>{topic.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <h4 className="mb-2 font-semibold">Tài nguyên đề xuất:</h4>
                                        <ul className="space-y-2">
                                            {topic.resources.map((resource: any, index: number) => (
                                                <li key={index} className="flex items-start">
                                                    <Badge variant="secondary" className="mr-2 whitespace-nowrap">{resource.type}</Badge>
                                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                        {resource.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        );
    }
    return (
        <Accordion type="single" collapsible defaultValue="phase-1" className="w-full">
            {roadmap.map((phase) => (
                <AccordionItem value={`phase-${phase.phase}`} key={phase._id}>
                    <AccordionTrigger className="text-xl font-semibold">
                        {phase.title}
                        <Badge variant="outline" className="ml-4">{phase.duration}</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="pl-2 space-y-4">
                        {phase.topics.map((topic: any) => (
                            <Card key={topic._id} className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                                    <CardDescription>{topic.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <h4 className="mb-2 font-semibold">Tài nguyên đề xuất:</h4>
                                    <ul className="space-y-2">
                                        {topic.resources.map((resource: any, index: number) => (
                                            <li key={index} className="flex items-start">
                                                <Badge variant="secondary" className="mr-2 whitespace-nowrap">{resource.type}</Badge>
                                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                    {resource.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}