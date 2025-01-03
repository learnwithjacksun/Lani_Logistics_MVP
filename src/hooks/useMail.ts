import { useContext } from "react";
import { EmailContext } from "../Contexts/EmailContext";

const useMail = ()=>{
    const {sendEmail} = useContext(EmailContext);

    return {sendEmail};
}

export default useMail;
