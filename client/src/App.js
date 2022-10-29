import React from "react";
import axios from "axios";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [transcriptText, setTranscriptText] = React.useState("");

  /* React.useEffect(() => { */
  /*   const input = document.getElementById("file-input"); */
  /*   input.addEventListener("change", function () { */
  /*     const files = e.target.files; */
  /*     if (!files.length) return; */
  /*     const file = files[0]; */
  /**/
  /*     var formdata = new FormData(); */
  /*     let localUri = file.uri; */
  /*     let filename = localUri.split("/").pop(); */
  /*     let match = /\.(\w+)$/.exec(filename); */
  /*     let type = match ? `image/${match[1]}` : `image`; */
  /*     let formData = new FormData(); */
  /*     formData.append("file", file); */
  /*     formdata.append("sourceCode", "ja"); */
  /*     formdata.append("destCode", "en"); */
  /**/
  /*     axios */
  /*       .post(`localost:5000/subs/`, formData, { */
  /*         headers: { */
  /*           "Content-Type": "multipart/form-data", */
  /*         }, */
  /*       }) */
  /*       .then(({ data }) => { */
  /*         if (data.success) setTranscriptText(data.data); */
  /*         else setTranscriptText(data.erorr); */
  /*       }) */
  /*       .catch((err) => console.log); */
  /*   }); */
  /* }, []); */
  const onChange = (e) => {
    console.log("running");
    const files = e.target.files;
    if (!files.length) return;
    const file = files[0];

    var formdata = new FormData();
    let formData = new FormData();
    formData.append("file", file);
    formdata.append("sourceCode", "ja");
    formdata.append("destCode", "en");

    console.log("API call");
    var config = {
      method: "POSt",
      url: "localhost:5000/subs/",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };
    axios(`localhost:5000/subs/`, config)
      .then(({ data }) => {
        console.log(data);
        if (data.success) setTranscriptText(data.data);
        else setTranscriptText(data.erorr);
        document.getElementById("file-input").value = null;
      })
      .catch((err) => console.log);
  };

  return (
    <div className="App">
      <div className="videoUpload">
        <i className="fa fa-cloud-upload fa-5x"></i>
        <input
          type="file"
          id="file-input"
          className="custom-file-input"
          accept="video/*"
          onChange={onChange}
        />
      </div>{" "}
      <p>{transcriptText}</p>
    </div>
  );
}

export default App;
