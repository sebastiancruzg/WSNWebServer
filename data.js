import { data, application } from "ttn"

const appID = "wsn-otaa"
const accessKey = "arizaje.NNSXS.M7BCLFDZVTBSWVB7VOT53B2RQAU7C5KYMFV6ZSY.5MNI4PTSUMBNMGF27OR7PNYYBCY5JZ3ASS2BXIQUZG4XNNHBAE4Q"

// discover handler and open mqtt connection
data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload)
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })

// discover handler and open application manager client
application(appID, accessKey)
  .then(function (client) {
    return client.get()
  })
  .then(function (app) {
    console.log("Got app", app)
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })