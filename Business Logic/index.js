const extractAudio = require('ffmpeg-extract-audio');
const fs = require('fs');
const axios = require('axios');

const main = async () => {
  try {
    // This extracts the audio from the video
    await extractAudio({
      // this is the input video file in mp4
      input: 'assets/To_ask_for_a_price.mp4',
      // this is the output audio file in mp3
      output: 'assets/converted.mp3'
    });

    // Some configurations for the speech to text api
    const assembly = axios.create({
      baseURL: "https://api.assemblyai.com/v2",
      headers: {
        // API-key NOTE: Must Not be leaked!!
        "Authorization": "ea6790a30c244e10a357fdb67eef0318",
        "Content-Type": "application/json",
        "transfer-encoding": "chunked",
      }
    });

    // Audio file that neds to be converted to text
    const file = "./assets/converted.mp3";
    // URI of the audio file after uploading it to the bucket
    var fileURI = "";
    // Source language code
    const langCode = "ja";
    // Target language code
    const targetLangCode = "en";

    // File reading and transcripting
    fs.readFile(file, async (err, data) => {
      if (err) return console.error(err);

      // Uploading file to bucket
      const fileData = await assembly.post("/upload", data)
      // Getting uploaded URI
      fileURI = fileData?.data?.upload_url;

      // Initiating transcript generation
      const postData = await assembly.post("/transcript", {
        audio_url: fileURI,
        language_code: langCode
      });
      // Getting transcript id
      const transcriptID = postData?.data?.id

      // Fetching the transcript initially
      var getData = await assembly.get(`/transcript/${transcriptID}`);
      // If the transcript hasn't been generated yet, wait till it gets generated and fetch again.
      while (getData?.data?.status !== "completed")
        getData = await assembly.get(`/transcript/${transcriptID}`);

      // Get the text from the audio file
      const sourceText = getData?.data?.text;

      // Some configurations for the translation API
      const encodedParams = new URLSearchParams();
      encodedParams.append("q", sourceText);
      encodedParams.append("target", targetLangCode);
      encodedParams.append("source", langCode);

      const options = {
        method: 'POST',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/gzip',
          'X-RapidAPI-Key': '3859461e85msh614bcd665e1cd5ep1bb6e7jsn196e6e191068',
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        data: encodedParams
      };

      // Translating the text obtained from the audio
      axios.request(options).then(function(response) {
        // Printing the output, i.e, the obtained transcript
        console.log(response?.data?.data?.translations?.[0]?.translatedText);
      }).catch(function(error) {
        console.error(error);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

main();
