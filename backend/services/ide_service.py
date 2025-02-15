import subprocess
import tempfile
import os
from typing import Dict

class IDEService:
    def __init__(self):
        self.supported_languages = {
            'python': {'ext': '.py', 'cmd': 'python'},
            'javascript': {'ext': '.js', 'cmd': 'node'},
            'java': {'ext': '.java', 'cmd': 'java'}
        }

    async def execute_code(self, code: str, language: str) -> Dict:
        if language not in self.supported_languages:
            return {
                'success': False,
                'output': f'Language {language} not supported',
                'error': True
            }

        try:
            with tempfile.NamedTemporaryFile(
                suffix=self.supported_languages[language]['ext'],
                mode='w',
                delete=False
            ) as f:
                f.write(code)
                temp_file = f.name

            cmd = [self.supported_languages[language]['cmd'], temp_file]
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            stdout, stderr = process.communicate(timeout=5)
            
            return {
                'success': process.returncode == 0,
                'output': stdout if process.returncode == 0 else stderr,
                'error': process.returncode != 0
            }
        except Exception as e:
            return {
                'success': False,
                'output': str(e),
                'error': True
            }
        finally:
            if os.path.exists(temp_file):
                os.remove(temp_file) 