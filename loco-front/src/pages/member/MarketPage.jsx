import { Routes, Route, Outlet } from 'react-router-dom';
import ProductPage from '../../components/member/Market/ProductPage';
import ProductInsert from '../../components/member/Market/ProductInsert';
import ProductInfo from '../../components/member/Market/ProductInfo';
import ProductUpdate from '../../components/member/Market/ProductUpdate';
import ProductRemove from '../../components/member/Market/ProductRemove';
import { PaymentSuccess } from '../../components/member/Market/PaymentSuccess';
import { PaymentFail } from '../../components/member/Market/PaymentFail';

export default function MarketPage() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="insert" element={<ProductInsert />} />
        <Route path="info/:id" element={<ProductInfo />} />
        <Route path="update/:id" element={<ProductUpdate />} />
        <Route path="remove" element={<ProductRemove />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="payment-fail" element={<PaymentFail />} />
      </Routes>
    </>
  );
}
