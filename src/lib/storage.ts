import { supabase } from "./supabase";

type UploadKind = "avatar" | "background" | "music";

const rules: Record<UploadKind, { bucket: string; max: number; accept: RegExp }> = {
  avatar: { bucket: "avatars", max: 5 * 1024 * 1024, accept: /^image\/(png|jpe?g|webp|gif)$/ },
  background: { bucket: "backgrounds", max: 15 * 1024 * 1024, accept: /^(image\/(png|jpe?g|webp|gif)|video\/(mp4|webm))$/ },
  music: { bucket: "music", max: 20 * 1024 * 1024, accept: /^audio\/(mpeg|mp3|wav|ogg|webm|mp4)$/ }
};

export const validateFile = (kind: UploadKind, file: File) => {
  const rule = rules[kind];
  if (file.size > rule.max) {
    throw new Error(`File is too large. Max size is ${Math.round(rule.max / 1024 / 1024)}MB.`);
  }
  if (!rule.accept.test(file.type)) {
    throw new Error("This file type is not allowed.");
  }
};

export const uploadPublicFile = async (kind: UploadKind, userId: string, file: File) => {
  validateFile(kind, file);
  const rule = rules[kind];
  const extension = file.name.split(".").pop() || "bin";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(rule.bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from(rule.bucket).getPublicUrl(path);
  return data.publicUrl;
};
