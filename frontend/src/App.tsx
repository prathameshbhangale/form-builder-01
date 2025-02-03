import Home from './pages/home'
import { Routes, Route , Router} from "react-router-dom"
import LoginPage from './pages/login'
import SignUpPage from './pages/signin'
import Forms from './pages/forms'
import Navbar from './components/common/Navbar'
import CreateFormPage from './pages/createform'
import FormFieldContainer from './pages/fromfields'
import FormResponse from './pages/formResponse'

function App() {


  return (
    <>
    <div className="App">
        <Routes>
          <Route path="/" element={ <Navbar/> } >
            <Route path="/" element={ <Home/> } />
            <Route path="/form/initilize" element={<CreateFormPage />} />
            <Route path="/forms" element={<Forms />}/>
          </Route>
          <Route path="/form/create/:formid" element={<FormFieldContainer/>}/>
          <Route path="/login" element={ <LoginPage/> } />
          <Route path="/resp/:FormResponseToken" element={ <FormResponse/> } />
          <Route path="/signup" element={ <SignUpPage/> } />
        </Routes>
    </div>
    </>
  )
}

export default App
