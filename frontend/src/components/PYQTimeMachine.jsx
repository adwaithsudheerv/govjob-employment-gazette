import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Award, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  FileText, 
  Check, 
  ChevronRight,
  Flame,
  Sparkles
} from 'lucide-react';

const PYQ_EXAMS = [
  {
    id: 'nic-sc-b-2023',
    agency: 'National Informatics Centre (NIC / NIELIT)',
    examName: 'Scientist B (CS/IT) - Dec 2023',
    year: '2023',
    totalTime: 300, // 5 minutes
    negativeMarking: 0.25,
    description: 'Actual questions tested in the 2023 NIC Technical Screening for Level 10 Gazetted Scientists.',
    questions: [
      {
        id: 1,
        topic: 'Operating Systems (Virtual Memory)',
        question: 'In a demand paging system with a page fault service time of 10 milliseconds and memory access time of 100 nanoseconds, if the page fault rate is p, what is the effective memory access time (EMAT)?',
        options: [
          'EMAT = (1 - p) × 100ns + p × 10ms',
          'EMAT = 100ns + p × 10ms',
          'EMAT = p × 100ns + (1 - p) × 10ms',
          'EMAT = (1 - p) × 10ms + p × 100ns'
        ],
        correct: 0,
        explanation: 'EMAT = (1 - p) × (Memory Access Time) + p × (Page Fault Service Time). Here (1 - p) × 100ns + p × 10,000,000ns.'
      },
      {
        id: 2,
        topic: 'Data Structures & Algorithms',
        question: 'What is the tightest worst-case time complexity of finding the median of an unsorted array of n distinct integers using the Median-of-Medians algorithm?',
        options: [
          'O(n log n)',
          'O(n)',
          'O(n²)',
          'O(log n)'
        ],
        correct: 1,
        explanation: 'The deterministic Selection / Median-of-Medians algorithm guarantees worst-case linear time O(n) by picking guaranteed good pivots.'
      },
      {
        id: 3,
        topic: 'Database Management Systems',
        question: 'A relation R(A, B, C, D) has Functional Dependencies: A -> B, B -> C, C -> D. What is the highest normal form satisfied by relation R?',
        options: [
          '1NF only',
          '2NF',
          '3NF',
          'BCNF'
        ],
        correct: 1,
        explanation: 'Candidate key is A. Every non-prime attribute is fully functionally dependent on candidate key A (so 2NF is satisfied). However, transitive dependencies exist (A -> B -> C and B -> C -> D), so it violates 3NF.'
      },
      {
        id: 4,
        topic: 'Computer Networks',
        question: 'Which of the following IP address blocks is designated by IANA for Class B Private IPv4 Addressing under RFC 1918?',
        options: [
          '10.0.0.0 to 10.255.255.255',
          '172.16.0.0 to 172.31.255.255',
          '192.168.0.0 to 192.168.255.255',
          '169.254.0.0 to 169.254.255.255'
        ],
        correct: 1,
        explanation: 'RFC 1918 assigns 10.0.0.0/8 (Class A), 172.16.0.0/12 (Class B: 172.16.0.0 - 172.31.255.255), and 192.168.0.0/16 (Class C) for private networks.'
      },
      {
        id: 5,
        topic: 'Software Engineering',
        question: 'In software testing, which metric assesses the complexity of code by measuring the number of linearly independent paths through a program source code?',
        options: [
          'Halstead Complexity',
          'Cyclomatic Complexity',
          'Function Point Analysis',
          'Defect Density Metric'
        ],
        correct: 1,
        explanation: "Thomas McCabe's Cyclomatic Complexity V(G) = E - N + 2P calculates the number of linearly independent paths in a control flow graph."
      }
    ]
  },
  {
    id: 'isro-icrb-2020',
    agency: 'ISRO Centralised Recruitment Board (ICRB)',
    examName: 'Scientist/Engineer "SC" (Computer Science)',
    year: '2020',
    totalTime: 300,
    negativeMarking: 0.33,
    description: 'Challenging core computer science questions from ISRO Scientist SC Computer Science recruitment test.',
    questions: [
      {
        id: 1,
        topic: 'Computer Organization & Architecture',
        question: 'A 4-way set-associative cache memory consists of 128 blocks. The main memory contains 2048 blocks, each of 32 words. How many bits are required for TAG, SET, and WORD fields respectively?',
        options: [
          'TAG: 6, SET: 5, WORD: 5',
          'TAG: 5, SET: 6, WORD: 5',
          'TAG: 4, SET: 5, WORD: 5',
          'TAG: 6, SET: 4, WORD: 5'
        ],
        correct: 0,
        explanation: '128 blocks / 4 ways = 32 sets -> 5 bits for SET. 32 words per block -> 5 bits for WORD. Total blocks in MM = 2048 (11 bits block address). TAG = 11 - 5 = 6 bits.'
      },
      {
        id: 2,
        topic: 'Theory of Computation',
        question: 'The language L = { a^n b^n c^m | n, m >= 1 } is:',
        options: [
          'Regular language',
          'Context-Free but not regular',
          'Context-Sensitive but not context-free',
          'Unrestricted only'
        ],
        correct: 1,
        explanation: 'L is Context-Free because a single stack can push a\'s and pop matching b\'s; c^m can follow freely. (If it were a^n b^n c^n, it would be context-sensitive).'
      },
      {
        id: 3,
        topic: 'Data Structures',
        question: 'In an AVL tree with 7 nodes, what is the maximum possible height (measuring height as number of edges on the longest path from root to leaf)?',
        options: [
          '2',
          '3',
          '4',
          '5'
        ],
        correct: 1,
        explanation: 'Minimum nodes for AVL height h: N(0)=1, N(1)=2, N(2)=4, N(3)=7. Hence for 7 nodes, maximum height possible is 3.'
      },
      {
        id: 4,
        topic: 'Operating Systems',
        question: 'Which of the following scheduling algorithms can result in starvation?',
        options: [
          'Round Robin',
          'First-Come First-Served',
          'Shortest Job First (SJF)',
          'All of the above'
        ],
        correct: 2,
        explanation: 'In Shortest Job First (both preemptive and non-preemptive), a continuous influx of short jobs causes long jobs to wait indefinitely (starvation).'
      },
      {
        id: 5,
        topic: 'Database Systems',
        question: 'The ACID properties in relational transaction management stand for:',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Accuracy, Concurrency, Integrity, Durability',
          'Atomicity, Completeness, Isolation, Dependability',
          'Availability, Consistency, Integrity, Durability'
        ],
        correct: 0,
        explanation: 'ACID: Atomicity (all-or-nothing), Consistency (preserves invariants), Isolation (concurrent execution serializable), Durability (committed changes persist).'
      }
    ]
  },
  {
    id: 'ibps-so-it-2022',
    agency: 'Institute of Banking Personnel Selection (IBPS)',
    examName: 'Specialist Officer (IT Officer Scale-I)',
    year: '2022',
    totalTime: 300,
    negativeMarking: 0.25,
    description: 'Banking technology, security, and enterprise database questions from IBPS CRP Specialist Officers.',
    questions: [
      {
        id: 1,
        topic: 'Network Security & Cryptography',
        question: 'Which symmetric encryption algorithm uses a 128-bit block size and key sizes of 128, 192, or 256 bits, adopted as standard by NIST to replace DES?',
        options: [
          'Triple DES (3DES)',
          'Blowfish',
          'Advanced Encryption Standard (AES / Rijndael)',
          'RSA'
        ],
        correct: 2,
        explanation: 'AES (Rijndael) uses 128-bit block size and supports 128, 192, and 256-bit keys. RSA is asymmetric.'
      },
      {
        id: 2,
        topic: 'Web Tech & OOP',
        question: 'In Java, which collection class does NOT permit duplicate elements and maintains insertion order?',
        options: [
          'HashSet',
          'TreeSet',
          'LinkedHashSet',
          'ArrayList'
        ],
        correct: 2,
        explanation: 'LinkedHashSet implements the Set interface (no duplicates) and maintains a doubly-linked list across all elements to preserve insertion order.'
      },
      {
        id: 3,
        topic: 'SQL / RDBMS',
        question: 'Which SQL statement is used to remove all records from a table without logging individual row deletions, resetting the high-water mark?',
        options: [
          'DELETE FROM table_name;',
          'TRUNCATE TABLE table_name;',
          'DROP TABLE table_name;',
          'REMOVE FROM table_name;'
        ],
        correct: 1,
        explanation: 'TRUNCATE TABLE is a DDL command that deallocates data pages quickly with minimal transaction logging compared to row-by-row DELETE.'
      },
      {
        id: 4,
        topic: 'Software Engineering',
        question: 'In Agile Scrum framework, what is the typical recommended duration for a Daily Standup meeting?',
        options: [
          '15 minutes',
          '30 minutes',
          '45 minutes',
          '60 minutes'
        ],
        correct: 0,
        explanation: 'The Daily Scrum / Standup is strictly time-boxed to a maximum of 15 minutes to synchronize daily activities and identify impediments.'
      },
      {
        id: 5,
        topic: 'Cloud Computing & Infrastructure',
        question: 'Which cloud deployment model provides infrastructure exclusively provisioned for a single organization comprising multiple consumers?',
        options: [
          'Public Cloud',
          'Community Cloud',
          'Private Cloud',
          'Hybrid Cloud'
        ],
        correct: 2,
        explanation: 'According to NIST, a Private Cloud is provisioned for exclusive use by a single organization.'
      }
    ]
  }
];

export default function PYQTimeMachine() {
  const [selectedExamId, setSelectedExamId] = useState(PYQ_EXAMS[0].id);
  const [currentExam, setCurrentExam] = useState(PYQ_EXAMS[0]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PYQ_EXAMS[0].totalTime);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Switch exam paper
  const handleExamChange = (examId) => {
    const exam = PYQ_EXAMS.find(e => e.id === examId);
    if (!exam) return;
    setSelectedExamId(examId);
    setCurrentExam(exam);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(exam.totalTime);
    setIsTestActive(false);
    setIsSubmitted(false);
  };

  // Start Exam
  const startExam = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(currentExam.totalTime);
    setIsTestActive(true);
    setIsSubmitted(false);
  };

  // Timer countdown effect
  useEffect(() => {
    let timer = null;
    if (isTestActive && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, isSubmitted, timeLeft]);

  // Answer selection
  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted || !isTestActive) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Submit Exam
  const submitExam = () => {
    setIsTestActive(false);
    setIsSubmitted(true);
  };

  // Score Calculation
  const calculateScore = () => {
    let correctCount = 0;
    let wrongCount = 0;
    let unattempted = 0;

    currentExam.questions.forEach(q => {
      const selected = answers[q.id];
      if (selected === undefined) {
        unattempted++;
      } else if (selected === q.correct) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const rawScore = (correctCount * 1) - (wrongCount * currentExam.negativeMarking);
    const maxScore = currentExam.questions.length;
    const percentage = Math.max(0, (rawScore / maxScore) * 100).toFixed(1);

    return {
      correctCount,
      wrongCount,
      unattempted,
      rawScore: rawScore.toFixed(2),
      maxScore,
      percentage
    };
  };

  const scoreStats = isSubmitted ? calculateScore() : null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currQ = currentExam.questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Gazette Header */}
      <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-6 shadow-[3px_3px_0px_0px_#1a2530] relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7a1c1c] mb-2 font-mono">
          <span>Official Examination Simulator</span>
          <span>•</span>
          <span>Section 11</span>
          <span>•</span>
          <span>5-Minute PYQ Time Machine</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1a2530] mb-2">
          Authentic Previous Year Question (PYQ) Drills
        </h2>
        <p className="text-sm font-serif text-[#4a5568] max-w-3xl leading-relaxed">
          Experience real examination pressure with authentic computer science questions asked in past NIC Scientist B, ISRO ICRB, and IBPS SO IT examinations. Timed with official negative marking schemes.
        </p>

        {/* Paper Selector Pills */}
        <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-[#1a2530]/20">
          {PYQ_EXAMS.map(exam => (
            <button
              key={exam.id}
              onClick={() => handleExamChange(exam.id)}
              disabled={isTestActive}
              className={`px-3 py-1.5 text-xs font-serif font-bold transition-all border ${
                selectedExamId === exam.id
                  ? 'bg-[#1a2530] text-[#fcfaf5] border-[#1a2530] shadow-[2px_2px_0px_0px_#7a1c1c]'
                  : 'bg-white text-[#1a2530] border-[#1a2530]/40 hover:border-[#1a2530] hover:bg-[#e8e4db]'
              } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {exam.agency.split('(')[0].trim()} ({exam.year})
            </button>
          ))}
        </div>
      </div>

      {/* Main Examination Docket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Question Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!isTestActive && !isSubmitted ? (
            /* Pre-Test Instructions Screen */
            <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-6 md:p-8 shadow-[3px_3px_0px_0px_#1a2530] space-y-5">
              <div className="border-b-2 border-[#1a2530] pb-4">
                <div className="text-[11px] font-mono text-[#7a1c1c] uppercase font-bold tracking-widest">
                  Examination Briefing Sheet
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1a2530] mt-1">
                  {currentExam.examName}
                </h3>
                <p className="text-xs font-serif text-[#555] mt-1">
                  {currentExam.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                <div className="bg-[#e8e4db] p-3 border border-[#1a2530]/30">
                  <div className="text-lg font-bold text-[#1a2530]">5</div>
                  <div className="text-[10px] uppercase text-[#666]">Questions</div>
                </div>
                <div className="bg-[#e8e4db] p-3 border border-[#1a2530]/30">
                  <div className="text-lg font-bold text-[#1a2530]">05:00</div>
                  <div className="text-[10px] uppercase text-[#666]">Time Limit</div>
                </div>
                <div className="bg-[#e8e4db] p-3 border border-[#1a2530]/30">
                  <div className="text-lg font-bold text-emerald-800">+1.00</div>
                  <div className="text-[10px] uppercase text-[#666]">Correct Mark</div>
                </div>
                <div className="bg-[#e8e4db] p-3 border border-[#1a2530]/30">
                  <div className="text-lg font-bold text-rose-800">-{currentExam.negativeMarking}</div>
                  <div className="text-[10px] uppercase text-[#666]">Negative Mark</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-300 p-4 text-xs font-serif text-amber-950 space-y-1.5">
                <div className="font-bold font-mono uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Examination Code of Conduct:
                </div>
                <p>• 1 mark awarded for every correct answer; negative marks deducted for wrong options.</p>
                <p>• Questions cover essential MCA & BCA competitive engineering topics: OS, RDBMS, Networks, DSA, and SE.</p>
                <p>• Auto-submission will execute precisely when the 5-minute timer expires.</p>
              </div>

              <button
                onClick={startExam}
                className="w-full bg-[#7a1c1c] text-[#fcfaf5] py-3.5 px-6 font-serif font-bold text-sm uppercase tracking-widest hover:bg-[#1a2530] transition-colors shadow-[3px_3px_0px_0px_#1a2530] flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-300" />
                Break Examination Seal & Begin (5 Mins)
              </button>
            </div>
          ) : isTestActive ? (
            /* Active Question Screen */
            <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-6 shadow-[3px_3px_0px_0px_#1a2530] space-y-6">
              {/* Question Index & Topic Header */}
              <div className="flex items-center justify-between border-b border-[#1a2530]/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-[#1a2530] text-[#fcfaf5] px-2.5 py-1">
                    Q {currentQuestionIndex + 1} of {currentExam.questions.length}
                  </span>
                  <span className="text-xs font-mono uppercase font-bold text-[#7a1c1c]">
                    {currQ.topic}
                  </span>
                </div>
                <div className="text-xs font-mono text-[#666]">
                  {answers[currQ.id] !== undefined ? 'Answered' : 'Not Answered'}
                </div>
              </div>

              {/* Question Text */}
              <div className="font-serif text-base md:text-lg text-[#1a2530] font-medium leading-relaxed">
                {currQ.question}
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currQ.options.map((option, optIdx) => {
                  const isSelected = answers[currQ.id] === optIdx;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currQ.id, optIdx)}
                      className={`p-3.5 border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#1a2530] text-[#fcfaf5] border-[#1a2530] shadow-[2px_2px_0px_0px_#7a1c1c]'
                          : 'bg-white text-[#1a2530] border-[#1a2530]/40 hover:border-[#1a2530] hover:bg-[#faf8f2]'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isSelected ? 'border-[#fcfaf5] text-[#fcfaf5] bg-[#7a1c1c]' : 'border-[#1a2530]/40 text-[#1a2530]'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-xs md:text-sm font-serif leading-relaxed mt-0.5">
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-[#1a2530]/20 pt-4">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 text-xs font-mono uppercase font-bold border border-[#1a2530] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#e8e4db]"
                >
                  Previous
                </button>

                {currentQuestionIndex < currentExam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-5 py-2 text-xs font-mono uppercase font-bold bg-[#1a2530] text-[#fcfaf5] hover:bg-[#7a1c1c] transition-colors flex items-center gap-1.5"
                  >
                    Next Question <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={submitExam}
                    className="px-5 py-2 text-xs font-mono uppercase font-bold bg-[#7a1c1c] text-[#fcfaf5] hover:bg-[#1a2530] transition-colors shadow-[2px_2px_0px_0px_#1a2530]"
                  >
                    Submit Test Docket
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Result Screen with Official Review */
            <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-6 shadow-[3px_3px_0px_0px_#1a2530] space-y-6">
              {/* Scorecard Hero */}
              <div className="border-b-2 border-[#1a2530] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#7a1c1c] font-bold">
                    Official Gazette Evaluation Sheet
                  </div>
                  <h3 className="text-2xl font-serif font-black text-[#1a2530] mt-1">
                    Final Result & Percentile
                  </h3>
                  <p className="text-xs font-serif text-[#666]">
                    {currentExam.examName}
                  </p>
                </div>

                <div className="text-right bg-white p-3 border-2 border-[#1a2530] shadow-[2px_2px_0px_0px_#1a2530]">
                  <div className="text-3xl font-serif font-black text-[#7a1c1c]">
                    {scoreStats.rawScore} <span className="text-xs text-[#666] font-normal">/ {scoreStats.maxScore}</span>
                  </div>
                  <div className="text-[10px] font-mono font-bold uppercase text-[#1a2530]">
                    Net Score ({scoreStats.percentage}%)
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center">
                <div className="p-3 bg-emerald-50 border border-emerald-300">
                  <div className="text-lg font-bold text-emerald-800">{scoreStats.correctCount}</div>
                  <div className="text-[10px] uppercase text-emerald-700">Correct</div>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-300">
                  <div className="text-lg font-bold text-rose-800">{scoreStats.wrongCount}</div>
                  <div className="text-[10px] uppercase text-rose-700">Wrong (-{currentExam.negativeMarking})</div>
                </div>
                <div className="p-3 bg-slate-100 border border-slate-300">
                  <div className="text-lg font-bold text-slate-800">{scoreStats.unattempted}</div>
                  <div className="text-[10px] uppercase text-slate-600">Unattempted</div>
                </div>
              </div>

              {/* Detailed Question Review */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif font-bold text-sm text-[#1a2530] uppercase tracking-wide border-b border-[#1a2530]/20 pb-2">
                  Official Answer Keys & Explanations:
                </h4>

                {currentExam.questions.map((q, qIndex) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correct;
                  const isSkipped = userAnswer === undefined;

                  return (
                    <div 
                      key={q.id}
                      className={`p-4 border-2 ${
                        isSkipped ? 'bg-slate-50 border-slate-300' :
                        isCorrect ? 'bg-emerald-50/70 border-emerald-600' :
                        'bg-rose-50/70 border-rose-600'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
                        <span className="text-[#1a2530]">
                          Question {qIndex + 1} • {q.topic}
                        </span>
                        <span>
                          {isSkipped ? (
                            <span className="text-slate-600 uppercase">Skipped</span>
                          ) : isCorrect ? (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> +1.00 Mark
                            </span>
                          ) : (
                            <span className="text-rose-700 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> -{currentExam.negativeMarking} Mark
                            </span>
                          )}
                        </span>
                      </div>

                      <p className="text-xs font-serif text-[#1a2530] font-medium mb-3">
                        {q.question}
                      </p>

                      <div className="text-[11px] font-serif space-y-1 bg-white/80 p-3 border border-[#1a2530]/20 mb-2">
                        <div>
                          <strong className="text-[#1a2530]">Your Choice: </strong>
                          {isSkipped ? (
                            <span className="italic text-[#777]">None selected</span>
                          ) : (
                            <span>{String.fromCharCode(65 + userAnswer)}. {q.options[userAnswer]}</span>
                          )}
                        </div>
                        <div>
                          <strong className="text-emerald-800">Official Correct Answer: </strong>
                          <span className="font-bold text-emerald-900">{String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}</span>
                        </div>
                      </div>

                      <div className="text-[11px] font-serif text-[#444] italic bg-[#e8e4db]/40 p-2 border-l-2 border-[#1a2530]">
                        <strong>Official Rationale: </strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Retake Button */}
              <button
                onClick={startExam}
                className="w-full bg-[#1a2530] text-[#fcfaf5] py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#7a1c1c] transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#7a1c1c]"
              >
                <RotateCcw className="w-4 h-4" /> Retake This Examination Paper
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar: Timer & Question Matrix (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Real Clock Widget */}
          <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-5 shadow-[2px_2px_0px_0px_#1a2530] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase font-bold text-[#7a1c1c] mb-2">
              <Clock className="w-4 h-4 animate-pulse" /> Official Exam Countdown
            </div>
            <div className={`text-4xl font-mono font-black tracking-tight ${
              timeLeft < 60 && isTestActive ? 'text-rose-600 animate-pulse' : 'text-[#1a2530]'
            }`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-[11px] font-serif text-[#666] mt-1">
              {isTestActive ? 'Time remaining for automatic paper lock' : 'Standard 5-minute drill session'}
            </div>
          </div>

          {/* Question Grid Matrix (when active) */}
          {isTestActive && (
            <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-5 shadow-[2px_2px_0px_0px_#1a2530]">
              <h4 className="font-serif font-bold text-xs uppercase text-[#1a2530] tracking-wider mb-3">
                Question Palette
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {currentExam.questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 text-xs font-mono font-bold border-2 transition-all ${
                        isCurrent
                          ? 'border-[#7a1c1c] bg-[#7a1c1c] text-[#fcfaf5]'
                          : isAnswered
                          ? 'border-emerald-700 bg-emerald-100 text-emerald-950'
                          : 'border-[#1a2530]/40 bg-white text-[#1a2530] hover:border-[#1a2530]'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-[#1a2530]/20 space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-100 border border-emerald-700 inline-block"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-white border border-[#1a2530]/40 inline-block"></span>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#7a1c1c] border border-[#7a1c1c] inline-block"></span>
                  <span>Current Question</span>
                </div>
              </div>
            </div>
          )}

          {/* MCA Competitive Strategy Bulletin */}
          <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-5 shadow-[2px_2px_0px_0px_#1a2530]">
            <h4 className="font-serif font-bold text-xs uppercase text-[#1a2530] tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7a1c1c]" /> MCA/BCA Cutoff Benchmark
            </h4>
            <div className="space-y-2 text-xs font-serif text-[#444] leading-relaxed">
              <p>
                <strong>NIC Scientist B:</strong> General cutoff historically hovers around 68–74% in the computer science technical section.
              </p>
              <p>
                <strong>IBPS SO IT Officer:</strong> Professional knowledge qualifying cutoff is sectional (~18-22 out of 50 marks).
              </p>
              <p>
                <strong>ISRO ICRB:</strong> Requires minimum 60% aggregate in the written screening to be shortlisted for technical interview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
