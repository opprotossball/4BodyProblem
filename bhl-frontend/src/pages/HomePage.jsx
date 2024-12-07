import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchLightTime} from "../state/slices/lightTimeSlice";
import {CircularProgress} from "@mui/material";

export const HomePage = () => {

    const error = useSelector(state => state.lightTime.error);
    const loading = useSelector(state => state.lightTime.loading);
    const lightTime = useSelector(state => state.lightTime.lightTime);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLightTime());
    }, []);

    console.log(lightTime);
    console.log(error);

    return (
        <div className='bg-gray-900 h-full'>
            {loading ? <div className='w-full mt-14 flex justify-center p-8'>
                <CircularProgress className='text-white' size={120}/>
            </div> : lightTime > 0 ? <div className='w-full mt-14 flex justify-center p-8'></div> :
                <div>{error}</div>}
            <h1>Home Page</h1>
        </div>
    );
}