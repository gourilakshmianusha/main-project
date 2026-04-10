import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Blog Data
  const blogs = [
    {
      id: "1",
      title: "Mastering React 19: What's New?",
      excerpt: "Explore the latest features in React 19 and how they improve web development efficiency.",
      content: "React 19 brings a host of new features including better support for concurrent rendering, improved hooks, and more...",
      date: "2024-03-15",
      author: "Surya",
      category: "Frontend",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "2",
      title: "Building Scalable Backends with Node.js",
      excerpt: "Learn the best practices for creating robust and scalable server-side applications.",
      content: "Scalability is key in modern web apps. Using Express and Node.js effectively requires understanding middleware...",
      date: "2024-03-10",
      author: "Surya",
      category: "Backend",
      image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "3",
      title: "SEO Strategies for Modern Web Apps",
      excerpt: "How to ensure your single-page application is discoverable by search engines.",
      content: "SEO in SPAs can be tricky. We'll look at server-side rendering, meta tag management, and structured data...",
      date: "2024-03-05",
      author: "Surya",
      category: "SEO",
      image: "https://images.unsplash.com/photo-1562577353-f5d4030c366c?q=80&w=800&auto=format&fit=crop"
    }
  ];

  // Mock Courses Data
  const courses = [
    {
      id: "1",
      title: "Java Full Stack Development",
      description: "Comprehensive training from core Java to advanced Spring Boot and React integration for enterprise apps.",
      duration: "4 Months",
      price: "₹15,000",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      tags: ["Java", "Spring Boot", "React", "MySQL"]
    },
    {
      id: "2",
      title: "Python Data Science & AI",
      description: "Master Python programming, data analysis, and machine learning with real-world industry projects.",
      duration: "3 Months",
      price: "₹12,000",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
      tags: ["Python", "Pandas", "Scikit-Learn", "AI"]
    },
    {
      id: "3",
      title: "Modern Web Development",
      description: "Learn modern web technologies like Next.js, Node.js, and Tailwind CSS to build high-performance websites.",
      duration: "3 Months",
      price: "₹10,000",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      tags: ["Next.js", "Node.js", "Tailwind", "MongoDB"]
    },
    {
      id: "4",
      title: "C & C++ Programming",
      description: "Master the fundamentals of programming with C and C++. Perfect for building strong logic and understanding memory management.",
      duration: "2 Months",
      price: "₹5,000",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
      tags: ["C", "C++", "Data Structures", "Algorithms"]
    },
    {
      id: "5",
      title: "UI/UX Design",
      description: "Learn to design beautiful and user-friendly interfaces with Figma and Adobe XD.",
      duration: "2 Months",
      price: "₹8,000",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop",
      tags: ["Figma", "UI Design", "UX Research", "Prototyping"]
    },
    {
      id: "6",
      title: "Digital Marketing",
      description: "Master SEO, SEM, Social Media Marketing, and Content Strategy to grow any business online.",
      duration: "2 Months",
      price: "₹7,000",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      tags: ["SEO", "Google Ads", "Social Media", "Analytics"]
    }
  ];

  // API Routes
  app.get("/api/courses", (req, res) => {
    res.json(courses);
  });

  app.post("/api/courses", (req, res) => {
    const newCourse = {
      id: Date.now().toString(),
      ...req.body
    };
    courses.push(newCourse);
    res.status(201).json(newCourse);
  });

  app.put("/api/courses/:id", (req, res) => {
    const index = courses.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...req.body };
      res.json(courses[index]);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  });

  app.delete("/api/courses/:id", (req, res) => {
    const index = courses.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
      const deleted = courses.splice(index, 1);
      res.json(deleted[0]);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  });

  app.get("/api/blogs", (req, res) => {
    res.json(blogs);
  });

  app.post("/api/blogs", (req, res) => {
    const newBlog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      author: "Surya",
      ...req.body
    };
    blogs.push(newBlog);
    res.status(201).json(newBlog);
  });

  app.put("/api/blogs/:id", (req, res) => {
    const index = blogs.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
      blogs[index] = { ...blogs[index], ...req.body };
      res.json(blogs[index]);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  });

  app.delete("/api/blogs/:id", (req, res) => {
    const index = blogs.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
      const deleted = blogs.splice(index, 1);
      res.json(deleted[0]);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  });

  app.get("/api/blogs/:id", (req, res) => {
    const blog = blogs.find(b => b.id === req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  });

  // Contact Messages Storage
  const contactMessages: any[] = [];

  app.get("/api/contact-messages", (req, res) => {
    res.json(contactMessages);
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    const newMessage = {
      id: (contactMessages.length + 1).toString(),
      name,
      email,
      subject,
      message,
      date: new Date().toISOString()
    };
    contactMessages.push(newMessage);
    console.log("Contact form submission stored:", newMessage);
    res.json({ success: true, message: "Message received! I'll get back to you soon." });
  });

  app.delete("/api/contact-messages/:id", (req, res) => {
    const index = contactMessages.findIndex(m => m.id === req.params.id);
    if (index !== -1) {
      contactMessages.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  });

  // Newsletter Storage
  const newsletterSubscribers: string[] = [];

  app.get("/api/newsletter-subscribers", (req, res) => {
    res.json(newsletterSubscribers);
  });

  app.post("/api/newsletter", (req, res) => {
    const { email } = req.body;
    if (email && !newsletterSubscribers.includes(email)) {
      newsletterSubscribers.push(email);
    }
    console.log("Newsletter subscription:", email);
    res.json({ success: true, message: "Subscribed successfully!" });
  });

  // Home Page Content Storage
  let homeContent: any = {
    services: [
      {
        id: "1",
        title: "Expert Training",
        description: "Learn from industry professionals with years of real-world experience in Java and Python.",
        icon: "Code"
      },
      {
        id: "2",
        title: "Project Based",
        description: "Gain hands-on experience by working on live projects that simulate industry environments.",
        icon: "Server"
      },
      {
        id: "3",
        title: "Career Support",
        description: "Get guidance on resume building, interview preparation, and career path planning.",
        icon: "Zap"
      }
    ],
    featuredCourses: ["1", "2"] // IDs of courses to feature
  };

  app.get("/api/home-content", (req, res) => {
    res.json(homeContent);
  });

  app.post("/api/home-content", (req, res) => {
    homeContent = { ...homeContent, ...req.body };
    res.json(homeContent);
  });

  // SEO Settings Storage
  let seoSettings: any = {
    global: {
      title: "Hello Surya IT | Advanced Developer Training",
      description: "Expert IT training in Java, Python, and Full Stack Web Development. Industry-led courses.",
      keywords: "Java, Python, Web Development, IT Training, Coding Bootcamp",
      author: "Surya",
      ogImage: "https://hellosurya.com/og-image.jpg"
    },
    pages: {
      home: { title: "Home", description: "Master your IT future with Hello Surya IT." },
      courses: { title: "Our Courses", description: "Explore our professional IT training programs." },
      blog: { title: "Blog", description: "Latest IT insights and tutorials." },
      contact: { title: "Contact Us", description: "Get in touch for professional IT training." }
    }
  };

  app.get("/api/seo-settings", (req, res) => {
    res.json(seoSettings);
  });

  app.post("/api/seo-settings", (req, res) => {
    seoSettings = { ...seoSettings, ...req.body };
    res.json(seoSettings);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
