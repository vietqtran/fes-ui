"use client";

import * as React from "react";

import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridValueGetterParams,
} from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ManagerLayout from "@/components/Common/Layouts/ManagerLayout";
import ModalMajor from "@/components/Common/Modals/ModalMajor";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { RootState } from "@/helpers/redux/reducers";
import useMajor from "@/hooks/Major";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function page() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  if (!user || user.role.name !== "MANAGER") {
    router.push("/login");
  }

  const { majors, fetchMajor, deleteMajor } = useMajor();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    setId("");
    setAction("create");
  };
  const handleClose = () => {
    fetchMajor();
    setOpen(false);
  };

  const [id, setId] = React.useState("");

  const [action, setAction] = React.useState("");

  const handleView = async (idMajor: string) => {
    setAction("view");
    setId(idMajor);
    setOpen(true);
  };

  const handleUpdate = async (idMajor: string) => {
    setAction("update");
    setId(idMajor);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMajor(id);
    console.log(`Delete button clicked for row with ID: ${id}`);
  };

  const hanldeOpenMajor = (id:string) => {
    router.push(`/manager/majors/${id}`);
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 300 },
    {
      field: "code",
      headerName: "Code",
      width: 80,
    },
    { field: "name", headerName: "Major Name", width: 250 },
    { field: "createAt", headerName: "Create At", width: 250 },
    { field: "updateAt", headerName: "Update At", width: 250 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <div style={{ color: params.row.status ? "green" : "red" }}>
          {params.row.status ? "Active" : "Inactive"}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="flex gap-5">
          <button
            className="rounded bg-blue-500 px-2 py-2 font-bold text-white hover:bg-blue-600"
            onClick={() => hanldeOpenMajor(params.row.id)}
          >
            <VisibilityIcon />
          </button>
          <button
            className="rounded bg-yellow-500 px-2 py-2 font-bold text-white hover:bg-yellow-600"
            onClick={() => handleUpdate(params.row.id)}
          >
            <EditIcon />
          </button>
          <button
            className="rounded bg-red-500 px-2 py-2 font-bold text-white hover:bg-red-700"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <ManagerLayout>
      <div className="container">
        <h1 className="my-8 text-3xl font-bold">List of Majors</h1>
        <div className="flex justify-end">
          <button
            className="mb-4 flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => handleOpen()}
          >
            <AddIcon />
            Add new major
          </button>
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={majors}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
            sx={{
              ".MuiDataGrid-columnHeader": {
                outline: "none !important",
              },
            }}
            showColumnVerticalBorder={true}
            showCellVerticalBorder={true}
            slots={{
              toolbar: CustomToolbar,
            }}
          />
          <ModalMajor
            open={open}
            handleClose={handleClose}
            id={id}
            action={action}
          />
        </div>
      </div>
    </ManagerLayout>
  );
}
