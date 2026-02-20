"use client";

import { Question } from "@/lib/types";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import YesNo from "@/components/ui/yes-no";
import CountrySelector from "@/components/ui/country-selector";
import CheckboxGroup from "@/components/ui/checkbox-group";

interface QuestionRendererProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  allAnswers: Record<string, string>;
  error?: boolean;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  allAnswers,
  error,
}: QuestionRendererProps) {
  // Check conditional visibility
  if (question.conditional) {
    const dependsValue = allAnswers[question.conditional.dependsOn];
    if (dependsValue !== question.conditional.showWhen) {
      return null;
    }
  }

  const errorMsg = error ? "required" : undefined;

  switch (question.type) {
    case "textarea":
      return (
        <Textarea
          label={question.label}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={question.required}
          placeholder={question.placeholder}
          helpText={question.helpText}
          error={errorMsg}
        />
      );

    case "text":
    case "short_text":
      return (
        <Input
          label={question.label}
          value={value || ""}
          onChange={(e) => {
            if (question.maxLength && e.target.value.length > question.maxLength) return;
            onChange(e.target.value);
          }}
          required={question.required}
          placeholder={question.placeholder}
          maxLength={question.maxLength}
          helpText={
            question.maxLength
              ? `${(value || "").length}/${question.maxLength} characters`
              : question.helpText
          }
          error={errorMsg}
        />
      );

    case "url":
      return (
        <Input
          type="url"
          label={question.label}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={question.required}
          placeholder={question.placeholder || "https://"}
          helpText={question.helpText}
          error={errorMsg}
        />
      );

    case "select":
      return (
        <Select
          label={question.label}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={question.required}
          options={question.options || []}
          error={errorMsg}
        />
      );

    case "yes_no":
      return (
        <YesNo
          label={question.label}
          value={value || ""}
          onChange={onChange}
          required={question.required}
          error={errorMsg}
        />
      );

    case "country":
      return (
        <CountrySelector
          label={question.label}
          value={value || ""}
          onChange={onChange}
          required={question.required}
          error={errorMsg}
        />
      );

    case "multi_checkbox":
      return (
        <CheckboxGroup
          label={question.label}
          options={question.options || []}
          value={value ? value.split("|").filter(Boolean) : []}
          onChange={(vals) => onChange(vals.join("|"))}
          required={question.required}
          helpText={question.helpText}
          error={errorMsg}
        />
      );

    default:
      return null;
  }
}
