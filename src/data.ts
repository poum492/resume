import { ResumeData } from "./types";

export const initialResumeData: ResumeData = {
  contact: {
    name: "Kittiphong Manisai",
    title: "Computer Science Student",
    targetPositions: "Full-Stack & Web Developer",
    email: "66143492@g.cmru.ac.th",
    phone: "0619768425",
    location: "Chiang Mai, Thailand",
    github: "github.com/kittiphong-dev",
  },
  summary: "Computer Science student at Chiang Mai Rajabhat University with a strong academic background and 3.67 GPA. Passionate about software engineering, full-stack development, and database administration. Proficient in Python, Java, JavaScript, and Next.js, seeking a Software Engineering or Web Development Internship to solve real-world problems.",
  education: [
    {
      id: "edu-1",
      school: "University of Rajabhat Chiang Mai",
      location: "Chiang Mai, Thailand",
      degree: "Bachelor of Science (Faculty of Science and Technology)",
      major: "Computer Science",
      gpa: "3.67 / 4.00",
      gradDate: "May 2027",
      coursework: "Data Structure, Database System, Machine Learning, Web Development, Object-Oriented Programming, Systems Analysis",
    },
  ],
  skills: {
    languages: "Python, Java, SQL, HTML, JavaScript, TypeScript",
    frameworks: "Next.js",
    databasesAndTools: "MySQL, Examine, Git, GitHub",
    concepts: "Object-Oriented Design, RESTful APIs, Database Administration, Systems Development",
  },
  projects: [
    {
      id: "proj-1",
      title: "AgroTech Smart Farming IoT Portal",
      techStack: "Python, FastAPI, React, MySQL, MQTT",
      role: "Lead Backend Developer",
      bullets: [
        "Designed and implemented high-performance RESTful APIs and MQTT brokers to handle real-time sensor telemetry, serving 500+ daily mock metrics.",
        "Optimized MySQL queries and indexing, decreasing database response latencies by 35% under high write loads.",
        "Coordinated a team of 3 members using Git/GitHub for version control, ensuring smooth continuous deployment workflows."
      ]
    },
    {
      id: "proj-2",
      title: "Educational Course Management System",
      techStack: "Java, Spring Boot, React, MySQL",
      role: "Full-Stack Developer",
      bullets: [
        "Developed an enterprise-grade academic course registration backend utilizing Spring Boot, implementing solid OOP patterns and Hibernate ORM.",
        "Created responsive React components styled with Tailwind CSS, reducing user registration friction and enhancing portal navigation.",
        "Administered relational schemas with robust constraints and foreign-key integrity, ensuring consistent state tracking for 1,000+ students."
      ]
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Faculty of Science & Technology, CMRU",
      location: "Chiang Mai, Thailand",
      role: "Database Administration & Systems Intern",
      dateRange: "Nov 2026 - Mar 2027",
      bullets: [
        "Administered local development MySQL databases, writing highly structured SQL migration scripts and optimizing backup frequencies.",
        "Conducted system testing and analysis for academic web portals, identifying and repairing 12 critical authentication loopholes.",
        "Assisted in maintaining technical documentation and system architectures, easing onboard processing times for upcoming student developers."
      ]
    },
    {
      id: "exp-2",
      company: "Chiang Mai Rajabhat University",
      location: "Chiang Mai, Thailand",
      role: "Computer Science Teaching Assistant",
      dateRange: "Jun 2025 - Oct 2026",
      bullets: [
        "Facilitated laboratory sessions for 45+ undergraduate students in Object-Oriented Programming (Java) and Data Structures.",
        "Reviewed and graded student programming submissions, providing constructive weekly code audits to ensure clean, readable implementations."
      ]
    }
  ]
};
