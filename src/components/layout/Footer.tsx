import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

// Email split into parts and assembled on click to defeat scrapers.
const EMAIL_PARTS = ["nunudzaim", "gmail", "com"];
const assembleEmail = () =>
  `${EMAIL_PARTS[0]}${String.fromCharCode(64)}${EMAIL_PARTS[1]}${String.fromCharCode(46)}${EMAIL_PARTS[2]}`;

const socialLinks = [
  { href: "https://github.com/JustNunuz", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/nunuz/", icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Copyright */}
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">//</span> © {currentYear} Nunudzai Mrewa
          </p>

          {/* Footer Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/styleguide"
              className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Styleguide
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
