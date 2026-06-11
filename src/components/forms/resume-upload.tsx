"use client";

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { uploadResume, type UploadResult } from "@/app/(candidate)/profile/upload-action";
import { Button } from "@/components/ui";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type UploadStatus = "idle" | "validating" | "uploading" | "success" | "error";

interface ResumeUploadProps {
  currentResumeUrl?: string | null;
  onUploadComplete?: (url: string) => void;
  onSkillsExtracted?: (skills: string[], titles: string[]) => void;
}

export function ResumeUpload({ currentResumeUrl, onUploadComplete, onSkillsExtracted }: ResumeUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentResumeUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file extension
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return "Unsupported file format. Please upload a PDF or DOCX file.";
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return "Unsupported file format. Please upload a PDF or DOCX file.";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`;
    }

    return null;
  }, []);

  const handleUpload = useCallback(
    async (file: File) => {
      setStatus("validating");
      setErrorMessage("");
      setFileName(file.name);

      // Client-side validation
      const validationError = validateFile(file);
      if (validationError) {
        setStatus("error");
        setErrorMessage(validationError);
        return;
      }

      setStatus("uploading");

      // Create FormData and call server action
      const formData = new FormData();
      formData.append("resume", file);

      const result: UploadResult = await uploadResume(formData);

      if (result.success && result.url) {
        setStatus("success");
        setUploadedUrl(result.url);
        onUploadComplete?.(result.url);
        // Notify parent of extracted skills/titles from resume
        if (result.parsedSkills?.length || result.parsedTitles?.length) {
          onSkillsExtracted?.(result.parsedSkills || [], result.parsedTitles || []);
        }
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Upload failed. Please try again.");
      }
    },
    [validateFile, onUploadComplete]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      const firstFile = files[0];
      if (files.length > 0 && firstFile) {
        handleUpload(firstFile);
      }
    },
    [handleUpload]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      const firstFile = files?.[0];
      if (firstFile) {
        handleUpload(firstFile);
      }
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleUpload]
  );

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setErrorMessage("");
    setFileName("");
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-700">
        Resume
      </label>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload resume. Drag and drop a file or click to browse."
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleBrowseClick();
          }
        }}
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer
          ${isDragOver ? "border-primary-500 bg-primary-50" : "border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100"}
          ${status === "error" ? "border-red-300 bg-red-50" : ""}
          ${status === "success" ? "border-green-300 bg-green-50" : ""}
        `}
      >
        {/* Icon */}
        <div className="mb-3">
          {status === "uploading" ? (
            <svg
              className="h-10 w-10 animate-spin text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : status === "success" ? (
            <svg
              className="h-10 w-10 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : status === "error" ? (
            <svg
              className="h-10 w-10 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          ) : (
            <svg
              className="h-10 w-10 text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
        </div>

        {/* Text content */}
        {status === "idle" && (
          <>
            <p className="text-sm font-medium text-neutral-700">
              Drag and drop your resume here, or click to browse
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              PDF or DOCX, up to 5MB
            </p>
          </>
        )}

        {status === "validating" && (
          <p className="text-sm text-neutral-600">Validating file...</p>
        )}

        {status === "uploading" && (
          <div className="text-center">
            <p className="text-sm font-medium text-primary-700">
              Uploading {fileName}...
            </p>
            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-primary-100">
              <div className="h-full animate-pulse rounded-full bg-primary-500" style={{ width: "70%" }} />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <p className="text-sm font-medium text-green-700">
              {fileName} uploaded successfully
            </p>
            <p className="mt-1 text-xs text-green-600">
              Your resume has been saved to your profile.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <p className="text-sm font-medium text-red-700" role="alert">
              {errorMessage}
            </p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {(status === "error" || status === "success") && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
          >
            {status === "success" ? "Replace Resume" : "Try Again"}
          </Button>
        )}

        {uploadedUrl && status !== "uploading" && (
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 underline hover:text-primary-700"
            onClick={(e) => e.stopPropagation()}
          >
            View current resume
          </a>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-neutral-500">
        Accepted formats: PDF, DOCX. Maximum file size: 5MB.
      </p>
    </div>
  );
}
