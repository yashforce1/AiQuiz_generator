export const SAMPLE_STUDENTS = [
    { id: 'stu_1', name: 'Aryan Verma', email: 'aryan@student.com', password: 'student123', avatar: 'AV', stream: 'JEE', class: '12th', school: 'DPS Noida' },
    { id: 'stu_2', name: 'Priya Nair', email: 'priya@student.com', password: 'student123', avatar: 'PN', stream: 'NEET', class: '12th', school: 'Kendriya Vidyalaya' },
    { id: 'stu_3', name: 'Rohan Mehta', email: 'rohan@student.com', password: 'student123', avatar: 'RM', stream: 'JEE', class: '11th', school: 'Ryan International' },
    { id: 'stu_4', name: 'Sneha Pillai', email: 'sneha@student.com', password: 'student123', avatar: 'SP', stream: 'NEET', class: '11th', school: 'Narayana Junior College' },
  ]
  
  export const SAMPLE_QUESTIONS = [
    {
      id: 'q_1', subject: 'Physics', topic: 'Kinematics', difficulty: 'Medium', stream: 'JEE',
      question: 'A particle moves along a straight line with uniform acceleration. If its velocity changes from 10 m/s to 20 m/s while covering a distance of 150 m, what is the acceleration?',
      options: ['1 m/s²', '1.5 m/s²', '2 m/s²', '2.5 m/s²'],
      correct: 0, explanation: 'Using v² = u² + 2as: 400 = 100 + 2a(150) → a = 1 m/s²', marks: 4, negativeMarks: 1
    },
    {
      id: 'q_2', subject: 'Chemistry', topic: 'Organic Chemistry', difficulty: 'Hard', stream: 'JEE',
      question: 'Which of the following statements is correct about the SN2 reaction?',
      options: [
        'It proceeds with retention of configuration',
        'It involves a carbocation intermediate',
        'It proceeds with inversion of configuration',
        'Rate depends only on concentration of substrate'
      ],
      correct: 2, explanation: 'SN2 is a one-step bimolecular reaction with backside attack, resulting in Walden inversion (inversion of configuration).', marks: 4, negativeMarks: 1
    },
    {
      id: 'q_3', subject: 'Mathematics', topic: 'Calculus', difficulty: 'Hard', stream: 'JEE',
      question: 'The value of ∫₀^(π/2) (sin x)/(sin x + cos x) dx is:',
      options: ['π/4', 'π/2', 'π/8', '1'],
      correct: 0, explanation: 'Using the property that ∫₀^a f(x)dx = ∫₀^a f(a-x)dx, adding I + I gives 2I = π/2, so I = π/4.', marks: 4, negativeMarks: 1
    },
    {
      id: 'q_4', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Easy', stream: 'NEET',
      question: 'Which organelle is known as the "powerhouse of the cell"?',
      options: ['Ribosome', 'Golgi apparatus', 'Mitochondria', 'Lysosome'],
      correct: 2, explanation: 'Mitochondria produce ATP through cellular respiration, earning the name "powerhouse of the cell".', marks: 4, negativeMarks: 1
    },
    {
      id: 'q_5', subject: 'Physics', topic: 'Thermodynamics', difficulty: 'Medium', stream: 'JEE',
      question: 'For an ideal gas undergoing an adiabatic process, which relation holds? (γ = Cp/Cv)',
      options: ['PV = constant', 'TV^(γ-1) = constant', 'P^γ V = constant', 'PV^γ = constant'],
      correct: 3, explanation: 'For an adiabatic process: PV^γ = constant, where γ is the ratio of specific heats.', marks: 4, negativeMarks: 1
    },
    {
      id: 'q_6', subject: 'Chemistry', topic: 'Electrochemistry', difficulty: 'Medium', stream: 'JEE',
      question: 'The standard electrode potential of Cu²⁺/Cu is +0.34V and Zn²⁺/Zn is -0.76V. The EMF of the Daniel cell is:',
      options: ['0.42 V', '1.10 V', '0.34 V', '1.46 V'],
      correct: 1, explanation: 'EMF = E°cathode - E°anode = 0.34 - (-0.76) = 1.10 V', marks: 4, negativeMarks: 1
    },
    {
      id: 'q_7', subject: 'Biology', topic: 'Genetics', difficulty: 'Medium', stream: 'NEET',
      question: 'In a cross between two heterozygous tall plants (Tt × Tt), what percentage of offspring will be homozygous recessive?',
      options: ['25%', '50%', '75%', '100%'],
      correct: 0, explanation: 'From Tt × Tt: TT:Tt:tt = 1:2:1. Therefore 25% (1/4) are homozygous recessive (tt).', marks: 4, negativeMarks: 1
    },
    {
      id: 'q_8', subject: 'Physics', topic: 'Optics', difficulty: 'Easy', stream: 'NEET',
      question: 'A convex lens has focal length 20 cm. An object is placed 40 cm from the lens. The image distance is:',
      options: ['20 cm', '40 cm', '60 cm', '80 cm'],
      correct: 1, explanation: 'Using 1/v - 1/u = 1/f: 1/v - 1/(-40) = 1/20 → 1/v = 1/20 - 1/40 = 1/40 → v = 40 cm', marks: 4, negativeMarks: 1
    },
  ]
  
  export const SAMPLE_TESTS = [
    {
      id: 'test_1',
      title: 'JEE Mains Mock Test — January Series',
      description: 'Full syllabus mock test covering Physics, Chemistry, and Mathematics',
      stream: 'JEE',
      duration: 180,
      totalMarks: 300,
      questionIds: ['q_1', 'q_2', 'q_3', 'q_5', 'q_6'],
      status: 'active',
      assignedTo: ['stu_1', 'stu_3'],
      createdAt: '2024-01-10T09:00:00Z',
      scheduledAt: '2024-01-20T09:00:00Z',
      sections: [
        { name: 'Physics', subjects: ['Physics'], questionCount: 2 },
        { name: 'Chemistry', subjects: ['Chemistry'], questionCount: 2 },
        { name: 'Mathematics', subjects: ['Mathematics'], questionCount: 1 }
      ]
    },
    {
      id: 'test_2',
      title: 'NEET Biology + Physics Weekly Test',
      description: 'Weekly practice test for NEET aspirants — Biology and Physics',
      stream: 'NEET',
      duration: 90,
      totalMarks: 120,
      questionIds: ['q_4', 'q_7', 'q_8'],
      status: 'active',
      assignedTo: ['stu_2', 'stu_4'],
      createdAt: '2024-01-12T09:00:00Z',
      scheduledAt: '2024-01-18T09:00:00Z',
      sections: [
        { name: 'Biology', subjects: ['Biology'], questionCount: 2 },
        { name: 'Physics', subjects: ['Physics'], questionCount: 1 }
      ]
    }
  ]