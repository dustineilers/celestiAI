import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";


const pages = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
];

const Navbar: React.FC = () => {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        color: "inherit",
                        textDecoration: "none",
                        fontWeight: 700,
                        letterSpacing: ".15rem",
                    }}
                >
                    CelestiAI
                </Typography>

                <Box>
                    {pages.map((page) => (
                        <Button
                            key={page.path}
                            component={Link}
                            to={page.path}
                            sx={{ color: "white" }}
                        >
                            {page.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;