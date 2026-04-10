import React from "react";
import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Blog() {
  const [blogs, setBlogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "blogs"), orderBy("date", "desc")), (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, "blogs");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <SEO pageId="blog" />
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, tutorials, and news from the world of software development and IT training.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col bg-background border rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
                >
                  <Link to={`/blog/${post.id}`} className="block aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-6 border-t flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="mr-1 h-3 w-3" />
                        {post.author}
                      </div>
                      <Link 
                        to={`/blog/${post.id}`} 
                        className="text-primary text-sm font-bold flex items-center hover:gap-2 transition-all"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {blogs.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No blog posts found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
