import React from "react";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import { useGetProductsQuery } from "../../slices/productApiSlice";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const [createProduct, { isLoading: loadingCreate, error: loadingError }] =
    useCreateProductMutation();
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure"));
    try {
      await deleteProduct(id);
      refetch();
      toast.success("Product deleted ");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a product ?")) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [deleteProduct, { isLoading: loadingDelete, refetch: refetchImage }] =
    useDeleteProductMutation();

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-secondary my-3" onClick={createProductHandler}>
            <FaEdit />
            Create Product
          </Button>
        </Col>
      </Row>
      {isLoading ? (
        <span className="loader"></span>
      ) : error ? (
        <Message variant="danger"></Message>
      ) : (
        <>
          <Table striped hover responsive className="tables-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.brand}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>

                  <td>
                    <LinkContainer to={`/admin/product/${item._id}/edit`}>
                      <Button variant="light" className="btn sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="light"
                      className="btn sm mx-2"
                      onClick={() => deleteHandler(item._id)}
                    >
                      <FaTrash color="red" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="text-center">
          <Paginate pages={data.pages} page={data.page} isAdmin={true} className="text-center"/>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListScreen;
