import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, ThemeProvider } from "@mui/material";
import UiModal from "../UI/UiModal";
import lavenderTheme from "../../theme";
import CourseUniForm from "./CourseUniForm";

const AddCourseUni = ({ appName, appId, country, setRefresherNeeded }) => {
  const [uniFormStatus, setUniFormStatus] = useState(false);

  const changeUniFormStatus = () => {
    setUniFormStatus((status) => !status);
  };

  return (
    <ThemeProvider theme={lavenderTheme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 2,
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            ml: 1,
            whiteSpace: "nowrap",
          }}
          onClick={changeUniFormStatus}
        >
          Apply To University
        </Button>
      </Box>
      {uniFormStatus ? (
        <UiModal
          setModalStatus={changeUniFormStatus}
          showStatus={true}
          showHeader={true}
          title="Apply To University"
          body={
            <CourseUniForm
              appName={appName}
              clssName="col-md-6"
              appId={appId}
              hideModal={changeUniFormStatus}
              country={country}
              setRefresherNeeded={setRefresherNeeded}
            />
          }
        />
      ) : (
        ""
      )}
    </ThemeProvider>
  );
};

export default AddCourseUni;
