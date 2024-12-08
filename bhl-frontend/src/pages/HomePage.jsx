import {Navbar} from "../components/Navbar";
import {Button} from "@mui/material";

export const HomePage = () => {

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
            </div>
        </div>
    );
}