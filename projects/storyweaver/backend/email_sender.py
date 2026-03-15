#!/usr/bin/env python3
"""
Email Sender — Send generated books to Kindle via Gmail SMTP
"""

import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
from pathlib import Path

log = logging.getLogger(__name__)

class EmailSender:
    def __init__(self, gmail_address=None, gmail_password=None):
        """
        Initialize email sender with Gmail credentials
        Get app-specific password: https://myaccount.google.com/apppasswords
        """
        self.gmail_address = gmail_address or os.getenv('GMAIL_ADDRESS')
        self.gmail_password = gmail_password or os.getenv('GMAIL_APP_PASSWORD')
    
    def send_to_kindle(self, book_path, kindle_email, book_title='Book'):
        """
        Send MOBI/EPUB to Kindle email
        Kindle accepts: MOBI, AZW, PDF, EPUB (convert to MOBI for better formatting)
        """
        if not self.gmail_address or not self.gmail_password:
            log.error("Gmail credentials not configured in .env")
            return False
        
        if not Path(book_path).exists():
            log.error(f"Book file not found: {book_path}")
            return False
        
        try:
            # Create email
            msg = MIMEMultipart()
            msg['From'] = self.gmail_address
            msg['To'] = kindle_email
            msg['Subject'] = book_title
            
            # Body
            body = f"Your story '{book_title}' is ready to read on your Kindle."
            msg.attach(MIMEText(body, 'plain'))
            
            # Attach book
            with open(book_path, 'rb') as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
            
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename= {Path(book_path).name}')
            msg.attach(part)
            
            # Send via Gmail SMTP
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(self.gmail_address, self.gmail_password)
            server.send_message(msg)
            server.quit()
            
            log.info(f"Book sent to Kindle: {kindle_email}")
            return True
        
        except smtplib.SMTPAuthenticationError:
            log.error("Gmail authentication failed. Check credentials in .env")
            return False
        except Exception as e:
            log.error(f"Error sending email: {e}")
            return False
    
    def send_custom(self, recipient_email, subject, body, attachments=None):
        """
        Send custom email with attachments
        attachments: ['/path/to/file1', '/path/to/file2']
        """
        if not self.gmail_address or not self.gmail_password:
            log.error("Gmail credentials not configured")
            return False
        
        try:
            msg = MIMEMultipart()
            msg['From'] = self.gmail_address
            msg['To'] = recipient_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            # Attach files
            if attachments:
                for file_path in attachments:
                    if Path(file_path).exists():
                        with open(file_path, 'rb') as f:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(f.read())
                        encoders.encode_base64(part)
                        part.add_header('Content-Disposition', f'attachment; filename= {Path(file_path).name}')
                        msg.attach(part)
            
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(self.gmail_address, self.gmail_password)
            server.send_message(msg)
            server.quit()
            
            log.info(f"Email sent to {recipient_email}")
            return True
        
        except Exception as e:
            log.error(f"Error sending email: {e}")
            return False
