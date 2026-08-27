import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { isAdmin } from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export const metadata={title:"Clinic Admin",robots:{index:false,follow:false}};
export default async function Admin(){return (await isAdmin())?<AdminDashboard/>:<AdminLogin/>}
