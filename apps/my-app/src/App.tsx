import { OnlinePBXPluginProvider, Widget, CallWidget } from "@boilerplate/online-pbx-plugin"

import "@boilerplate/online-pbx-plugin/dist/index.css"
import "./App.css"

function App() {
  return (
    <OnlinePBXPluginProvider
      apiKey="bG1nOUprY1FIVmFDZEY1ZlhONTkzOGNwaFZmczlqdG8"
      accountName="pbx21135.onpbx.ru"
    >
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
      <Widget />
      <CallWidget />
    </OnlinePBXPluginProvider>
  )
}

export default App
