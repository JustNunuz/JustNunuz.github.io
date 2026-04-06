import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub", handle: "@developer" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn", handle: "/in/developer" },
  { href: "mailto:nunudzaim@compulink.co.zw", icon: Mail, label: "Email", handle: "nunudzaim@compulink.co.zw" },
];

export default function Contact() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container flex flex-col items-center text-center">
          <div className="max-w-2xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Contact
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
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
