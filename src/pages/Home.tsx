import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TypingCursor } from "@/components/ui/TypingCursor";
import { ArrowRight } from "lucide-react";

const SLOGAN = "Simplifying security, amplifying trust.";

const stats = [
  { value: "5+", label: "years in tech" },
  { value: "10+", label: "talks delivered" },
  { value: "5+", label: "shipped tools" },
  { value: "2018", label: "remote-first since" },
];

const capabilities = [
  {
    code: "red team",
    title: "Find it first",
    desc: "Authorized penetration testing across web, network and cloud. You get a ranked fix list, not a scare tactic.",
  },
  {
    code: "blue team",
    title: "Hold the line",
    desc: "Firewalls, IDS/IPS, honeypots and SD-WAN, built so the boring parts keep working when things get loud.",
  },
  {
    code: "governance",
    title: "Make it defensible",
    desc: "ZCDPA, GDPR lineage and ISO 27001 translated into a roadmap your board can actually read and fund.",
  },
];

const consoleLines = [
  { cmd: "whoami", out: "nunudzai mrewa // cybersecurity & compliance consultant" },
  { cmd: "cat ./focus.txt", out: "offensive testing / defensive architecture / data protection" },
  { cmd: "python --version", out: "Python 3.12 (preferred language)" },
  { cmd: "ls ./now", out: "mimir  z3r0-nois3  payload-paradise" },
];

const featuredProjects = [
  {
    name: "Mimir",
    url: "https://github.com/JustNunuz/Mimir",
    description:
      "Mimir is a tool that helps people check whether an image is real, edited, or created using artificial intelligence. It looks for hidden clues inside an image and explains what it finds in a simple, easy-to-understand way.",
    stack: ["Python", "AI Forensics", "Streamlit", "FastAPI", "Provenance"],
    impact: "AI image provenance and detection engine",
  },
  {
    name: "Z3ro Nois3",
    url: "https://github.com/JustNunuz/z3r0-Nois3",
    description:
      "A linguistic engine that audits LLM inefficiencies to make AI cheaper and more secure for Bantu languages.",
    stack: ["Data Science", "Analytics", "Lingustics", "Bantu Tax"],
    impact: "Linguistic auditing engine for LLM efficiency",
  },
  {
    name: "Shona Rockyou",
    url: "https://github.com/JustNunuz/Shona-Rockyou",
    description:
      "A localized wordlist of Shona names, totems, and linguistic mutations for accurate security audits.",
    stack: ["Corpus", "Wordlist", "Paswords", "Shona"],
    impact: "Localized security wordlist for cultural naming patterns",
  },
  {
    name: "Payload Paradise",
    url: "https://github.com/JustNunuz/PayloadParadise",
    description:
      "Proof-of-concept scripts exploring script execution vulnerabilities using WhatsApp for Windows as a case study.",
    stack: ["Python", "Windows", "Remote Code Execution", "Reverse shell"],
    impact: "Proof-of-concept research on script execution flaws",
  },
  {
    name: "Corrupt PDF",
    url: "https://github.com/JustNunuz/Corrupt-PDF",
    description:
      "Exploring flaws within the architecture of the PDF file format that could be abused.",
    stack: ["PDF", "Python", "File Corruption", "Vulnerabilities"],
    impact: "Architectural analysis of PDF file format vulnerabilities",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[72vh] flex items-center bg-grid pt-24 pb-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-center">
            {/* Left: slogan + hook */}
            <div className="max-w-2xl opacity-0 animate-fade-in-up">
              {/* Meta label */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="h-px w-6 bg-primary/30" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80">
                  system.overview
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  nunudzai mrewa // harare, zw
                </span>
              </div>

              {/* Slogan */}
              <div className="flex items-center gap-4 mb-6 opacity-0 animate-fade-in-up stagger-1">
                <span className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent to-primary/60" />
                <p className="font-mono text-sm md:text-base uppercase tracking-[0.18em] text-slogan">
                  {SLOGAN}
                </p>
                <span className="hidden sm:block h-px w-10 bg-gradient-to-l from-transparent to-primary/60" />
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6 drop-shadow-[0_0_25px_hsl(var(--primary)/0.15)]">
                Most systems aren't secure,
                <br />
                they're just{" "}
                <span className="text-gradient">untested.</span>
                <TypingCursor />
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-muted-foreground mb-9 max-w-xl leading-relaxed opacity-0 animate-fade-in-up stagger-2">
                I run the experiments that show where a system actually breaks,
                then turn what I find into fixes your engineers can ship and
                your board can fund. Penetration testing, defensive
                architecture, and data protection, explained in plain language.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-in-up stagger-3">
                <Button asChild size="lg" className="font-mono transition-transform hover:scale-105">
                  <Link to="/work">
                    View Work
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-mono">
                  <Link to="/contact">Reach out</Link>
                </Button>
              </div>
            </div>

            {/* Right: console card */}
            <div className="opacity-0 animate-fade-in-up stagger-3">
              <div className="rounded-lg border border-border bg-card/80 backdrop-blur-sm overflow-hidden glow-primary">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    session: justnunuz
                  </span>
                </div>
                <div className="p-5 font-mono text-xs md:text-sm space-y-3">
                  {consoleLines.map((line) => (
                    <div key={line.cmd}>
                      <div className="flex gap-2">
                        <span className="text-primary select-none">$</span>
                        <span className="text-foreground">{line.cmd}</span>
                      </div>
                      <div className="pl-5 text-muted-foreground break-words">
                        {line.out}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <span className="text-primary select-none">$</span>
                    <span className="inline-block w-[8px] h-[1.1em] bg-primary/80 animate-blink" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What I do */}
      <section className="py-16">
        <div className="container">
          <div className="opacity-0 animate-fade-in-up">
            <CodeDivider label="What I actually do" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {capabilities.map((cap, index) => (
              <div
                key={cap.code}
                className={`group relative p-6 rounded-lg border border-border bg-card hover:border-primary/40 hover-lift opacity-0 animate-fade-in-up stagger-${index + 1}`}
              >
                <span className="absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-primary/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80 mb-3">
                  {"//"} {cap.code}
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">{cap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-border bg-card/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-4 py-6 md:py-8 opacity-0 animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="font-mono text-2xl md:text-3xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-muted-foreground mt-1">
                  <span className="text-primary">{"// "}</span>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container">
          <div className="opacity-0 animate-fade-in-up">
            <CodeDivider label="Featured Tools" />
          </div>

          <div className="grid auto-rows-fr gap-6 md:grid-cols-2">
            {featuredProjects.map((project, index) => {
              return (
                <div
                  key={project.name}
                  className={`h-full opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}
                >
                  <ProjectCard {...project} className="hover-lift" />
                </div>
              );
            })}
          </div>

          {/* View All Link */}
          <div className="mt-12 text-center opacity-0 animate-fade-in-up stagger-4">
            <Link
              to="/work"
              className="inline-flex items-center font-mono text-sm text-muted-foreground hover:text-primary transition-colors link-underline"
            >
              <span className="text-primary mr-2">{"//"}</span>
              View all tools & experiments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
