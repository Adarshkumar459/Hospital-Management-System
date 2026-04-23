import React from "react";
import {
  Activity,
  ChevronRight,
  MoonStar,
  Search,
  SunMedium
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { clearSession, getStoredToken, getStoredUser } from "../../lib/session";
import PageState from "../PageState";
import { adminNavItems } from "./AdminConfig";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();
  const token = getStoredToken();
  const [searchText, setSearchText] = React.useState("");
  const [darkMode, setDarkMode] = React.useState(
    () => localStorage.getItem("adminDarkMode") === "true"
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("adminDarkMode", darkMode ? "true" : "false");
  }, [darkMode]);

  if (!token || !user || user.role !== "admin") {
    return (
      <PageState
        title="Admin access required"
        description="Login with an admin account to open the hospital admin panel."
        actionLabel="Go to Login"
        onAction={() => navigate("/login", { state: { from: location.pathname } })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/85 px-5 py-6 backdrop-blur xl:block dark:border-slate-800 dark:bg-slate-900/85">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 p-3 text-white shadow-lg shadow-sky-500/30">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">CareAxis Admin</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Hospital operations center</p>
            </div>
          </div>

          <nav className="space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-70" />
                </NavLink>
              );
            })}
          </nav>

          <Card className="mt-8 rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-100 shadow-none dark:border-sky-900/50 dark:from-slate-900 dark:to-sky-950">
            <CardContent className="space-y-4 p-5">
              <Badge className="w-fit bg-white/80 text-sky-700 hover:bg-white dark:bg-slate-800 dark:text-sky-300">
                Admin mode
              </Badge>
              <div>
                <p className="text-lg font-semibold">Operational pulse</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Monitor patients, staffing, appointments, and applicants from one place.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur md:px-8 dark:border-slate-800 dark:bg-slate-950/75">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-sky-600 dark:text-sky-300">Hospital Admin Panel</p>
                <h1 className="text-2xl font-semibold">Manage every clinical workflow</h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search patients, doctors, appointments"
                    className="rounded-2xl border-slate-200 bg-slate-50 pl-10 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  onClick={() => setDarkMode((value) => !value)}
                >
                  {darkMode ? <SunMedium className="mr-2 h-4 w-4" /> : <MoonStar className="mr-2 h-4 w-4" />}
                  {darkMode ? "Light" : "Dark"}
                </Button>

                <button
                  type="button"
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 font-semibold text-white">
                    {user.name?.[0] || "A"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </button>

                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-2xl dark:text-slate-100 dark:hover:bg-slate-800"
                  onClick={() => {
                    clearSession();
                    navigate("/");
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function AdminSectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-medium text-sky-600 dark:text-sky-300">{eyebrow}</p> : null}
        <h2 className="text-3xl font-semibold">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function AdminStatCard({ label, value, delta, icon, tone = "blue" }) {
  const toneMap = {
    blue: "from-sky-500 to-blue-700 shadow-blue-500/20",
    green: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    amber: "from-amber-400 to-orange-500 shadow-amber-500/20",
    violet: "from-violet-500 to-indigo-600 shadow-violet-500/20"
  };

  return (
    <Card className="rounded-[28px] border border-white/60 bg-white/85 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-900">
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold">{value}</p>
          {delta ? <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{delta}</p> : null}
        </div>
        <div className={`rounded-3xl bg-gradient-to-br p-4 text-white shadow-lg ${toneMap[tone]}`}>
          {icon ? React.createElement(icon, { className: "h-6 w-6" }) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminSearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative min-w-[260px]">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-2xl border-slate-200 bg-white pl-10 dark:border-slate-700 dark:bg-slate-900"
      />
    </div>
  );
}

export function AdminTableSkeleton({ rows = 5 }) {
  return (
    <Card className="rounded-[28px] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
      <CardContent className="space-y-4 p-6">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function EmptyAdminState({ title, description }) {
  return (
    <Card className="rounded-[28px] border border-dashed border-slate-300 bg-transparent shadow-none dark:border-slate-700">
      <CardContent className="py-16 text-center">
        <p className="text-2xl font-semibold">{title}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}

export function SimpleLineChart({ data = [] }) {
  const width = 520;
  const height = 250;
  const padding = 24;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const points = data
    .map((item, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y = height - padding - ((item.value || 0) / maxValue) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
      {Array.from({ length: 5 }).map((_, index) => {
        const y = padding + (index * (height - padding * 2)) / 4;
        return <line key={index} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#cbd5e1" strokeDasharray="4 4" />;
      })}
      <polyline fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} />
      {data.map((item, index) => {
        const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
        const y = height - padding - ((item.value || 0) / maxValue) * (height - padding * 2);
        return (
          <g key={item.label}>
            <circle cx={x} cy={y} r="5" fill="#0284c7" />
            <text x={x} y={height - 6} textAnchor="middle" className="fill-slate-500 text-[12px]">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function SimpleBarChart({ data = [] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-700"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
