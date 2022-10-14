import Swal from "sweetalert2";

const UserTable = ({ users, updateData }) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const onDelete = async (event, idUser) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`/api/deleteUser?id=${idUser}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          Toast.fire({
            icon: "success",
            title: "User deleted",
          });
          const resultData = await fetch(`/api/getUsers`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          updateData(await resultData.json());
        } else if (response.status != 200) {
          Toast.fire({
            icon: "error",
            title: "Error to delete user",
          });
        }
      }
    });
  };

  return (
    <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
      <table className='min-w-full text-sm text-left text-gray-400 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-600 dark:text-white'>
          <tr>
            <th scope='col' className='py-3 px-6'>
              Name
            </th>
            <th scope='col' className='py-3 px-6'>
              Address
            </th>
            <th scope='col' className='py-3 px-6'>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            {
              return (
                <tr
                  key={user.id}
                  className='bg-white border-b dark:bg-gray-200 dark:border-gray-300'
                >
                  <th
                    scope='row'
                    className='py-3 px-6 font-normal text-gray-900 whitespace-nowrap dark:text-gray-500'
                  >
                    {user.nombre}
                  </th>
                  <td className='py-3 px-6 text-gray-500'>{user.address}</td>
                  <td className='py-3 px-6'>
                    <a
                      href='#'
                      key={user.id}
                      className='font-medium text-gray-500 hover:underline hidden'
                    >
                      Edit
                    </a>
                    <a
                      href='#'
                      className='font-medium text-red-500 hover:underline ml-3'
                      onClick={(event) => onDelete(event, `${user.id}`)}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
