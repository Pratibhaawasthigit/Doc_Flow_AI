package com.Doc_Flow_AI.api.config;

import com.Doc_Flow_AI.api.model.Course;
import com.Doc_Flow_AI.api.model.Subject;
import com.Doc_Flow_AI.api.repository.CourseRepository;
import com.Doc_Flow_AI.api.repository.SubjectRepository;
import com.Doc_Flow_AI.api.repository.FolderRepository;
import com.Doc_Flow_AI.api.repository.NoteRepository;
import com.Doc_Flow_AI.api.model.Folder;
import com.Doc_Flow_AI.api.model.Note;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private FolderRepository folderRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) throws Exception {
        // 1. Seed Categories/Subjects
        if (subjectRepository.count() == 0) {
            List<Subject> cats = List.of(
                    new Subject("C Language", "💻", "12", List.of("Basics", "Systems")),
                    new Subject("C++ Language", "🚀", "18", List.of("Stl", "Performance")),
                    new Subject("Java Language", "☕", "25", List.of("Enterprise", "Oops")),
                    new Subject("Python Languages", "🐍", "30", List.of("Data Science", "Ai")),
                    new Subject("Php", "🐘", "15", List.of("Web", "Wordpress")),
                    new Subject("C#", "🔷", "20", List.of("Dotnet", "Unity")),
                    new Subject("HTML", "🏗️", "10", List.of("Web", "Structure")),
                    new Subject("Css", "🎨", "15", List.of("Web", "Design")),
                    new Subject("Tailwind Css", "🍃", "12", List.of("Web", "Ui")),
                    new Subject("Bootstrap", "🅱️", "10", List.of("Web", "Components")),
                    new Subject("JavaScript", "📜", "40", List.of("Web", "Frontend")),
                    new Subject("React.js", "⚛️", "35", List.of("Web", "Framework")),
                    new Subject("Node.js", "🟢", "28", List.of("Web", "Backend")),
                    new Subject("MySQL", "🐬", "18", List.of("Db", "Sql")),
                    new Subject("SQL", "🔍", "22", List.of("Db", "Query")),
                    new Subject("JQuery", "🔧", "10", List.of("Web", "Legacy")),
                    new Subject("DSA", "📊", "15", List.of("Algorithm", "Data Structures")),
                    new Subject("ML & Data Science", "🧠", "22", List.of("AI", "Python")),
                    new Subject("DevOps", "🚀", "8", List.of("Docker", "K8s")));
            subjectRepository.saveAll(cats);
            System.out.println("Seeded database with requested Subjects/Categories.");
        }

        // 2. Seed Professional Courses
        if (courseRepository.count() == 0) {
            List<Course> initialCourses = List.of(
                    new Course("C Programming Mastery", "Beginner", 0, null,
                            "/thumbnails/c_programming.png",
                            25, "Systems Academy", "https://i.pravatar.cc/150?u=c", 4.7, "C Language", "1200 mins",
                            "https://www.youtube.com/watch?v=KJgsSFOSQv0",
                            "Master the foundational C language for systems programming and memory management.", "5.2k",
                            "Foundational", "text-blue-600"),
                    new Course("C++ for high-performance", "Advanced", 0, null,
                            "/thumbnails/cpp_performance.png",
                            35, "GameDev Pro", "https://i.pravatar.cc/150?u=cpp", 4.9, "C++ Language", "1800 mins",
                            "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
                            "Advanced C++ techniques for game engines and high-throughput systems.", "8.1k", "Advanced",
                            "text-rose-600"),
                    new Course("Java Enterprise Edition", "Advanced", 0, null,
                            "/thumbnails/java_enterprise.png",
                            40, "Tech Academy", "https://i.pravatar.cc/150?u=java", 4.9, "Java Language", "2100 mins",
                            "https://www.youtube.com/watch?v=eTXd89t8ngI",
                            "Comprehensive Java EE training for enterprise-grade backend development.", "12.4k",
                            "Enterprise", "text-orange-600"),
                    new Course("Python for Data Science", "Beginner", 0, null,
                            "/thumbnails/python_ds.png",
                            45, "AI School", "https://i.pravatar.cc/150?u=py", 4.8, "Python Languages", "2400 mins",
                            "https://www.youtube.com/watch?v=rfscVS0vtbw",
                            "Complete Python guide tailored for data analysis, machine learning, and automation.",
                            "15.7k", "Popular", "text-emerald-600"),
                    new Course("Modern React with Hooks", "Advanced", 0, null,
                            "/thumbnails/react_hooks.png",
                            30, "Frontend Masters", "https://i.pravatar.cc/150?u=react", 5.0, "React.js", "1500 mins",
                            "https://www.youtube.com/watch?v=bMknfKXIFA8",
                            "Master React.js building dynamic web apps with modern hooks and state management.",
                            "19.2k", "Frontend", "text-indigo-600"),
                    new Course("Node.js Backend Architecture", "Advanced", 0, null,
                            "/thumbnails/node_backend.png",
                            28, "Backend Labs", "https://i.pravatar.cc/150?u=node", 4.7, "Node.js", "1400 mins",
                            "https://www.youtube.com/watch?v=TlB_eWDSMt4",
                            "Build scalable server-side applications using event-driven Node.js models.", "10.5k",
                            "Backend", "text-green-600"),
                    new Course("Tailwind CSS Rapid UI", "Intermediate", 0, null,
                            "/thumbnails/tailwind_css.png",
                            15, "Design Pros", "https://i.pravatar.cc/150?u=tw", 4.8, "Tailwind Css", "900 mins",
                            "https://www.youtube.com/watch?v=lCxcTsOHrjo",
                            "Learn how to build stunning, responsive layouts in record time with Tailwind CSS.", "7.3k",
                            "Design", "text-cyan-600"),
                    new Course("PHP & MySQL Web Apps", "Beginner", 0, null,
                            "/thumbnails/php_mysql.png",
                            22, "Web Devs", "https://i.pravatar.cc/150?u=php", 4.6, "Php", "1300 mins",
                            "https://www.youtube.com/watch?v=OK_JCtrrv-c",
                            "The classic web combo. Build database-driven websites with PHP and MySQL.", "4.8k",
                            "Fullstack", "text-violet-600"),
                    new Course("C# & .NET 8 Mastery", "Advanced", 0, null,
                            "/thumbnails/csharp_dotnet.png",
                            35, "Dotnet Core Hub", "https://i.pravatar.cc/150?u=cs", 4.9, "C#", "1900 mins",
                            "https://www.youtube.com/watch?v=GhQdlIFylQ8",
                            "Build enterprise-level applications with C# and the .NET 8 framework.", "5.2k",
                            "Enterprise", "text-blue-600"),
                    new Course("HTML5 Semantic Web", "Beginner", 0, null,
                            "/thumbnails/html5_web.png",
                            10, "Web Academy", "https://i.pravatar.cc/150?u=web", 4.5, "HTML", "600 mins",
                            "https://www.youtube.com/watch?v=mJgBOIoGihA",
                            "Learn the building blocks of the web with modern HTML5 best practices.", "12.8k", "Core",
                            "text-orange-600"),
                    new Course("CSS3 & Modern Layouts", "Beginner", 0, null,
                            "/thumbnails/css3_layouts.png",
                            18, "Design Hub", "https://i.pravatar.cc/150?u=css", 4.6, "Css", "1100 mins",
                            "https://www.youtube.com/watch?v=yfoY53QXEnI",
                            "Master Flexbox, Grid, and beautiful custom styles with CSS3.", "10.4k", "Design",
                            "text-pink-600"),
                    new Course("Modern JavaScript Mastery", "Advanced", 0, null,
                            "/thumbnails/javascript_mastery.png",
                            42, "ES6 Academy", "https://i.pravatar.cc/150?u=js", 5.0, "JavaScript", "2200 mins",
                            "https://www.youtube.com/watch?v=hdI2bqOjy3c",
                            "Deep dive into ES6+, closures, promises, and the core of modern JavaScript.", "22.5k",
                            "Mastery", "text-yellow-600"),
                    new Course("MySQL Optimization", "Advanced", 0, null,
                            "/thumbnails/mysql_optimization.png",
                            24, "Data Pros", "https://i.pravatar.cc/150?u=mysql", 4.7, "MySQL", "1450 mins",
                            "https://www.youtube.com/watch?v=7S_tz1z_5bA",
                            "Advanced indexing, query optimization, and architectural patterns with MySQL.", "6.1k",
                            "Data", "text-blue-500"),
                    new Course("SQL for Data Analytics", "Intermediate", 0, null,
                            "/thumbnails/sql_analytics.png",
                            20, "Analytics Pro", "https://i.pravatar.cc/150?u=sql", 4.8, "SQL", "1300 mins",
                            "https://www.youtube.com/watch?v=7vzF8v2SNDY",
                            "Query millions of rows efficiently for business intelligence and data insights.", "9.3k",
                            "Query", "text-slate-600"),
                    new Course("Responsive Design: Bootstrap 5", "Beginner", 0, null,
                            "/thumbnails/bootstrap_responsive.png",
                            12, "Bootstrap Hub", "https://i.pravatar.cc/150?u=boot", 4.4, "Bootstrap", "800 mins",
                            "https://www.youtube.com/watch?v=jyYHeNo83Z4",
                            "Quickly build responsive, component-heavy websites with the Bootstrap framework.", "6.5k",
                            "Framework", "text-purple-700"),
                    new Course("Legacy Web: JQuery 2026", "Intermediate", 0, null,
                            "/thumbnails/jquery_legacy.png",
                            8, "Vibe Academy", "https://i.pravatar.cc/150?u=jq", 4.2, "JQuery", "500 mins",
                            "https://www.youtube.com/watch?v=Yf6uYid-6O8",
                            "Understand and maintain legacy web applications built with the beloved JQuery library.",
                            "2.1k", "Legacy", "text-blue-400"),
                    new Course("Advanced Algorithms (DSA)", "Advanced", 0, null,
                            "/thumbnails/dsa_algorithms.png",
                            25, "CS Mastery", "https://i.pravatar.cc/150?u=dsa", 4.9, "DSA", "1545 mins",
                            "https://www.youtube.com/watch?v=RBSGKlAobjM",
                            "Master graph theory, trees, and dynamic programming for top-tier tech interviews.",
                            "11.2k", "Interview", "text-emerald-700"),
                    new Course("Practical ML with Python", "Advanced", 0, null,
                            "/thumbnails/ml_python.png",
                            55, "Data Science Lab", "https://i.pravatar.cc/150?u=ml", 4.9, "ML & Data Science",
                            "2800 mins", "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
                            "Implement regression, classification, and clustering with real-world datasets.", "14.8k",
                            "AI", "text-indigo-600"),
                    new Course("DevOps Pipelines: Docker", "Intermediate", 0, null,
                            "/thumbnails/devops_docker.png",
                            14, "Cloud Native Hub", "https://i.pravatar.cc/150?u=devops", 4.7, "DevOps", "1000 mins",
                            "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                            "Master containerization and CI/CD pipelines to streamline deployment workflows.", "8.4k",
                            "Cloud", "text-blue-800"));
            courseRepository.saveAll(initialCourses);
            System.out.println("Seeded database with new cornerstone Courses.");
        }

        // 3. Seed Existing Folder/Note logic (Refined for new models if necessary)
        if (folderRepository.count() == 0) {
            Folder f1 = new Folder();
            f1.setLabel("Java Core Essentials");
            f1.setIcon("terminal");
            f1.setUserEmail("admin@docflow.ai");
            f1.setAccentVar("blue");
            f1.setBg("#dbeafe");
            f1.setIconBg("#eff6ff");
            f1.setIconColor("#1d4ed8");
            f1.setBadgeBg("rgba(37,99,235,.1)");
            f1.setBadgeColor("#1d4ed8");
            folderRepository.save(f1);

            if (noteRepository.count() == 0) {
                Note n1 = new Note();
                n1.setLabel("OOPS Concepts Summary");
                n1.setIcon("code");
                n1.setContent("Core Java concepts covering Inheritance, Polymorphism, Encapsulation, and Abstraction.");
                n1.setFolderId(f1.getId());
                n1.setUserEmail("admin@docflow.ai");
                n1.setTag("AI Summarized");
                n1.setTagBg("#d1fae5");
                n1.setTagColor("#059669");
                noteRepository.save(n1);
            }
            System.out.println("Seeded database with Folders and Notes.");
        }
    }
}
