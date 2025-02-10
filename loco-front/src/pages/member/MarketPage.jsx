import { Routes, Route, Outlet } from 'react-router-dom';
import ProductPage from '../../components/member/Market/ProductPage';
import ProductInsert from '../../components/member/Market/ProductInsert';
import ProductInfo from '../../components/member/Market/ProductInfo';
import ProductUpdate from '../../components/member/Market/ProductUpdate';
import { SuccessPage } from '../../components/member/Market/Success';
import { FailPage } from '../../components/member/Market/Fail';

export default function MarketPage() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="insert" element={<ProductInsert />} />
        <Route path="info/:id" element={<ProductInfo />} />
        <Route path="update/:id" element={<ProductUpdate />} />
        <Route path="payment-success" element={<SuccessPage />} />
        <Route path="payment-fail" element={<FailPage />} />
      </Routes>
    </>
  );
}
