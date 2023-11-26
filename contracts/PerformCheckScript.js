// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const postURL = args[0]
const impressionsTarget = args[1]

//CHECK FEW THINGS

let BrandPercentage, InfluencerPercentage, dealID = await getPostPerformance(twitterID)

return Buffer.concat([
  Functions.encodeUint256(parseInt(BrandPercentage)),
  Functions.encodeUint256(parseInt(InfluencerPercentage)),
  Functions.encodeUint256(parseInt(dealID)),
])


// ====================
// Helper Functions
// ====================


/// GET THE INSTAGRAM POST PERFORMANCE
async function getPostPerformance(twitterID) {
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

  let impressions_count = 30000

  let BrandPercentage = Math.round(impressions_count/impressionsTarget) * 100;
  let InfluencerPercentage = 100 - BrandPercentage;

  console.log(BrandPercentage)

  return (BrandPercentage, InfluencerPercentage, dealID)
}