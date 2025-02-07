// import H from './pages/home'
import HomePage from "./pages/home"
import { Routes, Route , Router} from "react-router-dom"
import LoginPage from './pages/login'
import SignUpPage from './pages/signin'
import Forms from './pages/forms'
import Navbar from './components/common/Navbar'
import CreateFormPage from './pages/createform'
import FormFieldContainer from './pages/fromfields'
import FormResponse from './pages/formResponse'
import FormResponsePage from './pages/responseDashboard'
import SuccessPage from './pages/success'

function App() {


  return (
    <>
    <div className="App">
        <Routes>
          <Route path="/" element={ <Navbar/> } >
            <Route path="/" element={ <HomePage/> } />
            <Route path="/form/initilize" element={<CreateFormPage />} />
            <Route path="/forms" element={<Forms />}/>
            <Route path="/responses" element={<FormResponsePage />}/>
          </Route>
          <Route path="/form/create/:formid" element={<FormFieldContainer/>}/>
          <Route path="/login" element={ <LoginPage/> } />
          <Route path="/resp/:FormResponseToken" element={ <FormResponse/> } />
          <Route path="/signup" element={ <SignUpPage/> } />
          <Route path="/success" element={<SuccessPage />} />

        </Routes>
    </div>
    </>
  )
}

export default App
