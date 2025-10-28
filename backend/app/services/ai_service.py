import os
import base64
from openai import OpenAI
from typing import Dict, Optional, List


class AIService:
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self._client = None
            self._initialized = True
    
    @property
    def client(self):
        if self._client is None:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key or api_key == "placeholder_will_be_set_by_user":
                raise ValueError("OPENAI_API_KEY environment variable is not set or is still a placeholder. Please set a valid OpenAI API key.")
            self._client = OpenAI(api_key=api_key)
        return self._client
    
    def generate_product_description(self, image_data: str) -> Dict[str, any]:
        try:
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            prompt = """Analyze this product image and provide:
1. A concise, compelling product title (5-10 words)
2. A detailed product description (2-3 sentences)
3. 3-5 relevant keywords for categorization

Format your response as:
TITLE: [product title]
DESCRIPTION: [detailed description]
KEYWORDS: [keyword1, keyword2, keyword3]"""
            
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_data}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            
            title = ""
            description = ""
            keywords = []
            
            lines = content.split('\n')
            for line in lines:
                line = line.strip()
                if line.startswith('TITLE:'):
                    title = line.replace('TITLE:', '').strip()
                elif line.startswith('DESCRIPTION:'):
                    description = line.replace('DESCRIPTION:', '').strip()
                elif line.startswith('KEYWORDS:'):
                    keywords_str = line.replace('KEYWORDS:', '').strip()
                    keywords = [k.strip() for k in keywords_str.split(',')]
            
            if not title or not description:
                title = "Product"
                description = content[:200]
            
            return {
                "title": title,
                "description": description,
                "keywords": keywords if keywords else ["product"]
            }
            
        except Exception as e:
            print(f"Error generating product description: {e}")
            raise Exception(f"AI generation failed: {str(e)}")


ai_service = AIService()
