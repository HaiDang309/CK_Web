import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Stack,
  Avatar,
  Input,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ClearIcon from "@mui/icons-material/Clear";

import Cropper from "react-cropper";

import { CustomerService, ProductService, TransactionService } from "@services";

import { CONSTANT } from "@utils";

import { useDispatch } from "react-redux";
import { SHOW_NOTI } from "src/reducers/noti";

function TaskDialog(props) {
  const dispatch = useDispatch();
  const { openDialog, setOpenDialog, type, action, row } = props;

  const [currentAvatar, setCurrentAvatar] = useState("");
  const [cropper, setCropper] = useState("");
  const [openDialogCropImg, setOpenDialogCropImg] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: row?.name || "",
    avatar: row?.avatar || "",
    email: row?.email || "",
    bio: row?.bio || "",
    gender: row?.gender || "0",
    birthday: row?.birthday || new Date(),
    isAdmin: row?.isAdmid || "0",
  });

  const [productInfo, setProductInfo] = useState({
    name: row?.name || "",
    thumbUrl: row?.thumbUrl || "",
    unitPrice: row?.unitPrice || 0,
    quantity: row?.quantity || 0,
    discount: row?.discount || 0,
    category: row?.category || "all",
  });

  const [transactionInfo, setTransactionInfo] = useState({
    date: row?.date || new Date(),
    totalAmount: row?.totalAmount || 0,
    shippingAddress: row?.shippingAddress || "",
    paymentMethod: row?.paymentMethod || "",
  });

  const getActionBtnText = (action) => {
    switch (action) {
      case "add":
        return "Th??m";
      case "edit":
        return "S???a";
      case "delete":
        return "X??a";
    }
  };

  const handleChangeAvatar = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentAvatar(reader.result);
    };
    reader.readAsDataURL(files[0]);
    setOpenDialogCropImg(true);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCustomerInfo((prev) => ({
        ...prev,
        avatar: cropper.getCroppedCanvas().toDataURL(),
      }));
    }
    handleCloseDialogCropImg();
  };

  const handleCloseDialogCropImg = () => {
    setOpenDialogCropImg(false);
  };

  const handleRemoveAvatar = () => {
    setCustomerInfo((prev) => ({
      ...prev,
      avatar: "",
    }));
  };

  const handleDoAction = (type, action) => {
    let data = null;
    if (type === "customer") {
      if (action === "edit") {
        data = {
          name: customerInfo.name || (row && row.name),
          email: customerInfo.email || (row && row.email),
          avatar: customerInfo.avatar || (row && row.avatar),
          bio: customerInfo.bio || (row && row.bio),
          gender: !!parseInt(customerInfo.gender || (row && row.gender)),
          birthday: customerInfo.birthday || (row && row.birthday),
          isAdmin: !!parseInt(customerInfo.isAdmin || (row && row.isAdmin)),
        };
        CustomerService.UPDATE_CUSTOMER(row && row.id, data)
          .then(() => {
            dispatch(
              SHOW_NOTI({
                status: "success",
                message: "C???p nh???t th??nh c??ng!",
              })
            );
          })
          .catch((err) => console.log(err))
          .finally(() => setOpenDialog(false));
      }

      if (action === "delete") {
        CustomerService.DELETE_CUSTOMER(row && row.id)
          .then(() => {
            dispatch(
              SHOW_NOTI({
                status: "success",
                message: "X??a th??nh c??ng!",
              })
            );
          })
          .catch((err) => console.log(err))
          .finally(() => setOpenDialog(false));
      }
    }

    if (type === "product") {
      if (action === "add") {
        data = {
          name: productInfo.name,
          thumbUrl:
            productInfo.thumbUrl ||
            "https://www.pngall.com/wp-content/uploads/2/Meal-PNG-Free-Image.png",
          unitPrice: parseInt(productInfo.unitPrice),
          quantity: parseInt(productInfo.quantity),
          discount: parseFloat(productInfo.discount),
          category: productInfo.category,
        };

        ProductService.CREATE_PRODUCT(data)
          .then(() => {
            dispatch(
              SHOW_NOTI({
                status: "success",
                message: "Th??m th??nh c??ng!",
              })
            );
          })
          .catch((err) => console.log(err));
      }

      if (action === "edit") {
        data = {
          name: productInfo.name || (row && row.name),
          thumbUrl:
            productInfo.thumbUrl ||
            (row && row.thumbUrl) ||
            "https://www.pngall.com/wp-content/uploads/2/Meal-PNG-Free-Image.png",
          unitPrice: parseInt(productInfo.unitPrice || (row && row.unitPrice)),
          quantity: parseInt(productInfo.quantity || (row && row.quantity)),
          discount: parseFloat(productInfo.discount || (row && row.discount)),
          category: productInfo.category || (row && row.category),
        };
        ProductService.UPDATE_PRODUCT(row.id, data)
          .then(() => {
            dispatch(
              SHOW_NOTI({
                status: "success",
                message: "C???p nh???t th??nh c??ng!",
              })
            );
          })
          .catch((err) => console.log(err));
      }

      if (action === "delete") {
        ProductService.DELETE_PRODUCT(row.id)
          .then(() => {
            dispatch(
              SHOW_NOTI({
                status: "success",
                message: "X??a th??nh c??ng!",
              })
            );
          })
          .catch((err) => console.log(err));
      }

      setOpenDialog(false);
    }

    if (type === "transaction") {
      if (action === "edit") {
        data = {
          date: transactionInfo.date || new Date(),
          totalAmount: parseInt(transactionInfo.totalAmount),
          shippingAddress: transactionInfo.shippingAddress,
          paymentMethod: transactionInfo.paymentMethod,
        };

        TransactionService.UPDATE_TRANSACTION(row && row.id, data)
          .then(() => {
            dispatch(
              SHOW_NOTI({
                status: "success",
                message: "C???p nh???t th??nh c??ng!",
              })
            );
          })
          .catch((err) => console.log(err));
      }
    }

    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogContent>
        {type === "customer" && action !== "delete" && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Avatar
                    sx={{
                      width: 128,
                      height: 128,
                      fontSize: "56px",
                    }}
                    src={customerInfo.avatar || (row && row.avatar)}
                    alt=""
                  />

                  <div
                    className="img-preview"
                    sx={{ width: "100%", height: "100%" }}
                  />

                  <Input
                    accept="image/*"
                    id="avatar"
                    multiple
                    type="file"
                    sx={{ display: "none" }}
                    onChange={handleChangeAvatar}
                  />

                  <Stack direction="column">
                    <IconButton component="label" htmlFor="avatar">
                      <CameraAltIcon />
                    </IconButton>

                    <IconButton onClick={handleRemoveAvatar}>
                      <ClearIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Dialog
                  open={openDialogCropImg}
                  onClose={handleCloseDialogCropImg}
                >
                  <DialogContent>
                    <Cropper
                      style={{ height: "100%", width: "100%" }}
                      zoomTo={0.5}
                      initialAspectRatio={1}
                      preview=".img-preview"
                      src={currentAvatar}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false}
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                      guides={true}
                    />
                  </DialogContent>

                  <DialogActions>
                    <Button variant="contained" onClick={getCropData}>
                      L??u
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCloseDialogCropImg}
                    >
                      H???y
                    </Button>
                  </DialogActions>
                </Dialog>
              </Stack>
            </Grid>

            <Grid item xs={6} md={6}>
              <TextField
                label="T??n"
                fullWidth
                variant="standard"
                value={customerInfo.name || (row && row.name)}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label="Email"
                fullWidth
                variant="standard"
                value={customerInfo.email || (row && row.email)}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={5} md={5}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gi???i t??nh</FormLabel>
                <RadioGroup
                  row
                  value={customerInfo.gender || (row && row.gender ? "1" : "0")}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                >
                  <FormControlLabel value="0" control={<Radio />} label="Nam" />
                  <FormControlLabel value="1" control={<Radio />} label="N???" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={7} md={7}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Ph??n quy???n</FormLabel>
                <RadioGroup
                  row
                  value={
                    customerInfo.isAdmin || (row && row.isAdmin ? "1" : "0")
                  }
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      isAdmin: e.target.value,
                    }))
                  }
                >
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label="Kh??ch h??ng"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Qu???n tr??? vi??n"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={8} md={8}>
              <TextField
                label="T??? b???ch"
                fullWidth
                variant="outlined"
                multiline
                rows={5}
                maxRows={10}
                value={customerInfo.bio || (row && row.bio)}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={4} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  orientation="portrait"
                  label="Ng??y sinh"
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  value={customerInfo.birthday || (row && row.birthday)}
                  onChange={(newDate) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      birthday: newDate || (row && row.birthday),
                    }))
                  }
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}

        {type === "customer" && action === "delete" && (
          <Stack>
            <Typography variant="h4">B???n mu???n x??a kh??ch h??ng n??y ?</Typography>
          </Stack>
        )}

        {type === "product" && action !== "delete" && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    component="img"
                    sx={{
                      width: 128,
                      height: 128,
                      fontSize: "56px",
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      borderRadius: "16px",
                      filter:
                        !productInfo.thumbUrl && !row?.thumbUrl
                          ? "grayscale(2)"
                          : "none",
                    }}
                    src={
                      productInfo.thumbUrl ||
                      "https://www.pngall.com/wp-content/uploads/2/Meal-PNG-Free-Image.png"
                    }
                    alt=""
                  />

                  <div
                    className="img-preview"
                    sx={{ width: "100%", height: "100%" }}
                  />

                  <Input
                    accept="image/*"
                    id="avatar"
                    multiple
                    type="file"
                    sx={{ display: "none" }}
                    onChange={handleChangeAvatar}
                  />

                  <Stack direction="column">
                    <IconButton component="label" htmlFor="avatar">
                      <CameraAltIcon />
                    </IconButton>

                    <IconButton onClick={handleRemoveAvatar}>
                      <ClearIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Dialog
                  open={openDialogCropImg}
                  onClose={handleCloseDialogCropImg}
                >
                  <DialogContent>
                    <Cropper
                      style={{ height: "100%", width: "100%" }}
                      zoomTo={0.5}
                      initialAspectRatio={1}
                      preview=".img-preview"
                      src={currentAvatar}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false}
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                      guides={true}
                    />
                  </DialogContent>

                  <DialogActions>
                    <Button variant="contained" onClick={getCropData}>
                      L??u
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCloseDialogCropImg}
                    >
                      H???y
                    </Button>
                  </DialogActions>
                </Dialog>
              </Stack>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                label="T??n s???n ph???m"
                fullWidth
                variant="standard"
                value={productInfo.name}
                onChange={(e) =>
                  setProductInfo((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={3} md={3}>
              <TextField
                label="????n gi??(??)"
                fullWidth
                variant="standard"
                value={productInfo.unitPrice}
                onChange={(e) =>
                  setProductInfo((prev) => ({
                    ...prev,
                    unitPrice: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={3} md={3}>
              <TextField
                label="S??? l?????ng"
                fullWidth
                variant="standard"
                value={productInfo.quantity}
                onChange={(e) =>
                  setProductInfo((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
              />
            </Grid>{" "}
            <Grid item xs={3} md={3}>
              <TextField
                label="Khuy???n m??i(%)"
                fullWidth
                variant="standard"
                value={productInfo.discount}
                onChange={(e) =>
                  setProductInfo((prev) => ({
                    ...prev,
                    discount: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={3} md={3}>
              <FormControl fullWidth>
                <InputLabel id="category-select">Lo???i</InputLabel>
                <Select
                  labelId="category-select"
                  value={productInfo.category}
                  label="Lo???i"
                  onChange={(e) =>
                    setProductInfo((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  {CONSTANT.CATEGORIES.map((item) => {
                    return (
                      <MenuItem key={item.code} value={item.code}>
                        {item.displayName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {type === "product" && action === "delete" && (
          <Stack>
            <Typography variant="h4">B???n mu???n x??a s???n ph???m n??y ?</Typography>
          </Stack>
        )}

        {type === "transaction" && action !== "delete" && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Stack direction="row" justifyContent="center">
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    Ph????ng th???c thanh to??n
                  </FormLabel>
                  <RadioGroup
                    row
                    value={transactionInfo.paymentMethod}
                    onChange={(e) =>
                      setTransactionInfo((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                  >
                    <FormControlLabel
                      value="cash"
                      control={<Radio />}
                      label="Ti???n m???t"
                    />
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label="Th??? t??n d???ng"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Ng??y ?????t h??ng"
                  value={transactionInfo.date}
                  onChange={(newDate) =>
                    setTransactionInfo((prev) => ({ ...prev, date: newDate }))
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <TextField
                label="T???ng ti???n"
                fullWidth
                variant="outlined"
                value={transactionInfo.totalAmount}
                onChange={(e) =>
                  setTransactionInfo((prev) => ({
                    ...prev,
                    totalAmount: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <TextField
                label="?????a ch??? giao h??ng"
                fullWidth
                variant="outlined"
                value={transactionInfo.shippingAddress}
                onChange={(e) =>
                  setTransactionInfo((prev) => ({
                    ...prev,
                    shippingAddress: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>H???y</Button>
        <Button onClick={() => handleDoAction(type, action)}>
          {getActionBtnText(action)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TaskDialog.propTypes = {};

export default TaskDialog;
