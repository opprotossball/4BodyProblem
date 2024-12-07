import {AppBar, Button, Toolbar} from "@mui/material";
import {NavLink} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchLightTime} from "../state/slices/lightTimeSlice";
import {NavbarButton} from "./navbar/NavbarButton";

export const Navbar = () => {
    const error = useSelector(state => state.lightTime.error);
    const loading = useSelector(state => state.lightTime.loading);
    const lightTime = useSelector(state => state.lightTime.lightTime);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLightTime());
    }, []);

    return (
        <div className="absolute">
            <AppBar sx={{
                backgroundColor: '#1F2937',
            }}>
                <Toolbar className="flex justify-between">
                    <div className="flex h-full">
                        <div className=" items-center hidden md:block">
                            <div>
                                <NavbarButton to="/" name="Home"/>
                                <NavbarButton to="/calendar" name="Calendar"/>
                                <Button sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem'
                                }} component={NavLink} to="/chat" color="inherit">Chat</Button>
                            </div>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );

};