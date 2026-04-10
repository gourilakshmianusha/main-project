import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Code, Server, Globe, Zap, CheckCircle2, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32 grid-bg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Star className="h-4 w-4 fill-primary" />
            <span>Professional IT Training & Development</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-text text-6xl md:text-8xl font-bold mb-8 tracking-tighter"
          >
            Master Your <br />
            <span className="text-muted-foreground">IT Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl"
          >
            We provide industry-leading training in Java, Python, and Full Stack Development. Join our expert-led courses and transform your career with hands-on projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              to="/courses" 
              className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg")}
            >
              Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact" 
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-lg")}
            >
              Let's Talk
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const [services, setServices] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/home-content")
      .then(res => res.json())
      .then(data => setServices(data.services || []))
      .catch(() => {});
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
              key={service.id}
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
    const loadFeatured = async () => {
      try {
        const [homeRes, coursesRes] = await Promise.all([
          fetch("/api/home-content"),
          fetch("/api/courses")
        ]);
        const homeData = await homeRes.json();
        const coursesData = await coursesRes.json();
        
        const featured = coursesData.filter((c: any) => 
          homeData.featuredCourses?.includes(c.id)
        );
        setFeaturedCourses(featured);
      } catch (err) {}
    };
    loadFeatured();
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
          {featuredCourses.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border bg-muted"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-primary font-medium mb-2">{project.tags?.[0] || "Course"}</span>
                <h3 className="text-white text-3xl font-bold mb-4">{project.title}</h3>
                <Link 
                  to="/courses" 
                  className={cn(buttonVariants({ variant: "secondary" }), "w-fit")}
                >
                  View Details
                </Link>
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
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to boost your career?</h2>
          <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto">
            Join our next batch and learn from industry experts. Limited seats available for our upcoming Java and Python courses.
          </p>
          <Link 
            to="/contact" 
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-14 px-8 text-lg")}
          >
            Enroll Now
          </Link>
        </div>
      </section>
    </>
  );
}
