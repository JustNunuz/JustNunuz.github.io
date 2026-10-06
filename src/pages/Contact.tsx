import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { PageTitle } from "@/components/ui/PageTitle";
import {
  ArrowRight,
  Briefcase,
  Github,
  Linkedin,
  Mail,
  Mic,
  Users,
} from "lucide-react";

const socialLinks = [
  { href: "https://github.com/JustNunuz", icon: Github, label: "GitHub", handle: "@JustNunuz" },
  { href: "https://www.linkedin.com/in/nunuz/", icon: Linkedin, label: "LinkedIn", handle: "/in/nunuz" },
];

// Email split into parts and only assembled on user interaction to defeat scrapers.
const EMAIL_PARTS = ["nunudzaim", "gmail", "com"];
const obfuscatedDisplay = "nunudzaim [at] gmail [dot] com";

export default function Contact() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const assembleEmail = () =>
    `${EMAIL_PARTS[0]}${String.fromCharCode(64)}${EMAIL_PARTS[1]}${String.fromCharCode(46)}${EMAIL_PARTS[2]}`;

  const handleEmailClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const email = assembleEmail();
    if (!revealed) setRevealed(true);
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
    window.location.href = `mailto:${email}`;
  };

  return (
    <Layout>
      <section className="pt-24 pb-14 bg-grid">
        <div className="container flex flex-col items-center text-center">
          <div className="max-w-3xl">
            <PageTitle title="Reach Out" meta="system.contact" align="center" />
            <p className="mt-10 text-xl md:text-2xl leading-snug font-medium text-foreground">
              Wanna collab on a project, book me to speak, or hire me as a
              consultant?
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Tell me what you need done and I'll tell you straight whether I'm
              the right person for it.
            </p>
          </div>
        </div>
      </section>

      {/* Three concrete ways to work together */}
      <section className="py-12">
        <div className="container">
          <div className="opacity-0 animate-fade-in-up">
            <CodeDivider label="Three ways this works" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Collab */}
            <a
              href="https://github.com/JustNunuz"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover-lift opacity-0 animate-fade-in-up stagger-1"
            >
              <div className="flex items-center justify-center w-11 h-11 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors mb-5">
                <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80 mb-2">
                {"//"} collab
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Wanna build something?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                A tool, a research angle, a file format nobody has pulled apart
                yet. Bring the idea, I'll bring Python.
              </p>
              <span className="mt-5 inline-flex items-center font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                See the repos
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </span>
            </a>

            {/* Talk */}
            <Link
              to="/work"
              className="group flex flex-col p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover-lift opacity-0 animate-fade-in-up stagger-2"
            >
              <div className="flex items-center justify-center w-11 h-11 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors mb-5">
                <Mic className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80 mb-2">
                {"//"} talk
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Need a speaker?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Ten-plus talks, from PyCon Zimbabwe to ISACA Harare. I make
                security land with rooms full of non-specialists.
              </p>
              <span className="mt-5 inline-flex items-center font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                See the talk list
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </span>
            </Link>

            {/* Hire */}
            <button
              type="button"
              onClick={handleEmailClick}
              aria-label="Reveal my email and start a message"
              className="group flex flex-col text-left p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover-lift opacity-0 animate-fade-in-up stagger-3"
            >
              <div className="flex items-center justify-center w-11 h-11 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors mb-5">
                <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80 mb-2">
                {"//"} hire
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Looking to hire me?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Penetration testing, network hardening, SD-WAN, or ZCDPA
                compliance. Give me the scope, I'll tell you what's realistic.
              </p>
              <span className="mt-5 inline-flex items-center font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                Reveal & email me
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Direct lines */}
      <section className="py-12 pb-20">
        <div className="container flex flex-col items-center text-center">
          <div className="max-w-md w-full">
            <CodeDivider label="Direct lines" />

            <div className="space-y-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                    <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">
                      {link.label}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {link.handle}
                    </p>
                  </div>
                </a>
              ))}

              {/* Scrape-resistant email: no mailto in DOM, address split & assembled on click */}
              <button
                type="button"
                onClick={handleEmailClick}
                className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group text-left"
                aria-label="Reveal and email me"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">
                    Email
                  </p>
                  <p className="font-mono text-xs text-muted-foreground select-none">
                    {revealed ? assembleEmail() : obfuscatedDisplay}
                  </p>
                  {copied && (
                    <p className="font-mono text-xs text-primary mt-1">Copied to clipboard</p>
                  )}
                </div>
              </button>
            </div>

            <p className="mt-10 font-mono text-xs text-muted-foreground">
              <span className="text-primary">{"//"}</span> no forms, no ticket
              queues. A message from you gets a reply from me.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
