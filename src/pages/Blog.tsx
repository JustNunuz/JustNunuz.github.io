import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { TechTag } from "@/components/ui/TechTag";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { ArrowRight } from "lucide-react";

export default function Blog() {
  return (
    <Layout>
      <section className="py-20 bg-grid">
        <div className="container">
          {/* Page Header */}
          <div className="max-w-3xl mb-12 opacity-0 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Field Notes
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              You may know it as a blog section. Writing about cybersecurity, compliance, and the evolving threat landscape.
            </p>
          </div>

          <CodeDivider label="Latest Posts" />

          {/* Blog Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className={`group p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <TechTag key={tag}>{tag}</TechTag>
                  ))}
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
                <div className="text-xs font-mono text-muted-foreground mt-1">
                  {post.readTime}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
