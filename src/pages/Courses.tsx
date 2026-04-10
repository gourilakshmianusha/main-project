import React from "react";
import { motion } from "motion/react";
import { BookOpen, Clock, Search, GraduationCap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEO } from "@/lib/seo";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Courses() {
  const [courses, setCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, "courses");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(filter.toLowerCase()) ||
    (c.tags && c.tags.some((t: string) => t.toLowerCase().includes(filter.toLowerCase())))
  );

  return (
    <>
      <SEO pageId="courses" />
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our Courses</h1>
            <p className="text-xl text-muted-foreground">
              Industry-aligned training programs designed to help you master the most in-demand technical skills.
            </p>
          </div>

          <div className="relative max-w-md mb-12">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by course or technology..." 
              className="pl-10 h-12 bg-background"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
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
              {filteredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex flex-col border rounded-2xl bg-background overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1">
                        {course.price}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 flex-grow">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {course.duration}
                      </div>
                      <Link 
                        to="/contact" 
                        className={cn(buttonVariants({ size: "sm" }))}
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredCourses.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No courses found matching your search.</p>
            </div>
          )}

          <div className="mt-20 p-8 md:p-12 rounded-3xl bg-primary text-primary-foreground text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Need Career Guidance?</h2>
            <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto">
              Not sure which course is right for you? Talk to our experts for a free career counseling session.
            </p>
            <Link 
              to="/contact" 
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-14 px-8 text-lg")}
            >
              Contact Counselor
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
