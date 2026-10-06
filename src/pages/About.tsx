import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { PageTitle } from "@/components/ui/PageTitle";
import { TechTag } from "@/components/ui/TechTag";
import { ArrowRight } from "lucide-react";

const expertise = [
  { label: "Offensive Security", desc: "Conducting authorized penetration tests to identify and exploit vulnerabilities before the bad actors do." },
  { label: "Defensive Architecture", desc: "Designing hardened network perimeters using Next-Gen Firewalls and SD-WAN." },
  { label: "Data Protection & Privacy", desc: "Expert-level navigation of the ZCDPA and international data privacy frameworks (DPO)." },
  { label: "Incident Response & Hunting", desc: "Utilizing honeypots and threat intelligence to detect and mitigate active breaches." },
  { label: "Vulnerability Management", desc: "Systematically identifying, classifying, and remediating security weaknesses." },
];

const securityStack = [
  { category: "Offensive", tools: ["Kali Linux", "Metasploit", "Nmap", "Burp Suite", "Wireshark", "SQLMap"] },
  { category: "Defensive", tools: ["Sophos", "Fortinet", "Check Point", "Snort (IDS/IPS)", "Honeypots"] },
  { category: "Infrastructure", tools: ["Linux Systems Administration", "SD-WAN", "FTTx", "Cisco Networking"] },
  { category: "AI/LLM", tools: ["Tokenization Security", "LLM Prompt Injection Defense", "Modular Scraping"] },
];

const principles = [
  {
    rule: "Prove it, don't promise it",
    note: "A control nobody has tried to bypass is a slide, not a defence.",
  },
  {
    rule: "Educate first, implement later",
    note: "People protect what they understand. Rules they can't explain get worked around.",
  },
  {
    rule: "Security is an enabler",
    note: "My job is to make risk legible enough that saying yes becomes possible.",
  },
  {
    rule: "Say it like I'm five",
    note: "If a stakeholder can't repeat the risk back to me, I haven't finished the job.",
  },
  {
    rule: "Assume it's untested",
    note: "The most dangerous environments are the ones everyone is confident about.",
  },
];

const fieldRecord = [
  {
    year: "2026",
    title: "WhatsApp, two years later",
    note: "Went back to an unpatched Windows execution flaw I first documented years ago and asked what had actually changed. Nothing had.",
    href: "https://github.com/JustNunuz/PayloadParadise",
    label: "Payload Paradise",
  },
  {
    year: "2026",
    title: "Mimir",
    note: "Checking whether an image is real, edited or generated, then explaining the evidence in plain terms instead of a confidence score.",
    href: "https://github.com/JustNunuz/Mimir",
    label: "Mimir",
  },
  {
    year: "2024",
    title: "Corrupting PDFs",
    note: "Used the PDF format's own structure against it to see how far a malformed file can travel before anything notices.",
    href: "https://github.com/JustNunuz/Corrupt-PDF",
    label: "Corrupt PDF",
  },
  {
    year: "2024",
    title: "Shona Rockyou",
    note: "A wordlist built from Shona names, totems and linguistic mutations, because local password habits don't fit English wordlists.",
    href: "https://github.com/JustNunuz/Shona-Rockyou",
    label: "Shona Rockyou",
  },
  {
    year: "2023",
    title: "Honeypots as early warning",
    note: "Decoy infrastructure that tells you what attackers are doing before they reach anything that matters.",
    href: "/blog/honeypots-threat-detection",
    label: "Field note",
  },
];

const questions = [
  {
    q: "Will I just get a PDF of findings?",
    a: "No. You get a ranked fix list your engineers can start from, a one-page brief your leadership can fund from, and a retest once the fixes land.",
  },
  {
    q: "How long until you understand our environment?",
    a: "Days, not months. I would rather read your topology and sit with your team than guess from a scan report.",
  },
  {
    q: "Doesn't compliance mean we're secure?",
    a: "It means the paperwork is honest. Security is whether you'd survive the afternoon. I try to get clients both, in that order of difficulty.",
  },
  {
    q: "Why publish the experiments and talks?",
    a: "Because a method I can't explain in public is a method I don't fully understand. Teaching is my stress test.",
  },
];

const path = [
  {
    stage: "Helpdesk & IT support",
    note: "Where I learned that most 'security problems' are people problems wearing a login screen.",
  },
  {
    stage: "Networking & infrastructure",
    note: "SD-WAN, FTTx and Cisco. Learned how traffic actually moves before learning how to stop it.",
  },
  {
    stage: "Cybersecurity & compliance",
    note: "Red teaming, governance and data protection work across startups and enterprise environments.",
  },
  {
    stage: "Remote-first since 2018",
    note: "Comfortable building trust across distributed teams and awkward time zones.",
  },
];

const currently = [
  { label: "Building", value: "Mimir, Z3ro Nois3" },
  { label: "Testing", value: "LLM prompt injection paths, image provenance signals" },
  { label: "Watching", value: "WhatsApp and Windows execution behaviour, ZCDPA enforcement moves" },
  { label: "Language", value: "Python, most days" },
  { label: "Base", value: "Harare, Zimbabwe (UTC+2)" },
];

export default function About() {
  return (
    <Layout>
      <section className="pt-20 pb-12 bg-grid">
        <div className="container">
          <div className="max-w-3xl opacity-0 animate-fade-in-up">
            <PageTitle
              title="whoami"
              meta="system.identity"
              subtitle="Simplifying security, amplifying trust. A short version of a long curiosity."
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="opacity-0 animate-fade-in-up stagger-1">
                <p className="text-lg text-foreground leading-relaxed">
                  I'm <span className="text-primary font-medium">Nunudzai Mrewa</span>. I
                  work at the uncomfortable edge between what a system is supposed to do
                  and what it will actually do when someone tries hard to break it.
                </p>
              </div>

              <div className="opacity-0 animate-fade-in-up stagger-2">
                <p className="text-muted-foreground leading-relaxed">
                  By day I'm a cybersecurity and compliance consultant at Compulink
                  Systems in Harare, Zimbabwe. My week splits between attacking things on
                  purpose (authorized testing, honeypots, weird file formats) and
                  defending them properly (firewalls, SD-WAN, detection, and the paperwork
                  that proves it all happened).
                </p>
              </div>

              <div className="opacity-0 animate-fade-in-up stagger-3">
                <p className="text-muted-foreground leading-relaxed">
                  The part I care about most is translation. A finding nobody understands
                  never gets fixed, so I write and talk about security the way I'd want it
                  explained to me: short, concrete, and with the 'why' attached. That ELI5
                  habit is behind everything I do, from a pentest report to a conference
                  stage.
                </p>
              </div>

              {/* Operating principles */}
              <div className="opacity-0 animate-fade-in-up stagger-4">
                <CodeDivider label="Operating principles" />
              </div>

              <ol className="space-y-4 opacity-0 animate-fade-in-up stagger-4">
                {principles.map((p, i) => (
                  <li
                    key={p.rule}
                    className="group flex gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
                  >
                    <span className="font-mono text-xs text-primary/70 pt-1 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {p.rule}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {p.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Field record */}
              <div className="opacity-0 animate-fade-in-up stagger-4">
                <CodeDivider label="Field record" />
              </div>

              <div className="space-y-3 opacity-0 animate-fade-in-up stagger-4">
                {fieldRecord.map((entry) => (
                  <a
                    key={entry.title}
                    href={entry.href}
                    target={entry.href.startsWith("http") ? "_blank" : undefined}
                    rel={entry.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5 p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors group"
                  >
                    <span className="font-mono text-xs text-primary/80 shrink-0 w-12">
                      {entry.year}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {entry.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {entry.note}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                      {entry.label} <ArrowRight className="inline h-3 w-3 -mb-0.5" />
                    </span>
                  </a>
                ))}
              </div>

              {/* Security Stack */}
              <div className="opacity-0 animate-fade-in-up stagger-4">
                <CodeDivider label="Security Stack" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 opacity-0 animate-fade-in-up stagger-4">
                {securityStack.map((group) => (
                  <div key={group.category} className="p-5 rounded-lg border border-border bg-card">
                    <h3 className="text-sm font-semibold text-primary mb-3">
                      <span className="text-muted-foreground">{"/*"}</span> {group.category} <span className="text-muted-foreground">{"*/"}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.tools.map((tool) => (
                        <TechTag key={tool}>{tool}</TechTag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Questions */}
              <div className="opacity-0 animate-fade-in-up stagger-4">
                <CodeDivider label="Questions I get asked" />
              </div>

              <div className="space-y-5 opacity-0 animate-fade-in-up stagger-4">
                {questions.map((item) => (
                  <div key={item.q} className="border-l border-primary/30 pl-5">
                    <p className="font-mono text-sm text-foreground">
                      <span className="text-primary">?</span> {item.q}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>

              {/* Community */}
              <div className="pt-6 opacity-0 animate-fade-in-up stagger-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Most of what I know got sharper because someone let me stand in front of
                  a room and explain it: PyCon Zimbabwe, GDG Harare, ISACA Harare Chapter,
                  Cybersec Mindmap Community, AMLD Africa and PyCon Africa.
                </p>
                <Link
                  to="/work"
                  className="inline-flex items-center mt-3 font-mono text-sm text-muted-foreground hover:text-primary transition-colors link-underline"
                >
                  <span className="text-primary mr-2">{"//"}</span>
                  Full talk list
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Currently */}
              <div className="opacity-0 animate-fade-in-up stagger-1">
                <h2 className="text-sm font-semibold text-primary mb-4">
                  <span className="text-muted-foreground">/*</span> Currently <span className="text-muted-foreground">*/</span>
                </h2>
                <dl className="space-y-3 border border-border rounded-lg bg-card p-5">
                  {currently.map((row) => (
                    <div key={row.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                        {row.label}
                      </dt>
                      <dd className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Expertise */}
              <div className="opacity-0 animate-fade-in-up stagger-2">
                <h2 className="text-sm font-semibold text-primary mb-4">
                  <span className="text-muted-foreground">/*</span> Expertise <span className="text-muted-foreground">*/</span>
                </h2>
                <ul className="space-y-4">
                  {expertise.map((item) => (
                    <li key={item.label} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <span className="text-primary mr-2">→</span>
                      <span className="font-medium text-foreground">{item.label}:</span>{" "}
                      {item.desc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Path */}
              <div className="opacity-0 animate-fade-in-up stagger-4">
                <h2 className="text-sm font-semibold text-primary mb-4">
                  <span className="text-muted-foreground">/*</span> Path <span className="text-muted-foreground">*/</span>
                </h2>
                <ol className="relative border-l border-border pl-6 space-y-6">
                  {path.map((step) => (
                    <li key={step.stage} className="relative">
                      <span className="absolute -left-[1.7rem] top-1 h-2 w-2 rounded-full bg-primary/80 shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
                      <p className="text-sm font-medium text-foreground">{step.stage}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {step.note}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
