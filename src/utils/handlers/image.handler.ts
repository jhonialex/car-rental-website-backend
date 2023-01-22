import axios from 'axios'
import FormData from 'form-data'

async function uploadImage(buffer: Buffer) {
    let url = null
    let formdata = new FormData()
    formdata.append('file', buffer)
    await axios(
        {
            method: 'post',
            url: process.env.CLOUDFLARE_URL,
            data: formdata,
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        })
        .then(async (res) => {
            url = res.data.result.variants[0]
        })
        .catch((err) => {
            url = null
        })
    return url
}

export { uploadImage }