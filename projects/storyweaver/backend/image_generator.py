#!/usr/bin/env python3
"""
Image Generator — Generate chapter illustrations using local SD or Ollama vision
"""

import os
import requests
import logging
from pathlib import Path
from PIL import Image
from io import BytesIO

log = logging.getLogger(__name__)

class ImageGenerator:
    def __init__(self, model='flux.1-schnell', api_url='http://localhost:7860'):
        """
        Initialize image generator
        model: 'flux.1-schnell', 'sdxl', or 'stable-diffusion-3'
        api_url: Automatic1111 Stable Diffusion WebUI or compatible API
        """
        self.model = model
        self.api_url = api_url
        self.output_dir = Path(__file__).parent.parent / 'books' / 'current' / 'images'
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_illustration(self, prompt, chapter_id, style='storybook illustration, detailed, whimsical'):
        """
        Generate an illustration for a chapter
        Returns: Path to saved image or None
        """
        try:
            # Enhance prompt with style
            full_prompt = f"{prompt}, {style}"
            
            # Call Stable Diffusion API
            payload = {
                'prompt': full_prompt,
                'negative_prompt': 'low quality, blurry, distorted',
                'steps': 20,
                'sampler_name': 'DPM++ 2M Karras',
                'cfg_scale': 7.0,
                'width': 512,
                'height': 512,
                'seed': -1
            }
            
            response = requests.post(
                f'{self.api_url}/sdapi/v1/txt2img',
                json=payload,
                timeout=120
            )
            
            if response.status_code != 200:
                log.error(f"SD API error: {response.status_code}")
                return None
            
            # Save image
            result = response.json()
            if 'images' not in result or len(result['images']) == 0:
                log.error("No image in response")
                return None
            
            image_data = result['images'][0]
            
            # Decode base64 and save
            import base64
            image_bytes = base64.b64decode(image_data)
            
            image_path = self.output_dir / f"chapter_{chapter_id}.png"
            with open(image_path, 'wb') as f:
                f.write(image_bytes)
            
            log.info(f"Illustration generated: {image_path}")
            return str(image_path)
        
        except Exception as e:
            log.error(f"Error generating illustration: {e}")
            return None
    
    def generate_for_chapters(self, chapters):
        """
        Generate illustration for each chapter
        chapters: [{"title": "...", "text": "..."}]
        Returns: Updated chapters with image_path
        """
        for i, chapter in enumerate(chapters):
            # Create prompt from chapter summary
            text = chapter.get('text', '')[:200]  # First 200 chars
            prompt = f"Storybook illustration depicting: {chapter.get('title', f'Chapter {i+1}')}. {text}"
            
            image_path = self.generate_illustration(prompt, i)
            if image_path:
                chapter['image_path'] = image_path
        
        return chapters
    
    @staticmethod
    def check_sd_available(api_url='http://localhost:7860'):
        """Check if Stable Diffusion WebUI is available"""
        try:
            response = requests.get(f'{api_url}/api/progress', timeout=5)
            return response.status_code == 200
        except:
            return False
