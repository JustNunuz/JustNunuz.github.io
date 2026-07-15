import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TechTag } from "@/components/ui/TechTag";
import { Calendar, MapPin, Mic, ExternalLink, ArrowRight } from "lucide-react";

const projects = [
  {
    name: "Mimir",
    url: "https://github.com/JustNunuz/Mimir",
    description: "Mimir is a tool that helps people check whether an image is real, edited, or created using artificial intelligence. It looks for hidden clues inside an image and explains what it finds in a simple, easy-to-understand way. The goal is to make image verification accessible to everyone, not just cybersecurity experts or researchers.",
    stack: ["Python", "AI Forensics", "Streamlit", "FastAPI", "Provenance"],
    impact: "Multi-layer AI image provenance and detection engine",
  },
  {
    name: "Z3ro Nois3",
    url: "https://github.com/JustNunuz/z3r0-Nois3",
    description: "AI models are built for English, making them expensive and inaccurate for Shona speakers. I call this the \"Bantu Tax\" because Shona text gets fragmented, increasing processing costs. Z3ro Nois3 is a linguistic engine that audits these inefficiencies to make AI cheaper and more secure for our local languages.",
    stack: ["Data Science", "Analytics", "Lingustics", "Bantu Tax"],
    impact: "Linguistic auditing engine for LLM efficiency",
  },
  {
    name: "Shona Rockyou",
    url: "https://github.com/JustNunuz/Shona-Rockyou",
    description: "Shona RockYou addresses the security gap where standard English wordlists fail to account for Shona names and cultural naming patterns. I am building a localized wordlist of names, totems, and linguistic mutations to enable accurate security audits for Shona-speaking users.",
    stack: ["Corpus", "Wordlist", "Paswords", "Shona"],
    impact: "Localized security wordlist for cultural naming patterns",
  },
  {
    name: "Payload Paradise",
    url: "https://github.com/JustNunuz/PayloadParadise",
    description: "A collection of proof-of-concept scripts exploring \"what could go wrong\" with unflagged script execution vulnerabilities, using the WhatsApp for Windows vulnerability that allows Python execution without warnings as a case study.",
    stack: ["Python", "Windows", "Remote Code Execution", "Reverse shell"],
    impact: "Proof-of-concept research on script execution flaws",
  },
  {
    name: "Corrupt PDF",
    url: "https://github.com/JustNunuz/Corrupt-PDF",
    description: "There are multiple ways to corrupt a PDF especially using Python. This project explores flaws within the architecture of the PDF file format that could be abused.",
    stack: ["PDF", "Python", "File Corruption", "Vulnerabilities"],
    impact: "Architectural analysis of PDF file format vulnerabilities",
  },
];

const speakingEngagements = [
  {
    title: "The Human Firewall",
    event: "Evolve Africa ICT Summit (Panel Moderator)",
    date: "June 2026",
    location: "Harare, Zimbabwe",
    topics: ["Panel Moderation", "Human Firewall", "Awareness", "Women in Cyber", "Regulation"],
    url: "https://www.linkedin.com/posts/nunuz_as-the-evolve-africa-ict-summit-comes-to-ugcPost-7472324526777720832-DhlY/?utm_source=share&utm_medium=member_desktop&rcm=ACoAADIXSugBmwIKQCJyTu8GVijPKGJ7Y4u-SPs",
  },
  {
    title: "Evolving Laws vs Stagnating Legislation",
    event: "ISACA Harare Chapter Webinar",
    date: "June 2026",
    location: "Zoom",
    topics: ["Governance", "Invisible Technology", "AI Surveillance", "Privacy", "Regulation"],
  },

  {
    title: "Z3ro Nois3: The Algorithm That Understands African Languages",
    event: "GDG Harare BuildWithAI",
    date: "May 2026",
    location: "Harare, Zimbabwe",
    topics: ["AI Localization", "Tokenization Equity", "African Datasets", "Linguistic Bias", "Data Sovereignty"],
  },

  {
    title: "Honeypot Demo Product",
    event: "Cybersec Mindmap Community",
    date: "March 2026",
    location: "Online / Harare",
    topics: ["Honeypots", "Demo", "Defensive Security"],
  },
  {
    title: "The Most Dangerous Input to AI Is You",
    event: "AMLD Africa",
    date: "January 2026",
    location: "Harare, Zimbabwe",
    topics: ["AI", "Vulnerabilities", "Hallucinations", "Sleeper Agent"],
  },
  {
    title: "It's Just a File… Until It Isn't",
    event: "PyCon Africa",
    date: "September 2025",
    location: "Johannesburg, South Africa",
    topics: ["Python", "Windows Vulnerability"],
  },
  {
    title: "Speedrunning and the Python Community",
    event: "PyCon ZA",
    date: "2024",
    location: "Johannesburg, South Africa",
    topics: ["Community Talk", "Python"],
  },
  {
    title: "Speedrunners Are the Real Hackers",
    event: "BSides Cape Town",
    date: "2024",
    location: "Cape Town, South Africa",
    topics: ["Speedrunners", "Hacking", "Thinking Like a Hacker"],
  },
  {
    title: "Using Forensics and Python to Corrupt PDF files",
    event: "PyCon Zimbabwe",
    date: "2024",
    location: "Harare, Zimbabwe",
    topics: ["PDF", "Forensics", "Vulnerabilities", "Python"],
  },
  {
    title: "Cyber Trends and Risks",
    event: "Annual Cyber Fraud Summit",
    date: "2023",
    location: "Victoria Falls, Zimbabwe",
    topics: ["Cybersecurity", "AI", "Fraud", "Risks", "Hacking"],
  },
];
export default function Work() {
  return (
    <Layout>
      <section className="pt-20 pb-12 bg-grid">
        <div className="container">
          {/* Page Header */}
          <div className="max-w-2xl opacity-0 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tools & Experiments
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              I work on a variety of projects mostly focused on security, but spanning my broader interests, from cybersecurity to more niche, single-purpose ideas. Python is my go-to language — I'm proficient in it and genuinely enjoy building with it. They're all linked below if you'd like to explore them in more detail.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="opacity-0 animate-fade-in-up stagger-1">
            <CodeDivider label="Tools & Experiments" />
          </div>

          {/* Focus Project */}
          {projects[0] && (
            <a
              href={projects[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-8 md:p-10 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 relative overflow-hidden opacity-0 animate-fade-in-up mb-10"
            >
              <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-wider text-primary/80 px-2 py-1 border border-primary/30 rounded">
                // focus
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {projects[0].stack.map((tech) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors max-w-3xl">
                {projects[0].name}
              </h2>
              <p className="text-base text-muted-foreground mb-6 max-w-2xl leading-relaxed">
                {projects[0].description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-mono text-xs text-primary">
                  <span className="text-muted-foreground">{"//"}</span> {projects[0].impact}
                </span>
                <span className="flex items-center gap-1 text-sm font-mono text-primary">
                  View project <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          )}

          {/* Projects Grid */}
          <div className="grid gap-8">
            {projects.slice(1).map((project, index) => (
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
            {speakingEngagements.map((talk, index) => {
              const Tag: any = talk.url ? "a" : "article";
              const linkProps = talk.url
                ? { href: talk.url, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <Tag
                  key={talk.title}
                  {...linkProps}
                  className={`group relative block p-6 pl-7 bg-card border border-border border-l-2 border-l-primary/60 rounded-lg transition-all hover:border-primary/50 hover:border-l-primary hover:bg-card/80 opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-primary/80">
                        Talk
                      </span>
                    </div>
                    {talk.url && (
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
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
                </Tag>
              );
            })}
          </div>

        </div>
      </section>
    </Layout>
  );
}
