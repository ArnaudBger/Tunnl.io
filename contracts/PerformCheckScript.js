const REGEX = /(?:https?:\/\/www\.)?instagram\.com\S*?\/p\/(\w{11})\/?/

const API_URL = "https://deal.testnetmint.com/users/checkLikesForInsPost/"

/// GET THE INSTAGRAM POST PERFORMANCE
async function getPostPerformance(url) {
  const postid = url.match(REGEX)[1]
  const postDetails = await Functions.makeHttpRequest({
    url: `${API_URL}${postid}`,
    timeout: 60 * 1000,
  })

  return Number(postDetails.data.likes)
}

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const postURL = args[0]

//CHECK FEW THINGS
return Functions.encodeUint256(await getPostPerformance(postURL))
