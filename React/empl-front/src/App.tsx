import './App.css'
import Home from './components/Home'
import AddEmpl from './components/AddEmple'
import EmplDetails from './components/EmplDetails'
import ListEmpl from './components/ListEmpl'
import { BrowserRouter , Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEmpl />} />
          <Route path="/list" element={<ListEmpl />} />
          <Route path="/details/:id" element={<EmplDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
