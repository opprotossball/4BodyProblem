import {Navbar} from "../components/Navbar";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useState} from "react";

export const HomePage = () => {

    const [selectedValue, setSelectedValue] = useState('EARTH');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <div className='flex flex-col items-center'>
            <Navbar/>
            <div className="flex flex-col h-[25vh]">
            </div>
            <div className='w-1/2 h-80 flex flex-col justify-center items-center'>
                Tu jest miejsce na logo
                <div className="flex w-1/2 justify-center">
                    <Button variant='contained' sx={{
                        backgroundColor: '#1F2937',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        padding: '18px 64px',
                        borderRadius: 3,
                        '&:hover': {
                            backgroundColor: '#374151',
                        },
                    }}>Chat!</Button>
                </div>
                <FormControl fullWidth style={{marginTop: '16px',
                justifyContent: 'center'}}>
                    <InputLabel id="dropdown-label" sx={{ color: '#fff', fontWeight:'bold'}}>You are on:</InputLabel>
                    <Select
                        className="font-semibold w-full bg-gray-800 rounded-bl focus:outline-none focus:ring"
                        sx={{
                            color: '#fff',
                            border: 1,
                            borderColor: '#444',
                            fontWeight: 'bold'
                        }}
                        labelId="dropdown-label"
                        value={selectedValue}
                        onChange={handleChange}
                    >
                        <MenuItem sx={{fontWeight: 'bold'}} value="EARTH">EARTH</MenuItem>
                        <MenuItem sx={{fontWeight: 'bold'}} value="MARS">MARS</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}