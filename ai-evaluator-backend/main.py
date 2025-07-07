from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import openai
import base64
import os

load_dotenv()
print(os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.get("/test")
async def test():
    return {"message": "Welcome to the AI Diagram Evaluator!", "api_key": os.getenv("OPENAI_API_KEY")}

@app.post("/analyze")
async def analyze_diagram(file: UploadFile = File(...)):
    image_bytes = await file.read()
    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    # response = openai.ChatCompletion.create(
    #     model="gpt-4-vision-preview",
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": [
    #                 {"type": "text", "text": "Evaluate this diagram."},
    #                 {
    #                     "type": "image_url",
    #                     "image_url": {
    #                         "url": f"data:image/png;base64,{encoded_image}"
    #                     },
    #                 },
    #             ],
    #         }
    #     ],
    #     max_tokens=500,
    # )

    # feedback = response["choices"][0]["message"]["content"]
    # return {"feedback": feedback}
