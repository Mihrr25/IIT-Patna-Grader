import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  async function handleSubmit(e){
    e.preventDefault();
    console.log(e.target.file.files[0])
    const myFile=e.target.file.files[0];
    const formdata=new FormData();
    formdata.append("file",myFile)

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formdata,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
        alert("File upload failed: " + errorData.error);
        return;
      }
  
      // If no error, proceed with download
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "graded_workbook.xlsx";
      link.textContent = "Download Graded Workbook";
      link.style.display = "block"; // Make sure it is block or inline-block so it appears on a new line
      const downloadContainer = document.getElementById("download-container");
      downloadContainer.innerHTML = ""; // Clear previous links if needed
      downloadContainer.appendChild(link);
  
      console.log("File downloaded successfully.");
    } catch (error) {
      console.error("Error uploading or downloading file:", error);
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
      <input type="file" name='file' id='file' accept=".xls,.xlsx" required />
        <button type="submit">Submit</button>
      </form>
      <div id='download-container'></div>
    </>
  )
}


export default App
