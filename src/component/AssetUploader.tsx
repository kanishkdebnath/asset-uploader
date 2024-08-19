import React, { useRef, useState } from "react";
import "./AssetUploader.css";

interface AssetUploaderProps {
  onUpload: (files: File[]) => void;
  onError?: (error: Error) => void;
  validateFiles?: (files: File[]) => string[]; // Validation function
  multiple?: boolean;
  acceptedTypes?: string;
  maxSize?: number; // Maximum file size in bytes
  buttonTitle: string;
  buttonClass?: string;
  isVideo?: boolean;
}

const AssetUploader: React.FC<AssetUploaderProps> = ({
  onUpload,
  onError,
  validateFiles,
  multiple = false,
  acceptedTypes = "image/*,video/*",
  maxSize = 10485760, // Default max size of 10MB
  buttonTitle,
  buttonClass,
  isVideo = false,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    let validFiles: File[] = [];
    const errors: string[] = [];

    if (validateFiles) {
      // Use the external validation function if provided
      const validationErrors = validateFiles(files);
      if (validationErrors.length > 0) {
        errors.push(...validationErrors);
      } else {
        validFiles = files;
      }
    } else {
      // Perform internal validation if no external function is provided
      files.forEach((file) => {
        if (
          !acceptedTypes
            .split(",")
            .some((type) => file.type.includes(type.trim()))
        ) {
          errors.push(`Invalid format: ${file.name}`);
        } else if (file.size > maxSize) {
          errors.push(`Size bigger than allowed: ${file.name}`);
        } else {
          validFiles.push(file);
        }
      });
    }

    if (errors.length > 0 && onError) {
      onError(new Error(errors.join(", ")));
    }

    if (validFiles.length > 0) {
      const filePreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews(filePreviews);
      console.log(filePreviews);

      try {
        onUpload(validFiles);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  };

  const handleRemovePreview = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="asset-uploader-container">
      <input
        id="upload-asset"
        type="file"
        accept={acceptedTypes}
        multiple={multiple}
        onChange={handleFileChange}
        className="upload-input"
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <div className="previews-container">
        {previews.length === 0 ? (
          <div className="default-preview-box">No asset uploaded</div>
        ) : (
          previews.map((preview, index) => (
            <div key={index} className="preview-box">
              <div
                className="remove-button"
                onClick={() => handleRemovePreview(index)}
              >
                X
              </div>
              {isVideo ? (
                <video src={preview} controls className="preview-media" />
              ) : (
                <img
                  src={preview}
                  alt={`preview-${index}`}
                  className="preview-media"
                />
              )}
            </div>
          ))
        )}
      </div>
      <button type="button" onClick={handleButtonClick} className={buttonClass}>
        {buttonTitle}
      </button>
    </div>
  );
};

export default AssetUploader;
