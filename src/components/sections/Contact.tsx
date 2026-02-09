import React from 'react';
import { ContactContentSchema } from '../../types/schema';
import { z } from 'zod';
import { InlineText } from '../admin/InlineText';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

type Content = z.infer<typeof ContactContentSchema>;

interface ContactProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Contact: React.FC<ContactProps> = ({ content, isEditing, onUpdate }) => {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      {/* Contact Info */}
      <div className="space-y-8">
        <div>
          <InlineText
            tagName="h2"
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-4"
            value={content.title}
            isEditing={isEditing}
            onUpdate={(val) => onUpdate && onUpdate({ title: val })}
          />
          {content.subtitle && (
            <InlineText
              tagName="p"
              className="text-xl text-muted-foreground"
              value={content.subtitle}
              isEditing={isEditing}
              onUpdate={(val) => onUpdate && onUpdate({ subtitle: val })}
            />
          )}
        </div>

        <div className="space-y-6">
          {content.email && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <InlineText
                  tagName="p"
                  className="text-foreground font-semibold"
                  value={content.email}
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate && onUpdate({ email: val })}
                />
              </div>
            </div>
          )}

          {content.phone && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <InlineText
                  tagName="p"
                  className="text-foreground font-semibold"
                  value={content.phone}
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate && onUpdate({ phone: val })}
                />
              </div>
            </div>
          )}

          {content.address && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <InlineText
                  tagName="p"
                  className="text-foreground font-semibold"
                  value={content.address}
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate && onUpdate({ address: val })}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First Name</label>
                <Input placeholder="John" />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last Name</label>
                <Input placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <Input type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="How can we help you?"
              />
            </div>
            <Button type="submit" className="w-full">
              <InlineText
                tagName="span"
                value={content.submitButtonText}
                isEditing={isEditing}
                onUpdate={(val) => onUpdate && onUpdate({ submitButtonText: val })}
              />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
