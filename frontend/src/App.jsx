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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="p-6 bg-white shadow-md rounded-md space-y-4 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold text-gray-800">Upload Excel File</h1>

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer bg-gray-50"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">Drag & drop your Excel file here, or click to browse</p>
        </div>

        <div className="mt-4">
          <input
            type="file"
            name="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Upload File
        </button>

        {downloadLink && (
          <a
            href={downloadLink}
            download="processed_file.xlsx"
            className="text-blue-600 hover:underline mt-4 block"
          >
            Download Processed File
          </a>
        )}
      </form>
    </div>
  );
}

export default FileUploadForm;
