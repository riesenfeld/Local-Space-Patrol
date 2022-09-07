import nodeFetch from 'node-fetch'

const getObjects = async function () {
  const response = await nodeFetch(
    `https://api.cosmicjs.com/v2/buckets/${
      process.env.BUCKET_SLUG
    }/objects?read_key=${process.env.READ_KEY}&query=${encodeURIComponent(
      `{ "type": "${process.env.OBJECT_TYPE}" }`
    )}`
  )
  return response.json()
}

exports.handler = async function () {
  const response = await getObjects()

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  }
}
