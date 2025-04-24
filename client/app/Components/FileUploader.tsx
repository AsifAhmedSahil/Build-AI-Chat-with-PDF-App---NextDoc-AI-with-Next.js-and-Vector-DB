"use client";

import { cn } from "@/lib/utils";

import React, { useRef, useState } from "react";

type FileStatus = "idle" | "uploading" | "success" | "error";
import {
  FileText,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const FileUploader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<FileStatus>("idle");
  const [file, setFile] = useState<File | null>(null);

  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
    }[]
  >([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      handleFileSelect(droppedFile);
    } else {
      console.log("invalid file type!");
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      await fetch("http://localhost:8000/upload/pdf", {
        method: "POST",
        body: formData,
      });

      console.log("upload successfully");
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(file)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    console.log("file uploading");
    if (!file) return;

    if (file) {
      const formData = new FormData();
      formData.append("pdf", file);

      await fetch("http://localhost:8000/upload/pdf", {
        method: "POST",
        body: formData,
      });
      console.log("file uploaded");
    }

    setStatus("uploading");
  };

  const removeFile = () => {
    console.log("removing file");
    setFile(null);
    setStatus("idle");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" ref={containerRef}>
      <div className="relative z-10 overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 p-1 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50"></div>

        {/* Animated border gradient */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-500 opacity-0 transition-opacity duration-500",
            (isDragging || status === "success") && "opacity-100"
          )}
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 0%, black 100%, transparent 100%)",
            maskSize: "100% 100%",
            maskPosition: "0 0",
            maskRepeat: "no-repeat",
          }}
        ></div>
        <div
          className={cn(
            "relative rounded-lg p-6 transition-all duration-300 ease-in-out backdrop-blur-sm",
            isDragging ? "bg-gray-800/50" : "bg-gray-800/30",
            status === "success" ? "bg-green-900/20" : "",
            status === "error" ? "bg-red-900/20" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Glow effect */}
          <div
            className={cn(
              "absolute inset-0 rounded-lg transition-opacity duration-500",
              status === "success"
                ? "bg-green-500/5 opacity-100"
                : status === "error"
                ? "bg-red-500/5 opacity-100"
                : isDragging
                ? "bg-blue-500/5 opacity-100"
                : "opacity-0"
            )}
          ></div>

          {/* Particles for success animation */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.size / 8,
              }}
            />
          ))}

          {!file ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div
                className={cn(
                  "mb-6 rounded-full p-4 transition-all duration-300",
                  "bg-gradient-to-br from-purple-500/20 to-blue-500/20",
                  "shadow-[0_0_15px_rgba(124,58,237,0.3)]",
                  isHovering && "shadow-[0_0_25px_rgba(124,58,237,0.5)]"
                )}
              >
                <Upload
                  className={cn(
                    "h-8 w-8 transition-all duration-300",
                    "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                  )}
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-emerald-300">
                Upload your PDF
              </h3>
              <p className="mb-6 text-sm text-gray-400 text-center max-w-xs">
                Drag and drop your file here or click to browse
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative overflow-hidden group transition-all duration-300",
                  "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500",
                  "border-none text-white font-medium py-2 px-6"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Choose File
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      "rounded-full p-3 transition-all duration-300",
                      "bg-gradient-to-br from-purple-500/20 to-blue-500/20",
                      "shadow-[0_0_10px_rgba(124,58,237,0.2)]"
                    )}
                  >
                    <FileText className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate font-medium text-gray-200">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className={cn(
                    "rounded-full p-2 transition-all duration-300",
                    "hover:bg-gray-700/50 group z-30"
                  )}
                >
                  <X className="h-5 w-5 text-gray-400 group-hover:text-gray-200" />
                  <span className="sr-only">Remove file</span>
                </button>
              </div>
              <button
                onClick={handleUpload}
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 shadow-md"
              >
                Upload
              </button>

              {status === "uploading" && (
                <div className="space-y-3 py-2">
                  <div className="relative h-2 overflow-hidden rounded-full bg-gray-700">
                    <Progress
                      value={progress}
                      className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500"
                    />
                    <div className="absolute inset-0 rounded-full opacity-30 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                  </div>
                  <p className="text-xs text-center text-gray-400">
                    Uploading... {progress}%
                  </p>
                </div>
              )}

              {status === "success" && (
                <div className="flex items-center justify-center space-x-2 py-2 text-emerald-400">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/20"></div>
                    <CheckCircle className="h-6 w-6 relative z-10" />
                  </div>
                  <span className="text-sm font-medium">Upload complete</span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center justify-center space-x-2 py-2 text-red-400">
                  <AlertCircle className="h-6 w-6" />
                  <span className="text-sm font-medium">Upload failed</span>
                </div>
              )}
            </div>
          )}

          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm bg-gray-900/50 border border-blue-500/50 z-20">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-px">
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Drop your PDF here
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default FileUploader;
