import Alert from '@mui/material/Alert';
import { AiOutlineClose } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';
import { useContext } from 'react';
import { ErrorContext } from '../Context/error';

const CustomAlert = () => {

    const { error, showError, setShowError, severity } = useContext(ErrorContext);
    return (
        <Alert
            className={`w-full absolute top-0 ${showError ? null : "hidden"} rounded-none z-50`}
            variant="filled"
            severity={severity}
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
<p className="font-bold">{error[0] !== 0 ? `Error ${error[0]}:` : null } <span className="font-normal">{error[1]}</span></p>
        </Alert>
    );
};

export default CustomAlert;