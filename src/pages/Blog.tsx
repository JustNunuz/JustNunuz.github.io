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
      <section className="pt-20 pb-12 bg-grid">
        <div className="container">
          {/* Page Header */}
          <div className="max-w-3xl opacity-0 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Field Notes
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              You may know it as a blog section. Writing about cybersecurity, compliance, and the evolving threat landscape.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <CodeDivider label="Latest Posts" />

          {(() => {
            const hasEvenCount = blogPosts.length % 2 === 0;
            const featured = blogPosts[0];
            const bottomFeatured = hasEvenCount ? blogPosts[blogPosts.length - 1] : null;
            const middle = hasEvenCount ? blogPosts.slice(1, -1) : blogPosts.slice(1);

            const FeaturedCard = ({ post, label, isBottom = false }: { post: typeof featured; label: string; isBottom?: boolean }) => (
              <Link
                to={`/blog/${post.slug}`}
                className={`group block p-8 md:p-10 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 opacity-0 animate-fade-in-up relative overflow-hidden ${isBottom ? "mt-10" : "mb-10"}`}
              >
                <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-wider text-primary/80 px-2 py-1 border border-primary/30 rounded">
                  // {label}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <TechTag key={tag}>{tag}</TechTag>
                  ))}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors max-w-3xl">
                  {post.title}
                </h2>
                <p className="text-base text-muted-foreground mb-6 max-w-2xl leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                  <span className="flex items-center gap-1 text-primary ml-auto">
                    Read post <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );

            return (
              <>
                {/* Featured post */}
                {featured && <FeaturedCard post={featured} label="featured" />}

                {/* Middle posts */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {middle.map((post, index) => (
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

                {/* Bottom highlight post (only when even count) */}
                {bottomFeatured && <FeaturedCard post={bottomFeatured} label="highlight" isBottom />}
              </>
            );
          })()}
        </div>
      </section>
    </Layout>
  );
}
