from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI
import base64
import os

# Load environment variables
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY is missing from environment variables")

client = OpenAI(api_key=api_key)

# Create FastAPI app
app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test route
@app.get("/test")
async def test():
    return {
        "message": "Welcome to the AI Diagram Evaluator!",
        "api_key_loaded": bool(os.getenv("OPENAI_API_KEY"))
    }

# Image analysis route
@app.post("/analyze")
async def analyze_diagram(
    file: UploadFile = File(...),
    description: str = Form("")
):
    try:
        # Read and encode image to base64
        image_bytes = await file.read()
        encoded_image = base64.b64encode(image_bytes).decode("utf-8")
        print(f"Received image: {file.filename}, size: {len(image_bytes)} bytes")
        print(f"Description: {description}")

        # Send request to GPT-4 Vision
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Evaluate this diagram. Description: {description.strip()}"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{encoded_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=500,
        )

        # Extract feedback
        feedback = response.choices[0].message.content
        print(f"Feedback received: {feedback}")
        return {"feedback": feedback}

    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="AI analysis failed.")
