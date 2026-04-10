import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, ArrowLeft, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export default function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = React.useState<Blog | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => setBlog(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;
  if (!blog) return <div className="container mx-auto px-4 py-20 text-center">Blog not found.</div>;

  return (
    <>
      <SEO 
        title={blog.title} 
        description={blog.excerpt} 
        image={blog.image}
        type="article"
      />
      <article className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            to="/blog" 
            className={cn(buttonVariants({ variant: "ghost" }), "mb-8 -ml-4 flex items-center w-fit")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-primary font-bold uppercase tracking-wider text-sm">{blog.category}</span>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="mr-2 h-4 w-4" /> {blog.date}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-between py-6 border-y">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {blog.author[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{blog.author}</p>
                  <p className="text-xs text-muted-foreground">Web Developer</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Twitter className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Linkedin className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </header>

          <img
            src={blog.image}
            alt={blog.title}
            className="w-full aspect-video object-cover rounded-3xl mb-12"
            referrerPolicy="no-referrer"
          />

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed italic">
              {blog.excerpt}
            </p>
            <div className="text-foreground leading-relaxed space-y-6">
              {blog.content.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <h3 className="text-2xl font-bold mt-12 mb-4">Key Takeaways</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Understanding the core principles of modern architecture.</li>
                <li>Implementing efficient data fetching strategies.</li>
                <li>Optimizing for Core Web Vitals and SEO.</li>
              </ul>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>

          <Separator className="my-16" />

          <div className="bg-muted/30 p-8 rounded-3xl text-center">
            <h3 className="text-2xl font-bold mb-4">Enjoyed this post?</h3>
            <p className="text-muted-foreground mb-8">Subscribe to my newsletter to get the latest articles directly in your inbox.</p>
            <div className="flex max-w-md mx-auto gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-grow h-12 px-4 rounded-lg border bg-background"
              />
              <Button className="h-12 px-8">Subscribe</Button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
