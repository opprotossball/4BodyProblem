import {AppBar, Toolbar} from "@mui/material";
import {NavbarButton} from "./navbar/NavbarButton";

export const Navbar = () => {

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
                            </div>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );

};