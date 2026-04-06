import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { TechTag } from "@/components/ui/TechTag";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const skills = [
  "Data Protection Compliance",
  "ISO 27001 & 42001 Lead Implementor",
  "VAPT",
  "Network Security Infrusture",
  "Pre and post sales support",
];

const stack = [
  "Kali Linux",
  "VS Code",
  "Python",
  "Parrot OS",
];

export default function About() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container">
          {/* Page Header */}
          <div className="max-w-3xl mb-12 opacity-0 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About
            </h1>
          </div>

          <div className="grid gap-16 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              <div className="opacity-0 animate-fade-in-up stagger-1">
                <p className="text-lg text-foreground leading-relaxed">
                  I'm <span className="text-primary font-medium">Nunudzai Mrewa</span>, a cybersecurity & compliance consultant at Compulink Systems based in Sunshine City, Zimbabwe. I work at the intersection of technical defense and regulatory compliance, turning complex security vulnerabilities into manageable, strategic assets for businesses.
                </p>
              </div>

              <div className="opacity-0 animate-fade-in-up stagger-2">
                <p className="text-muted-foreground leading-relaxed">
                  With extensive experience in pre-sales and post-sales engineering, I don’t just implement firewalls or run penetration tests; I bridge the gap between deep technical risk and executive decision-making. My approach is rooted in the "ELI5" philosophy—breaking down the bare elements of security so that stakeholders don't just see a cost, but appreciate the underlying importance of digital resilience
                </p>
              </div>

              <div className="opacity-0 animate-fade-in-up stagger-3">
                <p className="text-muted-foreground leading-relaxed">
                  I believe that security is a conversation, not just a configuration. Whether I'm tracking the latest CVEs or navigating the Zimbabwe Cyber and Data Protection Act, my goal is to educate and empower clients to stay ahead of an ever-evolving threat landscape.
                </p>
              </div>

              <div className="opacity-0 animate-fade-in-up stagger-4">
                <CodeDivider label="Philosophy" />
              </div>

              <div className="space-y-4 font-mono text-sm opacity-0 animate-fade-in-up stagger-4">
                <p className="text-muted-foreground transition-colors hover:text-foreground">
                  <span className="text-primary">{"//"}</span> Commitment to Lifelong Learning
                </p>
                <p className="text-muted-foreground transition-colors hover:text-foreground">
                  <span className="text-primary">{"//"}</span> Security is an enabler of business, not a barrier
                </p>
                <p className="text-muted-foreground transition-colors hover:text-foreground">
                  <span className="text-primary">{"//"}</span> Educate first implement later
                </p>
                <p className="text-muted-foreground transition-colors hover:text-foreground">
                  <span className="text-primary">{"//"}</span> 
                </p>
              </div>

              {/* Resume Download */}
              <div className="opacity-0 animate-fade-in-up stagger-4 mt-8">
                <CodeDivider label="Resume" />
                <div className="mt-4 p-6 rounded-lg border border-border bg-card">
                  <p className="text-muted-foreground text-sm mb-4">
                    Download my resume for a full overview of my experience, certifications, and skills.
                  </p>
                  <Button asChild>
                    <a href="/resume.pdf" download>
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Skills */}
              <div className="opacity-0 animate-fade-in-up stagger-2">
                <h2 className="font-mono text-sm text-primary mb-4">
                  <span className="text-muted-foreground">/*</span> Skills <span className="text-muted-foreground">*/</span>
                </h2>
                <ul className="space-y-2">
                  {skills.map((skill) => (
                    <li key={skill} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <span className="text-primary mr-2">→</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="opacity-0 animate-fade-in-up stagger-3">
                <h2 className="font-mono text-sm text-primary mb-4">
                  <span className="text-muted-foreground">/*</span> Stack <span className="text-muted-foreground">*/</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {stack.map((tech) => (
                    <TechTag key={tech}>{tech}</TechTag>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="opacity-0 animate-fade-in-up stagger-4">
                <h2 className="font-mono text-sm text-primary mb-4">
                  <span className="text-muted-foreground">/*</span> Experience <span className="text-muted-foreground">*/</span>
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>5 year in Tech spanning I.T Support, Networking and Cybersecurity</p>
                  <p>Startups to enterprise scale</p>
                  <p>Remote-first since 2018</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
