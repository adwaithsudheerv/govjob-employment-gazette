import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Printer, 
  Download, 
  Layers, 
  Cpu, 
  Database, 
  Network, 
  Terminal, 
  Code2, 
  ShieldCheck, 
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function SyllabusDesk() {
  const [selectedExamId, setSelectedExamId] = useState('nic_scientist_b');
  const [checkedTopics, setCheckedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('gazette_syllabus_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('gazette_syllabus_progress', JSON.stringify(checkedTopics));
    } catch (e) {
      console.error(e);
    }
  }, [checkedTopics]);

  const exams = [
    {
      id: 'nic_scientist_b',
      title: "NIC Scientist 'B' & STA-A (MeitY)",
      cadre: 'Group A Gazetted & Group B Technical',
      eligibility: 'MCA / B.Tech / M.Sc (CS/IT)',
      pattern: '120 Questions • 180 Minutes • 0.25 Negative Marking • (80% Tech + 20% Non-Tech)',
      sections: [
        {
          name: 'Section A: Generic & Analytical Aptitude (20%)',
          topics: [
            'Logical Reasoning & Analytical Ability',
            'Quantitative Aptitude & Arithmetic Progression',
            'General English & Technical Comprehension',
            'Data Interpretation (Charts, Tables, Graphs)'
          ]
        },
        {
          name: 'Section B.1: Computer Architecture & Digital Systems',
          topics: [
            'Boolean Algebra, Logic Gates & Minimization (K-Maps)',
            'Combinational & Sequential Circuits (Multiplexers, Flip-Flops, Counters)',
            'Computer Memory Hierarchy (Cache Mapping, Virtual Memory, Paging, TLB)',
            'Instruction Pipelining, Hazards & RISC vs CISC Architecture',
            'I/O Organization & Interrupt Handling (DMA, Polling)'
          ]
        },
        {
          name: 'Section B.2: Data Structures & Algorithms',
          topics: [
            'Asymptotic Analysis (Big-O, Theta, Omega Notations)',
            'Linear Data Structures (Arrays, Linked Lists, Stacks, Queues)',
            'Non-Linear Data Structures (Binary Trees, BST, AVL Trees, Heaps, B-Trees)',
            'Graph Algorithms (BFS, DFS, Dijkstra, Bellman-Ford, Prim & Kruskal MST)',
            'Algorithm Paradigms (Divide & Conquer, Greedy, Dynamic Programming)'
          ]
        },
        {
          name: 'Section B.3: Operating Systems & System Programming',
          topics: [
            'Process Management & Multi-Threading (Process Lifecycle, PCB)',
            'CPU Scheduling Algorithms (FCFS, SJF, Round Robin, Priority)',
            'Inter-Process Communication (Semaphores, Mutex, Monitors)',
            'Deadlocks (Conditions, Prevention, Banker\'s Avoidance Algorithm)',
            'Memory Management (Contiguous, Paging, Segmentation, Page Replacement)',
            'Linux Kernel Architecture, Shell Scripting & File System Hierarchy'
          ]
        },
        {
          name: 'Section B.4: Database Management Systems',
          topics: [
            'Relational Algebra, Tuple Calculus & SQL (DDL, DML, DCL, Complex Joins)',
            'ER-to-Relational Mapping & Integrity Constraints',
            'Database Normalization (1NF, 2NF, 3NF, BCNF, 4NF & Lossless Decompositions)',
            'Transaction Processing, ACID Properties & Serializability Schedules',
            'Concurrency Control (2-Phase Locking, Timestamp Ordering) & Crash Recovery'
          ]
        },
        {
          name: 'Section B.5: Computer Networks & Cyber Security',
          topics: [
            'OSI and TCP/IP Reference Models & Protocol Stack',
            'Data Link Layer (Framing, Flow Control, Sliding Window, Error Detection CRC)',
            'Network Layer (IPv4/IPv6 Addressing, CIDR, Subnetting, Routing: RIP, OSPF, BGP)',
            'Transport Layer (TCP 3-Way Handshake, Flow Control, Congestion Control, UDP)',
            'Application Protocols (DNS, HTTP/HTTPS, FTP, SMTP, DHCP)',
            'Network Security Fundamentals (Public Key Cryptography, RSA, AES, Firewalls, SSL/TLS)'
          ]
        },
        {
          name: 'Section B.6: Software Engineering & Web Technologies',
          topics: [
            'Software Development Life Cycle (Waterfall, Agile, Scrum)',
            'Testing Strategies (White Box, Black Box, Unit, Integration Testing)',
            'Web Development Standards (HTML5, CSS, JavaScript, RESTful APIs, JSON)',
            'Cloud Computing Fundamentals (IaaS, PaaS, SaaS, Docker Containerization)'
          ]
        }
      ]
    },
    {
      id: 'ibps_so_it',
      title: 'IBPS Specialist Officer (SO) IT Scale-I',
      cadre: 'Public Sector Bank Officers (Core Banking)',
      eligibility: 'MCA / 4-Year B.Tech / DOEACC B Level',
      pattern: 'Professional Knowledge: 60 Questions • 60 Marks • 45 Minutes (English & Hindi)',
      sections: [
        {
          name: 'Core Focus 1: Database Administration & SQL',
          topics: [
            'RDBMS Architecture, Schemas, Tablespaces & Primary/Foreign Keys',
            'Advanced SQL Queries (Subqueries, Group By, Having, Window Functions)',
            'Stored Procedures, Triggers, Views & Indexing (B-Tree, Hash)',
            'Database Backup, Disaster Recovery & Replication in Banking'
          ]
        },
        {
          name: 'Core Focus 2: Data Communication, Networking & Security',
          topics: [
            'LAN/WAN Architectures, Routers, Switches & VLANs',
            'IP Subnetting, CIDR Calculation & NAT/PAT',
            'Banking Cyber Security (Phishing, MITM, DDoS, Firewalls, IDS/IPS)',
            'Digital Signatures, PKI & RBI Cyber Security Framework Guidelines'
          ]
        },
        {
          name: 'Core Focus 3: Operating Systems & Server Administration',
          topics: [
            'Windows Server & Red Hat Enterprise Linux Administration',
            'Process Scheduling, Memory Allocation & RAID Configurations',
            'Shell Commands, Permissions (chmod, chown) & Process Monitoring'
          ]
        },
        {
          name: 'Core Focus 4: Software Engineering & Object-Oriented Programming',
          topics: [
            'OOP Principles in Java & C++ (Encapsulation, Polymorphism, Inheritance)',
            'Web Services (SOAP, REST) & API Gateway integration with Core Banking',
            'Version Control (Git) & Automated CI/CD Pipelines'
          ]
        }
      ]
    },
    {
      id: 'isro_technical_assistant',
      title: 'ISRO Technical Assistant (Computer Science)',
      cadre: 'Level 7 (Department of Space)',
      eligibility: 'BCA / First Class Diploma / B.Sc CS',
      pattern: '80 Multiple Choice Questions • 90 Minutes • 1/3 Negative Marking',
      sections: [
        {
          name: 'Module 1: Digital Electronics & Microprocessors',
          topics: [
            'Number Systems (Binary, Hex, 2\'s Complement Arithmetic)',
            'Logic Design (Adders, Subtractors, Multiplexers, Decoders)',
            '8085/8086 Microprocessor Architecture, Registers & Instruction Set',
            'Interfacing Devices (8255 PPI, Memory Interfacing)'
          ]
        },
        {
          name: 'Module 2: Programming in C & Python',
          topics: [
            'Pointers, Dynamic Memory Allocation (malloc, free) & Structs',
            'Recursion, File Handling & Preprocessor Directives',
            'Python Basics (Lists, Dictionaries, Tuples, File I/O)'
          ]
        },
        {
          name: 'Module 3: Data Structures & System Software',
          topics: [
            'Stacks, Queues, Linked Lists & Binary Search Trees',
            'Sorting Algorithms (Quick Sort, Merge Sort, Heap Sort)',
            'Assemblers, Loaders, Linkers & Compilers Overview'
          ]
        },
        {
          name: 'Module 4: Computer Networks & Operating Systems',
          topics: [
            'Ethernet Standards (802.3, 802.11 Wi-Fi)',
            'Routing Protocols, TCP/UDP & Sockets',
            'Linux Commands, File Permissions & Cron Jobs'
          ]
        }
      ]
    },
    {
      id: 'ssc_imd_scientific_assistant',
      title: 'SSC IMD Scientific Assistant (Computer Science)',
      cadre: 'Group B Non-Gazetted (India Meteorological Department)',
      eligibility: 'BCA / B.Sc Computer Science / B.Tech',
      pattern: 'Paper I (General Aptitude - 100 Qs) + Paper II (Computer Science - 100 Qs) • 200 Marks • 120 Mins',
      sections: [
        {
          name: 'Paper II: Computer Fundamentals & Hardware',
          topics: [
            'Von Neumann Architecture & CPU Bus Structures',
            'Primary Memory, Secondary Storage & RAID Arrays',
            'Input/Output Devices & Data Transmission Media'
          ]
        },
        {
          name: 'Paper II: Programming & Web Technologies',
          topics: [
            'Control Structures, Functions, Arrays & Strings in C/C++',
            'Object-Oriented Concepts (Classes, Objects, Inheritance)',
            'HTML, CSS, JavaScript Basics & Database Connectivity'
          ]
        },
        {
          name: 'Paper II: Relational Databases & Operating Systems',
          topics: [
            'Relational Model, Normalization & SQL Queries',
            'OS Fundamentals, Virtual Memory & Linux Utilities'
          ]
        }
      ]
    }
  ];

  const currentExam = exams.find(e => e.id === selectedExamId) || exams[0];

  const toggleTopic = (topicKey) => {
    setCheckedTopics(prev => ({
      ...prev,
      [topicKey]: !prev[topicKey]
    }));
  };

  // Calculate statistics
  let totalTopics = 0;
  let completedTopics = 0;

  currentExam.sections.forEach(sec => {
    sec.topics.forEach(t => {
      totalTopics++;
      const key = `${currentExam.id}::${t}`;
      if (checkedTopics[key]) {
        completedTopics++;
      }
    });
  });

  const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#fbf9f5] border-1.5 border-[#1c1f33] flex items-center justify-center text-[#1c1f33] shrink-0" style={{ border: '1.5px solid #1c1f33' }}>
            <BookOpen className="w-6 h-6 text-[#065f46]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight">
              Section 5: Examination Syllabi & Study Checklists
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              Official curriculum outlines, CBT exam patterns, and interactive study progression trackers for BCA & MCA examinations.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handlePrint}
            className="gazette-btn-outline px-3.5 py-1.5 text-xs flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Syllabus</span>
          </button>
        </div>
      </div>

      {/* Main Exam Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {exams.map(exam => {
          const isSelected = selectedExamId === exam.id;
          return (
            <div
              key={exam.id}
              onClick={() => setSelectedExamId(exam.id)}
              className={`p-3 border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[3px_3px_0px_0px_#1c1f33]'
                  : 'bg-white text-[#1c1f33] border-[#1c1f33]/40 hover:border-[#1c1f33] hover:bg-[#fbf9f5]'
              }`}
            >
              <div className="text-[10px] font-sans font-extrabold uppercase tracking-wider mb-1 truncate">
                {exam.cadre}
              </div>
              <h4 className="text-sm font-title font-bold leading-snug line-clamp-1 mb-1">
                {exam.title}
              </h4>
              <p className={`text-[11px] font-serif italic ${isSelected ? 'text-slate-300' : 'text-[#686f8a]'}`}>
                {exam.eligibility}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Exam Overview Banner & Progress Indicator */}
      <div className="bg-white border-2 border-[#1c1f33] p-5 shadow-[4px_4px_0px_0px_#1c1f33] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-[#1c1f33]/20 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
                {currentExam.cadre}
              </span>
              <span className="text-[10px] font-mono text-[#686f8a] uppercase">
                Eligibility: {currentExam.eligibility}
              </span>
            </div>
            <h3 className="text-xl font-title font-bold text-[#1c1f33]">
              {currentExam.title}
            </h3>
            <p className="text-xs font-serif italic text-[#383e5c] mt-0.5">
              Exam Scheme: <strong>{currentExam.pattern}</strong>
            </p>
          </div>

          {/* Progress Tracker Widget */}
          <div className="w-full md:w-64 p-3 bg-[#fbf9f5] border border-[#1c1f33] shrink-0 font-sans">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-extrabold uppercase text-[10px] text-[#1c1f33]">Curriculum Mastery:</span>
              <span className="font-bold text-[#065f46]">{completedTopics} / {totalTopics} ({percentage}%)</span>
            </div>
            <div className="w-full h-2.5 bg-white border border-[#1c1f33] overflow-hidden">
              <div 
                className="h-full bg-[#065f46] transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[9px] font-serif italic text-[#686f8a] block mt-1">
              Check off topics as you complete your revisions
            </span>
          </div>
        </div>

        {/* Search filter within syllabus */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1c1f33]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specific topics (e.g. Normalization, Pointers, TCP/IP, Linux, Scheduling)..."
            className="w-full bg-[#fbf9f5] border border-[#1c1f33] pl-10 pr-4 py-2 text-xs font-serif placeholder:font-serif placeholder:italic text-[#1c1f33] focus:outline-none"
          />
        </div>

        {/* Detailed Sections Breakdown */}
        <div className="space-y-4 pt-2">
          {currentExam.sections.map((section, sIdx) => {
            const filteredTopics = section.topics.filter(t => 
              t.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredTopics.length === 0) return null;

            return (
              <div key={sIdx} className="border border-[#1c1f33] bg-[#fbf9f5]">
                {/* Section Header */}
                <div className="bg-[#1c1f33] text-white py-1.5 px-3 flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider">
                  <span>{section.name}</span>
                  <span className="font-serif italic font-normal text-slate-300 text-[11px]">
                    {filteredTopics.length} Units
                  </span>
                </div>

                {/* Topics List with Interactive Checkboxes */}
                <div className="p-3 divide-y divide-[#1c1f33]/15">
                  {filteredTopics.map((topic, tIdx) => {
                    const topicKey = `${currentExam.id}::${topic}`;
                    const isChecked = !!checkedTopics[topicKey];

                    return (
                      <div
                        key={tIdx}
                        onClick={() => toggleTopic(topicKey)}
                        className={`py-2 px-2 flex items-start space-x-3 cursor-pointer transition-colors ${
                          isChecked ? 'bg-[#ecfdf5]/80 text-[#065f46]' : 'hover:bg-white text-[#1c1f33]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          className="mt-0.5 h-4 w-4 rounded-none accent-[#065f46] cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className={`text-xs font-serif ${isChecked ? 'line-through text-[#065f46] font-semibold' : 'text-[#1c1f33]'}`}>
                            {topic}
                          </span>
                        </div>
                        {isChecked && (
                          <CheckCircle className="w-4 h-4 text-[#065f46] shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
