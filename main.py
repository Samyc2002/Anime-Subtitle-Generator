# IMPORTING LIBRARIES
import speech_recognition as sr 
import moviepy.editor as mp
from deep_translator import GoogleTranslator

# VIDEO TO AUDIO CONVERSION
clip = mp.VideoFileClip(r'video_recording.mp4') 
clip.audio.write_audiofile(r'converted.wav')

# SPEECH RECOGNISION
r = sr.Recognizer()
audio = sr.AudioFile('converted.wav')
with audio as source:
    audio_file = r.record(source)
result = r.recognize_google(audio_file, None, "ja")

# TRANSLATING THE TEXT TO ENGLISH
translated = GoogleTranslator(source='auto', target='english').translate(result)

# EXPORTING THE RESULTS
with open('recognized.txt', mode ='w', encoding="utf-8") as file: 
    file.write("Recognized Speech:") 
    file.write("\n") 
    # file.write(result)
    file.write(translated)
    print("ready!")
