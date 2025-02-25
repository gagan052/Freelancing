import openai
from typing import Dict, Optional

class CodeGenerator:
    def __init__(self, api_key: str):
        openai.api_key = api_key
        self.context = []
        self.max_context_length = 5

    async def generate_code(self, 
                          gesture_sequence: list, 
                          language: str = 'javascript') -> Dict:
        """Generate code from gesture sequence using OpenAI"""
        try:
            # Create prompt from gesture sequence
            prompt = self._create_prompt(gesture_sequence, language)
            
            # Generate code using OpenAI
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self._get_system_prompt(language)},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=150
            )
            
            code = response.choices[0].message.content.strip()
            return {
                'status': 'success',
                'code': code,
                'language': language
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'code': None
            }

    def _create_prompt(self, gesture_sequence: list, language: str) -> str:
        """Create prompt from gesture sequence"""
        gesture_text = " ".join(gesture_sequence)
        return f"Convert the following gesture sequence into {language} code: {gesture_text}"

    def _get_system_prompt(self, language: str) -> str:
        """Get system prompt based on programming language"""
        return f"""You are an expert {language} programmer. 
        Convert gesture sequences into clean, well-formatted {language} code.
        Focus on creating simple, readable code snippets.""" 