import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { Github, Linkedin, Mail } from "lucide-react";

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
      <section className="py-20">
        <div className="container flex flex-col items-center text-center">
          <div className="max-w-2xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
               Reach Out to Me
             </h1>
            <p className="text-muted-foreground leading-relaxed">
              Have a project in mind or want to discuss opportunities? 
              I'm always open to interesting conversations and collaborations.
            </p>
          </div>

          <div className="max-w-md w-full">
            <CodeDivider label="Connect" />
            
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
          </div>
        </div>
      </section>
    </Layout>
  );
}
