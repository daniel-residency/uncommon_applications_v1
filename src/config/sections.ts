import { Section } from "@/lib/types";

export const SECTIONS: Section[] = [
  {
    id: "about-you",
    title: "About You",
    questions: [
      {
        id: "citizenship",
        label: "what is your country of citizenship?",
        type: "country",
        required: true,
      },
      {
        id: "locations",
        label: "Which Residency locations are you open to?",
        type: "multi_checkbox",
        required: true,
        helpText: "select all that apply",
        options: [
          { label: "San Francisco, CA", value: "San Francisco, CA" },
          { label: "New York, NY", value: "New York, NY" },
          { label: "Vienna, Austria", value: "Vienna, Austria" },
          { label: "Berkeley, CA", value: "Berkeley, CA" },
          { label: "Bangalore, India", value: "Bangalore, India" },
          { label: "Cambridge, MA", value: "Cambridge, MA" },
          { label: "Ithaca, NY", value: "Ithaca, NY" },
          { label: "London, UK", value: "London, UK" },
        ],
      },
      {
        id: "accomplishments",
        label: "what are 2 things you are most proud of?",
        type: "textarea",
        required: true,
        placeholder: "two things you're most proud of...",
      },
    ],
  },
  {
    id: "your-work",
    title: "Your Work",
    questions: [
      {
        id: "pitch",
        label:
          "describe what you're building or investigating in 50 characters or less.",
        type: "short_text",
        required: true,
        maxLength: 50,
        placeholder: "e.g. AI-powered legal document review",
      },
      {
        id: "details",
        label:
          "add any details that we might be interested in that you couldn't fit in 50 characters.",
        type: "textarea",
        required: true,
        placeholder: "anything you couldn't fit above...",
      },
      {
        id: "project_link",
        label:
          "link to your work (if available, nw if you don't have one)",
        type: "url",
        required: false,
        placeholder: "https://",
      },
      {
        id: "demo_video",
        label:
          "demo video (if available, nw if you don't have one)",
        type: "url",
        required: false,
        placeholder: "https://",
      },
    ],
  },
  {
    id: "why-this-idea",
    title: "Why This Idea",
    questions: [
      {
        id: "why_this",
        label: "why did you pick this to work on?",
        type: "textarea",
        required: true,
        placeholder: "what drew you to this?",
      },
      {
        id: "how_know_needed",
        label: "how do you know the world needs what you're making?",
        type: "textarea",
        required: true,
        placeholder: "what evidence do you have?",
      },
    ],
  },
  {
    id: "progress",
    title: "Progress",
    questions: [
      {
        id: "how_far",
        label: "have you hit any milestones yet? if so, which ones?",
        type: "textarea",
        required: true,
        placeholder: "describe your most significant milestones...",
      },
      {
        id: "duration",
        label:
          "How long have you been working on this, and how much has been full-time, if any?",
        type: "textarea",
        required: true,
      },
      {
        id: "has_users",
        label: "are people using what you're building?",
        type: "yes_no",
        required: true,
      },
      {
        id: "user_count",
        label: "roughly how many?",
        type: "short_text",
        required: true,
        conditional: {
          dependsOn: "has_users",
          showWhen: "yes",
        },
      },
      {
        id: "has_revenue",
        label: "do you have revenue?",
        type: "yes_no",
        required: true,
      },
      {
        id: "revenue_amount",
        label: "roughly how much?",
        type: "short_text",
        required: true,
        conditional: {
          dependsOn: "has_revenue",
          showWhen: "yes",
        },
      },
    ],
  },
  {
    id: "competition",
    title: "Competition & Business Model",
    questions: [
      {
        id: "competitors",
        label: "who else is doing something similar to you?",
        type: "textarea",
        required: true,
      },
      {
        id: "unique_insight",
        label: "what do you understand that they don't?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "the-residency",
    title: "The Residency",
    questions: [
      {
        id: "what_need",
        label:
          "what do you need most right now to make meaningful progress on your work?",
        type: "textarea",
        required: true,
      },
      {
        id: "how_helps",
        label:
          "how can the residency help you move the needle on your goals?",
        type: "textarea",
        required: true,
      },
      {
        id: "looking_cofounder",
        label: "are you looking for a cofounder?",
        type: "yes_no",
        required: true,
      },
    ],
  },
  {
    id: "funding",
    title: "Funding",
    questions: [
      {
        id: "has_investment",
        label: "Have you taken any investment?",
        type: "yes_no",
        required: true,
      },
      {
        id: "focus_area",
        label:
          "Will you be more focused on fundraising or building at the beginning of the cohort?",
        type: "select",
        required: true,
        options: [
          { label: "Fundraising", value: "fundraising" },
          { label: "Building", value: "building" },
        ],
      },
    ],
  },
  {
    id: "past-programs",
    title: "Past Programs",
    questions: [
      {
        id: "accelerators",
        label:
          "Have you participated in any incubators, accelerators, or pre-accelerators? If so which ones?",
        type: "textarea",
        required: true,
        placeholder: "List any programs you've been part of, or write N/A",
      },
      {
        id: "had_roommates",
        label: "Have you had roommates besides your family before?",
        type: "yes_no",
        required: true,
      },
      {
        id: "applied_before",
        label: "Have you applied to the Residency before?",
        type: "yes_no",
        required: true,
      },
      {
        id: "same_thing",
        label: "Are you working on the same thing?",
        type: "yes_no",
        required: true,
        conditional: {
          dependsOn: "applied_before",
          showWhen: "yes",
        },
      },
      {
        id: "what_changed",
        label: "What changed since last time?",
        type: "textarea",
        required: true,
        conditional: {
          dependsOn: "same_thing",
          showWhen: "yes",
        },
      },
      {
        id: "why_pivot",
        label: "Why did you pivot, and what did you learn?",
        type: "textarea",
        required: true,
        conditional: {
          dependsOn: "same_thing",
          showWhen: "no",
        },
      },
    ],
  },
  {
    id: "how-found-us",
    title: "How You Found Us",
    questions: [
      {
        id: "how_heard",
        label: "how did you hear about the residency?",
        type: "select",
        required: true,
        options: [
          { label: "Instagram", value: "instagram" },
          { label: "Twitter", value: "twitter" },
          { label: "LinkedIn", value: "linkedin" },
          { label: "Email", value: "email" },
          { label: "Word of Mouth", value: "word_of_mouth" },
          { label: "Other", value: "other" },
        ],
      },
      {
        id: "what_convinced",
        label: "what convinced you to apply? did someone encourage you?",
        type: "textarea",
        required: true,
      },
    ],
  },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

export function getSectionIndex(sectionId: string): number {
  return SECTIONS.findIndex((s) => s.id === sectionId);
}

export function getNextSection(sectionId: string): string | null {
  const idx = getSectionIndex(sectionId);
  if (idx === -1 || idx >= SECTIONS.length - 1) return null;
  return SECTIONS[idx + 1].id;
}

export function getPrevSection(sectionId: string): string | null {
  const idx = getSectionIndex(sectionId);
  if (idx <= 0) return null;
  return SECTIONS[idx - 1].id;
}
