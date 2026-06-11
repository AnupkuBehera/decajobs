"use client";

import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  type KeyboardEvent,
  type InputHTMLAttributes,
} from "react";

export interface TagInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  suggestions?: string[];
}

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      tags,
      onTagsChange,
      maxTags,
      suggestions = [],
      placeholder,
      className = "",
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [announcement, setAnnouncement] = useState("");
    const announcementTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const announcementId = `${inputId}-announcements`;
    const listboxId = `${inputId}-listbox`;

    // Filter suggestions based on input
    const filteredSuggestions = inputValue.trim()
      ? suggestions
          .filter((s) => {
            const lower = s.toLowerCase();
            const query = inputValue.toLowerCase();
            return (
              lower.includes(query) &&
              !tags.some((t) => t.toLowerCase() === lower)
            );
          })
          .slice(0, 8)
      : [];

    const announce = useCallback((message: string) => {
      // Clear previous timeout to avoid stale announcements
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }
      // Reset then set to ensure screen readers pick up repeated messages
      setAnnouncement("");
      announcementTimeoutRef.current = setTimeout(() => {
        setAnnouncement(message);
      }, 50);
    }, []);

    const addTag = useCallback(
      (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        if (tags.includes(trimmed)) {
          announce(`${trimmed} is already added.`);
          return;
        }
        if (maxTags && tags.length >= maxTags) {
          announce(`Maximum of ${maxTags} tags reached.`);
          return;
        }
        onTagsChange([...tags, trimmed]);
        setInputValue("");
        announce(`Added ${trimmed}. ${tags.length + 1} tag${tags.length + 1 === 1 ? "" : "s"} total.`);
      },
      [tags, onTagsChange, maxTags, announce],
    );

    const removeTag = useCallback(
      (index: number) => {
        const removed = tags[index];
        onTagsChange(tags.filter((_, i) => i !== index));
        announce(`Removed ${removed}. ${tags.length - 1} tag${tags.length - 1 === 1 ? "" : "s"} remaining.`);
      },
      [tags, onTagsChange, announce],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
            addTag(filteredSuggestions[highlightedIndex]);
            setHighlightedIndex(-1);
            setShowSuggestions(false);
          } else {
            addTag(inputValue);
          }
        } else if (e.key === "ArrowDown" && filteredSuggestions.length > 0) {
          e.preventDefault();
          setShowSuggestions(true);
          setHighlightedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === "ArrowUp" && filteredSuggestions.length > 0) {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
        } else if (e.key === "Escape") {
          setShowSuggestions(false);
          setHighlightedIndex(-1);
        } else if (
          e.key === "Backspace" &&
          inputValue === "" &&
          tags.length > 0
        ) {
          removeTag(tags.length - 1);
        }
      },
      [inputValue, tags, addTag, removeTag, filteredSuggestions, highlightedIndex],
    );

    return (
      <div className="relative flex w-full flex-col gap-1.5" ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div
          className={`flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 ${
            error
              ? "border-error-500 focus-within:ring-error-500 focus-within:border-error-500"
              : "border-neutral-300 hover:border-neutral-400"
          } ${className}`}
          role="group"
          aria-label={label ? `${label} tags` : "Tags"}
        >
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2 py-1 text-sm text-primary-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                aria-label={`Remove ${tag}`}
                className="relative inline-flex h-5 w-5 items-center justify-center rounded-full text-primary-600 hover:bg-primary-200 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 before:absolute before:inset-0 before:-m-2.5 before:content-['']"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </span>
          ))}
          <input
            ref={ref}
            id={inputId}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => {
              if (inputValue.trim()) setShowSuggestions(true);
            }}
            onBlur={() => {
              // Delay to allow click on suggestion
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            aria-invalid={!!error}
            aria-describedby={
              [errorId, helperId, announcementId].filter(Boolean).join(" ") || undefined
            }
            aria-label={label ? undefined : placeholder}
            aria-autocomplete={suggestions.length > 0 ? "list" : undefined}
            aria-controls={suggestions.length > 0 ? listboxId : undefined}
            aria-expanded={showSuggestions && filteredSuggestions.length > 0}
            aria-activedescendant={
              highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
            }
            role={suggestions.length > 0 ? "combobox" : undefined}
            className="min-w-[120px] flex-1 border-none bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              props.disabled || (maxTags ? tags.length >= maxTags : false)
            }
            {...props}
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                  highlightedIndex === index
                    ? "bg-primary-50 text-primary-800"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(suggestion);
                  setShowSuggestions(false);
                  setHighlightedIndex(-1);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {/* Live region for screen reader announcements of tag changes */}
        <div
          id={announcementId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-sm text-error-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TagInput.displayName = "TagInput";
