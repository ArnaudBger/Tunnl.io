from eth_account import Account
import secrets


def create_wallet():
    private_key = secrets.token_hex(32)
    acct = Account.from_key(private_key)
    return acct.address, private_key
