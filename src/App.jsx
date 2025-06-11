
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SchPost from './components/SchPost';
import { store } from './store';
import { Provider } from 'react-redux';
import Homepage from './components/Homepage';
import Schedule from './components/Schedule';
import Login from './components/Login_page';
import axios from 'axios';
import Analytics from './components/Analytics';
const App = () => {
  return(
     <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/Schedule" element={<SchPost />} />
        <Route path= "/Analytics" element = {<Analytics/>} />
        <Route path="/Homepage" element= {<Homepage />} />
        <Route path='/schedulePost' element={<Schedule />}/>
        {/* <Route path='/Posts' element={<Posts />}/> */}
      </Routes>
    </Router>
    </Provider>
  );
};

export default App;
