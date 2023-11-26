// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const dealID = args[0]
const impressionsTarget = args[1]
const postURL = args[2]


//CHECK FEW THINGS

let [brandPercentage, influencerPercentage] = await getPostPerformance(postURL)

return Buffer.concat([
  Functions.encodeUint256(parseInt(dealID)),
  Functions.encodeUint256(parseInt(brandPercentage)),
  Functions.encodeUint256(parseInt(influencerPercentage))
])


// ====================
// Helper Functions
// ====================


/// GET THE INSTAGRAM POST PERFORMANCE
async function getPostPerformance(postURL) {
//   console.log("\nFetching tweet information...")
//   if (!secrets.instagramApiKey) {
//     throw new Error('Need to set Instagram API key environment variable')
//   }

//   const instagramRequestPostData = Functions.makeHttpRequest({
//     url: postURL,
//     method: "GET",
//     headers: {
//         'Authorization': `Bearer ${secrets.instagramApiKey}`
//     },
// })


//   const [postDataResponse] = await Promise.all([
//     instagramRequestPostData
//   ])

//   console.log(postDataResponse)

//   if (postDataResponse.error) {
//     throw Error(`Instagram API request failed - ${postDataResponse.response.statusText}`)
//   }

  // INSTAGRAM API GETTING DATA LOGIC

  let impressionsCount = 300
  let influencerPercentage

  if (impressionsCount >= impressionsTarget) {
    influencerPercentage = 100
  } else {
    influencerPercentage = Math.round(impressionsCount/impressionsTarget) * 100;
  }

  let brandPercentage = 100 - influencerPercentage;

  return [brandPercentage, influencerPercentage]
}