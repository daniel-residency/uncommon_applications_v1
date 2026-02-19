export interface Home {
  id: string;
  name: string;
  slug: string;
  color: string;
  logo_url: string | null;
  location: string;
  description_template: string;
  matching_prompt: string;
  question: string | null;
  video_url: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  email: string;
  answers: Record<string, string>;
  status: "in_progress" | "frozen" | "submitted";
  current_section: string | null;
  matched_home_ids: string[] | null;
  frozen_at: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type QuestionType =
  | "text"
  | "textarea"
  | "url"
  | "select"
  | "yes_no"
  | "country"
  | "multi_checkbox"
  | "short_text";

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: { label: string; value: string }[];
  conditional?: {
    dependsOn: string;
    showWhen: string;
  };
  helpText?: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface MatchResult {
  homeId: string;
  rank: number;
}
