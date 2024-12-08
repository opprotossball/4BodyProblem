import os
from dotenv import load_dotenv
import google.generativeai as genai
import re

# Load the environment variables from a .env file (if you're using one)
load_dotenv()

# Fetch the OpenAI API key from the environment variable
api_key = os.getenv("GEMINI_KEY")

conversation = ""

def test():
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Guess")
    print(response.text)

def predict_responses(message, n_guesses):
    global conversation
    conversation += f"\n- {message}"
    prompt = f'''
        Here is conversation between people on earth and in base on mars.
        \n {conversation} 
        I need you to generate {n_guesses} most probable next messages separated by ;
    '''
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    print(response.text)
    return response.text.split("; ")
