/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response, NextFunction } from "express";
// @ts-ignore
import * as extractAudio from "ffmpeg-extract-audio";
import * as fs from "fs";
import axios from "axios";

export class SubsController {
  static async generateSubs(req: Request, res: Response, next: NextFunction) {
    try {
      const videoFilePath = "assets/video.mp4";
      const audioFilePath = "assets/audio.mp4";
      /* fs.writeFile(videoFilePath, req?.file?.buffer as Buffer, (err) => { */
      /*   if (err) { */
      /*     console.log(err); */
      /*   } */
      /* }); */

      console.log("Generating audio");
      // This extracts the audio from the video and writes to memory
      await extractAudio({
        // this is the input video file in mp4
        input: videoFilePath,
        // this is the output audio file in mp3
        output: audioFilePath
      });
      console.log("Audio generated");

      // Some configurations for the speech to text api
      const assembly = {
        baseURL: "https://api.assemblyai.com/v2",
        headers: {
          // API-key NOTE: Must Not be leaked!!
          Authorization: "ea6790a30c244e10a357fdb67eef0318",
          "Content-Type": "application/json",
          "transfer-encoding": "chunked"
        }
      };

      // URI of the audio file after uploading it to the bucket
      var fileURI = "";
      // Source language code
      const langCode = req.body?.sourceCode;
      // Target language code
      const targetLangCode = req.body?.destCode;

      // File reading and transcripting
      fs.readFile(audioFilePath, async (err, data) => {
        if (err) return console.error(err);
        // console.log(data);

        // Uploading file to bucket
        const fileData = await axios.post("/upload", data, assembly);
        // Getting uploaded URI
        fileURI = fileData?.data?.upload_url;

        // Deleting generated files as they are no longer needed
        console.log("Deleting generated files");
        fs.unlinkSync(videoFilePath);
        fs.unlinkSync(audioFilePath);
        console.log("Generated files deleted");

        console.log("Generating Transcript");
        // Initiating transcript generation
        const postData = await axios.post(
          "/transcript",
          {
            audio_url: fileURI,
            language_code: langCode
          },
          assembly
        );
        // Getting transcript id
        const transcriptID = postData?.data?.id;
        console.log(`Transcript generated with id ${transcriptID}`);

        console.log("Fetching Transcript data");
        // Fetching the transcript initially
        var getData = await axios.get(`/transcript/${transcriptID}`, assembly);
        // If the transcript hasn't been generated yet, wait till it gets generated and fetch again.
        while (getData?.data?.status !== "completed")
          getData = await axios.get(`/transcript/${transcriptID}`, assembly);

        // Get the text from the audio file
        const sourceText = getData?.data?.text;
        console.log("Transcript data fetched: " + sourceText);

        console.log("Generating translation");
        // Some configurations for the translation API
        const encodedParams = new URLSearchParams();
        encodedParams.append("q", sourceText);
        encodedParams.append("target", targetLangCode);
        encodedParams.append("source", langCode);

        // Translating the text obtained from the audio
        axios({
          method: "POST",
          url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
          data: encodedParams,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "application/gzip",
            "X-RapidAPI-Key":
              "2aac47a38dmsh5acbe927ef6b633p116962jsn0dfe8f819030",
            "X-RapidAPI-Host": "google-translate1.p.rapidapi.com"
          }
        })
          .then(function(response) {
            // Printing the output, i.e, the obtained transcript
            console.log(
              "Translation generated: " +
              response?.data?.data?.translations?.[0]?.translatedText
            );
            res.status(200).json({
              data: response?.data?.data?.translations?.[0]?.translatedText,
              error: null,
              success: true
            });
          })
          .catch(function(error) {
            console.log("Error obtained:  " + error);
            res.status(200).json({
              data: null,
              error: error,
              success: false
            });
          });
      });
    } catch (err) {
      next(err);
    }
  }
}
