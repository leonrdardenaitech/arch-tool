import pyttsx3
import sys

engine = pyttsx3.init()
engine.setProperty('rate', 170)

if len(sys.argv) > 1:
    text = sys.argv[1]
else:
    text = "Atlas Master Brain is online. Standing by for deep research."

engine.say(text)
engine.runAndWait()
