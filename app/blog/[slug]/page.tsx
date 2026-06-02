import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/lib/posts";
import { getThemeSettings } from "@/lib/theme";
import { renderContent } from "@/lib/content";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, theme] = await Promise.all([getPostBySlug(slug), getThemeSettings()]);

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <main>
      <SiteHeader siteName={theme.siteName} />

      <section className="section">
        <div className="container">
          <article className="prose page-prose">
            <div className="meta-row">
              <span className="badge">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("it-IT") : "Bozza"}
              </span>
              {post.featured ? <span className="badge">In evidenza</span> : null}
            </div>
            <h1>{post.title}</h1>
            <p className="lead">{post.excerpt}</p>
            {post.coverImageUrl ? (
              <img className="article-cover" src={post.coverImageUrl} alt={post.coverImageAlt || post.title} />
            ) : null}
            <div dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} />
            <div className="article-footer">
              <Link className="button-secondary" href="/blog">
                Torna all'archivio
              </Link>
              <Link className="button" href="/contatti">
                Contatti
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
