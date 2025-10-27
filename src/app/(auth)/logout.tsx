import {FC, useEffect} from "react"
import { signOut } from "../../../lib/hooks/userHook"

const Logout: FC = () => {
    useEffect(() => {
        signOut()
    })
    return (<></>);
}
export default Logout