import { NoteItem, QuizQuestion, Flashcard, StudyPlan, UserStats } from "./types";

export const SAMPLE_NOTES: NoteItem[] = [
  {
    id: "demo-note-1",
    title: "Object-Oriented Programming (OOP) Principles",
    subject: "Computer Science",
    classLevel: "Undergraduate / B.Tech",
    language: "hinglish",
    difficulty: "medium",
    isDemo: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ["Programming", "Java", "Python", "OOP"],
    content: {
      introduction:
        "Object-Oriented Programming (OOP) ek aisi programming paradigm hai jo real-world entities (jaise Car, Student, Bank Account) ko software objects ke roop me model karti hai. Iska main maqsad code reuse, modularity aur security provide karna hai.",
      definitions: [
        {
          term: "Class",
          explanation: "Ek blueprint ya template jisse objects create kiye jaate hain. Jaise 'House Design Map'.",
        },
        {
          term: "Object",
          explanation: "Class ka ek real instance jiske paas state (attributes) aur behavior (methods) hote hain.",
        },
        {
          term: "Encapsulation",
          explanation: "Data (variables) aur code (methods) ko ek single unit (class) ke andar pack karna aur direct access restrict karna (Data Hiding).",
        },
        {
          term: "Inheritance",
          explanation: "Ek child class ka parent class ke features and properties inherit karna for code reusability.",
        },
        {
          term: "Polymorphism",
          explanation: "'Poly' matlab many, 'morph' matlab forms. Ek hi method alag-alag objects me different behave kare (e.g., Method Overloading & Overriding).",
        },
        {
          term: "Abstraction",
          explanation: "Internal implementation details chupana aur user ko sirf essential features dikhana (e.g., Car Accelerator dabana vs engine piston movement).",
        },
      ],
      keyConcepts: [
        {
          heading: "The 4 Core Pillars of OOP",
          points: [
            "Encapsulation: Private variables with public getter/setter methods.",
            "Abstraction: Interfaces and Abstract classes.",
            "Inheritance: 'is-a' relationship (e.g., Dog is an Animal).",
            "Polymorphism: Compile-time (Overloading) and Run-time (Overriding).",
          ],
        },
        {
          heading: "Real-Life Analogy: The Smartphone",
          points: [
            "Blueprint (Class): Phone design by Apple/Samsung.",
            "Object: The actual physical phone in your hand.",
            "Encapsulation: Circuit board is sealed inside the phone body.",
            "Abstraction: You press the camera button, picture click hoti hai bina sensor chemistry jaane.",
          ],
        },
      ],
      bulletPoints: [
        "OOP improves software maintainability and scalability.",
        "Dry Principle (Don't Repeat Yourself) is naturally enforced.",
        "Design patterns (Singleton, Factory) rely heavily on OOP fundamentals.",
      ],
      examples: [
        "Python Example:\nclass Student:\n    def __init__(self, name, roll):\n        self.__name = name # Private attribute (Encapsulation)\n        self.roll = roll\n\n    def study(self):\n        print(f'{self.roll} is studying!')",
      ],
      formulas: [
        "Compile-Time Polymorphism: Method Signature must differ (same name, diff parameters)",
        "Run-Time Polymorphism: Method Override with identical signature in derived class",
      ],
      examTips: [
        "Always explain OOP concepts with a clear diagram (Class Box with attributes & methods).",
        "Viva question: 'What is the difference between Abstraction and Encapsulation?' (Abstraction focuses on 'what' the object does, Encapsulation focuses on 'how' data is protected).",
      ],
      quickSummary:
        "OOP 4 pillars par tika hai: Encapsulation (data safety), Abstraction (hiding details), Inheritance (reusability), and Polymorphism (multiple behaviors).",
      practiceQuestions: [
        "Q1: What is the diamond problem in Multiple Inheritance and how is it resolved in Java vs C++?",
        "Q2: Explain Abstract Class vs Interface with a real-world scenario.",
        "Q3: Write a simple code snippet demonstrating runtime polymorphism.",
      ],
    },
  },
  {
    id: "demo-note-2",
    title: "Photosynthesis: Light & Dark Reactions",
    subject: "Biology / General Science",
    classLevel: "Class 10 - 12",
    language: "hinglish",
    difficulty: "easy",
    isDemo: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["Biology", "Botany", "Photosynthesis"],
    content: {
      introduction:
        "Photosynthesis wo biological process hai jisme green plants sunlight, water aur CO2 ka use karke chemical energy (Glucose) generate karte hain aur oxygen gas release karte hain.",
      definitions: [
        {
          term: "Chlorophyll",
          explanation: "Chloroplast me present green pigment jo sunlight photons ko absorb karta hai.",
        },
        {
          term: "Stomata",
          explanation: "Leaves par tiny pores jo gaseous exchange (CO2 in, O2 out) aur transpiration regulate karte hain.",
        },
      ],
      keyConcepts: [
        {
          heading: "Phase 1: Light-Dependent Reaction (Thylakoids)",
          points: [
            "Sunlight energy water molecules ko split karti hai (Photolysis).",
            "ATP aur NADPH generate hote hain, O2 release hoti hai.",
          ],
        },
        {
          heading: "Phase 2: Dark Reaction / Calvin Cycle (Stroma)",
          points: [
            "Light ki direct zaroorat nahi hoti.",
            "CO2 fix hokar Glucose me convert hoti hai with the help of RuBisCO enzyme.",
          ],
        },
      ],
      bulletPoints: [
        "Overall Reaction: 6CO2 + 6H2O + Sunlight -> C6H12O6 + 6O2",
        "Occurs inside chloroplasts in mesophyll cells.",
        "Primary source of organic matter and oxygen on Earth.",
      ],
      examples: [
        "Kitchen analogy: Chloroplast is the kitchen, Sunlight is the gas flame, CO2 and Water are raw veggies, Glucose is the cooked food, and Oxygen is the steam going out.",
      ],
      formulas: ["6 CO2 + 6 H2O + Photons ---> C6H12O6 + 6 O2"],
      examTips: [
        "Light Reaction happens in Thylakoids; Dark Reaction happens in Stroma. This is a very common MCQ question!",
      ],
      quickSummary:
        "Light reaction generates ATP/NADPH + O2 in thylakoids; Calvin cycle uses that energy in stroma to synthesize sugar from CO2.",
      practiceQuestions: [
        "Explain the role of RuBisCO enzyme in Calvin cycle.",
        "Why do variegated leaves show patchy starch test results?",
      ],
    },
  },
];

export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-1",
    question: "Which OOP concept is also known as 'Data Hiding'?",
    options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
    correctAnswerIndex: 1,
    explanation:
      "Encapsulation me variables ko private mark karke public methods ke through access diya jaata hai, jisse unauthorized direct manipulation nahi ho sakti.",
  },
  {
    id: "q-2",
    question: "In Photosynthesis, where does the Calvin Cycle (Dark Reaction) take place?",
    options: ["Thylakoid Membrane", "Stroma of Chloroplast", "Mitochondria", "Cell Wall"],
    correctAnswerIndex: 1,
    explanation:
      "Light reactions thylakoid membranes me hote hain, jabki Calvin Cycle Chloroplast ke liquid fluid 'Stroma' me hoti hai.",
  },
  {
    id: "q-3",
    question: "What is the average time complexity to search an element in a balanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswerIndex: 2,
    explanation:
      "Balanced BST me har step par search space half ho jaati hai, isliye searching time complexity O(log n) hoti hai.",
  },
  {
    id: "q-4",
    question: "Hinglish Tutor question: Agar function apne aap ko call kare toh use kya kehte hain?",
    options: ["Iteration", "Recursion", "Overloading", "Abstraction"],
    correctAnswerIndex: 1,
    explanation:
      "Recursion ek aisi technique hai jisme function khud ko call karta hai jab tak base condition reach na ho jaaye.",
  },
  {
    id: "q-5",
    question: "Which of the following is NOT an essential pillar of Object-Oriented Programming?",
    options: ["Inheritance", "Polymorphism", "Compilation", "Encapsulation"],
    correctAnswerIndex: 2,
    explanation:
      "Compilation programming language execution ka stage hai, OOP ka fundamental pillar nahi. The 4 pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism.",
  },
];

export const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    subject: "Computer Science",
    topic: "Data Structures",
    question: "What is the difference between Stack and Queue?",
    answer: "Stack follows LIFO (Last In First Out) jaise plates ka stack. Queue follows FIFO (First In First Out) jaise movie ticket line.",
    difficulty: "easy",
    status: "mastered",
    lastReviewed: new Date(Date.now() - 86400000).toISOString(),
    isDemo: true,
  },
  {
    id: "fc-2",
    subject: "Computer Science",
    topic: "OOP",
    question: "What is Method Overriding?",
    answer: "Jab child class parent class ke kisi method ko same name, same return type aur same parameters ke saath dobara define karti hai for customized behavior.",
    difficulty: "medium",
    status: "learning",
    lastReviewed: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "fc-3",
    subject: "Physics",
    topic: "Newton's Laws",
    question: "State Newton's Third Law in simple Hinglish.",
    answer: "Har action ka ek equal aur opposite reaction hota hai. For example: Rocket ka fuel exhaust niche gas push karta hai aur rocket upar jaata hai.",
    difficulty: "easy",
    status: "mastered",
    isDemo: true,
  },
  {
    id: "fc-4",
    subject: "Mathematics",
    topic: "Calculus",
    question: "What does the Derivative of a function represent geometrically?",
    answer: "Derivative curve ke kisi point par draw kiye gaye Tangent line ka Slope (dhalan / rate of change) represent karta hai.",
    difficulty: "hard",
    status: "new",
    isDemo: true,
  },
  {
    id: "fc-5",
    subject: "Web Development",
    topic: "React",
    question: "What is the purpose of useEffect dependency array?",
    answer: "Dependency array React ko batata hai ki effect function kab run hona chahiye. Agar empty [] ho toh sirf component mount hone par 1 baar run hoga.",
    difficulty: "medium",
    status: "learning",
    isDemo: true,
  },
];

export const SAMPLE_STUDY_PLAN: StudyPlan = {
  id: "demo-plan-1",
  title: "Semester Exam Preparation Sprint",
  examDate: new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0],
  targetDailyHours: 3.5,
  subjects: ["Computer Science", "Mathematics", "Physics"],
  isDemo: true,
  createdAt: new Date().toISOString(),
  tasks: [
    {
      id: "task-1",
      subject: "Computer Science",
      topic: "OOP 4 Pillars & Design Patterns",
      durationMinutes: 45,
      dueDate: new Date().toISOString().split("T")[0],
      completed: true,
      priority: "high",
      notes: "Revise Encapsulation vs Abstraction viva questions",
    },
    {
      id: "task-2",
      subject: "Mathematics",
      topic: "Integration by Parts & Substitution",
      durationMinutes: 60,
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      priority: "high",
      notes: "Practice 10 numericals from chapter 7",
    },
    {
      id: "task-3",
      subject: "Physics",
      topic: "Electromagnetic Induction & Faraday's Laws",
      durationMinutes: 45,
      dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      completed: false,
      priority: "medium",
      notes: "Lenz law direction problems",
    },
    {
      id: "task-4",
      subject: "Computer Science",
      topic: "Binary Trees & BST Traversals",
      durationMinutes: 50,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      completed: false,
      priority: "medium",
    },
  ],
};

export const SAMPLE_USER_STATS: UserStats = {
  totalNotes: 4,
  quizzesCompleted: 6,
  averageScore: 84,
  studyStreakDays: 5,
  totalStudyMinutes: 240,
  lastActiveDate: new Date().toISOString(),
};
