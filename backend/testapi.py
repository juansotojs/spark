from fastapi.middleware.cors import CORSMiddleware 
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from transformers import pipeline
import re
from num2words import num2words
from word2number import w2n
import httpx

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the NER pipeline for extracting amounts
ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

# Define expense categories and their keywords
EXPENSE_CATEGORIES = {
    "Bills": ["rent", "mortgage", "utilities", "electricity", "water", "gas", "insurance", "phone", "internet"],
    "Entertainment": ["games", "movies", "restaurant", "food", "dining", "netflix", "spotify", "subscription"],
    "Transportation": ["gas", "fuel", "uber", "lyft", "transit", "bus", "train", "airline", "flight"],
    "Shopping": ["clothes", "shopping", "amazon", "walmart", "target", "store"],
    "Healthcare": ["doctor", "medical", "pharmacy", "medicine", "health", "dental"],
    "Education": ["school", "university", "college", "course", "education", "tuition"],
    "Investments": ["stock", "crypto", "investment", "trading", "shares", "bitcoin"],
    "Other": []  # Default category
}

def extract_amount(text):
    # First try to find dollar amounts using regex
    dollar_pattern = r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)'
    matches = re.findall(dollar_pattern, text)
    
    if matches:
        # Convert the matched amount to float, removing commas
        amount = float(matches[0].replace(',', ''))
        return amount
    
    # If no dollar amount found, try to find numbers that might represent amounts
    number_pattern = r'\b(\d+(?:,\d{3})*(?:\.\d{2})?)\b'
    matches = re.findall(number_pattern, text)
    
    if matches:
        # Convert the matched number to float, removing commas
        amount = float(matches[0].replace(',', ''))
        return amount
    
    # Try to find text numbers
    try:
        # Common text number patterns
        text_number_patterns = [
            r'(?:spent|paid|cost|worth)\s+([a-zA-Z\s]+)\s+(?:dollars|bucks|dollar|buck)',
            r'([a-zA-Z\s]+)\s+(?:dollars|bucks|dollar|buck)',
            r'(?:spent|paid|cost|worth)\s+([a-zA-Z\s]+)'
        ]
        
        for pattern in text_number_patterns:
            match = re.search(pattern, text.lower())
            if match:
                text_number = match.group(1).strip()
                try:
                    # Convert text number to integer
                    amount = w2n.word_to_num(text_number)
                    return float(amount)
                except:
                    continue
        
        # If no pattern matches, try direct conversion
        try:
            amount = w2n.word_to_num(text)
            return float(amount)
        except:
            pass
            
    except Exception as e:
        print(f"Error converting text number: {str(e)}")
    
    return None

def categorize_expense(text):
    text = text.lower()
    
    # Check each category's keywords
    for category, keywords in EXPENSE_CATEGORIES.items():
        if any(keyword in text for keyword in keywords):
            return category
    
    # If no category matches, return "Other"
    return "Other"

@app.post('/webhook')
async def webhook(memory: dict, uid: str):
    try:
        # Extract text from the transcript
        text_value = memory.get('transcript_segments', [])[0].get('text', '')
        print(f"Extracted text: {text_value}")
        
        # Extract amount
        amount = extract_amount(text_value)
        print(f"Extracted amount: {amount}")
        
        # Categorize the expense
        category = categorize_expense(text_value)
        print(f"Categorized as: {category}")
        
        # Forward to frontend webhook
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:3000/api/webhook",
                json={
                    "amount": amount,
                    "category": category,
                    "user_id": uid
                }
            )
            
            if response.status_code != 200:
                print(f"Error forwarding to frontend: {response.text}")
        
        return {
            "message": "Successfully processed expense",
            "extracted_text": text_value,
            "amount": amount,
            "category": category,
            "user_id": uid
        }
    except (IndexError, KeyError) as e:
        print(f"Error processing data: {str(e)}")
        return {"error": "Could not process the provided data"}
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {"error": "An unexpected error occurred"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)