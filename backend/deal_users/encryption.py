from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from django.conf import settings
from Crypto.Random import get_random_bytes
from eth_account.signers.local import LocalAccount
from .createWallet import create_wallet

# def generate_hexadecimal_encryption_key(key_size=32):
#     key_bytes = get_random_bytes(key_size)
#     return key_bytes.hex()


# encryption_key = generate_hexadecimal_encryption_key()
# print(encryption_key)


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


def encrypt_private_key(privateKey) -> str:
    key_bytes = bytes.fromhex(settings.ENCRYPTION_KEY)

    # Convert the private key to a hexadecimal string and then to a normal string
    private_key_str = privateKey

    iv = get_random_bytes(AES.block_size)
    cipher = AES.new(key_bytes, AES.MODE_CBC, iv)
    encrypted_private_key = cipher.encrypt(
        pad(private_key_str.encode(), AES.block_size))

    return (iv + encrypted_private_key).hex()


def decrypt_private_key(encrypted_hex_data):
    key_bytes = bytes.fromhex(settings.ENCRYPTION_KEY)
    encrypted_data = bytes.fromhex(encrypted_hex_data)

    iv = encrypted_data[:AES.block_size]
    encrypted_private_key = encrypted_data[AES.block_size:]

    cipher = AES.new(key_bytes, AES.MODE_CBC, iv)
    decrypted_private_key = unpad(cipher.decrypt(
        encrypted_private_key), AES.block_size)

    return decrypted_private_key.decode()
