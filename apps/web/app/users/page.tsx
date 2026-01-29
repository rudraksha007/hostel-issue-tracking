import { EnsureSession } from "@/app/components/session-provider";
import { UsersComponent } from "./components/comp";

export default function Users() {

    return <EnsureSession >
        <UsersComponent />
    </EnsureSession>
}