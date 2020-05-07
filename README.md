# Cloudfront Prerender Integration

This is a simple script that creates a Lambda@Edge function to check if the User-Agent of the request made to cloudfront is a crawler/bot, and if so, redirects the response to the [prerender.io](https://prerender.io) service with your token.

[prerender.io](https://prerender.io) loads your SPA, executes the javascript, waits for all the requests made by the SPA, and then returns the resulting HTML.

This is a good way to still use static front-ends and benefit from the ease of the deployment and low cost of this kind of solution, without the major drawback of bad SEO. If SEO is the main concern and reason to use server-side rendering, this can be an alternative.

## How to use

You need two environment variables set during the run time of the scripts: `PRERENDER_TOKEN` (your prerender.io token) and `CLOUDFRONT_DISTRIBUTION_ID` (your SPA cloudfront distribution ID).

Then, run `yarn deploy` and `yarn map` afterwards.

```sh
#set environment variables
export PRERENDER_TOKEN=myPrerenderToken
export CLOUDFRONT_DISTRIBUTION_ID=myCloudFrontDistributionId

#creates and deploys the lambda@edge functions
yarn deploy 
#maps the lambda@edge functions to your cloudfront distribution, and invalidates the cache
yarn map
```

Lambda@Edge functions can't have environment variables so the scripts uses `sed` to replace the prerender token inside the lambda deployed file directly.

### Final considerations

This script was based on the [Prerendercloud Lambda@Edge](https://github.com/sanfrancesco/prerendercloud-lambda-edge) script.

I do not have any kind of association with the prerender.io service.
