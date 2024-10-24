"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useToaster } from "@/hooks";
import { handlePostData, postSelector } from "@/redux/post";
import { API_ROUTER } from "@/services/apiRouter";
import axiosApiCall from "@/utils/axios";
import { TOAST_ALERTS, TOAST_TYPES } from "@/utils/constants";

export default function Home() {
  // states
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { toaster } = useToaster();
  // Redux Hooks
  const dispatch = useDispatch();
  const { postData } = useSelector(postSelector);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required("Product name is required")
      .min(3, "Product name must be at least 3 characters long"),
    description: yup.string().required("description is required"),
    dueDate: yup.date().required("Due date is required"),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      dueDate: null,
    },
  });

  const fetchPost = async () => {
    try {
      const res = await axiosApiCall.get(API_ROUTER?.GET_POSTS, {
        params: {
          _page: page,
        },
      });
      if (!res?.status) {
        return res;
      } else {
        setProducts(res?.data);
        dispatch(handlePostData(res?.data));
        setTotalPages(10);
      }
    } catch (error) {
      // return error
      toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
  };

  const handleAddProduct = async (data) => {
    try {
      let param = {
        title: data?.name,
        body: data?.description,
        userId: 1,
      };
      const res = await axiosApiCall.post(API_ROUTER?.GET_POSTS, param);
      if (!res?.status) {
        return toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
      } else {
        toaster("Post added successfully", TOAST_TYPES.SUCCESS);
        setDialogOpen(false);
        fetchPost(page);
      }
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  const handleUpdateProduct = async (id, data) => {
    try {
      await axiosApiCall.put(`${API_ROUTER?.GET_POSTS}/${id}`, { name: data.name });
      setDialogOpen(false);
      fetchPost(page);
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axiosApiCall.delete(`${API_ROUTER?.GET_POSTS}/${id}`);
      fetchPost(page);
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const openDialog = (product) => {
    setEditingProduct(product);
    reset({ name: product ? product.name : "" }); // Reset form when opening dialog
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    reset({ name: "" });
  };

  const onSubmit = (data) => {
    if (editingProduct) {
      handleUpdateProduct(editingProduct.id, data);
    } else {
      handleAddProduct(data);
    }
  };

  const convertToCSV = (data) => {
    const headers = ["ID", "Name"];
    const rows = data.map((product) => [product.id, product.title]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });
    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV(products);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  useEffect(() => {
    fetchPost();
  }, [page]);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => openDialog(null)}>
        Add Product
      </Button>
      <Button variant="contained" color="primary" onClick={downloadCSV}>
        Download CSV
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => openDialog(product)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Product Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Product description"
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description ? errors.description.message : ""}
                />
              )}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Due Date"
                    inputFormat="dd/MM/yyyy"
                    disablePast={true}
                    // onError={(newError) => setError("dueDate", "please select the date.")}
                    slotProps={{
                      textField: {
                        helperText: errors?.dueDate?.message,
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="dense"
                        fullWidth
                        error={!!errors.dueDate}
                        helperText={errors.dueDate ? errors.dueDate.message : ""}
                      />
                    )}
                    {...field}
                  />
                )}
              />
            </LocalizationProvider>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}>{editingProduct ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
