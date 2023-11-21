import { OnlinePBXPluginProvider } from "@boilerplate/online-pbx-plugin"

import "./App.css"

function App() {
  return (
    <OnlinePBXPluginProvider apiKey="123">
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
    </OnlinePBXPluginProvider>
  )
}

export default App
