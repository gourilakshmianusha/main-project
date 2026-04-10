import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/lib/seo";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `blogs/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading post...</div>;
  if (!post) return <div className="p-20 text-center">Post not found.</div>;

  return (
    <>
      <SEO 
        title={`${post.title} | Hello Surya IT Blog`} 
        description={post.excerpt} 
      />
      <article className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {post.author}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">
                {post.title}
              </h1>

              <div className="aspect-video rounded-3xl overflow-hidden mb-12 border">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-lg">
                  {post.content}
                </div>
              </div>

              <div className="mt-16 pt-8 border-t flex items-center justify-between">
                <div className="flex gap-4">
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </article>
    </>
  );
}
