import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Edit2, Save, X, BookOpen, GraduationCap, Mail, Settings, Globe, LayoutDashboard, Search, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { 
  db, 
  auth, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy,
  getDoc
} from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Admin() {
  const [user, setUser] = React.useState<any>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [blogs, setBlogs] = React.useState<any[]>([]);
  const [courses, setCourses] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [subscribers, setSubscribers] = React.useState<any[]>([]);
  const [homeContent, setHomeContent] = React.useState<any>({});
  const [seoSettings, setSeoSettings] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("dashboard");

  // Form states
  const [editingBlog, setEditingBlog] = React.useState<any>(null);
  const [editingCourse, setEditingCourse] = React.useState<any>(null);
  
  const [showCourseForm, setShowCourseForm] = React.useState(false);
  const [courseFormData, setCourseFormData] = React.useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    tags: ""
  });

  const [showBlogForm, setShowBlogForm] = React.useState(false);
  const [blogFormData, setBlogFormData] = React.useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
  });

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user && user.email === "atomceatomce@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  React.useEffect(() => {
    if (!isAdmin) return;

    const unsubBlogs = onSnapshot(query(collection(db, "blogs"), orderBy("date", "desc")), (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "blogs"));

    const unsubCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "courses"));

    const unsubMessages = onSnapshot(query(collection(db, "contactMessages"), orderBy("date", "desc")), (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "contactMessages"));

    const unsubSubs = onSnapshot(query(collection(db, "newsletterSubscribers"), orderBy("date", "desc")), (snapshot) => {
      setSubscribers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "newsletterSubscribers"));

    const unsubHome = onSnapshot(doc(db, "settings", "home"), (doc) => {
      if (doc.exists()) setHomeContent(doc.data());
    }, (err) => handleFirestoreError(err, OperationType.GET, "settings/home"));

    const unsubSeo = onSnapshot(doc(db, "settings", "seo"), (doc) => {
      if (doc.exists()) setSeoSettings(doc.data());
    }, (err) => handleFirestoreError(err, OperationType.GET, "settings/seo"));

    return () => {
      unsubBlogs();
      unsubCourses();
      unsubMessages();
      unsubSubs();
      unsubHome();
      unsubSeo();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Login successful:", result.user.email);
      toast.success("Logged in successfully");
    } catch (err: any) {
      console.error("Login error details:", err);
      let errorMessage = "Login failed";
      
      if (err.code === "auth/unauthorized-domain") {
        errorMessage = "Unauthorized domain. Please add this domain to your Firebase Console Authorized Domains list.";
      } else if (err.code === "auth/popup-blocked") {
        errorMessage = "Popup blocked. Please allow popups for this site.";
      } else if (err.message) {
        errorMessage = `Login failed: ${err.message}`;
      }
      
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const handleUpdateSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "settings", "seo"), seoSettings);
      toast.success("SEO settings updated");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "settings/seo");
      toast.error("Failed to update SEO");
    }
  };

  const handleUpdateHome = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "settings", "home"), homeContent);
      toast.success("Home page content updated");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "settings/home");
      toast.error("Failed to update home content");
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const blogData = {
        ...blogFormData,
        date: new Date().toISOString().split('T')[0],
        author: "Surya"
      };

      if (editingBlog) {
        await updateDoc(doc(db, "blogs", editingBlog.id), blogData);
        toast.success("Blog updated");
      } else {
        await addDoc(collection(db, "blogs"), blogData);
        toast.success("Blog added");
      }

      setShowBlogForm(false);
      setEditingBlog(null);
      setBlogFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
      });
    } catch (err) {
      handleFirestoreError(err, editingBlog ? OperationType.UPDATE : OperationType.CREATE, "blogs");
      toast.error("Failed to save blog");
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseToSubmit = {
      ...courseFormData,
      tags: typeof courseFormData.tags === "string" 
        ? courseFormData.tags.split(",").map(t => t.trim()).filter(t => t !== "")
        : courseFormData.tags
    };
    
    try {
      if (editingCourse) {
        await updateDoc(doc(db, "courses", editingCourse.id), courseToSubmit);
        toast.success("Course updated");
      } else {
        await addDoc(collection(db, "courses"), courseToSubmit);
        toast.success("Course added");
      }

      setShowCourseForm(false);
      setEditingCourse(null);
      setCourseFormData({
        title: "",
        description: "",
        duration: "",
        price: "",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
        tags: ""
      });
    } catch (err) {
      handleFirestoreError(err, editingCourse ? OperationType.UPDATE : OperationType.CREATE, "courses");
      toast.error("Failed to save course");
    }
  };

  const startEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      image: blog.image
    });
    setShowBlogForm(true);
  };

  const startEditCourse = (course: any) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      price: course.price,
      image: course.image,
      tags: course.tags.join(", ")
    });
    setShowCourseForm(true);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteDoc(doc(db, "blogs", id));
      toast.success("Blog deleted");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `blogs/${id}`);
      toast.error("Failed to delete blog");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteDoc(doc(db, "courses", id));
      toast.success("Course deleted");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `courses/${id}`);
      toast.error("Failed to delete course");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, "contactMessages", id));
      toast.success("Message deleted");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `contactMessages/${id}`);
      toast.error("Failed to delete message");
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    try {
      await deleteDoc(doc(db, "newsletterSubscribers", id));
      toast.success("Subscriber removed");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `newsletterSubscribers/${id}`);
      toast.error("Failed to remove subscriber");
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm("This will overwrite your current home and SEO settings. Continue?")) return;
    try {
      // Seed SEO
      await setDoc(doc(db, "settings", "seo"), {
        global: {
          title: "Hello Surya IT | Advanced Developer Training",
          description: "Expert IT training in Java, Python, and Full Stack Web Development. Industry-led courses.",
          keywords: "Java, Python, Web Development, IT Training, Coding Bootcamp",
          author: "Surya",
          ogImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
        },
        pages: {
          home: { title: "Home", description: "Master your IT future with Hello Surya IT." },
          courses: { title: "Our Courses", description: "Explore our professional IT training programs." },
          blog: { title: "Blog", description: "Latest IT insights and tutorials." },
          contact: { title: "Contact Us", description: "Get in touch for professional IT training." }
        }
      });

      // Seed Home
      await setDoc(doc(db, "settings", "home"), {
        services: [
          { id: "1", title: "Expert Training", description: "Learn from industry professionals with years of real-world experience in Java and Python.", icon: "Code" },
          { id: "2", title: "Project Based", description: "Gain hands-on experience by working on live projects that simulate industry environments.", icon: "Server" },
          { id: "3", title: "Career Support", description: "Get guidance on resume building, interview preparation, and career path planning.", icon: "Zap" }
        ],
        featuredCourses: []
      });

      toast.success("Initial data seeded successfully!");
    } catch (err) {
      toast.error("Failed to seed data");
    }
  };

  if (isLoading) return <div className="p-20 text-center">Loading Admin Dashboard...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Please sign in with your authorized Google account to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full py-6 text-lg" size="lg">
              <LogIn className="mr-2 h-5 w-5" /> Sign in with Google
            </Button>
            {user && !isAdmin && (
              <p className="mt-4 text-center text-sm text-destructive font-medium">
                Access denied. This account is not authorized.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "home", label: "Home Page", icon: Settings },
    { id: "blogs", label: "Blogs", icon: BookOpen },
    { id: "courses", label: "Courses", icon: GraduationCap },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "subscribers", label: "Subscribers", icon: Search },
    { id: "seo", label: "SEO Settings", icon: Globe },
  ];

  return (
    <>
      <SEO title="Admin Dashboard" description="Manage blogs, courses, and messages for Hello Surya IT." />
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 space-y-2">
              <div className="mb-8 px-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground mt-1">Hello Surya IT</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      activeTab === tab.id 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "dashboard" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="bg-primary text-primary-foreground">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-80">Total Blogs</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">{blogs.length}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-accent text-accent-foreground">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-80">Active Courses</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">{courses.length}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-background border-2 border-primary/10">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">New Messages</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-primary">{messages.length}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-background border-2 border-accent/10">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Subscribers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-accent">{subscribers.length}</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={handleSeedData}>
                          Seed Initial Data
                        </Button>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Messages</CardTitle>
                          <CardDescription>Latest inquiries from your contact form.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {messages.slice(0, 3).map((msg) => (
                              <div key={msg.id} className="flex items-start justify-between p-4 rounded-xl bg-muted/50 border">
                                <div>
                                  <p className="font-bold text-sm">{msg.name}</p>
                                  <p className="text-xs text-muted-foreground mb-2">{msg.email}</p>
                                  <p className="text-sm line-clamp-1">{msg.message}</p>
                                </div>
                                <span className="text-[10px] text-muted-foreground">{new Date(msg.date).toLocaleDateString()}</span>
                              </div>
                            ))}
                            {messages.length === 0 && <p className="text-center py-8 text-muted-foreground">No recent messages.</p>}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeTab === "home" && (
                    <div className="space-y-8">
                      <h2 className="text-3xl font-bold">Home Page Content</h2>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Services Section</CardTitle>
                          <CardDescription>Manage the services shown on the home page.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleUpdateHome} className="space-y-8">
                            {homeContent.services?.map((service: any, index: number) => (
                              <div key={service.id || index} className="p-6 rounded-xl border bg-muted/30 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Service Title</Label>
                                    <Input 
                                      value={service.title} 
                                      onChange={(e) => {
                                        const newServices = [...homeContent.services];
                                        newServices[index].title = e.target.value;
                                        setHomeContent({...homeContent, services: newServices});
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Icon (Code, Server, Globe, Zap)</Label>
                                    <Input 
                                      value={service.icon} 
                                      onChange={(e) => {
                                        const newServices = [...homeContent.services];
                                        newServices[index].icon = e.target.value;
                                        setHomeContent({...homeContent, services: newServices});
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <Textarea 
                                    value={service.description} 
                                    onChange={(e) => {
                                      const newServices = [...homeContent.services];
                                      newServices[index].description = e.target.value;
                                      setHomeContent({...homeContent, services: newServices});
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                            
                            <div className="space-y-4">
                              <Label className="text-lg font-bold">Featured Courses (IDs)</Label>
                              <CardDescription>Enter course IDs separated by commas to show them in the "Popular Courses" section.</CardDescription>
                              <Input 
                                value={homeContent.featuredCourses?.join(", ") || ""} 
                                onChange={(e) => {
                                  const ids = e.target.value.split(",").map(id => id.trim());
                                  setHomeContent({...homeContent, featuredCourses: ids});
                                }}
                              />
                            </div>

                            <Button type="submit" className="w-full md:w-auto px-8">
                              <Save className="h-4 w-4 mr-2" /> Save Home Content
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeTab === "blogs" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold">Manage Blogs</h2>
                        {!showBlogForm && (
                          <Button onClick={() => {
                            setEditingBlog(null);
                            setBlogFormData({
                              title: "",
                              excerpt: "",
                              content: "",
                              category: "",
                              image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
                            });
                            setShowBlogForm(true);
                          }}>
                            <Plus className="h-4 w-4 mr-2" /> New Post
                          </Button>
                        )}
                      </div>

                      {showBlogForm && (
                        <Card className="border-primary/20 bg-primary/5">
                          <CardHeader>
                            <CardTitle>{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <form onSubmit={handleAddBlog} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Title</Label>
                                  <Input 
                                    value={blogFormData.title} 
                                    onChange={(e) => setBlogFormData({...blogFormData, title: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Category</Label>
                                  <Input 
                                    value={blogFormData.category} 
                                    onChange={(e) => setBlogFormData({...blogFormData, category: e.target.value})}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Excerpt</Label>
                                <Input 
                                  value={blogFormData.excerpt} 
                                  onChange={(e) => setBlogFormData({...blogFormData, excerpt: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea 
                                  value={blogFormData.content} 
                                  onChange={(e) => setBlogFormData({...blogFormData, content: e.target.value})}
                                  className="min-h-[150px]"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input 
                                  value={blogFormData.image} 
                                  onChange={(e) => setBlogFormData({...blogFormData, image: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="flex gap-4">
                                <Button type="submit">{editingBlog ? "Update Blog" : "Create Blog"}</Button>
                                <Button type="button" variant="outline" onClick={() => setShowBlogForm(false)}>Cancel</Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogs.map((blog) => (
                          <Card key={blog.id} className="overflow-hidden">
                            <img src={blog.image} className="w-full h-32 object-cover" alt="" referrerPolicy="no-referrer" />
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                              <CardTitle className="text-lg line-clamp-1">{blog.title}</CardTitle>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => startEditBlog(blog)}>
                                  <Edit2 className="h-4 w-4 text-primary" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteBlog(blog.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground line-clamp-2">
                              {blog.excerpt}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "courses" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold">Manage Courses</h2>
                        {!showCourseForm && (
                          <Button onClick={() => {
                            setEditingCourse(null);
                            setCourseFormData({
                              title: "",
                              description: "",
                              duration: "",
                              price: "",
                              image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
                              tags: ""
                            });
                            setShowCourseForm(true);
                          }}>
                            <Plus className="h-4 w-4 mr-2" /> New Course
                          </Button>
                        )}
                      </div>

                      {showCourseForm && (
                        <Card className="border-accent/20 bg-accent/5">
                          <CardHeader>
                            <CardTitle>{editingCourse ? "Edit Course" : "Add New Course"}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <form onSubmit={handleAddCourse} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Course Title</Label>
                                  <Input 
                                    value={courseFormData.title} 
                                    onChange={(e) => setCourseFormData({...courseFormData, title: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Price (e.g. ₹10,000)</Label>
                                  <Input 
                                    value={courseFormData.price} 
                                    onChange={(e) => setCourseFormData({...courseFormData, price: e.target.value})}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Duration (e.g. 3 Months)</Label>
                                  <Input 
                                    value={courseFormData.duration} 
                                    onChange={(e) => setCourseFormData({...courseFormData, duration: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Tags (comma separated)</Label>
                                  <Input 
                                    value={courseFormData.tags} 
                                    onChange={(e) => setCourseFormData({...courseFormData, tags: e.target.value})}
                                    placeholder="Java, React, MySQL"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea 
                                  value={courseFormData.description} 
                                  onChange={(e) => setCourseFormData({...courseFormData, description: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input 
                                  value={courseFormData.image} 
                                  onChange={(e) => setCourseFormData({...courseFormData, image: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="flex gap-4">
                                <Button type="submit">{editingCourse ? "Update Course" : "Add Course"}</Button>
                                <Button type="button" variant="outline" onClick={() => setShowCourseForm(false)}>Cancel</Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.map((course) => (
                          <Card key={course.id}>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  <GraduationCap className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg">{course.title}</CardTitle>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => startEditCourse(course)}>
                                  <Edit2 className="h-4 w-4 text-primary" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              <div className="flex justify-between mb-2">
                                <span>{course.price}</span>
                                <span>{course.duration}</span>
                              </div>
                              <p className="text-xs opacity-70">ID: {course.id}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "messages" && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-bold">Inquiries</h2>
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <Card key={msg.id}>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                              <div className="flex flex-col">
                                <CardTitle className="text-lg">{msg.name}</CardTitle>
                                <span className="text-xs text-muted-foreground">{msg.email}</span>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteMessage(msg.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p className="text-sm font-bold">{msg.subject}</p>
                              <p className="text-sm text-muted-foreground">{msg.message}</p>
                              <p className="text-[10px] text-muted-foreground pt-2 border-t">
                                {new Date(msg.date).toLocaleString()}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                        {messages.length === 0 && <p className="text-center py-20 text-muted-foreground">No messages found.</p>}
                      </div>
                    </div>
                  )}

                  {activeTab === "subscribers" && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-bold">Newsletter Subscribers</h2>
                      <Card>
                        <CardHeader>
                          <CardTitle>Subscriber List</CardTitle>
                          <CardDescription>All emails registered for the newsletter.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {subscribers.map((sub) => (
                              <div key={sub.id} className="p-3 rounded-lg bg-muted/50 border flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <Mail className="h-4 w-4 text-primary" />
                                  <span className="text-sm">{sub.email}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteSubscriber(sub.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ))}
                            {subscribers.length === 0 && <p className="text-center py-8 text-muted-foreground">No subscribers yet.</p>}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeTab === "seo" && (
                    <div className="space-y-8">
                      <h2 className="text-3xl font-bold">SEO Settings</h2>
                      
                      {/* Global SEO */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Global SEO Configuration</CardTitle>
                          <CardDescription>Default settings for the entire website.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleUpdateSeo} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label>Site Title</Label>
                                <Input 
                                  value={seoSettings.global?.title || ""} 
                                  onChange={(e) => setSeoSettings({...seoSettings, global: {...seoSettings.global, title: e.target.value}})}
                                  placeholder="Main site title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Author Name</Label>
                                <Input 
                                  value={seoSettings.global?.author || ""} 
                                  onChange={(e) => setSeoSettings({...seoSettings, global: {...seoSettings.global, author: e.target.value}})}
                                  placeholder="Site author"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Meta Description</Label>
                              <Textarea 
                                value={seoSettings.global?.description || ""} 
                                onChange={(e) => setSeoSettings({...seoSettings, global: {...seoSettings.global, description: e.target.value}})}
                                placeholder="Brief site description"
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Keywords (comma separated)</Label>
                              <Input 
                                value={seoSettings.global?.keywords || ""} 
                                onChange={(e) => setSeoSettings({...seoSettings, global: {...seoSettings.global, keywords: e.target.value}})}
                                placeholder="java, python, training..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>OG Image URL</Label>
                              <Input 
                                value={seoSettings.global?.ogImage || ""} 
                                onChange={(e) => setSeoSettings({...seoSettings, global: {...seoSettings.global, ogImage: e.target.value}})}
                                placeholder="https://..."
                              />
                            </div>
                            <Button type="submit" className="w-full md:w-auto px-8">
                              <Save className="h-4 w-4 mr-2" /> Save Global Settings
                            </Button>
                          </form>
                        </CardContent>
                      </Card>

                      {/* Per-Page SEO */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {["home", "courses", "blog", "contact"].map((page) => (
                          <Card key={page}>
                            <CardHeader>
                              <CardTitle className="capitalize">{page} Page SEO</CardTitle>
                              <CardDescription>Specific SEO for the {page} page.</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <form onSubmit={handleUpdateSeo} className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Page Title</Label>
                                  <Input 
                                    value={seoSettings.pages?.[page]?.title || ""} 
                                    onChange={(e) => setSeoSettings({
                                      ...seoSettings, 
                                      pages: {
                                        ...seoSettings.pages,
                                        [page]: { ...seoSettings.pages?.[page], title: e.target.value }
                                      }
                                    })}
                                    placeholder="Page specific title"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Meta Description</Label>
                                  <Textarea 
                                    value={seoSettings.pages?.[page]?.description || ""} 
                                    onChange={(e) => setSeoSettings({
                                      ...seoSettings, 
                                      pages: {
                                        ...seoSettings.pages,
                                        [page]: { ...seoSettings.pages?.[page], description: e.target.value }
                                      }
                                    })}
                                    placeholder="Page specific description"
                                    className="min-h-[80px]"
                                  />
                                </div>
                                <Button type="submit" variant="outline" size="sm" className="w-full">
                                  <Save className="h-4 w-4 mr-2" /> Save {page} SEO
                                </Button>
                              </form>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
