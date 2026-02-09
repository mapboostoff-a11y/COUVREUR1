import { describe, it, expect } from 'vitest';
import { SectionSchema, LandingPageConfigSchema } from '../types/schema';

describe('JSON Schema Validation', () => {
  it('should validate a correct hero section', () => {
    const heroSection = {
      id: '123',
      type: 'hero',
      settings: {
        visible: true,
        paddingTop: 'md',
        paddingBottom: 'md',
        backgroundColor: 'white',
        container: true,
      },
      content: {
        headline: 'Test Headline',
        subheadline: 'Test Subheadline',
        alignment: 'center',
        cta: []
      }
    };

    const result = SectionSchema.safeParse(heroSection);
    expect(result.success).toBe(true);
  });

  it('should fail validation for invalid section type', () => {
    const invalidSection = {
      id: '123',
      type: 'invalid-type', // Error
      content: {}
    };

    const result = SectionSchema.safeParse(invalidSection);
    expect(result.success).toBe(false);
  });

  it('should validate the full config structure', () => {
    const config = {
      meta: {
        title: "Test Page",
        description: "Test Description"
      },
      theme: {
        colors: {
          primary: "#000",
          secondary: "#fff",
          background: "#fff",
          text: "#000"
        },
        fonts: {
          heading: "Inter",
          body: "Inter"
        }
      },
      sections: []
    };

    const result = LandingPageConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });
});
