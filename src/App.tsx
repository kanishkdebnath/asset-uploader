import "./App.css";
import AssetUploader from "./component/AssetUploader";

const validateFiles = (files: File[]): string[] => {
  const errors: string[] = [];
  const acceptedTypes = "image/jpeg,image/png,video/mp4"; // Example accepted types
  const maxSize = 5242880; // 5MB
  // const maxSize = 1048576; // 1MB

  files.forEach((file) => {
    if (
      !acceptedTypes.split(",").some((type) => file.type.includes(type.trim()))
    ) {
      errors.push(`Invalid format: ${file.name}`);
    } else if (file.size > maxSize) {
      errors.push(`Size bigger than allowed: ${file.name}`);
    }
  });

  return errors;
};

const handleUpload = (files: File[]) => {
  // Implement your upload logic here
  console.log("Files to upload:", files);
};

const handleError = (error: Error) => {
  // Handle any errors that occur during upload
  console.error("Upload error:", error.message);
};

function App() {
  return (
    <div className="App">
      <h1>Upload Assets</h1>
      <h2>Upload Single Image</h2>
      <AssetUploader
        onUpload={handleUpload}
        onError={handleError}
        validateFiles={validateFiles}
        multiple={false}
        maxSize={1048576}
        acceptedTypes="image/jpeg,image/png,image/jpg"
        buttonTitle="Upload Image"
        buttonClass="upload-button"
      />
      <h2>Upload Multiple Images</h2>
      <AssetUploader
        onUpload={handleUpload}
        onError={handleError}
        validateFiles={validateFiles}
        multiple={true}
        acceptedTypes="image/jpeg,image/png,image/jpg"
        buttonTitle="Upload Images"
        buttonClass="upload-button"
      />
      <h2>Upload Video</h2>
      <AssetUploader
        onUpload={handleUpload}
        onError={handleError}
        validateFiles={validateFiles}
        multiple={false}
        acceptedTypes="video/mp4"
        buttonTitle="Upload Video"
        buttonClass="upload-button"
        isVideo={true}
      />
    </div>
  );
}

export default App;
