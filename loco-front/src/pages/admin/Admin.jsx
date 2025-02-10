import { Route, Routes } from "react-router-dom";
import AdminpageMain from "../../components/admin/AdminpageMain";

const Admin = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminpageMain />} />
      </Routes>
    </>
  );
};

export default Admin;
