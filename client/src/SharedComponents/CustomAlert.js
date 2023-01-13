import Alert from '@mui/material/Alert';
import { AiOutlineClose } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';
import { useContext } from 'react';
import { ErrorContext } from '../Context/error';

const CustomAlert = () => {

    const { error, showError, setShowError } = useContext(ErrorContext);
    return (
        <Alert
            className={`w-full absolute top-0 ${showError ? null : "hidden"} rounded-none`}
            variant="filled"
            severity="error"
            action={
                <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setShowError(false);
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