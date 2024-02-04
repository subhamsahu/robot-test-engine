import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import DnsIcon from '@mui/icons-material/Dns';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import ListAltSharpIcon from '@mui/icons-material/ListAltSharp';
import TerminalIcon from '@mui/icons-material/Terminal';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PestControlIcon from '@mui/icons-material/PestControl';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import TuneIcon from '@mui/icons-material/Tune';


export const sideBarItems = [
    {
        id: 1,
        icon: <DashboardIcon />,
        label: 'Dashboard',
        route: '/',
    },
    {
        id: 2,
        icon: <TerminalIcon />,
        label: 'Test Framework',
        route: '/testframework',
        children: [
            { label: "Config", route: "/testframework/config", icon: <SettingsInputComponentIcon />, },
            { label: "Data", route: "/testframework/data", icon: <StorageIcon /> },
            { label: "Tests", route: "/testframework/tests", icon: <PrecisionManufacturingIcon /> },
            { label: "Test Suite", route: "/testframework/suite", icon: <FileOpenIcon /> },
            { label: "Testplan", route: "/testframework/testplan", icon: <ListAltSharpIcon /> },
            { label: "Logs", route: "/testframework/logs", icon: <AssessmentIcon />  },
        ],
    },
    {
        id: 3,
        icon: <PestControlIcon />,
        label: 'Defect Management',
        route: '/defectmanagement',
    },
]
export const sideBarLowerItems = [
    {
        id: 98,
        icon: <TuneIcon />,
        label: 'Settings',
        route: 'settings',
    },
    {
        id: 99,
        icon: <ExitToAppIcon />,
        label: 'Log Out',
        route: '/logout',
    },
]