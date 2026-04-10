import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Edit2, Save, X, BookOpen, GraduationCap, Mail, Settings, Globe, LayoutDashboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { SEO } from "@/lib/seo";
import { cn } from "@/lib/utils";

export default function Admin() {
  const [blogs, setBlogs] = React.useState<any[]>([]);
  const [courses, setCourses] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [seoSettings, setSeoSettings] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("dashboard");

  const fetchData = async () => {
    try {
      const [blogsRes, coursesRes, messagesRes, seoRes] = await Promise.all([
        fetch("/api/blogs"),
        fetch("/api/courses"),
        fetch("/api/contact-messages"),
        fetch("/api/seo-settings")
      ]);
      const [blogsData, coursesData, messagesData, seoData] = await Promise.all([
        blogsRes.json(),
        coursesRes.json(),
        messagesRes.json(),
        seoRes.json()
      ]);
      setBlogs(blogsData);
      setCourses(coursesData);
      setMessages(messagesData);
      setSeoSettings(seoData);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/seo-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoSettings)
      });
      if (res.ok) {
        toast.success("SEO settings updated");
      }
    } catch (err) {
      toast.error("Failed to update SEO");
    }
  };

  const handleAddBlog = async () => {
    const newBlog = {
      title: "New Blog Post",
      excerpt: "Short description...",
      content: "Full content here...",
      category: "General",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
    };
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog)
      });
      if (res.ok) {
        toast.success("Blog added");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to add blog");
    }
  };

  const handleAddCourse = async () => {
    const newCourse = {
      title: "New Course",
      description: "Course description...",
      duration: "3 Months",
      price: "₹10,000",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      tags: ["Tech"]
    };
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        toast.success("Course added");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to add course");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog deleted");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Course deleted");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/contact-messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  if (isLoading) return <div className="p-20 text-center">Loading Admin Dashboard...</div>;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "blogs", label: "Blogs", icon: BookOpen },
    { id: "courses", label: "Courses", icon: GraduationCap },
    { id: "messages", label: "Messages", icon: Mail },
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
              <div className="mb-8 px-4">
                <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
                <p className="text-xs text-muted-foreground mt-1">Hello Surya IT Management</p>
              </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                  {activeTab === "blogs" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold">Manage Blogs</h2>
                        <Button onClick={handleAddBlog}>
                          <Plus className="h-4 w-4 mr-2" /> New Post
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogs.map((blog) => (
                          <Card key={blog.id} className="overflow-hidden">
                            <img src={blog.image} className="w-full h-32 object-cover" alt="" />
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                              <CardTitle className="text-lg line-clamp-1">{blog.title}</CardTitle>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteBlog(blog.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
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
                        <Button onClick={handleAddCourse}>
                          <Plus className="h-4 w-4 mr-2" /> New Course
                        </Button>
                      </div>
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
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              <div className="flex justify-between">
                                <span>{course.price}</span>
                                <span>{course.duration}</span>
                              </div>
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
                                  <Label>Page Description</Label>
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
