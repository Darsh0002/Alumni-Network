import React, { useState, useMemo, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaFileExcel } from "react-icons/fa";

export const events = [
  {
    id: 1,
    name: "Alumni Reunion 2024",
    organizer: "Divya Kaurani",
    organizerType: "Alumni",
    status: "Active",
    date: "31/12/2024",
    time: "00:00",
  },
  {
    id: 2,
    name: "Meetup",
    organizer: "College Admin",
    organizerType: "College",
    status: "Active",
    date: "30/12/2024",
    time: "17:22",
  },
  {
    id: 3,
    name: "Hackathon Event",
    organizer: "College Admin",
    organizerType: "College",
    status: "Upcoming",
    date: "26/12/2024",
    time: "16:46",
  },
  {
    id: 4,
    name: "Generative AI Event",
    organizer: "College Admin",
    organizerType: "College",
    status: "Active",
    date: "22/12/2024",
    time: "12:00",
  },
  {
    id: 5,
    name: "How to Crack Faang",
    organizer: "Mayank Yadav",
    organizerType: "Alumni",
    status: "Active",
    date: "20/12/2024",
    time: "10:00",
  },
  {
    id: 6,
    name: "AR VR Webinar",
    organizer: "Khushi Sompura",
    organizerType: "Alumni",
    status: "Upcoming",
    date: "19/12/2024",
    time: "16:01",
  },
  {
    id: 7,
    name: "Industry Panel: Startups",
    organizer: "Alumni Cell",
    organizerType: "Alumni",
    status: "Active",
    date: "15/01/2025",
    time: "18:00",
  },
  {
    id: 8,
    name: "Alumni Networking Night",
    organizer: "Student Council",
    organizerType: "College",
    status: "Upcoming",
    date: "10/02/2025",
    time: "20:00",
  },
  {
    id: 9,
    name: "Data Science Workshop",
    organizer: "Ritu Sharma",
    organizerType: "Alumni",
    status: "Active",
    date: "05/03/2025",
    time: "09:30",
  },
  {
    id: 10,
    name: "Entrepreneurship Bootcamp",
    organizer: "Incubation Cell",
    organizerType: "College",
    status: "Active",
    date: "22/04/2025",
    time: "10:00",
  },
  {
    id: 11,
    name: "Alumni Mentorship Session",
    organizer: "Priya Patel",
    organizerType: "Alumni",
    status: "Active",
    date: "12/05/2025",
    time: "16:00",
  },
  {
    id: 12,
    name: "Campus Tour for Alumni",
    organizer: "Campus Team",
    organizerType: "College",
    status: "Upcoming",
    date: "01/06/2025",
    time: "11:00",
  },
];

export const donations = [
  { id: 1, alumniName: "Darsh Balar", amount: 150000, date: "10/05/2025" },
  { id: 2, alumniName: "Anjali Verma", amount: 30000, date: "01/08/2025" },
  { id: 3, alumniName: "Rohit Singh", amount: 45000, date: "12/07/2025" },
  { id: 4, alumniName: "Pooja Desai", amount: 5000, date: "02/04/2025" },
  { id: 5, alumniName: "Amit Patel", amount: 75000, date: "18/03/2025" },
];

import {
  FaChartPie,
  FaCalendarAlt,
  FaUsers,
  FaDonate,
  FaBell,
  FaSearch,
  FaDownload,
  FaUpload,
  FaBriefcase,
  FaTrophy,
  FaUserPlus,
  FaComments,
  FaEye,
  FaEdit,
  FaBars,
  FaTimes,
  FaSpinner,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaIdCard,
  FaLinkedin,
  FaExternalLinkAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  Pie,
  PieChart,
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const ITEMS_PER_PAGE = 12;

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("analytics");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const [studentData, setStudentData] = useState([]);
  const [loadingAlumni, setLoadingAlumni] = useState(true);

  const [departmentData, setDepartmentData] = useState([]);
  const [graduationTrends, setGraduationTrends] = useState([]);
  const [locationData, setLocationData] = useState([
    { location: "Ahmedabad", alumni: 65 },
    { location: "Delhi", alumni: 30 },
    { location: "Punjab", alumni: 20 },
    { location: "Banglore", alumni: 70 },
    { location: "Other", alumni: 40 },
  ]);
  const [donationData, setDonationData] = useState([
    { name: "2021", funds: 120000 },
    { name: "2022", funds: 250000 },
    { name: "2023", funds: 180000 },
    { name: "2024", funds: 320000 },
    { name: "2025", funds: 400000 },
  ]);

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid Excel file (.xlsx or .xls).");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
      "http://localhost:5000/api/admin/upload-excel",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
      toast.success("Excel file uploaded successfully!");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      toast.error("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New donation received from John Doe - ₹25,000",
      type: "donation",
      status: "unread",
      time: "2 minutes ago",
    },
    {
      id: 2,
      message: "Upcoming event: Annual Alumni Meet 2025",
      type: "event",
      status: "unread",
      time: "10 minutes ago",
    },
    {
      id: 3,
      message: "Priya Sharma (CSE '22) posted a new job opportunity at Google",
      type: "job",
      status: "unread",
      time: "1 hour ago",
    },
    {
      id: 4,
      message:
        "Congratulations! The mentorship program has successfully connected 50+ students with alumni mentors",
      type: "achievement",
      status: "read",
      time: "3 hours ago",
    },
    {
      id: 5,
      message:
        "New alumni registration: Raj Patel (Mechanical '23) joined the network",
      type: "registration",
      status: "read",
      time: "5 hours ago",
    },
    {
      id: 6,
      message:
        "Your post about 'Technology Trends 2025' received 25+ responses",
      type: "engagement",
      status: "read",
      time: "1 day ago",
    },
  ]);

  const pieColors = [
    "#6366F1",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#A78BFA",
  ];
  const graduationLineColor = "#06B6D4";
  const locationBarColor = "#4F46E5";
  const donationLineColor = "#EF4444";
  const degreeList = useMemo(() => {
    const courses = [...new Set(studentData.map(member => member.course).filter(Boolean))];
    return courses.sort();
  }, [studentData]);

  const departmentList = useMemo(() => {
    const branches = [...new Set(studentData.map(member => member.branch).filter(Boolean))];
    return branches.sort();
  }, [studentData]);

  const batchList = useMemo(() => {
    const years = [...new Set(studentData.map(member => member.passoutYear).filter(Boolean))];
    return years.sort().reverse(); // Most recent first
  }, [studentData]);

  const [degree, setDegree] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");

  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showAlumniModal, setShowAlumniModal] = useState(false);

  useEffect(() => {
    const fetchStudents  = async () => {
      try {
        const token = localStorage.getItem("token"); // admin JWT
        const response = await axios.get('http://localhost:5000/api/admin/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const students = response.data.students || [];
        setStudentData(students);

        // Compute department data
        const branchCount = {};
        students.forEach(student => {
          if (student.branch) {
            branchCount[student.branch] = (branchCount[student.branch] || 0) + 1;
          }
        });
        const deptData = Object.keys(branchCount).map(branch => ({
          name: branch,
          value: branchCount[branch]
        }));
        setDepartmentData(deptData);

        // Compute location data based on company
        const companyCount = {};
        students.forEach(student => {
          if (student.company) {
            companyCount[student.company] = (companyCount[student.company] || 0) + 1;
          }
        });
        const locData = Object.keys(companyCount).slice(0, 5).map(company => ({
          location: company,
          alumni: companyCount[company]
        }));
        setLocationData(locData);

      } catch (error) {
        console.error('Error fetching alumni:', error);
        toast.error('Failed to load alumni data');
      } finally {
        setLoadingAlumni(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredAlumni = useMemo(() => {
    return studentData.filter((member) => {
      const inSearch =
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const inDegree = degree === "" || member.course === degree;
      const inDepartment =
        department === "" || member.branch === department;
      const inBatch = batch === "" || String(member.passoutYear) === batch;
      return inSearch && inDegree && inDepartment && inBatch;
    });
  }, [searchTerm, degree, department, batch, studentData]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const paginate = (data) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setSearchTerm("");
    setCurrentPage(1);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleLogout = () => {
    // Show confirmation alert
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    
    if (confirmLogout) {
      // Clear auth token
      localStorage.removeItem("token");
      localStorage.removeItem("alumnet-user");
      
      // Redirect to login
      window.location.href = "/login";
    }
  };

  const renderMainDashboard = () => {
    switch (activeSection) {
      case "analytics":
        return (
          <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            {/* Header & Summary Cards */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mb-4 flex items-center gap-3">
                <FaChartPie className="text-indigo-600" /> Analytics Overview
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center">
                  <FaUsers className="text-blue-500 text-3xl mb-2" />
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">
                    {departmentData.reduce((acc, d) => acc + d.value, 0)}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 text-center">
                    Total Alumni
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center">
                  <FaChartPie className="text-indigo-500 text-3xl mb-2" />
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">
                    {departmentData.length}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 text-center">
                    Departments
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center">
                  <FaDonate className="text-emerald-500 text-3xl mb-2" />
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">
                    ₹
                    {donationData
                      .reduce((acc, d) => acc + d.funds, 0)
                      .toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 text-center">
                    Total Funds Raised
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center">
                  <FaBriefcase className="text-yellow-500 text-3xl mb-2" />
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">
                    3
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 text-center">
                    Upcoming Events
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10">
              <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6">
                <h2 className="text-lg font-bold mb-4 text-indigo-700 flex items-center gap-2">
                  {" "}
                  <FaUsers className="text-indigo-400" /> Department
                  Distribution{" "}
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      dataKey="value"
                      nameKey="name"
                      label={({ payload }) => `${payload?.name ?? ""}`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell
                          key={`slice-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6">
                <h2 className="text-lg font-bold mb-4 text-teal-700 flex items-center gap-2">
                  {" "}
                  <FaTrophy className="text-teal-400" /> Graduation Year
                  Trends{" "}
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={graduationTrends}>
                    <XAxis dataKey="year" /> <YAxis /> <Tooltip /> <Legend />
                    <Line
                      type="monotone"
                      dataKey="alumni"
                      stroke={graduationLineColor}
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6">
                <h2 className="text-lg font-bold mb-4 text-indigo-700 flex items-center gap-2">
                  {" "}
                  <FaChartPie className="text-indigo-400" /> Geographic
                  Distribution{" "}
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={locationData}>
                    <XAxis dataKey="location" /> <YAxis /> <Tooltip />{" "}
                    <Legend />
                    <Bar
                      dataKey="alumni"
                      fill={locationBarColor}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6">
                <h2 className="text-lg font-bold mb-4 text-rose-700 flex items-center gap-2">
                  {" "}
                  <FaDonate className="text-rose-400" /> Funds Donated by
                  Alumni{" "}
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={donationData}>
                    <XAxis dataKey="name" /> <YAxis /> <Tooltip /> <Legend />
                    <Line
                      type="monotone"
                      dataKey="funds"
                      stroke={donationLineColor}
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Other Sections */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-bold mb-4 text-indigo-700 flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-400" /> Upcoming Events
                </h2>
                <ul className="divide-y divide-gray-200">
                  {events.slice(0, 3).map((event) => (
                    <li
                      key={event.id}
                      className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                    >
                      <span className="font-medium text-gray-800">
                        {event.name}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 sm:mt-0">
                        {event.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <section className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                <h3 className="text-xl font-bold mb-3 text-emerald-700 flex items-center gap-2">
                  <FaDonate className="text-emerald-400" /> Recent Donations
                </h3>
                <div className="overflow-x-auto rounded-md border border-gray-300">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Alumni
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {donations.slice(0, 5).map((donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {donation.alumniName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            ₹{(Number(donation.amount) || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {donation.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        );
      case "events":
        return (
          <div className="p-4 sm:p-6 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                  <FaCalendarAlt className="text-indigo-600" /> Event Management
                </h1>
                <p className="mt-2 text-gray-600">
                  Create and manage alumni events and gatherings
                </p>
              </div>
              <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium w-full sm:w-auto justify-center">
                <FaCalendarAlt className="text-blue-100" /> Create Event
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-100">
              <div className="max-w-md">
                <label
                  htmlFor="event-search"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Search Events
                </label>
                <div className="relative text-gray-500 focus-within:text-gray-700">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch />
                  </span>
                  <input
                    id="event-search"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by event name..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Event Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Organizer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginate(filteredEvents).map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {event.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {event.organizer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {event.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredEvents.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalItems={filteredEvents.length}
                itemsPerPage={ITEMS_PER_PAGE}
                setPage={setCurrentPage}
              />
            )}
          </div>
        );
      case "Directory":
        return (
          <div className="p-4 sm:p-6 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                  <FaUsers className="text-indigo-600" />  Directory
                </h1>
                <p className="mt-2 text-gray-600">
                  Browse and manage your alumni network
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="relative flex-1 w-full sm:w-auto">
                  {/* Hidden Actual Input */}
                  <input
                    type="file"
                    id="excel-upload"
                    accept=".xlsx,.xls"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                  />

                  {/* Styled Custom Label */}
                  <label
                    htmlFor="excel-upload"
                    className="flex items-center justify-between w-full px-4 py-2.5 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <FaFileExcel className="text-gray-400 group-hover:text-blue-500" />
                      <span className="text-sm text-gray-600 truncate max-w-[150px]">
                        {file ? file.name : "Select Excel file"}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Browse
                    </span>
                  </label>
                </div>

                <button
                  onClick={uploadFile}
                  disabled={!file || isUploading}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <FaSpinner className="text-blue-100 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload className="text-blue-100" />
                      <span>Upload Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center p-5 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer hover:bg-gray-50"
                >
                  <option value="">All Degrees</option>
                  {degreeList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border rounded px-4 py-2.5"
                >
                  <option value="">All Branches</option>
                  {departmentList.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full border rounded px-4 py-2.5"
                >
                  <option value="">All Batches</option>
                  {batchList.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Card Grid View for Mobile, Table for Desktop */}
            <div className="hidden md:block overflow-x-auto rounded-xl shadow border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-widest hidden lg:table-cell">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-widest hidden lg:table-cell">Branch</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingAlumni ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <FaSpinner className="inline animate-spin mr-2" />Loading alumni data...
                      </td>
                    </tr>
                  ) : filteredAlumni.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <FaUsers className="inline mr-2" />No alumni found
                      </td>
                    </tr>
                  ) : (
                    paginate(filteredAlumni).map((member) => (
                      <tr key={member.id} className="hover:bg-indigo-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {member.full_name?.charAt(0)}
                            </div>
                            {member.full_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 hidden lg:table-cell text-sm">{member.email}</td>
                        <td className="px-6 py-4 text-gray-600 hidden lg:table-cell text-sm">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{member.branch}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                            onClick={() => {setSelectedAlumni(member); setShowAlumniModal(true);}}
                          >
                            <FaEye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Card Grid View for Mobile */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loadingAlumni ? (
                <div className="col-span-full py-12 text-center text-gray-500">
                  <FaSpinner className="inline animate-spin mr-2" />Loading...
                </div>
              ) : filteredAlumni.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500">
                  <FaUsers className="inline mr-2" />No alumni found
                </div>
              ) : (
                paginate(filteredAlumni).map((member) => (
                  <div key={member.id} className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {member.full_name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{member.full_name}</h3>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="text-xs">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">{member.branch}</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        <FaGraduationCap className="inline mr-1" />
                        {member.course}
                      </p>
                    </div>
                    <button
                      className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                      onClick={() => {setSelectedAlumni(member); setShowAlumniModal(true);}}
                    >
                      View Profile
                    </button>
                  </div>
                ))
              )}
            </div>
            {!loadingAlumni && filteredAlumni.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalItems={filteredAlumni.length}
                itemsPerPage={ITEMS_PER_PAGE}
                setPage={setCurrentPage}
              />
            )}
            {showAlumniModal && selectedAlumni && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                  {/* Header with Gradient Background */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 relative">
                    <button
                      className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold hover:scale-110 transition-transform"
                      onClick={() => setShowAlumniModal(false)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl shadow-lg">
                        {selectedAlumni.full_name?.charAt(0)}
                      </div>
                      <div className="text-white">
                        <h2 className="text-3xl font-bold">{selectedAlumni.full_name}</h2>
                        <p className="text-indigo-100 flex items-center gap-2 mt-1">
                          <FaBriefcase className="w-4 h-4" />
                          {selectedAlumni.job || selectedAlumni.course || "Alumni"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Content Area */}
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
                          <FaPhone className="text-indigo-600" />Contact Info
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <FaEnvelope className="text-indigo-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500">Email</p>
                              <a href={`mailto:${selectedAlumni.email}`} className="text-sm text-indigo-600 hover:underline font-medium truncate">
                                {selectedAlumni.email}
                              </a>
                            </div>
                          </div>
                          {selectedAlumni.phone && (
                            <div className="flex items-center gap-3">
                              <FaPhone className="text-indigo-600 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Phone</p>
                                <a href={`tel:${selectedAlumni.phone}`} className="text-sm font-medium text-gray-900">
                                  {selectedAlumni.phone}
                                </a>
                              </div>
                            </div>
                          )}
                          {selectedAlumni.linkedinuri && (
                            <div className="flex items-center gap-3">
                              <FaLinkedin className="text-indigo-600 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <a href={selectedAlumni.linkedinuri} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-2">
                                  LinkedIn <FaExternalLinkAlt className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Academic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
                          <FaGraduationCap className="text-indigo-600" />Academic
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Enrollment Number</p>
                            <div className="flex items-center gap-2 mt-1">
                              <FaIdCard className="text-indigo-600" />
                              <p className="text-sm font-medium text-gray-900">{selectedAlumni.enrollment_no}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Course</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{selectedAlumni.course}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Branch</p>
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mt-1">
                              {selectedAlumni.branch}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Passout Year</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{selectedAlumni.passoutYear}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Professional Information */}
                    {(selectedAlumni.company || selectedAlumni.job) && (
                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
                          <FaBriefcase className="text-indigo-600" />Professional
                        </h3>
                        <div className="bg-indigo-50 rounded-lg p-4 space-y-3">
                          {selectedAlumni.company && (
                            <div>
                              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Current Company</p>
                              <p className="text-sm font-bold text-indigo-900 mt-1">{selectedAlumni.company}</p>
                            </div>
                          )}
                          {selectedAlumni.job && (
                            <div>
                              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Designation</p>
                              <p className="text-sm font-bold text-indigo-900 mt-1">{selectedAlumni.job}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* footer */}
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                      onClick={() => setShowAlumniModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "donations":
        return (
          <div className="p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-green-100 min-h-screen">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-900 flex items-center gap-3">
                  <FaDonate className="text-emerald-600" /> Donation Management
                </h1>
                <p className="mt-2 text-emerald-700">
                  Track and manage alumni donations and contributions
                </p>
              </div>
            </div>

            {/* Donation Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                <FaDonate className="text-emerald-500 text-3xl mb-3" />
                <span className="text-2xl font-bold text-gray-800">
                  ₹{donationData.reduce((acc, d) => acc + d.funds, 0).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 text-center">
                  Total Funds Raised
                </span>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                <FaUsers className="text-blue-500 text-3xl mb-3" />
                <span className="text-2xl font-bold text-gray-800">
                  {donations.length}
                </span>
                <span className="text-sm text-gray-500 text-center">
                  Total Donors
                </span>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                <FaTrophy className="text-yellow-500 text-3xl mb-3" />
                <span className="text-2xl font-bold text-gray-800">
                  ₹{Math.max(...donationData.map(d => d.funds)).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 text-center">
                  Highest Donation
                </span>
              </div>
            </div>

            {/* Donation Chart */}
            <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold mb-4 text-emerald-700 flex items-center gap-2">
                <FaDonate className="text-emerald-400" /> Donation Trends Over Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={donationData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Funds']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="funds"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Donations Table */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-bold mb-4 text-emerald-700 flex items-center gap-2">
                <FaUsers className="text-emerald-400" /> Recent Donations
              </h2>
              <div className="overflow-x-auto rounded-md border border-gray-300">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Alumni Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {donation.alumniName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">
                          ₹{(Number(donation.amount) || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {donation.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="p-4 sm:p-6 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
                <FaBell className="text-indigo-600" /> Notifications
              </h1>
              {notifications.some((note) => note.status === "unread") && (
                <button
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, status: "read" })),
                    );
                  }}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors mt-2 sm:mt-0"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <FaBell className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500 text-lg">No new notifications</p>
                </div>
              ) : (
                notifications.map((note) => (
                  <div
                    key={note.id}
                    className={`transform transition-all duration-200 hover:scale-[1.01] ${
                      note.status === "unread"
                        ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600"
                        : "bg-white"
                    } rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-start justify-between gap-4`}
                  >
                    <div className="flex items-start gap-3 flex-grow">
                      <div
                        className={`mt-1 p-2 rounded-full ${
                          note.status === "unread"
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {note.type === "donation" && (
                          <FaDonate className="w-4 h-4" />
                        )}{" "}
                        {note.type === "event" && (
                          <FaCalendarAlt className="w-4 h-4" />
                        )}
                        {note.type === "job" && (
                          <FaBriefcase className="w-4 h-4" />
                        )}{" "}
                        {note.type === "achievement" && (
                          <FaTrophy className="w-4 h-4" />
                        )}
                        {note.type === "registration" && (
                          <FaUserPlus className="w-4 h-4" />
                        )}{" "}
                        {note.type === "engagement" && (
                          <FaComments className="w-4 h-4" />
                        )}
                        {!note.type && <FaBell className="w-4 h-4" />}
                      </div>
                      <div>
                        <p
                          className={`text-sm ${
                            note.status === "unread"
                              ? "text-gray-900 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {note.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {note.time}
                        </p>
                      </div>
                    </div>
                    {note.status === "unread" && (
                      <button
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) =>
                              n.id === note.id ? { ...n, status: "read" } : n,
                            ),
                          );
                        }}
                        className="text-xs self-start sm:self-center font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors flex-shrink-0"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar for navigation */}
      <aside
        className={`w-64 bg-white p-6 shadow-lg flex flex-col fixed inset-y-0 left-0 z-30 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <h2 className="text-3xl my-8 font-extrabold text-gray-800">
          Dashboard
        </h2>
        <nav className="flex flex-col flex-grow space-y-3">
          {[
            { id: "analytics", label: "Analytics", icon: <FaChartPie /> },
            {
              id: "Directory",
              label: "Directory",
              icon: <FaUsers />,
            },
            { id: "events", label: "Events", icon: <FaCalendarAlt /> },
            { id: "donations", label: "Donations", icon: <FaDonate /> },
            { id: "notifications", label: "Notifications", icon: <FaBell /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleSectionChange(id)}
              className={`flex items-center gap-3 p-3 rounded-lg text-left text-lg font-semibold transition-colors duration-200 ${
                activeSection === id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-xl">{icon}</span> {label}
            </button>
          ))}
        </nav>
        <footer className="mt-auto space-y-4 py-6 border-t border-gray-200 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-lg font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
          <p className="text-xs text-gray-500 text-center">&copy; 2026 Alumni Network</p>
        </footer>
      </aside>

      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top header for mobile */}
        <header className="md:hidden sticky top-10 bg-white shadow-md z-10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {activeSection}
          </h2>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </header>

        {/* Main content area */}
        <main className="flex-1 mt-12 overflow-auto">
          {renderMainDashboard()}
        </main>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalItems, itemsPerPage, setPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null; // Don't show pagination if there's only one page
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="mt-6 flex justify-center items-center space-x-3">
      <button
        onClick={() => canPrev && setPage(currentPage - 1)}
        disabled={!canPrev}
        className={`px-4 py-2 rounded-md ${
          canPrev ? "bg-blue-600 text-white" : "bg-gray-300 cursor-not-allowed"
        }`}
        aria-label="Previous Page"
      >
        Prev
      </button>
      <span className="text-gray-700 font-semibold">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => canNext && setPage(currentPage + 1)}
        disabled={!canNext}
        className={`px-4 py-2 rounded-md ${
          canNext ? "bg-blue-600 text-white" : "bg-gray-300 cursor-not-allowed"
        }`}
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

export default AdminDashboard;
