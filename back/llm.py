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
    return response.text.split(";")

def choose_prediction(message, predictions):
    pred_str = "\n".join(
        f"{index + 1}. {item["prediction"]}" for index, item in enumerate(predictions)
    )
    prompt = f'''
        You have a list of messages:
        \n{pred_str}
        I need you to tell if one of them is similar to message:
        {message["message"]}
        If you find a message that is identical in meaning give me its ID - return just single number.
        If there are no messages identical in meaning then just print 0.
        It is very important that you return 0 if there are no identical in meaning messages
    '''
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    match = re.search(r"\d", response.text)
    if not match or match.group() == "0":
        return None
    return predictions[int(match.group())]
