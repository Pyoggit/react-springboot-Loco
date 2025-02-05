import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProductItem from "./ProductItem";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";

function ListCircle() {
  const navigate = useNavigate();
  const [items, setProductList] = useState([]);
  const product_name = useRef();

  //비동기 처리방식
  function getList(url) {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProductList(data);
      });
  }
  //마운트 될때 비동기 방식 처리
  useEffect(() => {
    getList("http://localhost:8080/product/list");
  }, []);
  return (
    <>
      <Container className="text-center p-5">
        <h2>LOCO CIRCLE</h2>
        <Row className="align-items-center mt-5">
          <Col md={10}>
            <FloatingLabel label="상품명입력" className="mb-1">
              <Form.Control
                name="product_name"
                ref={product_name}
                className="mb-2"
              />
            </FloatingLabel>
          </Col>
          <Col md={2}>
            <Button
              type="button"
              className="mb-2 "
              onClick={() => {
                getList(
                  `http://localhost:8080/product/list?product_name=${product_name.current.value}`
                );
              }}
            >
              조회
            </Button>
          </Col>
        </Row>
        <br />
        <br />
        <Button onClick={() => navigate("/product/write")}>상품등록</Button>
        <hr />
        등록된 상품수: {items.length}
        <br />
        <br />
        <Row className="display-content-around mt-5 gap-4">
          {items.map(({ PRODUCT_CODE, PRODUCT_NAME, PRICE, FILENAME }) => (
            <ProductItem
              product_code={PRODUCT_CODE}
              product_name={PRODUCT_NAME}
              price={PRICE}
              filename={FILENAME}
              key={PRODUCT_CODE}
            />
          ))}
        </Row>
      </Container>
    </>
  );
}
export default ListCircle;
