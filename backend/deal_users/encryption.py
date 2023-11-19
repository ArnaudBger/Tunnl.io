from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from django.conf import settings


def encrypt(token):
    iv = get_random_bytes(AES.block_size)
    cipher = AES.new(bytes.fromhex(settings.ENCRYPTION_KEY), AES.MODE_CBC, iv)
    padded_token = pad(token.encode(), AES.block_size)
    encrypted_token = cipher.encrypt(padded_token)
    ciphertext = iv + encrypted_token
    encoded_token = ciphertext.hex()
    return encoded_token


def decrypt(encrypted_key):
    try:
        ciphertext = bytes.fromhex(encrypted_key)
        iv = ciphertext[:AES.block_size]
        cipher = AES.new(bytes.fromhex(
            settings.ENCRYPTION_KEY), AES.MODE_CBC, iv)
        decrypted_token = unpad(cipher.decrypt(
            ciphertext[AES.block_size:]), AES.block_size).decode()
        return decrypted_token
    except:
        return None

