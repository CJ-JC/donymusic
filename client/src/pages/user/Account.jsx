import { checkAuthStatus } from "@/widgets/utils/CheckAuthStatus";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import Dashboard from "./Dashboard";
import Invoice from "./Invoice";
import Settings from "./Settings";
import { ReceiptTextIcon } from "lucide-react";
import Profile from "./Profile";

const Account = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus(dispatch, setAuthLoading);
  }, [dispatch, authLoading, isLoggedIn, user]);

  if (!isLoggedIn || !user) {
    return navigate("/");
  }

  const data = [
    {
      label: "Dashboard",
      value: "dashboard",
      icon: Square3Stack3DIcon,
      component: <Dashboard user={user} />,
    },
    {
      label: "Profile",
      value: "profile",
      icon: UserCircleIcon,
      component: <Profile user={user} />,
    },
    {
      label: "Factures",
      value: "invoice",
      icon: ReceiptTextIcon,
      component: <Invoice user={user} />,
    },
    {
      label: "Paramètres",
      value: "settings",
      icon: Cog6ToothIcon,
      component: <Settings />,
    },
  ];

  return (
    <section className="mx-auto h-auto max-w-screen-xl px-4 py-5 md:h-screen">
      <div className="container mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-gray-900">Mon Profil</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gérez vos informations, formations et achats.
          </p>
        </div>
        <Tabs value="dashboard">
          <TabsHeader className="overflow-auto py-2">
            {data.map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div className="flex items-center gap-2">
                  {React.createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, component }) => (
              <TabPanel key={value} value={value} className="px-0">
                {component}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
    </section>
  );
};

export default Account;
