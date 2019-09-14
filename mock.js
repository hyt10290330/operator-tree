const express = require('express')
const app = express()
const appData = require('./data.json')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings
const apiRoutes = express.Router()
apiRoutes.get('/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller,
  })
})
apiRoutes.get('/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods,
  })
})
apiRoutes.get('/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings,
  })
})
app.use('/', apiRoutes)
app.listen(8081, () => {
  console.log('mock data is Running')
})
