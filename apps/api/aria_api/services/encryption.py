"""AES-256 encryption for channel credentials stored at rest."""
import base64
import os
from cryptography.fernet import Fernet
from aria_api.config import get_settings


def _get_fernet() -> Fernet:
    settings = get_settings()
    key = settings.encryption_key
    if not key:
        key = base64.urlsafe_b64encode(os.urandom(32)).decode()
    if len(base64.urlsafe_b64decode(key + "==")) != 32:
        key = base64.urlsafe_b64encode(base64.urlsafe_b64decode(key + "==")[:32]).decode()
    return Fernet(key.encode() if isinstance(key, str) else key)


def encrypt(plaintext: str) -> str:
    f = _get_fernet()
    return f.encrypt(plaintext.encode()).decode()


def decrypt(ciphertext: str) -> str:
    f = _get_fernet()
    return f.decrypt(ciphertext.encode()).decode()
