import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"

function AboutPage() {

  const features = [
    "Реєстрація та авторизація користувачів",
    "Перегляд завдань",
    "Додавання завдань",
    "Оновлення завдань",
    "Видалення завдань",
    "Управління статусами завдань",
    "Призначення завдань іншим користувачам",
  ]

  const logoUrl = "http://localhost:8000/static/images/logo.png"

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>

      <Card sx={{ borderRadius: 4, boxShadow: 4 }}>

        <CardContent sx={{ p: 4 }}>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4
            }}
          >

            <Avatar
              src={logoUrl}
              sx={{
                width: 120,
                height: 120,
                mb: 2
              }}
            />

            <Typography variant="h3" fontWeight="bold">
              To-Do List
            </Typography>

            <Typography variant="h6" color="text.secondary">
              Version 1.0.0
            </Typography>

            <Typography variant="h6" sx={{ mt: 4 }} color="text.secondary">
            Система управління завданнями у списку справ
          </Typography>

          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
          >
            Features
          </Typography>

          <List>
            {features.map((feature, index) => (
              <ListItem key={index}>

                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>

                <ListItemText primary={feature} />

              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mt: 2 }}>

            <Typography variant="body1">
              <strong>Author:</strong> Viktoriia Panchenko
            </Typography>

            <Typography variant="body1">
              <strong>Contact:</strong> @rose_can_dy
            </Typography>

          </Box>

        </CardContent>

      </Card>

    </Container>
  )
}

export default AboutPage