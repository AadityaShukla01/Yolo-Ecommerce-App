import React from "react";
import { Card } from "react-bootstrap";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import Rating from "./Rating";
import { useGetProductsQuery } from "../slices/productApiSlice";

const Product = ({ product }) => {
  const { pageNumber, keyword } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetProductsQuery({
    keyword,
    pageNumber,
  });
  const submit = () => {
    if (keyword) {
      navigate(`/product/${product._id}`);
    }
  };
  return (
    <Card className="my-3 p-3 rounded" onClick={submit}>
      <Link to={`product/${product._id}`}>
        <Card.Img
          src={product.image}
          variant="top"
          style={{ objectFit: "cover", height: "300px" }}
        />
      </Link>
      <Card.Body>
        <Link to={`product/${product._id}`}>
          <Card.Title
            as="div"
            style={{
              // to get all cards to same height
              whiteSpace: "nowrap",
              textOverflow: "hidden",
              overflow: "hidden",
            }}
          >
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews}  people`}
          />
        </Card.Text>
        <Card.Text as="h3">₹ {product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
