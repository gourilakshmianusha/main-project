import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Code, Server, Zap, Globe, GraduationCap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, doc, getDocs, query, where, documentId } from "firebase/firestore";

import { Badge } from "@/components/ui/badge";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              #1 IT Training Institute
            </Badge>
            <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
              Master Your <span className="text-primary">IT Future</span> with Hello Surya IT
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
              Industry-led training in Java, Python, and Full Stack Development. 
              Gain real-world skills and launch your career in tech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/courses" 
                className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg shadow-xl shadow-primary/20")}
              >
                Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/contact" 
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-lg")}
              >
                Book Free Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const [services, setServices] = React.useState<any[]>([]);

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "home"), (doc) => {
      if (doc.exists()) {
        setServices(doc.data().services || []);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, "settings/home"));
    return () => unsub();
  }, []);

  const iconMap: Record<string, any> = {
    Code: <Code className="h-10 w-10 text-primary" />,
    Server: <Server className="h-10 w-10 text-primary" />,
    Globe: <Globe className="h-10 w-10 text-primary" />,
    Zap: <Zap className="h-10 w-10 text-primary" />,
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Specialized Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Focused on delivering quality code and exceptional user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl border bg-background hover:shadow-xl transition-all"
            >
              <div className="mb-6">{iconMap[service.icon] || <Code className="h-10 w-10 text-primary" />}</div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedWork = () => {
  const [featuredCourses, setFeaturedCourses] = React.useState<any[]>([]);

  React.useEffect(() => {
    const unsubHome = onSnapshot(doc(db, "settings", "home"), async (homeDoc) => {
      if (homeDoc.exists()) {
        const homeData = homeDoc.data();
        const courseIds = homeData.featuredCourses || [];
        
        if (courseIds.length > 0) {
          const q = query(collection(db, "courses"), where(documentId(), "in", courseIds));
          const coursesSnap = await getDocs(q);
          setFeaturedCourses(coursesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setFeaturedCourses([]);
        }
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, "settings/home"));

    return () => unsubHome();
  }, []);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Popular Courses</h2>
            <p className="text-muted-foreground">Our most in-demand professional training programs.</p>
          </div>
          <Link 
            to="/courses" 
            className={cn(buttonVariants({ variant: "ghost" }), "hidden md:flex")}
          >
            View All Courses <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[16/10] rounded-3xl overflow-hidden border bg-muted"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <div className="flex gap-2 mb-4">
                  {course.tags?.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} className="bg-white/20 text-white border-white/20 backdrop-blur-md">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">{course.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 font-medium">{course.duration}</span>
                  <Link 
                    to="/courses" 
                    className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <SEO pageId="home" />
      <Hero />
      <Services />
      <FeaturedWork />
      
      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to start your tech journey?</h2>
            <p className="text-xl opacity-80 mb-12 leading-relaxed">
              Join hundreds of successful students who have transformed their careers with Hello Surya IT. 
              Get industry-ready skills today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/contact" 
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-14 px-8 text-lg")}
              >
                Enroll Now
              </Link>
              <Link 
                to="/courses" 
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-lg border-white/20 hover:bg-white/10")}
              >
                View Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
