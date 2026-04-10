import React from "react";
import { motion } from "motion/react";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export default function Blog() {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/blogs")
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(true); // Set to true to simulate loading if needed, but here we just set data
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO pageId="blog" />
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Blog</h1>
            <p className="text-xl text-muted-foreground">
              Thoughts, tutorials, and insights on modern web development and technology.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-video rounded-2xl mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((blog, i) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${blog.id}`} className="block mb-6 overflow-hidden rounded-2xl border">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="secondary">{blog.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" /> {blog.date}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${blog.id}`} 
                    className={cn(buttonVariants({ variant: "ghost" }), "p-0 h-auto hover:bg-transparent hover:text-primary flex items-center")}
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
