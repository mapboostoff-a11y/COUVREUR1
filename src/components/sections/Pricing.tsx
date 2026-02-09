import React from 'react';
import { PricingContentSchema } from '../../types/schema';
import { z } from 'zod';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { InlineText } from '../admin/InlineText';
import { LinkEditor } from '../admin/LinkEditor';

type Content = z.infer<typeof PricingContentSchema>;

interface PricingProps {
  content: Content;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Content>) => void;
}

const Pricing: React.FC<PricingProps> = ({ content, isEditing, onUpdate }) => {
  const handlePlanUpdate = (index: number, field: string, value: string) => {
    if (!onUpdate) return;
    const newPlans = [...content.plans];
    // @ts-ignore
    newPlans[index] = { ...newPlans[index], [field]: value };
    onUpdate({ plans: newPlans });
  };
  
  const handleCtaUpdate = (index: number, value: string) => {
      if (!onUpdate) return;
      const newPlans = [...content.plans];
      newPlans[index] = { ...newPlans[index], cta: { ...newPlans[index].cta, text: value } };
      onUpdate({ plans: newPlans });
  }

  const handleCtaLinkUpdate = (index: number, updates: any) => {
      if (!onUpdate) return;
      const newPlans = [...content.plans];
      newPlans[index] = { ...newPlans[index], cta: { ...newPlans[index].cta, ...updates } };
      onUpdate({ plans: newPlans });
  }

  const handleFeatureUpdate = (planIndex: number, featureIndex: number, value: string) => {
    if (!onUpdate) return;
    const newPlans = [...content.plans];
    const newFeatures = [...newPlans[planIndex].features];
    newFeatures[featureIndex] = value;
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures };
    onUpdate({ plans: newPlans });
  }

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <InlineText
          tagName="h2"
          className="text-3xl font-bold tracking-tight"
          value={content.title}
          isEditing={isEditing}
          onUpdate={(val) => onUpdate?.({ title: val })}
        />
        {content.description && (
          <InlineText
            tagName="p"
            className="text-lg text-muted-foreground"
            value={content.description}
            isEditing={isEditing}
            onUpdate={(val) => onUpdate?.({ description: val })}
          />
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {content.plans.map((plan, idx) => (
          <div 
            key={idx} 
            className={cn(
              "rounded-2xl p-8 border bg-card relative",
              plan.highlight 
                ? "border-primary shadow-xl scale-105 z-10" 
                : "border-border shadow-sm"
            )}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            <InlineText
              tagName="h3"
              className="text-xl font-semibold mb-2"
              value={plan.name}
              isEditing={isEditing}
              onUpdate={(val) => handlePlanUpdate(idx, 'name', val)}
            />
            <div className="flex items-baseline gap-1 mb-6">
              <InlineText
                tagName="span"
                className="text-4xl font-bold"
                value={plan.price}
                isEditing={isEditing}
                onUpdate={(val) => handlePlanUpdate(idx, 'price', val)}
              />
              {plan.period && (
                <InlineText
                  tagName="span"
                  className="text-muted-foreground"
                  value={plan.period}
                  isEditing={isEditing}
                  onUpdate={(val) => handlePlanUpdate(idx, 'period', val)}
                />
              )}
            </div>
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-green-500 shrink-0" />
                  <InlineText
                    tagName="span"
                    value={feat}
                    isEditing={isEditing}
                    onUpdate={(val) => handleFeatureUpdate(idx, i, val)}
                  />
                </li>
              ))}
            </ul>

            <div className="relative group">
                <a
                  href={plan.cta.url}
                  target={plan.cta.external ? "_blank" : undefined}
                  rel={plan.cta.external ? "noopener noreferrer" : undefined}
                  onClick={(e) => isEditing && e.preventDefault()}
                  className={cn(
                    "block w-full py-3 rounded-lg font-medium text-center transition-colors",
                    plan.highlight || plan.cta.variant === 'primary'
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  )}
                >
                  <InlineText
                      tagName="span"
                      value={plan.cta.text}
                      isEditing={isEditing}
                      onUpdate={(val) => handleCtaUpdate(idx, val)}
                  />
                </a>
                {isEditing && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex z-50 w-64">
                        <LinkEditor 
                            link={plan.cta} 
                            onUpdate={(updates) => handleCtaLinkUpdate(idx, updates)} 
                        />
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
