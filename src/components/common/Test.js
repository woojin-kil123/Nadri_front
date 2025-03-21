import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/system";

const userTestimonials = {
  avatar: <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />,
  name: "Travis Howard",
  occupation: "Lead Product Designer",
  testimonial:
    "One of the standout features of this product is the exceptional customer support. In my experience, the team behind this product has been quick to respond and incredibly helpful. It's reassuring to know that they stand firmly behind their product.",
};
const logoStyle = {
  width: "64px",
  opacity: 0.3,
};

export default function Test() {
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <CardContent>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: "text.secondary" }}
          >
            {userTestimonials.testimonial}
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <CardHeader
            avatar={userTestimonials.avatar}
            title={userTestimonials.name}
            subheader={userTestimonials.occupation}
          />
          <img src="/image/dora.png" />
        </Box>
      </Card>
    </>
  );
}
