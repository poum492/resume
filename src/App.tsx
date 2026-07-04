import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  Printer,
  FileDown,
  FileUp,
  BookOpen,
  Briefcase,
  Award,
  Code,
  User,
  FileText,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  Layers,
  Layout,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { initialResumeData } from "./data";
import {
  ResumeData,
  ResumeTheme,
  ProjectItem,
  ExperienceItem,
  EducationItem,
} from "./types";
import ResumePreview from "./components/ResumePreview";

export default function App() {
  const [resume, setResume] = useState<ResumeData>(initialResumeData);
  const [theme, setTheme] = useState<ResumeTheme>("tech");
  const [activeTab, setActiveTab] = useState<
    "contact" | "education" | "experience" | "projects"
  >("contact");
  const [activeTool, setActiveTool] = useState<
    "optimizer" | "project-gen" | "ats"
  >("optimizer");

  // Authentication & Routing States
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [passcode, setPasscode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch live resume data on load
  useEffect(() => {
    fetch("/api/resume")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load");
      })
      .then((data) => {
        if (data && data.contact) {
          setResume(data);
        }
      })
      .catch((err) => console.error("Error loading resume data:", err));
  }, []);

  // Verify saved passcode on load
  useEffect(() => {
    const savedPasscode = localStorage.getItem("owner_passcode");
    if (savedPasscode) {
      fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: savedPasscode }),
      })
        .then((res) => {
          if (res.ok) {
            setIsAdmin(true);
            setPasscode(savedPasscode);
          } else {
            localStorage.removeItem("owner_passcode");
          }
        })
        .catch(() => {});
    }
  }, []);

  // Listen to popstate for state-based routing
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setLoginError("กรุณากรอกรหัสผ่าน (Please enter passcode)");
      return;
    }
    setIsVerifying(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        throw new Error("รหัสผ่านไม่ถูกต้อง (Incorrect passcode)");
      }
      setIsAdmin(true);
      localStorage.setItem("owner_passcode", passcode);
      showNotification("เข้าสู่ระบบเรียบร้อยแล้ว (Logged in successfully)");
    } catch (err: any) {
      setLoginError(err.message || "เกิดข้อผิดพลาด (An error occurred)");
    } finally {
      setIsVerifying(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAdmin(false);
    setPasscode("");
    localStorage.removeItem("owner_passcode");
    showNotification("ออกจากระบบเรียบร้อยแล้ว (Logged out successfully)");
    navigateTo("/");
  };

  // Save changes to backend
  const handleSaveResume = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, resumeData: resume }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save");
      }
      showNotification("บันทึกข้อมูลสำเร็จ! (Resume saved successfully)");
    } catch (err: any) {
      alert("เกิดข้อผิดพลาดในการบันทึก: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // AI Tool States
  // 1. Bullet Optimizer
  const [weakBullet, setWeakBullet] = useState("");
  const [optimizerRole, setOptimizerRole] = useState(
    "Software Engineer Intern",
  );
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedOptions, setOptimizedOptions] = useState<
    Array<{ type: string; text: string; explanation: string }>
  >([]);
  const [optimizationError, setOptimizationError] = useState("");

  // 2. Project Generator
  const [projectFocus, setProjectFocus] = useState("Software Engineering");
  const [projectCoursework, setProjectCoursework] = useState(
    "Data Structures, Systems Programming",
  );
  const [generatingProjects, setGeneratingProjects] = useState(false);
  const [suggestedProjects, setSuggestedProjects] = useState<
    Array<{
      title: string;
      difficulty: string;
      techStack: string[];
      description: string;
      features: string[];
      executionSteps: string[];
      goldBullet: string;
    }>
  >([]);
  const [projectError, setProjectError] = useState("");

  // 3. ATS Analyzer
  const [jobDescription, setJobDescription] = useState("");
  const [analyzingAts, setAnalyzingAts] = useState(false);
  const [atsResult, setAtsResult] = useState<{
    score: number;
    matchPercentage: number;
    matchingKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  } | null>(null);
  const [atsError, setAtsError] = useState("");

  // Success notifications
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper to update deeply nested fields
  const updateContact = (field: keyof typeof resume.contact, value: string) => {

    setResume((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const updateSkills = (field: keyof typeof resume.skills, value: string) => {
    setResume((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [field]: value,
      },
    }));
  };

  // List management helpers
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      school: "University of Technology",
      location: "City, ST",
      degree: "B.S.",
      major: "Computer Science",
      gpa: "3.70 / 4.00",
      gradDate: "May 2028",
      coursework: "Data Structures, Algorithms, Software Engineering",
    };
    setResume((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
    showNotification("Added new Education entry");
  };

  const handleUpdateEducation = (
    id: string,
    field: keyof EducationItem,
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleDeleteEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
    showNotification("Deleted Education entry");
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "Company Name",
      location: "Location / Remote",
      role: "Software Engineering Intern",
      dateRange: "Jun 2026 - Aug 2026",
      bullets: [
        "Developed a scalable REST API using Node.js and Express, handling over 10,000 requests per day.",
        "Collaborated with cross-functional teams in an agile environment.",
      ],
    };
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
    showNotification("Added new Experience entry");
  };

  const handleUpdateExperience = (
    id: string,
    field: keyof ExperienceItem,
    value: any,
  ) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleUpdateExperienceBullet = (
    expId: string,
    bulletIdx: number,
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id === expId) {
          const updatedBullets = [...exp.bullets];
          updatedBullets[bulletIdx] = value;
          return { ...exp, bullets: updatedBullets };
        }
        return exp;
      }),
    }));
  };

  const handleAddExperienceBullet = (expId: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            bullets: [
              ...exp.bullets,
              "New impressive, metric-driven statement.",
            ],
          };
        }
        return exp;
      }),
    }));
  };

  const handleDeleteExperienceBullet = (expId: string, bulletIdx: number) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            bullets: exp.bullets.filter((_, idx) => idx !== bulletIdx),
          };
        }
        return exp;
      }),
    }));
  };

  const handleDeleteExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
    showNotification("Deleted Experience entry");
  };

  // Projects management
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: "New Project",
      techStack: "React, Node.js, PostgreSQL",
      role: "Lead Developer",
      githubLink: "github.com/yourusername/project",
      bullets: [
        "Engineered a full-stack platform using React and Express to automate school scheduling.",
        "Implemented complex database indexing reducing query search latency by 45%.",
      ],
    };
    setResume((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
    showNotification("Added new Project entry");
  };

  const handleUpdateProject = (
    id: string,
    field: keyof ProjectItem,
    value: any,
  ) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleUpdateProjectBullet = (
    projId: string,
    bulletIdx: number,
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id === projId) {
          const updatedBullets = [...proj.bullets];
          updatedBullets[bulletIdx] = value;
          return { ...proj, bullets: updatedBullets };
        }
        return proj;
      }),
    }));
  };

  const handleAddProjectBullet = (projId: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id === projId) {
          return {
            ...proj,
            bullets: [
              ...proj.bullets,
              "New impressive, metric-driven project statement.",
            ],
          };
        }
        return proj;
      }),
    }));
  };

  const handleDeleteProjectBullet = (projId: string, bulletIdx: number) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id === projId) {
          return {
            ...proj,
            bullets: proj.bullets.filter((_, idx) => idx !== bulletIdx),
          };
        }
        return proj;
      }),
    }));
  };

  const handleDeleteProject = (id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
    showNotification("Deleted Project entry");
  };



  // Trigger browser printing for clean single-page PDF
  const handlePrint = () => {
    window.print();
  };



  // Reset to sample template
  const handleResetToTemplate = () => {
    if (
      window.confirm(
        "Are you sure you want to load the Computer Science Intern template? This will overwrite your current inputs.",
      )
    ) {
      setResume(initialResumeData);
      showNotification("Reset to default CS Intern template");
    }
  };

  // AI API CALL 1: Optimize bullet point
  const handleOptimizeBullet = async () => {
    if (!weakBullet.trim()) {
      setOptimizationError("Please enter a bullet point to optimize.");
      return;
    }
    setOptimizing(true);
    setOptimizationError("");
    setOptimizedOptions([]);

    try {
      const res = await fetch("/api/resume/optimize-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulletText: weakBullet, role: optimizerRole }),
      });
      if (!res.ok) throw new Error("Server error optimizing bullet point.");
      const data = await res.json();
      setOptimizedOptions(data.options || []);
    } catch (err: any) {
      setOptimizationError(
        err.message ||
          "Something went wrong. Please check your network or try again.",
      );
    } finally {
      setOptimizing(false);
    }
  };

  const isAdminMode = currentPath === "/admin" && isAdmin;

  if (currentPath === "/admin" && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-6 sticky top-0 z-40 no-print shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-md shadow-emerald-200">
                <FileText className="w-5.5 h-5.5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                CS Resume Builder
                <span className="text-[10px] uppercase tracking-widest font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Owner Portal
                </span>
              </h1>
            </div>
            <button
              onClick={() => navigateTo("/")}
              className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors"
            >
              กลับสู่หน้าเว็บ (Public View)
            </button>
          </div>
        </header>

        {/* Login Form Card */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-2">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">เข้าสู่ระบบสำหรับเจ้าของเว็บไซต์</h2>
              <p className="text-xs text-slate-500">กรุณาป้อนรหัสผ่านเพื่อเข้าใช้งานเครื่องมือแก้ไขเรซูเม่</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  รหัสผ่านเจ้าของเว็บ (Passcode)
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-emerald-600 transition-all shadow-inner placeholder-slate-400 font-mono"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2 border border-red-100 font-medium">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    กำลังตรวจสอบ...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    ยืนยันรหัสผ่าน
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400">
                รหัสผ่านเริ่มต้นตั้งค่าไว้ที่ <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">admin123</code> (สามารถเปลี่ยนได้ที่ไฟล์ .env)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Printable Area overrides */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Hide app layout entirely during printing */
          .no-print {
            display: none !important;
          }
          /* Center print layout and strip border shadows */
          #resume-preview-sheet {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
          }
        }
      `}</style>

      {/* Main Top Header */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-6 sticky top-0 z-40 no-print shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-md shadow-emerald-200">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {isAdminMode ? "Admin Control Panel" : `${resume.contact.name || "Kittiphong"}'s Resume`}
                <span className={`text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full ${isAdminMode ? "bg-amber-100 text-amber-800 shadow-xs" : "bg-emerald-100 text-emerald-800 shadow-xs"}`}>
                  {isAdminMode ? "Admin Mode" : "Portfolio"}
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {isAdminMode 
                  ? "ระบบหลังบ้าน: จัดการและอัปเดตข้อมูลเรซูเม่ของคุณอย่างปลอดภัย" 
                  : "ประวัติส่วนตัวและผลงานสำหรับการสมัครสหกิจศึกษา / ฝึกงาน"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Template Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setTheme("serif")}
                className={`px-2.5 py-1 rounded font-medium transition-all ${theme === "serif" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Serif
              </button>
              <button
                onClick={() => setTheme("tech")}
                className={`px-2.5 py-1 rounded font-medium transition-all ${theme === "tech" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Tech Mono
              </button>
              <button
                onClick={() => setTheme("modern")}
                className={`px-2.5 py-1 rounded font-medium transition-all ${theme === "modern" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                Modern
              </button>
            </div>

            {isAdminMode ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveResume}
                  disabled={saving}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${saving ? "animate-spin" : ""}`} />
                  {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล (Save)"}
                </button>
                <button
                  onClick={handleResetToTemplate}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  title="รีเซ็ตเป็นเทมเพลตเริ่มต้น"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  onClick={() => navigateTo("/")}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  Public View
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-red-200 rounded-lg text-xs font-semibold text-red-600 bg-white hover:bg-red-50 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => navigateTo("/admin")}
                  className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Owner Access
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className={`max-w-7xl mx-auto px-4 md:px-6 py-6 w-full flex-grow ${isAdminMode ? "grid grid-cols-1 lg:grid-cols-12 gap-6" : "flex flex-col items-center justify-center"}`}>
        {/* Left Side: Editor */}
        {isAdminMode && (
          <section className="lg:col-span-6 flex flex-col gap-6 no-print w-full">
            {/* Custom Notification banner */}
            {notification && (
              <div className="bg-emerald-600 text-white text-xs py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{notification}</span>
              </div>
            )}


          {/* Interactive Resume Data Editor Forms */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Editor Sections Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "contact" ? "border-emerald-600 text-emerald-700 bg-white" : "border-transparent text-slate-600 hover:text-slate-900"}`}
              >
                <User className="w-4 h-4" />
                Contact & Summary
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "education" ? "border-emerald-600 text-emerald-700 bg-white" : "border-transparent text-slate-600 hover:text-slate-900"}`}
              >
                <BookOpen className="w-4 h-4" />
                Education & Skills
              </button>
              <button
                onClick={() => setActiveTab("experience")}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "experience" ? "border-emerald-600 text-emerald-700 bg-white" : "border-transparent text-slate-600 hover:text-slate-900"}`}
              >
                <Briefcase className="w-4 h-4" />
                Experience ({resume.experience.length})
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "projects" ? "border-emerald-600 text-emerald-700 bg-white" : "border-transparent text-slate-600 hover:text-slate-900"}`}
              >
                <Code className="w-4 h-4" />
                Projects ({resume.projects.length})
              </button>

            </div>

            {/* Tab Editor Body */}
            <div className="p-6">
              {/* CONTACT & SUMMARY FORM */}
              {activeTab === "contact" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={resume.contact.name}
                        onChange={(e) => updateContact("name", e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={resume.contact.title}
                        onChange={(e) => updateContact("title", e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="e.g. Computer Science Student"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Job Positions (ตำแหน่งหางาน)
                    </label>
                    <input
                      type="text"
                      value={resume.contact.targetPositions}
                      onChange={(e) => updateContact("targetPositions", e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                      placeholder="e.g. Full-Stack & Web Developer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={resume.contact.email}
                        onChange={(e) => updateContact("email", e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="john.doe@university.edu"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={resume.contact.phone}
                        onChange={(e) => updateContact("phone", e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={resume.contact.location}
                        onChange={(e) =>
                          updateContact("location", e.target.value)
                        }
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        GitHub
                      </label>
                      <input
                        type="text"
                        value={resume.contact.github}
                        onChange={(e) =>
                          updateContact("github", e.target.value)
                        }
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="github.com/username"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Professional Summary
                    </label>
                    <textarea
                      value={resume.summary}
                      onChange={(e) =>
                        setResume((prev) => ({
                          ...prev,
                          summary: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                      placeholder="Give a concise summary of your technical background, specific interests, and what you seek..."
                    />
                  </div>
                </div>
              )}

              {/* EDUCATION & SKILLS FORM */}
              {activeTab === "education" && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Education Background
                      </h3>
                      <button
                        onClick={handleAddEducation}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Add School
                      </button>
                    </div>

                    {resume.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 relative space-y-3 mb-3"
                      >
                        <button
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove Education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                              University Name
                            </label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) =>
                                handleUpdateEducation(
                                  edu.id,
                                  "school",
                                  e.target.value,
                                )
                              }
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                              Location
                            </label>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) =>
                                handleUpdateEducation(
                                  edu.id,
                                  "location",
                                  e.target.value,
                                )
                              }
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                              placeholder="e.g. Berkeley, CA"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                              Degree
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) =>
                                handleUpdateEducation(
                                  edu.id,
                                  "degree",
                                  e.target.value,
                                )
                              }
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                              placeholder="e.g. Bachelor of Science"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                              Major
                            </label>
                            <input
                              type="text"
                              value={edu.major}
                              onChange={(e) =>
                                handleUpdateEducation(
                                  edu.id,
                                  "major",
                                  e.target.value,
                                )
                              }
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                              placeholder="Computer Science"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                              GPA
                            </label>
                            <input
                              type="text"
                              value={edu.gpa}
                              onChange={(e) =>
                                handleUpdateEducation(
                                  edu.id,
                                  "gpa",
                                  e.target.value,
                                )
                              }
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                              placeholder="e.g. 3.82 / 4.00"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                              Graduation Date
                            </label>
                            <input
                              type="text"
                              value={edu.gradDate}
                              onChange={(e) =>
                                handleUpdateEducation(
                                  edu.id,
                                  "gradDate",
                                  e.target.value,
                                )
                              }
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                              placeholder="May 2028"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Relevant Coursework
                          </label>
                          <input
                            type="text"
                            value={edu.coursework}
                            onChange={(e) =>
                              handleUpdateEducation(
                                edu.id,
                                "coursework",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                            placeholder="Data Structures, Algorithms..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Technical Skills
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Languages
                      </label>
                      <input
                        type="text"
                        value={resume.skills.languages}
                        onChange={(e) =>
                          updateSkills("languages", e.target.value)
                        }
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="Python, Java, C, TypeScript, SQL..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Frameworks
                      </label>
                      <input
                        type="text"
                        value={resume.skills.frameworks}
                        onChange={(e) =>
                          updateSkills("frameworks", e.target.value)
                        }
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="Next.js, React, Node.js, Express..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Databases & Developer Tools
                      </label>
                      <input
                        type="text"
                        value={resume.skills.databasesAndTools}
                        onChange={(e) =>
                          updateSkills("databasesAndTools", e.target.value)
                        }
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="PostgreSQL, MongoDB, Git, Docker, AWS..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Concepts / Methodologies
                      </label>
                      <input
                        type="text"
                        value={resume.skills.concepts}
                        onChange={(e) =>
                          updateSkills("concepts", e.target.value)
                        }
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-emerald-600"
                        placeholder="Agile, REST APIs, System Design, OOP..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EXPERIENCE FORM */}
              {activeTab === "experience" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Professional Experience
                    </h3>
                    <button
                      onClick={handleAddExperience}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Experience
                    </button>
                  </div>

                  {resume.experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 relative space-y-3 mb-4"
                    >
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Role / Title
                          </label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) =>
                              handleUpdateExperience(
                                exp.id,
                                "role",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Company / Org
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) =>
                              handleUpdateExperience(
                                exp.id,
                                "company",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Location
                          </label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) =>
                              handleUpdateExperience(
                                exp.id,
                                "location",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Date Range
                          </label>
                          <input
                            type="text"
                            value={exp.dateRange}
                            onChange={(e) =>
                              handleUpdateExperience(
                                exp.id,
                                "dateRange",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                          />
                        </div>
                      </div>

                      {/* Bullet statements list */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Metric-driven statements (XYZ)
                          </label>
                          <button
                            onClick={() => handleAddExperienceBullet(exp.id)}
                            className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold"
                          >
                            + Add Bullet
                          </button>
                        </div>

                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex gap-2 items-start">
                            <textarea
                              value={bullet}
                              onChange={(e) =>
                                handleUpdateExperienceBullet(
                                  exp.id,
                                  bIdx,
                                  e.target.value,
                                )
                              }
                              rows={2}
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600 font-sans"
                            />
                            <button
                              onClick={() =>
                                handleDeleteExperienceBullet(exp.id, bIdx)
                              }
                              className="text-slate-400 hover:text-red-500 self-center"
                              title="Delete Bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PROJECTS FORM */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Technical Projects
                    </h3>
                    <button
                      onClick={handleAddProject}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Project
                    </button>
                  </div>

                  {resume.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 relative space-y-3 mb-4"
                    >
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) =>
                              handleUpdateProject(
                                proj.id,
                                "title",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Role / Affiliation
                          </label>
                          <input
                            type="text"
                            value={proj.role}
                            onChange={(e) =>
                              handleUpdateProject(
                                proj.id,
                                "role",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                            placeholder="e.g. Personal Project or Academic Project"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            GitHub Link
                          </label>
                          <input
                            type="text"
                            value={proj.githubLink || ""}
                            onChange={(e) =>
                              handleUpdateProject(
                                proj.id,
                                "githubLink",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                            placeholder="github.com/username/project"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Live Link (if any)
                          </label>
                          <input
                            type="text"
                            value={proj.liveLink || ""}
                            onChange={(e) =>
                              handleUpdateProject(
                                proj.id,
                                "liveLink",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                            placeholder="project.dev"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Tech Stack (comma separated)
                          </label>
                          <input
                            type="text"
                            value={proj.techStack}
                            onChange={(e) =>
                              handleUpdateProject(
                                proj.id,
                                "techStack",
                                e.target.value,
                              )
                            }
                            className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600"
                            placeholder="React, TypeScript, Go"
                          />
                        </div>
                      </div>

                      {/* Bullet points list */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Impact Statements (XYZ formula)
                          </label>
                          <button
                            onClick={() => handleAddProjectBullet(proj.id)}
                            className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold"
                          >
                            + Add Bullet
                          </button>
                        </div>

                        {proj.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex gap-2 items-start">
                            <textarea
                              value={bullet}
                              onChange={(e) =>
                                handleUpdateProjectBullet(
                                  proj.id,
                                  bIdx,
                                  e.target.value,
                                )
                              }
                              rows={2}
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-emerald-600 font-sans"
                            />
                            <button
                              onClick={() =>
                                handleDeleteProjectBullet(proj.id, bIdx)
                              }
                              className="text-slate-400 hover:text-red-500 self-center"
                              title="Delete Bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}


            </div>


          </div>
        </section>
        )}

        {/* Right Side: Professional Live Resume Sheets */}
        <section className={`flex flex-col gap-4 ${isAdminMode ? "lg:col-span-6 w-full" : "w-full max-w-4xl"}`}>
          <div className="bg-slate-800 text-slate-200 rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-between no-print border border-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Live Resume Preview Sheet (A4 Equivalent)</span>
            </div>
            <div className="text-slate-400 text-[11px] font-mono">
              Designed to fit cleanly on one page
            </div>
          </div>

          {/* Interactive sheet wrapper */}
          <div className="overflow-x-auto select-all rounded-xl border border-slate-200 bg-white/40 p-4 md:p-6 shadow-xs flex items-center justify-center min-h-[900px]">
            <ResumePreview data={resume} theme={theme} />
          </div>
        </section>
      </main>

      {/* Humble Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 px-6 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © 2026 CS Resume Builder. Designed for Computer Science
            undergraduate interns.
          </p>
          <p className="flex items-center gap-1 font-semibold text-slate-600">
            Built using standard single-page printable layouts & Google XYZ
            metrics.
          </p>
        </div>
      </footer>
    </div>
  );
}
