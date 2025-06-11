
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SchPost from './components/SchPost';
import { store } from './store';
import { Provider } from 'react-redux';
import Homepage from './components/Homepage';
import Schedule from './components/Schedule';
const App = () => {
  return(
     <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/schedulePost" element={<SchPost />} />
        <Route path="/Homepage" element= {<Homepage />} />
        <Route path='/Schedule' element={<Schedule />}/>
        {/* <Route path='/Posts' element={<Posts />}/> */}
      </Routes>
    </Router>
    </Provider>
  );
};

export default App;
