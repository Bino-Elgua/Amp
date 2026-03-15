#!/usr/bin/env python3
"""
Book Generator — Convert story markdown to EPUB/MOBI with pandoc
"""

import os
import subprocess
import json
from pathlib import Path
from datetime import datetime
import logging

log = logging.getLogger(__name__)

class BookGenerator:
    def __init__(self, output_dir='../books'):
        self.output_dir = Path(__file__).parent.parent / output_dir
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_epub(self, story_id, title, chapters, author='Anonymous'):
        """
        Generate EPUB from chapters
        Each chapter: {"title": "...", "text": "..."}
        """
        try:
            # Create temporary markdown file
            md_path = self.output_dir / f"story_{story_id}.md"
            epub_path = self.output_dir / f"{story_id}_{title.replace(' ', '_')}.epub"
            
            # Build markdown content
            content = f"# {title}\n\nBy {author}\n\n"
            for i, chapter in enumerate(chapters, 1):
                content += f"\n## {chapter.get('title', f'Chapter {i}')}\n\n"
                content += chapter.get('text', '') + "\n"
            
            # Write to temp file
            with open(md_path, 'w') as f:
                f.write(content)
            
            # Convert with pandoc
            cmd = [
                'pandoc',
                str(md_path),
                '-o', str(epub_path),
                '--from', 'markdown',
                '--to', 'epub3',
                f'--metadata=title:{title}',
                f'--metadata=author:{author}',
                '--toc',
                '--number-sections'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            if result.returncode != 0:
                log.error(f"Pandoc error: {result.stderr}")
                return None
            
            log.info(f"EPUB generated: {epub_path}")
            return str(epub_path)
        
        except Exception as e:
            log.error(f"Error generating EPUB: {e}")
            return None
    
    def generate_mobi(self, story_id, title, chapters, author='Anonymous'):
        """
        Generate MOBI (Kindle format) using calibre
        Falls back to EPUB if calibre unavailable
        """
        try:
            # First generate EPUB
            epub_path = self.generate_epub(story_id, title, chapters, author)
            if not epub_path:
                return None
            
            mobi_path = Path(epub_path).parent / Path(epub_path).stem + '.mobi'
            
            # Try to convert with calibre
            cmd = ['ebook-convert', epub_path, str(mobi_path)]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                log.info(f"MOBI generated: {mobi_path}")
                return str(mobi_path)
            else:
                log.warn("Calibre not available, returning EPUB instead")
                return epub_path
        
        except Exception as e:
            log.error(f"Error generating MOBI: {e}")
            return None
    
    def extract_chapters(self, markdown_content):
        """
        Extract chapters from markdown (assumes ## Chapter structure)
        Returns: [{"title": "...", "text": "..."}]
        """
        chapters = []
        current_chapter = None
        
        lines = markdown_content.split('\n')
        for line in lines:
            if line.startswith('## '):
                if current_chapter:
                    chapters.append(current_chapter)
                current_chapter = {
                    'title': line[3:].strip(),
                    'text': ''
                }
            elif current_chapter is not None:
                current_chapter['text'] += line + '\n'
        
        if current_chapter:
            chapters.append(current_chapter)
        
        return chapters
