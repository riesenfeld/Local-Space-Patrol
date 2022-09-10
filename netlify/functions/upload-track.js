import nodeFetch from 'node-fetch'

const addMedia = async function (file) {
  const formData = new FormData()
  formData.append('file', file, file.name)
  formData.append('folder', process.env.MEDIA_FOLDER)
  const response = await nodeFetch(
    `https://upload.cosmicjs.com/v2/buckets/${process.env.BUCKET_SLUG}/media`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WRITE_KEY}`,
      },
      body: formData,
    }
  )
  return response.json()
}

const addObject = async function (title, metafields) {
  const params = {
    title,
    type: process.env.OBJECT_TYPE,
    metafields,
  }
  const response = await nodeFetch(
    `https://api.cosmicjs.com/v2/buckets/${process.env.BUCKET_SLUG}/objects`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WRITE_KEY}`,
      },
      body: JSON.stringify(params),
    }
  )
  return response.json()
}

const addObjectWithNewMedia = async function (objectTitle, mediaFile) {
  const { media: mediaResponse } = await addMedia(mediaFile)
  const mediaFileMetafield = {
    type: 'file',
    title: process.env.MEDIA_METAFIELD_NAME,
    key: process.env.MEDIA_METAFIELD_NAME,
    value: mediaResponse.name,
  }
  const mediaIDMetafield = {
    type: 'json',
    title: 'media_data',
    key: 'media_data',
    value: {
      id: mediaResponse.id,
    },
  }
  const response = await addObject(objectTitle, [
    mediaFileMetafield,
    mediaIDMetafield,
  ])
  return response
}

/* Use FormData with Fetch to send file to Netlify Function? */
/* Or use Netlify Forms? The form request has a maximum size limit of 8 MB. */
/* EITHER WAY: ADD NETLIFY IDENTITY BEFORE YOU PUSH THIS */
exports.handler = async function (request) {
  const requestBody = JSON.parse(request.body)
  const response = await addObjectWithNewMedia(
    requestBody.title,
    requestBody.file
  )

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  }
}
