var formdata = new FormData()
formdata.append("url", "https://www.instagram.com/p/C0ZsIBAqxnV/")

fetch("https://deal.testnetmint.com/users/checkLikesForInsPost/C0ZsIBAqxnV")
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error))
