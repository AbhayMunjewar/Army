import hmac
import hashlib
import json
import base64
from django.conf import settings
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from functools import wraps
from rest_framework.response import Response
from rest_framework import status

# AES-256 Key derivation
AES_KEY = hashlib.sha256(getattr(settings, 'AES_SECRET_KEY', b'RAKSHAK_SECRET_KEY_32_BYTES_LONG')).digest()
HMAC_KEY = getattr(settings, 'HMAC_SECRET_KEY', b'RAKSHAK_HMAC_SECRET_KEY_32_BYTES')


def encrypt_payload(data_dict: dict) -> str:
    """Encrypts a Python dictionary payload using AES-256-GCM."""
    try:
        json_str = json.dumps(data_dict)
        aesgcm = AESGCM(AES_KEY)
        nonce = hashlib.sha256(json_str.encode()).digest()[:12]
        ct = aesgcm.encrypt(nonce, json_str.encode(), None)
        combined = nonce + ct
        return base64.b64encode(combined).decode('utf-8')
    except Exception as e:
        return f"ENCRYPT_ERROR: {str(e)}"


def decrypt_payload(encrypted_b64: str) -> dict:
    """Decrypts an AES-256-GCM base64 string back into a Python dictionary."""
    try:
        combined = base64.b64decode(encrypted_b64.encode('utf-8'))
        nonce = combined[:12]
        ct = combined[12:]
        aesgcm = AESGCM(AES_KEY)
        decrypted_bytes = aesgcm.decrypt(nonce, ct, None)
        return json.loads(decrypted_bytes.decode('utf-8'))
    except Exception as e:
        return {"error": f"DECRYPT_FAILED: {str(e)}"}


def sign_qr_payload(payload_str: str) -> str:
    """Computes an HMAC-SHA256 signature for a QR scan payload."""
    signature = hmac.new(HMAC_KEY, payload_str.encode('utf-8'), hashlib.sha256).hexdigest()
    return signature


def verify_qr_signature(payload_str: str, signature: str) -> bool:
    """Verifies HMAC-SHA256 signature match."""
    expected_sig = sign_qr_payload(payload_str)
    return hmac.compare_digest(expected_sig, signature)


def compute_audit_hash(prev_hash: str, event_type: str, role: str, description: str, timestamp_str: str) -> str:
    """Computes SHA-256 hash for immutable audit logging chain."""
    raw_data = f"{prev_hash}|{event_type}|{role}|{description}|{timestamp_str}"
    return hashlib.sha256(raw_data.encode('utf-8')).hexdigest()


def require_military_role(allowed_roles=None):
    """Decorator to enforce role-based access control from headers or body."""
    if allowed_roles is None:
        allowed_roles = ['DEPOT_OFFICER', 'POST_COMMANDER', 'CONVOY_LEADER']

    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            role_header = request.headers.get('X-Military-Role') or request.data.get('role') or 'DEPOT_OFFICER'
            if role_header not in allowed_roles:
                return Response({
                    "error": "ACCESS_DENIED_UNAUTHORIZED_ROLE",
                    "details": f"Role '{role_header}' is not authorized to perform this operation. Required: {allowed_roles}"
                }, status=status.HTTP_403_FORBIDDEN)
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator
