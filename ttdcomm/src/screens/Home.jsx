import { Row, Col, Button } from "react-bootstrap";
import React from "react";
import Product from "../components/Product";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

const Home = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  // if we pass empty array as dependency it will run only once when he  page reloads
  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/">
          <Button className="btn-btn-light mb-4" variant="light">
            &lArr; Go Back
          </Button>
        </Link>
      )}
      {isLoading ? (
        <>
          <div className="text-center">
            <span className="loader"></span>
          </div>
        </>
      ) : isError ? (
        <div>
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        </div>
      ) : (
        <>
        <Meta/>
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col md={6} sm={12} lg={4} xl={3}>
                <Product product={product} key={product._id} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default Home;
