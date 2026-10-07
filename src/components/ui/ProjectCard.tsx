import { TechTag } from "./TechTag";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  stack: string[];
  impact: string;
  url: string;
  className?: string;
}

export function ProjectCard({ name, description, stack, impact, url, className }: ProjectCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg">
      <article
        className={cn(
          "group flex h-full min-w-0 flex-col p-6 bg-card border border-border rounded-lg transition-all hover:border-primary/50 hover:bg-card/80 cursor-pointer",
          className
        )}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </div>

        <p className="flex-1 text-sm text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex min-h-14 flex-wrap content-start gap-2 mb-4">
          {stack.map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </div>

        <div className="min-h-14 pt-4 border-t border-border">
          <span className="font-mono text-xs text-primary">
            <span className="text-muted-foreground">{"//"}</span> {impact}
          </span>
        </div>
      </article>
    </a>
  );
}
