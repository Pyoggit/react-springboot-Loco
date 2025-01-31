import { Route, Routes } from "react-router-dom";
import "./App.css";
import Container from "./layouts/Container";
import Member from "./pages/member/Member";
import AdminLoginMain from "./components/admin/AdminLogin/AdminLoginMain";
import LoginMain from "./components/member/Sign/LoginForm";

function App() {
  return (
    <Routes>
      <Route element={<Container />}>
        <Route path="/*" element={<Member />} />
        <Route path="/admin/login" element={<AdminLoginMain />} />
        <Route path="/member/Sign/LoginMain" element={<LoginMain />} />
        <Route path="*" element={<h1> 404 Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
