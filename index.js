const extractAudio = require('ffmpeg-extract-audio')

const main = async () => {
  await extractAudio({
    input: 'assets/video_recording.mp4',
    output: 'assets/converted.mp3'
  })
}

main();
