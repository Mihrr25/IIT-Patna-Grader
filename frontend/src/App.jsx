import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

function FileUploadForm() {
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        className="p-8 bg-white shadow-lg rounded-lg w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Upload Excel File
        </h1>

        {/* Drag and Drop Section */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-blue-500 bg-blue-50 p-6 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-all"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600 font-medium">
            Drag & drop your Excel file here, or click to browse
          </p>
        </div>

        {/* File Input Section */}
        <div className="mt-6">
          <input
            type="file"
            name="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
        >
          Upload File
        </button>

        {/* Download Link */}
        {downloadLink && (
          <a
            href={downloadLink}
            download="processed_file.xlsx"
            className="block text-center mt-6 text-blue-600 hover:underline font-medium"
          >
            Download Processed File
          </a>
        )}
      </form>
    </div>
  );
}

export default FileUploadForm;
