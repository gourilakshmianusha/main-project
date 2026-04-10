import React from "react";
import { motion } from "motion/react";
import { Mail, Phone, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { SEO } from "@/lib/seo";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        date: new Date().toISOString()
      });
      
      toast.success("Message received! I'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "contactMessages");
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO pageId="contact" />
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Get in Touch</h1>
                  <p className="text-xl text-muted-foreground mb-12">
                    Have questions about our courses or need career guidance? 
                    Our team is here to help you navigate your IT journey.
                  </p>

                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Email Us</h3>
                        <p className="text-muted-foreground">hello@hellosurya.com</p>
                        <p className="text-muted-foreground">support@hellosurya.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Call Us</h3>
                        <p className="text-muted-foreground">9989581311</p>
                        <p className="text-muted-foreground">Mon - Sat, 9am - 6pm</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-2 border-primary/10 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                      <MessageSquare className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">Send a Message</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            placeholder="John Doe" 
                            className="h-12"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            className="h-12"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="Course Inquiry" 
                          className="h-12"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="How can we help you?" 
                          className="min-h-[150px] py-4"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required 
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-14 text-lg font-bold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                        <Send className="ml-2 h-5 w-5" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
