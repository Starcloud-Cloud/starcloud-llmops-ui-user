import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/EditTwoTone";
import LinkIcon from "@mui/icons-material/Link";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Modal,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Upload, UploadProps } from "antd";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "store";
import { gridSpacing } from "store/constant";
import { openSnackbar } from "store/slices/snackbar";
import { TabsProps } from "types";
import { Confirm } from "ui-component/Confirm";
import { LoadingSpin } from "ui-component/LoadingSpin";
import MainCard from "ui-component/cards/MainCard";
import * as yup from "yup";
import {
  delDataset,
  getDatasetSource,
  uploadCharacters,
  uploadUrls,
} from "../../../../../api/chat";
import { getAccessToken } from "../../../../../utils/auth";

function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const validationSchema = yup.object({
  title: yup.string().required(""),
  context: yup.string().required(""),
});

const transformDataType = (dataType: string) => {
  switch (dataType) {
    case "DOCUMENT":
      return <ArticleIcon className="text-[#5e35b1] text-base mr-2" />;
    case "URL":
      return <LinkIcon className="text-[#5e35b1] text-base mr-2" />;
    case "CHARACTERS":
      return <EditIcon className="text-[#5e35b1] text-base mr-2" />;
  }
};

const QAModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [valueLabel, setValueLabel] = useState("checked");
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { Dragger } = Upload;

  const formik = useFormik({
    initialValues: {
      title: "",
      context: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        openSnackbar({
          open: true,
          message: "Submit Success",
          variant: "alert",
          alert: {
            color: "success",
          },
          close: false,
        })
      );
    },
  });

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
      } else if (status === "error") {
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <MainCard
        style={{
          position: "absolute",
          width: "800px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        title="添加问答"
        content={false}
        secondary={
          <IconButton
            onClick={handleClose}
            size="large"
            aria-label="close modal"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <CardContent>
          <>
            <Tabs
              value={value}
              variant="scrollable"
              onChange={handleChange}
              sx={{
                mb: 3,
                "& a": {
                  minHeight: "auto",
                  minWidth: 10,
                  py: 1.5,
                  px: 1,
                  mr: 2.2,
                  color: theme.palette.grey[600],
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
                "& a.Mui-selected": {
                  color: theme.palette.primary.main,
                },
                "& a > svg": {
                  mb: "0px !important",
                  mr: 1.1,
                },
              }}
            >
              <Tab component={Link} label="批量上传" {...a11yProps(0)} />
              <Tab component={Link} label="输入问答" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <div className="text-sm text-[#9da3af]">
                <a className="text-[#673ab7]">点击此处下载模板</a>{" "}
                完成填写后再上传，问题总数不超过条10000条
              </div>
              <div className="mt-3">
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <AddIcon />
                  </p>
                  <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                </Dragger>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  label={"问题"}
                  fullWidth
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                  label={"答案"}
                  fullWidth
                  id="context"
                  name="context"
                  value={formik.values.context}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.context && Boolean(formik.errors.context)
                  }
                  helperText={formik.touched.context && formik.errors.context}
                  className={"mt-3"}
                  multiline
                  minRows={6}
                />
              </form>
            </TabPanel>
          </>
        </CardContent>
        <Divider />
        <CardActions>
          <Grid container justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={() => {
                console.log(formik);
              }}
            >
              保存
            </Button>
          </Grid>
        </CardActions>
      </MainCard>
    </Modal>
  );
};

const DocumentModal = ({
  open,
  handleClose,
  forceUpdate,
}: {
  open: boolean;
  handleClose: () => void;
  forceUpdate: () => void;
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [valueLabel, setValueLabel] = useState("checked");
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { Dragger } = Upload;

  // TODO 最大20M, 以及错误的提示
  const props: UploadProps = {
    name: "files",
    multiple: true,
    action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/dataset-source-data/uploadFiles/1683395894274936832`,
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
    accept: ".pdf, .docx, .txt, .pptx, .epub, .md, .csv",
    maxCount: 20,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        handleClose();
        forceUpdate();
      } else if (status === "error") {
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      context: "",
    },
    validationSchema: yup.object({
      title: yup.string().required("12jl"),
      context: yup.string().required("12"),
    }),
    onSubmit: (values) => {
      uploadCharacters({
        datasetId: "1683395894274936832",
        uploadCharacterReqVOs: [values],
      }).then((res) => {
        dispatch(
          openSnackbar({
            open: true,
            message: "Submit Success",
            variant: "alert",
            alert: {
              color: "success",
            },
            close: false,
          })
        );
        handleClose();
        forceUpdate();
      });
    },
  });
  const formikUrl = useFormik({
    initialValues: {
      url: "",
    },
    validationSchema: yup.object({
      url: yup.string().required("12jl"),
    }),
    onSubmit: (values) => {
      uploadUrls({
        datasetId: "1683395894274936832",
        urls: values.url.split(","),
      }).then((res) => {
        dispatch(
          openSnackbar({
            open: true,
            message: "Submit Success",
            variant: "alert",
            alert: {
              color: "success",
            },
            close: false,
          })
        );
        handleClose();
        forceUpdate();
      });
    },
  });
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <MainCard
        style={{
          position: "absolute",
          width: "800px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        title="添加文档"
        content={false}
        secondary={
          <IconButton
            onClick={handleClose}
            size="large"
            aria-label="close modal"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <CardContent>
          <>
            <Tabs
              value={value}
              variant="scrollable"
              onChange={handleChange}
              sx={{
                mb: 3,
                "& a": {
                  minHeight: "auto",
                  minWidth: 10,
                  py: 1.5,
                  px: 1,
                  mr: 2.2,
                  color: theme.palette.grey[600],
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
                "& a.Mui-selected": {
                  color: theme.palette.primary.main,
                },
                "& a > svg": {
                  mb: "0px !important",
                  mr: 1.1,
                },
              }}
            >
              <Tab component={Link} label="上传文档" {...a11yProps(0)} />
              <Tab component={Link} label="文本输入" {...a11yProps(1)} />
              <Tab component={Link} label="网页抓取" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <div className="text-sm text-[#9da3af]">
                格式支持 .pdf .docx .txt .pptx .epub .md
                .csv，请确保内容可复制，每个30MB以内，单次最多上传20个。
                文档中的表格和图片暂时无法学习。
              </div>
              <div className="mt-3">
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <AddIcon />
                  </p>
                  <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                </Dragger>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  label={"标题"}
                  fullWidth
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                  label={"内容"}
                  fullWidth
                  id="context"
                  name="context"
                  value={formik.values.context}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.context && Boolean(formik.errors.context)
                  }
                  helperText={formik.touched.context && formik.errors.context}
                  className={"mt-3"}
                  multiline
                  minRows={6}
                />
                <Divider />
                <CardActions>
                  <Grid container justifyContent="flex-end">
                    <Button variant="contained" type="submit" color="secondary">
                      保存
                    </Button>
                  </Grid>
                </CardActions>
              </form>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div className="text-sm text-[#9da3af]">
                请避免非法抓取他人网站的侵权行为，保证链接可公开访问，且网站内容可复制
              </div>
              <form onSubmit={formikUrl.handleSubmit}>
                <TextField
                  label={"网页地址"}
                  fullWidth
                  id="url"
                  name="url"
                  value={formikUrl.values.url}
                  onChange={formikUrl.handleChange}
                  error={formikUrl.touched.url && Boolean(formikUrl.errors.url)}
                  helperText={formikUrl.touched.url && formikUrl.errors.url}
                  className={"mt-3"}
                  multiline
                  minRows={6}
                />
                <Divider />
                <CardActions>
                  <Grid container justifyContent="flex-end">
                    <Button variant="contained" type="submit" color="secondary">
                      保存
                    </Button>
                  </Grid>
                </CardActions>
              </form>
            </TabPanel>
          </>
        </CardContent>
      </MainCard>
    </Modal>
  );
};

export type typeDocument = typeDocumentChild[];
export type typeDocumentChild = {
  id: number;
  uid: string;
  name: string;
  position: number;
  dataSourceInfo?: any;
  batch?: any;
  status?: any;
  wordCount: number;
  tokens?: any;
  dataType: string;
};

export const Knowledge = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<
    Element | ((element: Element) => Element) | null | undefined
  >(null);
  const [qaVisible, setQaVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(false);
  const [documentList, setDocumentList] = useState<typeDocument>([]);
  const [QAList, setQAList] = useState([]);
  const [update, setUpdate] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [current, setCurrent] = useState<typeDocumentChild | null>(null);

  const forceUpdate = () => setUpdate((pre) => pre + 1);

  React.useEffect(() => {
    (async () => {
      const res = await getDatasetSource({ datasetId: "1683395894274936832" });
      setDocumentList(res);
    })();
  }, [update]);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
  };

  const handleDel = async (item: typeDocumentChild) => {
    setAnchorEl(null);
    const res = await delDataset({ id: item.id });
  };

  const handleDelDocument = async () => {
    await delDataset({ id: current?.uid });
    forceUpdate();
    setCurrent(null);
    setOpenConfirm(false);
  };

  return (
    <div>
      <div>
        <div>
          <span
            className={
              "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
            }
          >
            文档式
          </span>
          <div className={"mt-3"}>
            <div className="flex justify-end">
              <Button
                variant={"contained"}
                startIcon={<AddIcon />}
                color={"secondary"}
                size={"small"}
                onClick={() => setDocumentVisible(true)}
              >
                添加文档
              </Button>
            </div>
            <div>
              <MainCard>
                <Grid
                  container
                  direction="row"
                  spacing={gridSpacing}
                  className={"h-[620px] overflow-auto"}
                >
                  {documentList.map((item, index) => {
                    return (
                      <Grid item xs={12} sm={6} xl={4} key={index}>
                        <Card
                          sx={{
                            p: 2,
                            background:
                              theme.palette.mode === "dark"
                                ? theme.palette.dark.main
                                : theme.palette.grey[50],
                            border: "1px solid #e3e8ef",
                            "&:hover": {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                              <Grid container spacing={gridSpacing}>
                                <Grid item xs zeroMinWidth>
                                  <div className="flex items-center">
                                    {transformDataType(item.dataType)}
                                    <Tooltip title={item.name}>
                                      <Typography
                                        variant="h4"
                                        component="div"
                                        color={"#0009"}
                                        className={
                                          "overflow-ellipsis whitespace-nowrap w-full overflow-hidden"
                                        }
                                      >
                                        {item?.name}
                                      </Typography>
                                    </Tooltip>
                                  </div>
                                </Grid>

                                <Grid item>
                                  <IconButton
                                    size="small"
                                    sx={{ mt: -0.75, mr: -0.75 }}
                                    aria-label="more-options"
                                    onClick={() => {
                                      setOpenConfirm(true);
                                      setCurrent(item);
                                    }}
                                  >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} className="!pt-[10px]">
                              <Typography
                                variant="h5"
                                component="div"
                                color={"#0009"}
                              >
                                这里是答案
                              </Typography>
                            </Grid>
                            <Grid item xs={12} className="!pt-[10px]">
                              <Divider variant="fullWidth" />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              className="!pt-[10px] flex items-center"
                            >
                              {item.status !== 99 ? (
                                <LoadingSpin />
                              ) : (
                                <CheckCircleIcon
                                  sx={{
                                    color: "success.dark",
                                    width: 14,
                                    height: 14,
                                  }}
                                />
                              )}
                              <Typography variant="caption">
                                From Custom Input
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </MainCard>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span
          className={
            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
          }
        >
          问答式
        </span>
        <div className={"mt-3"}>
          <div className="flex justify-end">
            <Button
              variant={"contained"}
              startIcon={<AddIcon />}
              color={"secondary"}
              size={"small"}
              onClick={() => setQaVisible(true)}
            >
              添加问答
            </Button>
          </div>
          <div>
            <MainCard>
              <Grid container direction="row" spacing={gridSpacing}>
                <Grid item xs={12} sm={6} xl={4}>
                  <Card
                    sx={{
                      p: 2,
                      background:
                        theme.palette.mode === "dark"
                          ? theme.palette.dark.main
                          : theme.palette.grey[50],
                      border:
                        theme.palette.mode === "dark"
                          ? "1px solid transparent"
                          : `1px solid${theme.palette.grey[100]}`,
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Grid container spacing={gridSpacing}>
                      <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                          <Grid item xs zeroMinWidth>
                            <div className="flex items-center">
                              <EditIcon className="text-[#0009] text-lg" />
                              <Typography
                                variant="h4"
                                component="div"
                                color={"#0009"}
                              >
                                这里是问题
                              </Typography>
                            </div>
                          </Grid>

                          <Grid item>
                            <IconButton
                              size="small"
                              sx={{ mt: -0.75, mr: -0.75 }}
                              onClick={handleClick}
                              aria-label="more-options"
                            >
                              <MoreHorizOutlinedIcon
                                fontSize="small"
                                color="inherit"
                                aria-controls="menu-friend-card"
                                aria-haspopup="true"
                                sx={{ opacity: 0.6 }}
                              />
                            </IconButton>
                            {anchorEl && (
                              <Menu
                                id="menu-user-details-card"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                variant="selectedMenu"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                              >
                                <MenuItem onClick={handleClose}>删除</MenuItem>
                              </Menu>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="h5"
                          component="div"
                          color={"#0009"}
                        >
                          这里是答案
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider variant="fullWidth" />
                      </Grid>
                      <Grid item xs={12} className="!pt-[3px]">
                        <Typography variant="caption">
                          From Custom Input
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </MainCard>
          </div>
        </div>
      </div>

      <Confirm
        open={openConfirm}
        handleOk={handleDelDocument}
        handleClose={() => setOpenConfirm(false)}
        content="确认删除该条记录？"
      />
      {qaVisible && (
        <QAModal open={qaVisible} handleClose={() => setQaVisible(false)} />
      )}
      {documentVisible && (
        <DocumentModal
          open={documentVisible}
          handleClose={() => setDocumentVisible(false)}
          forceUpdate={forceUpdate}
        />
      )}
    </div>
  );
};