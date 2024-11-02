import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IndexUtama } from "./componen/IndexUtama";
import Login from "./componen/login";
import { IndexAdminPages } from "./pages/AdminPages/IndexAdminPages";
import { IndexUserPages } from "./pages/UserPages/IndexUserPages";
import { UsersAdminPages } from "./pages/AdminPages/UsersAdminPages";
import { JobPages } from "./pages/AdminPages/JobPages";
import { DataPages } from "./pages/UserPages/DataPages";

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path ="/" element={<IndexUtama />} />
    <Route path ="/login" element={<Login />} />
    <Route path ="/dashboard" element={<IndexUserPages />} />
    <Route path ="/dashboardadmin" element={<IndexAdminPages />} />
    <Route path ="/users" element={<UsersAdminPages />} />
    <Route path ="/job" element={<JobPages />} />
    <Route path ="/data" element={<DataPages />} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;
