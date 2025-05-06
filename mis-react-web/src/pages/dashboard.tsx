import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scroll, ScrollText } from "lucide-react";
import { Box } from '@mui/material';
import {
    Apartment,
    Cancel,
    CheckCircle,
    Edit,
    HourglassEmpty,
    LocationOn,
    PeopleAlt,
} from '@mui/icons-material';

import { handleError } from "@/helpers/errorHandlers";
import { useAuth } from "@/context/useAuth";
import { DashboardType } from "@/models/User";

import { dashboardProvider } from "@/mocks/mockAPI";

export default function DashboardPage ()
{
    const { user } = useAuth();
    const [date] = useState (new Date());
    const [ dashboardData, setDashboardData ] = useState <DashboardType> ({});

    useEffect (() => {
        if (user)
        {
            const roleData = dashboardProvider.find (item => item.Role === user.Role);

            if (roleData)
            { setDashboardData (roleData); }
        }
    }, [user]);

    const dashboardItems = [
        { label: "Active Users",    valueKey: "ActiveUsers",    icon: PeopleAlt },
        { label: "Areas",           valueKey: "Areas",          icon: LocationOn },
        { label: "Branches",        valueKey: "Branches",       icon: Apartment },
        { label: "Total Pending",   valueKey: "Pending",        icon: HourglassEmpty },
        { label: "Approved",        valueKey: "Approved",       icon: CheckCircle },
        { label: "Rejected",        valueKey: "Declined",       icon: Cancel },
        { label: "Total Encoded",   valueKey: "Encoded",        icon: Edit },
    ];

    const visibleCardsbyRole: Record <number, (keyof DashboardType) []> = {
        1: ["ActiveUsers", "Areas", "Branches", "Approved"],
        2: ["ActiveUsers", "Areas", "Branches", "Approved"],
        3: ["ActiveUsers", "Approved", "Pending"],
        4: ["Approved", "Encoded", "Pending", "Declined"],
    };

    const visibleItems = dashboardItems.filter (item => visibleCardsbyRole [user?.Role || 0]?.includes (item.valueKey as keyof DashboardType));
    
    return (
        <main className = "flex flex-col flex-1 items-center justify-center">
            <div className = "grid grid-cols-1 sm:grid-cols-2 gap-6">
                { visibleItems.map (({ label, valueKey, icon: Icon }) => (
                    <div
                        key = { label }
                        className = {`p-4 flex items-center gap-4`}
                    >
                        <Icon className = "" fontSize = "large"/>
                        
                        <div className = "">
                            <p className = "">
                                { label }: { dashboardData [valueKey as keyof DashboardType] ?? 0 }
                            </p>
                        </div>
                    </div>
                )) }
            </div>
        </main>
    );
}