import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { PageTitle } from "@/components/ui/PageTitle";
import { TechTag } from "@/components/ui/TechTag";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const index = blogPosts.findIndex((p) => p.slug === slug);
  const post = index >= 0 ? blogPosts[index] : undefined;
  const prev = index > 0 ? blogPosts[index - 1] : null;
  const next = index >= 0 && index < blogPosts.length - 1 ? blogPosts[index + 1] : null;
  const related = post
    ? blogPosts
        .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
        .slice(0, 3)
    : [];

  if (!post) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
            <Button asChild variant="outline">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  // Render inline bold and markdown-style links
  const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    const renderBold = (segment: string) => {
      const parts = segment.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <span key={`${keyPrefix}-b-${key++}`} className="font-medium text-foreground">
            {part}
          </span>
        ) : (
          <span key={`${keyPrefix}-n-${key++}`}>{part}</span>
        )
      );
    };

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(...renderBold(text.slice(lastIndex, match.index)));
      }
      nodes.push(
        <a
          key={`${keyPrefix}-l-${key++}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      nodes.push(...renderBold(text.slice(lastIndex)));
    }

    return nodes;
  };

  // Simple markdown-like rendering for ## headings, ### subheadings, lists, bold, and links
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-lg font-semibold text-foreground mt-8 mb-3">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-xl font-bold text-foreground mt-10 mb-4">
            {line.slice(3)}
          </h2>
        );
      } else if (line.match(/^\d+\.\s\*\*/)) {
        // Numbered list item with bold
        const match = line.match(/^(\d+\.)\s\*\*(.+?)\*\*\s*-?\s*(.*)/);
        if (match) {
          elements.push(
            <div key={i} className="flex gap-3 mb-3 text-muted-foreground">
              <span className="text-primary font-mono text-sm">{match[1]}</span>
              <p>{renderInline(`${match[2]}${match[3] ? ` - ${match[3]}` : ""}`, `li-${i}`)}</p>
            </div>
          );
        }
      } else if (line.trim() === "") {
        // skip empty lines
      } else {
        elements.push(
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">
            {renderInline(line, `p-${i}`)}
          </p>
        );
      }
      i++;
    }

    return elements;
  };

  return (
    <Layout>
      <Seo
        title={`${post.title} | JustNunuz Field Notes`}
        description={post.excerpt}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          keywords: post.tags.join(", "),
          author: { "@type": "Person", name: "Nunudzai Mrewa" },
        }}
      />
      <section className="pt-20 pb-12 bg-grid">
        <div className="container max-w-3xl">
          {/* Back link */}
          <div className="mb-8 opacity-0 animate-fade-in-up">
            <Button asChild variant="ghost" size="sm">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Post Header */}
          <div className="opacity-0 animate-fade-in-up stagger-1">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <TechTag key={tag}>{tag}</TechTag>
              ))}
            </div>
            <PageTitle title={post.title} meta="field.note" className="mb-4" />
            <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span className="text-primary">•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-3xl">
          {/* Post Content */}
          <div className="opacity-0 animate-fade-in-up stagger-2">
            {renderContent(post.content)}
          </div>

          {/* Prev / next navigation */}
          {(prev || next) && (
            <nav className="mt-16 grid gap-4 sm:grid-cols-2 border-t border-border pt-8">
              {prev ? (
                <Link
                  to={`/blog/${prev.slug}`}
                  className="group rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/80 mb-2">
                    <ArrowLeft className="h-3 w-3" /> newer note
                  </div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to={`/blog/${next.slug}`}
                  className="group rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors sm:text-right"
                >
                  <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary/80 mb-2 sm:justify-end">
                    older note <ArrowRight className="h-3 w-3" />
                  </div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {next.title}
                  </div>
                </Link>
              )}
            </nav>
          )}

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12">
              <div className="font-mono text-xs text-primary mb-4">{"// "}related notes</div>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to={`/blog/${r.slug}`}
                      className="group flex items-baseline gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="font-mono text-xs text-primary/70">{"→"}</span>
                      <span className="group-hover:underline">{r.title}</span>
                      <span className="ml-auto font-mono text-[11px] whitespace-nowrap">{r.date}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 border-t border-border pt-8">
            <Button asChild variant="outline" size="sm">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All field notes
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </Layout>
  );
}
