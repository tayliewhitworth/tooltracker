import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";

import { PulseLoader } from "react-spinners";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(null, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#868dfb"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;

    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <table className="table users-table">
        <thead className="table_head thead">
          <tr className="tr">
            <th scope="col" className="table_th users-username">
              Username
            </th>
            <th scope="col" className="table_th users-roles">
              Roles
            </th>
            <th scope="col" className="table_th users-edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody className="tbody">{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default UsersList;
