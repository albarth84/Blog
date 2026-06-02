import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/lib/posts";
import { getThemeSettings } from "@/lib/theme";
import { renderContent } from "@/lib/content";

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
      <header className="site-header">
        <div className="container header-row">
          <Link href="/" className="brand">
            <span className="brand-mark" />
            <span>{theme.siteName}</span>
          </Link>
          <Link href="/" className="button-secondary">
            Torna alla home
          </Link>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <article className="prose">
            <div className="meta-row">
              <span className="badge">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("it-IT") : "Bozza"}
              </span>
              {post.featured ? <span className="badge">In evidenza</span> : null}
            </div>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.6rem)", marginTop: 12 }}>{post.title}</h1>
            <p className="lead">{post.excerpt}</p>
            {post.coverImageUrl ? (
              <img src={post.coverImageUrl} alt={post.coverImageAlt || post.title} />
            ) : null}
            <div dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} />
          </article>
        </div>
      </section>
    </main>
  );
}
