import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load the environment variables from a .env file (if you're using one)
load_dotenv()

# Fetch the OpenAI API key from the environment variable
api_key = os.getenv("GEMINI_KEY")

def test():
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Guess")
    print(response.text)