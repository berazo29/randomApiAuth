
const log = {
  request: '24y73748385345fvdfv',
  ip: '124.12.1.1',
  date: '25/5/2022',
  time: '3:54 PM',
  status: 'success',
  location: 'Manhattan, NY',
  country: 'US'
}

const getLogs = (req, res) => {
  const logs = []
  logs.push(log)
  res.render('pages/logs/logs', { title: 'logs', errors: [], logs: logs })
}

module.exports = { getLogs }
