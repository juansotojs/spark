from fastapi.middleware.cors import CORSMiddleware 
from fastapi import FastAPI, Request, Query
from fastapi.responses import JSONResponse
import re
import httpx
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import asyncio
from prisma import Prisma
from datetime import datetime

load_dotenv()

class WebhookRequest(BaseModel):
    id: str
    transcript_segments: list
    source: str
    language: str
    structured: dict
    status: str

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get frontend URL from environment variable
FRONTEND_URL = 'https://spark2-asst3u14s-juansotojs-projects.vercel.app/'

# Initialize Prisma client with database URL
db = Prisma(datasource={
    "url": "postgresql://postgres:LeTvYUsneJBgvRlSoLhCxBwYzuvnmxPp@tramway.proxy.rlwy.net:10513/railway"
})

@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

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

async def extract_amount_and_category(text):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [{
                        "role": "system",
                        "content": "Extract the monetary amount and expense category from the text. Respond in JSON format with 'amount' and 'category' fields. Category must be exactly one of: Bills, Entertainment, Transportation, Shopping, Healthcare, Education, Investments, Other. For amounts, convert any text numbers to numerical values (e.g., 'twenty dollars' to 20.00)."
                    }, {
                        "role": "user",
                        "content": text
                    }]
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                extracted = result['choices'][0]['message']['content']
                # Parse the JSON response
                import json
                parsed = json.loads(extracted)
                return parsed.get('amount'), parsed.get('category')
            
            return None, "Other"
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        return None, "Other"

@app.post('/webhook')
async def webhook(request: WebhookRequest, uid: str = Query(..., description="User ID")):
    try:
        # Extract text from the transcript segments
        text_value = request.transcript_segments[0].get('text', '')
        print(f"Extracted text: {text_value}")
        
        # Extract amount and category using OpenAI
        amount, category = await extract_amount_and_category(text_value)
        print(f"Extracted amount: {amount}")
        print(f"Categorized as: {category}")
        
        # Ensure amount is a valid float and convert it
        if amount is None or not isinstance(amount, (int, float)):
            raise ValueError("Invalid amount")
        
        # Map the category to the correct enum value
        category_mapping = {
            'BILLS': 'Bills',
            'ENTERTAINMENT': 'Entertainment',
            'TRANSPORTATION': 'Transportation',
            'SHOPPING': 'Shopping',
            'HEALTHCARE': 'Healthcare',
            'EDUCATION': 'Education',
            'INVESTMENTS': 'Investments',
            'OTHER': 'Other'
        }
        
        # Get the correct enum value
        enum_category = category_mapping.get(category.upper(), 'Other')
        print(f"Using enum category: {enum_category}")
        
        # First, ensure the user exists
        try:
            user = await db.user.find_unique(where={'omiUserId': uid})
            if not user:
                print(f"User not found with omiUserId: {uid}")
                return {"error": "User not found. Please create an account first."}
        except Exception as user_error:
            print(f"Error finding user: {str(user_error)}")
            raise
        
        # Create the expense record
        expense_data = {
            'amount': float(amount),
            'category': enum_category,
            'omiUserId': uid
        }
        
        print(f"Creating expense with data: {expense_data}")
        
        # Try creating the expense
        try:
            expense = await db.expense.create(data=expense_data)
            print(f"Saved expense to database: {expense}")
            
            # Verify the relationship by fetching the expense with user
            expense_with_user = await db.expense.find_unique(
                where={'id': expense.id},
                include={'user': True}
            )
            print(f"Expense with user data: {expense_with_user}")
            
        except Exception as db_error:
            print(f"Database error details: {str(db_error)}")
            raise
        
        return {
            "message": "Successfully processed and saved expense",
            "extracted_text": text_value,
            "amount": float(amount),
            "category": enum_category,
            "user_id": uid
        }
    except ValueError as ve:
        print(f"Value error: {str(ve)}")
        return {"error": f"Invalid input: {str(ve)}"}
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {"error": "An unexpected error occurred"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)