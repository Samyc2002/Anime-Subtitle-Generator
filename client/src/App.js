import React from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [loading, setLoading] = React.useState(false);
  const [transcriptText, setTranscriptText] = React.useState("");
  const [source, setSource] = React.useState("Japaneese");
  const [dest, setDest] = React.useState("General English");

  const languages = [
    "General English",
    "Australian English",
    "British English",
    "US English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portugeese",
    "Dutch",
    "Hindi",
    "Japaneese",
  ];

  const languageMap = {
    "General English": "en",
    "Australian English": "en_au",
    "British English": "en_uk",
    "US English": "en_us",
    Spanish: "es",
    French: "fr",
    German: "de",
    Italian: "it",
    Portugeese: "pt",
    Dutch: "ni",
    Hindi: "hi",
    Japaneese: "ja",
  };

  const onChange = (e) => {
    console.log("running");
    const files = e.target.files;
    if (!files.length) return;
    const file = files[0];

    var data = new FormData();
    data.append("file", file);
    data.append("sourceCode", languageMap[source]);
    data.append("destCode", languageMap[dest]);

    console.log("API running");
    var config = {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    setLoading(true);
    axios(`http://localhost:5000/subs/`, config)
      .then(({ data }) => {
        console.log(data);
        if (data.success) setTranscriptText(data.data);
        else setTranscriptText(data.erorr);
        document.getElementById("file-input").value = null;
        setLoading(false);
      })
      .catch((err) => console.log);
  };

  const changeLang = (e, type) => {
    switch (type) {
      case "source":
        setSource(e.target.value);
        break;
      case "dest":
        setDest(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="language-options">
          <div>
            <label>Please tell us what Language the video is in:</label>
            <br />
            <select value={source} onChange={(e) => changeLang(e, "source")}>
              {languages.map((language, id) => (
                <option key={id} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>
              Please tell us what Language you want the subtitles in:
            </label>
            <br />
            <select value={dest} onChange={(e) => changeLang(e, "dest")}>
              {languages.map((language, id) => (
                <option key={id} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>
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
        <p>{loading ? "Loadng..." : transcriptText}</p>
      </div>
    </div>
  );
}

export default App;
