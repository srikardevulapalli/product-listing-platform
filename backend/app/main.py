from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes import products, admin, auth

load_dotenv()

app = FastAPI(
    title="Product Listing Platform API",
    description="AI-powered product listing platform with Firebase integration",
    version="1.0.0"
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(admin.router)


@app.get("/")
async def root():
    return {
        "message": "Product Listing Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
