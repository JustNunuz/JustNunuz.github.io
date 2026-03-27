import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TechTag } from "@/components/ui/TechTag";
import { Calendar, MapPin } from "lucide-react";

const projects = [
  {
    name: "Scalable Fintech Platform",
    slug: "scalable-fintech-platform",
    description: "Development of a scalable financial platform designed to handle millions of transactions with real-time processing capabilities. Built with a focus on security, reliability, and performance at scale.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    impact: "35% latency reduction, support for millions of users",
  },
  {
    name: "Internal Design System",
    slug: "internal-design-system",
    description: "Creation of a comprehensive design system that enables multiple development teams to build consistent, accessible, and visually cohesive interfaces. Includes documentation, component library, and design tokens.",
    stack: ["React", "Storybook", "CSS-in-JS", "TypeScript"],
    impact: "40% increase in team productivity, improved visual consistency",
  },
  {
    name: "Real-Time Analytics Dashboard",
    slug: "real-time-analytics-dashboard",
    description: "A real-time dashboard built for instant decision-making. Features live data visualization, customizable metrics, and seamless integration with multiple data sources for product and business intelligence.",
    stack: ["Next.js", "WebSockets", "D3.js", "Redis"],
    impact: "Instant insights for product and business teams",
  },
  {
    name: "E-Commerce Microservices Architecture",
    slug: "e-commerce-microservices-architecture",
    description: "Complete microservices ecosystem for a high-traffic e-commerce platform. Features event-driven architecture, automated scaling, and distributed data management for maximum reliability and performance.",
    stack: ["Go", "Kubernetes", "gRPC", "MongoDB"],
    impact: "99.99% uptime, 10x throughput improvement",
  },
];

const speakingEngagements = [
  {
    title: "Zero Trust Architecture in Practice",
    event: "AfricaHackon Conference",
    date: "March 2026",
    location: "Nairobi, Kenya",
    topics: ["Zero Trust", "Network Security", "IAM"],
  },
  {
    title: "Building Resilient SOC Teams",
    event: "CyberFest Harare",
    date: "January 2026",
    location: "Harare, Zimbabwe",
    topics: ["SOC", "Incident Response", "Leadership"],
  },
  {
    title: "Compliance Frameworks for African Startups",
    event: "TechConnect Summit",
    date: "November 2025",
    location: "Cape Town, South Africa",
    topics: ["ISO 27001", "GDPR", "Compliance"],
  },
  {
    title: "Threat Hunting with Open Source Tools",
    event: "BSides Johannesburg",
    date: "September 2025",
    location: "Johannesburg, South Africa",
    topics: ["Threat Hunting", "OSINT", "Blue Team"],
  },
  {
    title: "Cloud Security Misconfigurations",
    event: "DevSecOps Days",
    date: "July 2025",
    location: "Virtual",
    topics: ["AWS", "Cloud Security", "DevSecOps"],
  },
  {
    title: "Penetration Testing War Stories",
    event: "Harare Tech Week",
    date: "May 2025",
    location: "Harare, Zimbabwe",
    topics: ["Pentesting", "Red Team", "Vulnerability Assessment"],
  },
];

export default function Work() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container">
          {/* Page Header */}
          <div className="max-w-2xl mb-12 opacity-0 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Projects
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              A selection of projects showcasing systems engineering, product development, 
              and technical problem-solving. Each project represents real challenges solved 
              with measurable impact.
            </p>
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-1">
            <CodeDivider label="Projects" />
          </div>

          {/* Projects Grid */}
          <div className="grid gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.name}
                className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 2, 4)}`}
              >
                <ProjectCard {...project} className="hover-lift" />
              </div>
            ))}
          </div>

          {/* Speaking Engagements */}
          <div className="mt-20 opacity-0 animate-fade-in-up">
            <CodeDivider label="Speaking Engagements" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {speakingEngagements.map((talk, index) => (
              <article
                key={talk.title}
                className={`group p-6 bg-card border border-border rounded-lg transition-all hover:border-primary/50 hover:bg-card/80 opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}
              >
                <h3 className="font-mono text-lg font-medium text-foreground group-hover:text-primary transition-colors mb-2">
                  {talk.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{talk.event}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {talk.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {talk.location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {talk.topics.map((topic) => (
                    <TechTag key={topic}>{topic}</TechTag>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
