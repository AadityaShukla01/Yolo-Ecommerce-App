import React, { useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { useGetOrderDetailsQuery } from "../slices/orderApiSlice";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliveredAtMutation,
} from "../slices/orderApiSlice";
import { toast } from "react-toastify";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";

const AfterOrder = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    isError,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading:loadingDeliver, error }] = useDeliveredAtMutation();

  const [payOrder, { loading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPaypal, errorPaypal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  //   TESTING ONLY! REMOVE BEFORE PRODUCTION
  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();

    toast.success("Order is paid");
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

    const deliverOrderHandler = async () => {
      await deliverOrder(orderId);
      refetch();
    };

  return isLoading ? (
    <span className="loader"></span>
  ) : isError ? (
    <Message variant="danger" />
  ) : (
    <>
      <h1 style={{ fontSize: 28, marginTop: 8, fontWeight: 540 }}>
        Order {order._id}
      </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item
              style={{ fontSize: 18, marginTop: 8, fontWeight: 340 }}
            >
              <h2 style={{ fontSize: 28, marginTop: 8, fontWeight: 540 }}>
                Shipping:
              </h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p style={{ fontSize: 18, marginTop: 8, fontWeight: 340 }}>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country} .
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item
              style={{ fontSize: 18, marginTop: 8, fontWeight: 340 }}
            >
              <h2 style={{ fontSize: 28, marginTop: 8, fontWeight: 540 }}>
                Payment Method:{" "}
              </h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup>
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} fluid rounded />
                      </Col>
                      <Col md={4}>
                        {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                      </Col>
                      
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card style={{ fontSize: 18 }}>
            <ListGroup variant="flush">
              <ListGroup.Item>Order Summary</ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items: </Col>
                  <Col>₹{order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping: </Col>
                  <Col>₹{order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Tax: </Col>
                  <Col>₹{order.taxPrice}</Col>
                </Row>
                <Row>
                  <Col>Total: </Col>
                  <Col>₹{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Pay order placeholder */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <span className="loader"></span>}

                  {isPending ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <div>
                        <Button
                          onClick={onApproveTest}
                          style={{ marginBottom: "10px" }}
                        >
                          Test Pay order
                        </Button>
                      </div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </>
                  )}
                </ListGroup.Item>
              )}
              {/* marks as delivered */}
              {loadingDeliver && <span classname="loader"></span>}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                   <Button type="button" className="btn btn-secondary" onClick={deliverOrderHandler}>Mark as delivered </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AfterOrder;
