import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { TechTag } from "@/components/ui/TechTag";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

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

  // Simple markdown-like rendering for ## headings, ### subheadings, lists, and **bold**
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
        const match = line.match(/^(\d+\.)\s\*\*(.+?)\*\*\s*—?\s*(.*)/);
        if (match) {
          elements.push(
            <div key={i} className="flex gap-3 mb-3 text-muted-foreground">
              <span className="text-primary font-mono text-sm">{match[1]}</span>
              <p>
                <span className="font-medium text-foreground">{match[2]}</span>
                {match[3] && ` — ${match[3]}`}
              </p>
            </div>
          );
        }
      } else if (line.trim() === "") {
        // skip empty lines
      } else {
        // Render bold text within paragraphs
        const parts = line.split(/\*\*(.*?)\*\*/g);
        elements.push(
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">
            {parts.map((part, idx) =>
              idx % 2 === 1 ? (
                <span key={idx} className="font-medium text-foreground">{part}</span>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      i++;
    }

    return elements;
  };

  return (
    <Layout>
      <section className="py-20 bg-grid">
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
          <div className="mb-8 opacity-0 animate-fade-in-up stagger-1">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <TechTag key={tag}>{tag}</TechTag>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span className="text-primary">•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Post Content */}
          <div className="opacity-0 animate-fade-in-up stagger-2">
            {renderContent(post.content)}
          </div>
        </div>
      </section>
    </Layout>
  );
}
