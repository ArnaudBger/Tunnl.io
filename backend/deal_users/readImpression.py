import requests


def readImpression(qurl):
    url = "https://instagram130.p.rapidapi.com/media-info-by-url"

    querystring = {"url": f"{qurl}"}

    headers = {
        "X-RapidAPI-Key": "6dc706fc5cmsh80fa0743a60727ep127c9ejsn9daac1529ef3",
        "X-RapidAPI-Host": "instagram130.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    url = f"https://api.hikerapi.com/v1/media/insight?media_id={response.json()['id']}"
    params = {
        'username': 'sun',
        'access_key': 'JyePDmRnjrtZ7952WL82qeOHvsRZBkEF'
    }
    headers = {
        'accept': 'application/json'
    }

    response = requests.get(url, headers=headers, params=params)
    res = response.json()
    return res['like_count']
