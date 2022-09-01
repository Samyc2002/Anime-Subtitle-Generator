const extractAudio = require('ffmpeg-extract-audio')

const main = async () => {
  // This extracts the audio from the video
  await extractAudio({
    // this is the input video file in mp4
    input: 'assets/video_recording.mp4',
    // this is the output audio file in mp3
    output: 'assets/converted.mp3'
  })
}

main();
