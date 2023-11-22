import WebSocket from "isomorphic-ws"

import { dateCreator, dataFormatter } from "../utils"
import { IInitialState } from "src/providers"

const wsConnect = (props: IInitialState, setEvents: React.Dispatch<React.SetStateAction<string>>) => {
  const account = props.accountName
  const apiKey = props.apiKey
  const calls = props.calls ? "calls" : ""
  const gateway = props.gateway ? "gateway" : ""
  const userBlf = props.userBlf ? "userBlf" : ""
  const userRegistration = props.userRegistration ? "userRegistration" : ""

  const groupNames = [calls, gateway, userBlf, userRegistration]

  const ws = new WebSocket(`wss://${account}:3342/?key=${apiKey}`)

  ws.onopen = function () {
    ws.send(
      JSON.stringify({
        command: "subscribe",
        data: {
          eventGroups: groupNames.filter((name) => name !== ""),
        },
      }),
    )
    console.log("Connect")
  }

  ws.onmessage = function (event: any) {
    const currentDate = dateCreator()
    const data = dataFormatter(event.data)
    const strData = `${currentDate} \n${data}\n\n`
    console.log(strData)
    setEvents(strData)
  }
}

export default wsConnect
