from web3 import Web3
import os
from dotenv import load_dotenv
load_dotenv()


def transferFundForRegisteredUser(receiver_address: str):
    # Connect to Ethereum node
    infura_url = os.environ.get("INFURA_URL")
    web3 = Web3(Web3.HTTPProvider(infura_url))

    # Check if the connection is successful
    if not web3.isConnected():
        print("Failed to connect to Ethereum node.")
        exit()

    # Sender and Receiver Details
    sender_address = os.environ.get("SENDER_ADDRESS")
    private_key = os.environ.get("FACET_PRIVATE_KEY")

    amount = web3.toWei(0.02, 'ether')
    nonce = web3.eth.getTransactionCount(sender_address)

    tx = {
        'nonce': nonce,
        'to': receiver_address,
        'value': amount,
        'gas': 2000000,
        'gasPrice': web3.toWei('10', 'gwei'),
    }

    signed_tx = web3.eth.account.sign_transaction(tx, private_key)

    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return Web3.toHex(tx_hash)
