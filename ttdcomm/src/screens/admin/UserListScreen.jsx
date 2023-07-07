import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Row, Col, Table, Button } from "react-bootstrap";
import Message from "../../components/Message";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  console.log(users);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure??? ")) {
      try {
        await deleteUser(id);
        toast.success('User deleted')
        refetch();
      } catch (err) {
        toast.error(err?.data?.mesaage || err.error);
      }
    } else {
    }
  };

  return (
    <div>
      <h1>Users</h1>

      {isLoading ? (
        <span className="loader"></span>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a
                    href={`mailto: ${user.email}`}
                    style={{
                      textDecoration: "none",
                      textUnderlineOffset: "none",
                    }}
                  >
                    {user.email}
                  </a>
                </td>

                <td>
                  {user.isAdmin ? (
                    <FaCheck color="green" />
                  ) : (
                    <FaTimes color="red" />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash color="red" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListScreen;
