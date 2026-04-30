import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TypingCursor } from "@/components/ui/TypingCursor";
import { ArrowRight } from "lucide-react";

const featuredProjects = [
  {
    name: "Z3ro Nois3",
    url: "https://github.com/JustNunuz/z3r0-Nois3",
    description: "A linguistic engine that audits LLM inefficiencies to make AI cheaper and more secure for Bantu languages.",
    stack: ["Data Science", "Analytics", "Lingustics", "Bantu Tax"],
    impact: "Linguistic auditing engine for LLM efficiency",
  },
  {
    name: "Shona Rockyou",
    url: "https://github.com/JustNunuz/Shona-Rockyou",
    description: "A localized wordlist of Shona names, totems, and linguistic mutations for accurate security audits.",
    stack: ["Corpus", "Wordlist", "Paswords", "Shona"],
    impact: "Localized security wordlist for cultural naming patterns",
  },
  {
    name: "Payload Paradise",
    url: "https://github.com/JustNunuz/PayloadParadise",
    description: "Proof-of-concept scripts exploring script execution vulnerabilities using WhatsApp for Windows as a case study.",
    stack: ["Python", "Windows", "Remote Code Execution", "Reverse shell"],
    impact: "Proof-of-concept research on script execution flaws",
  },
  {
    name: "Corrupt PDF",
    url: "https://github.com/JustNunuz/Corrupt-PDF",
    description: "Exploring flaws within the architecture of the PDF file format that could be abused.",
    stack: ["PDF", "Python", "File Corruption", "Vulnerabilities"],
    impact: "Architectural analysis of PDF file format vulnerabilities",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-grid">
        <div className="container">
          <div className="max-w-3xl opacity-0 animate-fade-in-up">
            {/* Headline with typing cursor */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Hi, I'm <span className="text-gradient">Nunudzai Mrewa.</span>
              <br />
              <span className="text-muted-foreground">I solve cybersecurity problems</span>
              <TypingCursor />
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed opacity-0 animate-fade-in-up stagger-1 whitespace-pre-line">
              Most systems aren’t secure, they’re just untested.
              I build tools, run experiments, and track signals to understand where things actually break.

              This is where I document what I’m building, testing, and learning in real time.
            </p>

            {/* CTA */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <Button asChild size="lg" className="font-mono transition-transform hover:scale-105">
                <Link to="/work">
                  View Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container">
          <div className="opacity-0 animate-fade-in-up">
            <CodeDivider label="Featured Tools" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <div 
                key={project.name} 
                className={`opacity-0 animate-fade-in-up stagger-${index + 1}`}
              >
                <ProjectCard {...project} className="hover-lift" />
              </div>
            ))}
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
