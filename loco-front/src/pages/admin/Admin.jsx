import { Route, Routes } from "react-router-dom";
import AdminpageMain from "../../components/admin/AdminpageMain";
import ForbiddenPage from "../../components/admin/ForbiddenPage";

const Admin = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminpageMain />} />
        <Route path="/403" element={<ForbiddenPage />} />
      </Routes>
    </>
  );
};

export default Admin;
