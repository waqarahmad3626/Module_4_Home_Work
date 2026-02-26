import re
from pypdf import PdfReader

def clean_timestamps(text):
    # Remove timestamps like 0:00, 12:34 etc.
    return re.sub(r"\b\d{1,2}:\d{2}\b", "", text)

def load_pdf(path):
    reader = PdfReader(path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

    text = clean_timestamps(text)

    return text