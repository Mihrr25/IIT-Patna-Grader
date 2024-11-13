import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./index.css"; // Import the CSS file

function App() {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: ".xlsx, .xls",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file before submitting!");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", file);

    try {
      const response = await fetch(
        "https://renderiitpgraderproject.onrender.com/upload",
        {
          method: "POST",
          body: formdata,
        }
      );

      if (response.status !== 400) {
        alert("Something is wrong with the Excel file. Please check and try again.");
      } else {
        const blob = await response.blob();
        const fileURL = window.URL.createObjectURL(blob);
        setDownloadLink(fileURL);
      }
    } catch (error) {
      alert("An error occurred while uploading the file.");
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Upload Excel File</h1>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className="dropzone"
        >
          <input {...getInputProps()} />
          <p>Drag & drop your Excel file here, or</p>
          <label className="file-button">
            Choose File
            <input
              type="file"
              name="file"
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden-input"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Upload File
        </button>

        {/* Download Link */}
        {downloadLink && (
          <a
            href={downloadLink}
            download="processed_file.xlsx"
            className="download-link"
          >
            Download Processed File
          </a>
        )}
      </form>
    </div>
  );
}

export default App;
