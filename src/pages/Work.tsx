import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TechTag } from "@/components/ui/TechTag";
import { Calendar, MapPin } from "lucide-react";

const projects = [
  {
    name: "Z3ro Nois3",
    slug: "z3ro-nois3",
    description: "AI models are built for English, making them expensive and inaccurate for Shona speakers. I call this the \"Bantu Tax\" because Shona text gets fragmented, increasing processing costs. Z3ro Nois3 is a linguistic engine that audits these inefficiencies to make AI cheaper and more secure for our local languages.",
    stack: ["Data Science", "Analytics", "Lingustics", "Bantu Tax"],
    impact: "Linguistic auditing engine for LLM efficiency",
  },
  {
    name: "Shona Rockyou",
    slug: "shona-rockyou",
    description: "Shona RockYou addresses the security gap where standard English wordlists fail to account for Shona names and cultural naming patterns. I am building a localized wordlist of names, totems, and linguistic mutations to enable accurate security audits for Shona-speaking users.",
    stack: ["Corpus", "Wordlist", "Paswords", "Shona"],
    impact: "Localized security wordlist for cultural naming patterns",
  },
  {
    name: "Payload Paradise",
    slug: "payload-paradise",
    description: "A collection of proof-of-concept scripts exploring \"what could go wrong\" with unflagged script execution vulnerabilities, using the WhatsApp for Windows vulnerability that allows Python execution without warnings as a case study.",
    stack: ["Python", "Windows", "Remote Code Execution", "Reverse shell"],
    impact: "Proof-of-concept research on script execution flaws",
  },
  {
    name: "Corrupt PDF",
    slug: "corrupt-pdf",
    description: "There are multiple ways to corrupt a PDF especially using Python. This project explores flaws within the architecture of the PDF file format that could be abused.",
    stack: ["PDF", "Python", "File Corruption", "Vulnerabilities"],
    impact: "Architectural analysis of PDF file format vulnerabilities",
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
              Tools & Experiments
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              I work on a variety of projects mostly focused on security, but spanning my broader interests, from cybersecurity to more niche, single-purpose ideas. They’re all linked below if you’d like to explore them in more detail.
            </p>
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-1">
            <CodeDivider label="Tools & Experiments" />
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
