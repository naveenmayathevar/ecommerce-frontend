import API_URL from "../api";
import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

/**
 * Props:
 *  - onUpload(url)           -> called with uploaded image URL when finished
 *  - uploadUrl (optional)    -> override upload endpoint
 *  - fieldName (optional)    -> field name the backend expects (default: "image")
 */
export default function ImageUploader({
  onUpload,
  uploadUrl = `${API_URL}/api/upload`,
  fieldName = "image",
}) {
  const { token } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    // show local preview immediately
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const res = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });

      // default expected response: { url: "https://..." }
      // try a few fallback keys if backend returns a different name
      const url =
        res.data?.url || res.data?.secure_url || res.data?.imageUrl || res.data?.path;

      if (!url) {
        throw new Error("Upload response missing image URL. Check server response.");
      }

      onUpload(url);
    } catch (err) {
      console.error("Upload error:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Image upload failed — check server logs or network."
      );
      // if upload failed, clear preview
      setPreview(null);
      onUpload?.(""); // signal failure / clear
    } finally {
      setUploading(false);
      setProgress(0);
      // revoke preview URL after a while to free memory
      setTimeout(() => {
        if (preview) URL.revokeObjectURL(preview);
      }, 2000);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <label
          htmlFor="product-image"
          className="btn btn-outline"
          style={{ cursor: "pointer", marginRight: 8 }}
        >
          {uploading ? `Uploading ${progress}%` : "Choose Image"}
        </label>

        <input
          id="product-image"
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
          disabled={uploading}
        />

        {preview && (
          <div className="image-preview" style={{ minWidth: 80 }}>
            <img src={preview} alt="preview" />
          </div>
        )}

        {!preview && !uploading && (
          <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No file chosen</div>
        )}
      </div>

      {uploading && (
        <div style={{ marginTop: 8, height: 6, background: "#eee", borderRadius: 6 }}>
          <div
            style={{
              width: `${progress}%`,
              height: 6,
              borderRadius: 6,
              background: "linear-gradient(90deg,var(--primary),var(--primary-dark))",
            }}
          />
        </div>
      )}
    </div>
  );
}
