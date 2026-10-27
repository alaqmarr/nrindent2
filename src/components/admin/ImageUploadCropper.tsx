"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { Area } from "react-easy-crop";
import {
  Upload,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  X,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";

export interface CropPreset {
  label: string;
  aspect: number;
  width: number;
  height: number;
  description: string;
}

export const DISPLAY_CROP_PRESETS: CropPreset[] = [
  {
    label: "Product Card (4:3)",
    aspect: 4 / 3,
    width: 1000,
    height: 750,
    description: "Matches client-side Product Card & Product Detail display (4:3)",
  },
  {
    label: "Category / Hero Banner (16:9)",
    aspect: 16 / 9,
    width: 1280,
    height: 720,
    description: "Matches Category Banner & Hero Section display (16:9)",
  },
  {
    label: "Square Thumbnail (1:1)",
    aspect: 1 / 1,
    width: 800,
    height: 800,
    description: "Matches Square Avatar / Icon / Spec Thumbnail (1:1)",
  },
  {
    label: "Wide Showcase (3:2)",
    aspect: 3 / 2,
    width: 1200,
    height: 800,
    description: "Matches About Section & Industrial Feature Showcase (3:2)",
  },
];

interface ImageUploadCropperProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  defaultAspect?: number;
  label?: string;
  helperText?: string;
}

async function createCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  targetWidth?: number,
  targetHeight?: number
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const rotRad = (rotation * Math.PI) / 180;
  const bBoxWidth =
    Math.abs(Math.cos(rotRad) * image.width) +
    Math.abs(Math.sin(rotRad) * image.height);
  const bBoxHeight =
    Math.abs(Math.sin(rotRad) * image.width) +
    Math.abs(Math.cos(rotRad) * image.height);

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  if (!croppedCtx) throw new Error("Cropped canvas context unavailable");

  const finalWidth = targetWidth || pixelCrop.width;
  const finalHeight = targetHeight || pixelCrop.height;

  croppedCanvas.width = finalWidth;
  croppedCanvas.height = finalHeight;

  croppedCtx.imageSmoothingEnabled = true;
  croppedCtx.imageSmoothingQuality = "high";

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    finalWidth,
    finalHeight
  );

  return new Promise<Blob>((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate cropped image blob"));
      },
      "image/webp",
      0.9
    );
  });
}

export default function ImageUploadCropper({
  value,
  onChange,
  folder = "products",
  defaultAspect = 4 / 3,
  label = "Image Upload (Cloudflare R2 + Client Display Cropper)",
  helperText,
}: ImageUploadCropperProps) {
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [originalFilename, setOriginalFilename] = useState<string>("image.webp");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const initialPreset =
    DISPLAY_CROP_PRESETS.find(
      (p) => Math.abs(p.aspect - defaultAspect) < 0.05
    ) || DISPLAY_CROP_PRESETS[0];

  const [selectedPreset, setSelectedPreset] = useState<CropPreset>(initialPreset);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null);
    const file = acceptedFiles[0];
    if (!file) return;

    setOriginalFilename(file.name.replace(/\.[^/.]+$/, "") + ".webp");
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/avif": [],
    },
    maxFiles: 1,
    multiple: false,
  });

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirmCropAndUpload = async () => {
    if (!rawImageSrc || !croppedAreaPixels) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const blob = await createCroppedBlob(
        rawImageSrc,
        croppedAreaPixels,
        rotation,
        selectedPreset.width,
        selectedPreset.height
      );

      const file = new File([blob], originalFilename, { type: "image/webp" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      setStorageInfo(
        data.storage === "cloudflare-r2"
          ? "Uploaded to Cloudflare R2"
          : "Saved (Local R2 Fallback)"
      );
      setRawImageSrc(null);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload cropped image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput((prev) => !prev)}
          className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
        >
          <LinkIcon className="h-3.5 w-3.5" />
          {showUrlInput ? "Hide URL Input" : "Or paste image URL"}
        </button>
      </div>

      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://pub-xxx.r2.dev/products/image.webp"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
          />
        </div>
      )}

      {/* Current Image Preview + Dropzone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
        {value ? (
          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 sm:col-span-5">
            <div
              className="relative w-full overflow-hidden rounded-lg bg-slate-900/5"
              style={{ aspectRatio: selectedPreset.aspect }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-white">
                Client View ({selectedPreset.label})
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between px-1">
              <span className="truncate text-[11px] text-slate-500">
                {storageInfo || "Active Image"}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setRawImageSrc(value);
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                    setRotation(0);
                  }}
                  className="inline-flex items-center gap-1 rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
                >
                  <Crop className="h-3 w-3" /> Re-crop
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className={value ? "sm:col-span-7" : "sm:col-span-12"}>
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
              isDragActive
                ? "border-orange-500 bg-orange-50/70"
                : "border-slate-300 bg-slate-50/60 hover:border-orange-400 hover:bg-slate-50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {isDragActive
                ? "Drop image here to open Crop Window..."
                : "Drag & drop image here, or click to browse"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Opens interactive client-display cropper ({selectedPreset.width}×
              {selectedPreset.height}px) • Uploads to Cloudflare R2
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {uploadError}
        </div>
      )}

      {/* Interactive Crop Modal */}
      {rawImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-white">
                  <Crop className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Crop Image to Client Display Size
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedPreset.description} — Output: {selectedPreset.width} ×{" "}
                    {selectedPreset.height}px WebP
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRawImageSrc(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Display Aspect Ratio Selector */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/50 px-6 py-3">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Client Display Preset:
              </span>
              {DISPLAY_CROP_PRESETS.map((preset) => {
                const active = preset.label === selectedPreset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "bg-orange-600 text-white shadow"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {preset.label} ({preset.width}×{preset.height})
                  </button>
                );
              })}
            </div>

            {/* Cropper Canvas Viewport */}
            <div className="relative h-[360px] w-full bg-slate-950 sm:h-[420px]">
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={selectedPreset.aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                showGrid={true}
              />
            </div>

            {/* Controls Footer */}
            <div className="space-y-4 border-t border-slate-800 bg-slate-900 px-6 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Zoom Control */}
                <div className="flex items-center gap-3">
                  <ZoomOut className="h-4 w-4 text-slate-400" />
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-orange-500"
                  />
                  <ZoomIn className="h-4 w-4 text-slate-400" />
                  <span className="w-12 text-right text-xs font-mono text-slate-300">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Rotation Control */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                  >
                    <RotateCw className="h-3.5 w-3.5" /> Rotate 90°
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCrop({ x: 0, y: 0 });
                      setZoom(1);
                      setRotation(0);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ImageIcon className="h-4 w-4 text-orange-400" />
                  <span>
                    Exact client frame: <strong>{selectedPreset.width}px</strong> ×{" "}
                    <strong>{selectedPreset.height}px</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => setRawImageSrc(null)}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={handleConfirmCropAndUpload}
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-orange-500 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading to Cloudflare R2...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Crop & Upload Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
