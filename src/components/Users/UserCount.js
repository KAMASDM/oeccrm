import React, { useCallback, useEffect, useState } from "react";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import {
  Grid,
  Card,
  Typography,
  Box,
  CircularProgress,
  CardContent,
} from "@mui/material";

const UserCount = () => {
  const [data, setData] = useState({
    totalEnq: null,
    totalApp: null,
  });
  const [loadingData, setLoadingData] = useState(true);
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const userCountData = useCallback(async () => {
    setLoadingData(true);
    try {
      const response = await ajaxCallWithHeaderOnly(
        "total/counts/",
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "GET"
      );
      if (response?.isNetwork || response?.status === 401 || response?.status) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      setData({
        totalApp: response.total_applications,
        totalEnq: response.total_enquiries,
      });
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
    } finally {
      setLoadingData(false);
    }
  }, [authData.accessToken]);

  useEffect(() => {
    userCountData();
  }, [userCountData]);

  if (loadingData) {
    return (
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      </Grid>
    );
  }

  return (
    <>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Total Enquiries Processed
            </Typography>
            <Typography variant="h5" component="p" color="primary">
              {data.totalEnq}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Total Applications Processed
            </Typography>
            <Typography variant="h5" component="p" color="primary">
              {data.totalApp}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default UserCount;
