from typing import Dict, List
import openai
import os
from datetime import datetime

class ChatService:
    def __init__(self):
        self.openai = openai
        self.openai.api_key = os.getenv('OPENAI_API_KEY')
        self.conversation_history = {}
        
    async def get_response(self, user_id: str, message: str) -> Dict:
        try:
            # Initialize conversation history for new users
            if user_id not in self.conversation_history:
                self.conversation_history[user_id] = []
            
            # Add user message to history
            self.conversation_history[user_id].append({
                'role': 'user',
                'content': message,
                'timestamp': datetime.now().isoformat()
            })
            
            # Prepare conversation for OpenAI
            messages = [
                {'role': 'system', 'content': 'You are a helpful assistant for EnableFreelance, a platform for freelancers with disabilities. Be supportive, clear, and focus on accessibility.'},
                *[{'role': msg['role'], 'content': msg['content']} 
                  for msg in self.conversation_history[user_id][-5:]]
            ]
            
            # Get AI response
            response = await self.openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=150
            )
            
            ai_message = response.choices[0].message['content']
            
            # Add AI response to history
            self.conversation_history[user_id].append({
                'role': 'assistant',
                'content': ai_message,
                'timestamp': datetime.now().isoformat()
            })
            
            return {
                'message': ai_message,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            } 