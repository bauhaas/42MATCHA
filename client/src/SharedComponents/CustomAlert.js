import Alert from '@mui/material/Alert';
import { AiOutlineClose } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';

const CustomAlert = ({ error, open, setOpen}) => {

    return (
        <Alert
            className={`w-full absolute ${open ? null : "hidden"} rounded-none`}
            variant="filled"
            severity="error"
            action={
                <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    <AiOutlineClose fontSize="inherit" />
                </IconButton>
            }
        >
            <p className="font-bold">Error {error[0]}: <span className="font-normal">{error[1]}</span></p>
        </Alert>
    );
};

export default CustomAlert;