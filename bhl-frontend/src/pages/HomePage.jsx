import {Navbar} from "../components/Navbar";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useEffect, useState} from "react";
import {NavLink} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {fetchLightTime} from "../state/slices/lightTimeSlice";

export const HomePage = () => {

    const error = useSelector(state => state.lightTime.error);
    const loading = useSelector(state => state.lightTime.loading);
    const lightTime = useSelector(state => state.lightTime.lightTime);

    const [selectedValue, setSelectedValue] = useState('EARTH');

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLightTime());
    }, []);

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
                    }} component={NavLink} to={`/simulation/${selectedValue}`}>Chat!</Button>
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
                <div className='font-semibold text-xl mt-4'>
                    Current distance between Earth and Mars: {lightTime?.toFixed(2)} light minutes.
                </div>
            </div>
        </div>
    );
}