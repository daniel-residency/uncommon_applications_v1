import { Section } from "@/lib/types";

export const SECTIONS: Section[] = [
  {
    id: "about-you",
    title: "About You",
    questions: [
      {
        id: "citizenship",
        label: "What is your country of citizenship?",
        type: "country",
        required: true,
      },
      {
        id: "locations",
        label: "Which Residency locations are you open to?",
        type: "multi_checkbox",
        required: true,
        helpText: "Select all that apply",
        options: [
          { label: "Vienna", value: "vienna" },
          { label: "Brooklyn, NY (Homebrew)", value: "homebrew" },
          { label: "San Francisco (Inventors)", value: "inventors" },
          { label: "San Francisco (Actioners)", value: "actioners" },
          { label: "Bangalore", value: "bangalore" },
          { label: "Aurea", value: "aurea" },
          { label: "Berkeley (Arcadia)", value: "arcadia" },
          { label: "San Francisco (SF2)", value: "sf2" },
          { label: "Biopunk", value: "biopunk" },
          { label: "London", value: "london" },
        ],
      },
      {
        id: "accomplishments",
        label:
          "What past two prior accomplishments are you the most proud of?",
        type: "textarea",
        required: true,
        placeholder: "Tell us about your proudest achievements...",
      },
    ],
  },
  {
    id: "the-project",
    title: "The Project",
    questions: [
      {
        id: "pitch",
        label: "Describe what you're building in 50 characters or less.",
        type: "short_text",
        required: true,
        maxLength: 50,
        placeholder: "e.g. AI-powered legal document review",
      },
      {
        id: "details",
        label:
          "Add any details that we might be interested in that you couldn't fit in 50 characters.",
        type: "textarea",
        required: true,
        placeholder: "Tell us more about your project...",
      },
      {
        id: "project_link",
        label: "Link to your project (if available, nw if you don't have one)",
        type: "url",
        required: false,
        placeholder: "https://",
      },
      {
        id: "demo_video",
        label: "Demo video (if available, nw if you don't have one)",
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
        label: "Why did you pick this to work on?",
        type: "textarea",
        required: true,
        placeholder: "What drew you to this problem?",
      },
      {
        id: "how_know_needed",
        label: "How do you know people need what you're making?",
        type: "textarea",
        required: true,
        placeholder: "What evidence do you have?",
      },
    ],
  },
  {
    id: "progress",
    title: "Progress",
    questions: [
      {
        id: "how_far",
        label: "How far along is your project?",
        type: "textarea",
        required: true,
        placeholder: "Describe your current stage...",
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
        label: "Are people using your project?",
        type: "yes_no",
        required: true,
      },
      {
        id: "has_revenue",
        label: "Do you have revenue?",
        type: "yes_no",
        required: true,
      },
    ],
  },
  {
    id: "competition",
    title: "Competition & Business Model",
    questions: [
      {
        id: "competitors",
        label:
          "Who is another person or group trying to solve this problem?",
        type: "textarea",
        required: true,
      },
      {
        id: "unique_insight",
        label: "What do you understand that they don't?",
        type: "textarea",
        required: true,
      },
      {
        id: "world_impact",
        label: "How will this positively impact the world?",
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
          "What do you need most right now to make meaningful progress on this project?",
        type: "textarea",
        required: true,
      },
      {
        id: "how_helps",
        label:
          "How can the Residency help you move the needle on that goal?",
        type: "textarea",
        required: true,
      },
      {
        id: "looking_cofounder",
        label: "Are you looking for a cofounder?",
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
        required: false,
        conditional: {
          dependsOn: "applied_before",
          showWhen: "yes",
        },
      },
      {
        id: "what_changed",
        label: "What changed since last time?",
        type: "textarea",
        required: false,
        conditional: {
          dependsOn: "same_thing",
          showWhen: "yes",
        },
      },
      {
        id: "why_pivot",
        label: "Why did you pivot, and what did you learn?",
        type: "textarea",
        required: false,
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
        id: "what_convinced",
        label: "What convinced you to apply? Did someone encourage you?",
        type: "textarea",
        required: true,
      },
      {
        id: "how_heard",
        label: "How did you hear about the Residency?",
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
