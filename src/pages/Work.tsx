import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TechTag } from "@/components/ui/TechTag";
import { Calendar, MapPin } from "lucide-react";

const projects = [
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
    title: "Corrupting PDFs",
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
      <section className="py-20 bg-grid">
        <div className="container">
          {/* Page Header */}
          <div className="max-w-2xl mb-12 opacity-0 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tools & Experiments
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              I work on a variety of projects mostly focused on security, but spanning my broader interests, from cybersecurity to more niche, single-purpose ideas. Python is my go-to language — I'm proficient in it and genuinely enjoy building with it. They're all linked below if you'd like to explore them in more detail.
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
