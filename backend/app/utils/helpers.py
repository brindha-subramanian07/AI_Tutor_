import re
from typing import Any, Dict


def slugify(text: str) -> str:
    """Converts a title or topic string to a URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


def truncate_text(text: str, max_chars: int = 150) -> str:
    """Truncates text nicely to max_chars with ellipsis."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rsplit(" ", 1)[0] + "..."
