require('dotenv').config({ path: './.env' })
const express = require('express')
const getScreenshortwithSelecter = require('./helpers/getScreenshortwithSelecter');
const getScreenshortwithoutSelecter = require('./helpers/getScreenshortwithoutSelecter');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('OK'))
app.use(express.json())
app.use(cors({
    origin: '*'
}))
// Post requests
app.post('/api/htmltojpegwithselecter', async (req, res) => {
    const { html, css, selecter = '.container', delay = 1000, width, height } = req.body
    const { responsetype } = req.headers
    if (!html) return res.status(400).send('required html')
    await getScreenshortwithSelecter(html, css, selecter, delay, width, height, responsetype, res)
})

app.post('/api/htmltojpegwithoutselecter', async (req, res) => {
    const { html, css, delay = 1000, width, height } = req.body
    const { responsetype } = req.headers
    if (!html) return res.status(400).send('required html')
    await getScreenshortwithoutSelecter(html, css, delay, width, height, responsetype, res)
})


app.listen(port, () => console.log(` Server running on port : ${port}!`))