import {useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchLightTime} from "../state/slices/lightTimeSlice";
import {CircularProgress} from "@mui/material";

export const HomePage = () => {

    const lightTime = useSelector(state => state.lightTime);
    const loading = useSelector(state => state.loading);
    const error = useSelector(state => state.error);

    useEffect(() => {
        console.log("homepage");
        fetchLightTime();
    }, []);

    return (
        <div className='bg-gray-900 h-full'>
            {loading && <div className='w-full mt-14 flex justify-center p-8'>
                <CircularProgress className='text-white' size={120}/>
            </div>}
            <h1>Home Page</h1>
        </div>
    );
}