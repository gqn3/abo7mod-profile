import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uploadPublicFile } from "../lib/storage";

export const FileUploader = ({
  kind,
  userId,
  label,
  onUploaded
}: {
  kind: "avatar" | "background" | "music";
  userId: string;
  label: string;
  onUploaded: (url: string) => void;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-center transition hover:border-luxury-accent/35 hover:bg-luxury-accent/10">
      <UploadCloud className="mb-3 h-6 w-6 text-luxury-accent" />
      <span className="font-semibold text-luxury-text">{loading ? "Uploading..." : label}</span>
      <span className="mt-1 text-xs text-luxury-muted">Validated before upload</span>
      <input
        type="file"
        className="hidden"
        disabled={loading}
        accept={kind === "music" ? "audio/*" : kind === "background" ? "image/*,image/gif,video/mp4,video/webm" : "image/*"}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setLoading(true);
          try {
            const url = await uploadPublicFile(kind, userId, file);
            onUploaded(url);
            toast.success("Upload complete");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Upload failed");
          } finally {
            setLoading(false);
            event.currentTarget.value = "";
          }
        }}
      />
    </label>
  );
};
