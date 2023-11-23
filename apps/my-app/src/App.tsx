import { OnlinePBXPluginProvider, Widget, CallWidget } from "@boilerplate/online-pbx-plugin"

import "@boilerplate/online-pbx-plugin/dist/index.css"
import svg from "./logo.svg"
import "./App.css"

function App() {
  return (
    <OnlinePBXPluginProvider
      apiKey={process.env.REACT_APP_API_KEY || ""}
      accountName={process.env.REACT_APP_ACCOUNT_NAME || ""}
      pbxExternalNumber={process.env.REACT_APP_PBX_EXTERNAL_NUMBER || ""}
    >
      <div className="App">
        <img className="App-logo" src={svg} alt="" />
      </div>
      <Widget />
      <CallWidget />
    </OnlinePBXPluginProvider>
  )
}

export default App
