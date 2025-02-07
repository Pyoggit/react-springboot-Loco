import { Routes, Route, Outlet } from "react-router-dom";
import ProductPage from "../../components/member/Market/ProductPage";
import ProductInsert from "../../components/member/Market/ProductInsert";
import ProductInfo from "../../components/member/Market/ProductInfo";

export default function MarketPage() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="insert" element={<ProductInsert />} />
        <Route path="info/:id" element={<ProductInfo />} />
      </Routes>
    </>
  );
}
