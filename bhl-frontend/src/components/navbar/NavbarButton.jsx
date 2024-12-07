import {NavLink} from "react-router";
import {Button} from "@mui/material";

export const NavbarButton = ({to, name}) => {
    return <Button sx={{
        fontWeight: 'bold',
        fontSize: '1.25rem',
        border: 2,
        borderRadius: 2,
        mr: '10px',
        borderColor: '#4B5563',
    }} component={NavLink} to={to} color="inherit">{name}</Button>
}