import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Button, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import lavenderTheme from "../../theme";
import CourseUniData from "../course/CourseUniData";
import LoadingData from "../UI/LoadingData";
import EnqDetails from "../enq/EnqDetails";
import AddCourseUni from "../app/AddCourseUni";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const authData = useSelector((state) => state.authStore);
  const enqId = useParams().enqId;
  const [throwErr, setThrowErr] = useState(null);
  const [refreshNeeded, setRefresherNeeded] = useState(true);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const getEnqdata = useCallback(async () => {
    const response = await ajaxCallWithHeaderOnly(
      `enquiries/${enqId}/`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
      null
    );
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (
      response?.status === 401 ||
      response?.status === 204 ||
      response?.status === 404
    ) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (response?.status) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    setData(response);
    setIsLoading(false);
  }, [authData.accessToken, enqId]);

  useEffect(() => {
    if (enqId) {
      setIsLoading(true);
      getEnqdata();
    }
  }, [enqId, getEnqdata]);

  if (isLoading) {
    return <LoadingData />;
  }

  return (
    <ThemeProvider theme={lavenderTheme}>
      <CssBaseline />
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "background.default",
          color: "text.primary",
          transition: "all 0.3s ease",
          backgroundImage: `radial-gradient(${lavenderTheme.palette.primary.light}20 2px, transparent 0)`, // Using customTheme directly
          backgroundSize: "24px 24px",
          borderRadius: "24px",
        }}
      >
        <EnqDetails data={data} />
        {data.application_id ? (
          <>
            <AddCourseUni
              appName={data.student_name}
              appId={data.application_id}
              country={
                data.country_interested?.id ? data.country_interested?.id : 1
              }
              setRefresherNeeded={setRefresherNeeded}
            />
            {data.application_id && (
              <CourseUniData
                stuName={data.student_name}
                setRefresherNeeded={setRefresherNeeded}
                refreshNeeded={refreshNeeded}
                enqId={data.id}
                appId={data.application_id}
              />
            )}
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/application/create/${data.id}`}
            sx={{ mt: 2 }}
          >
            Add Application
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default StudentDashboard;
