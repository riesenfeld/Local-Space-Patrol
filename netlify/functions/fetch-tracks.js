import nodeFetch from 'node-fetch'

/* MOVE TO ENV VARS */
const BUCKET_SLUG = 'template-vue-music-website-production'
const READ_KEY = 'GqdIpxdAn1W44s8FMYdSyJ6edqijwLtx2b5BkF6qHztVjza7jp'
const OBJECT_TYPE = 'audio'

const getObjects = async function () {
  const response = await nodeFetch(
    `https://api.cosmicjs.com/v2/buckets/${BUCKET_SLUG}/objects?read_key=${READ_KEY}&query=${encodeURIComponent(
      `{ "type": "${OBJECT_TYPE}" }`
    )}`
  )
  return response.json()
}

exports.handler = async function () {
  const response = {
    tracks: await getObjects(),
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  }
}
