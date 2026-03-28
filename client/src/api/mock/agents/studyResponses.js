export const studyConfig = {
  greetingTriggers: ['hello', 'hi', 'hey', 'start', 'help'],
  greetingResponse: "Hi! I'm your Study Assistant 📚 I can help you with study strategies, exam prep, note-taking methods, time management, and more. What are you working on today?",
  fallbackResponse: "That's an interesting question! While I may not have a specific answer for that, I can help you with study strategies, exam prep, note-taking, time management, and focus techniques. What would you like to explore?",
  entries: [
    {
      keywords: ['schedule', 'timetable', 'plan', 'routine', 'organize'],
      response: "A solid study schedule is key! Try to break your day into blocks. Use your most productive hours for the hardest subjects. Make sure to schedule breaks too. Would you like me to help you draft a specific daily routine?",
      followUps: ['Create a daily routine', 'How to stick to a plan', 'Balancing study and life']
    },
    {
      keywords: ['exam', 'prep', 'preparation', 'test', 'finals', 'midterms'],
      response: ["Start your exam prep early to avoid cramming. Review past papers, identify your weak spots, and create a targeted revision plan.", "For exams, active recall and spaced repetition are much more effective than just re-reading notes. Have you tried testing yourself?"],
      followUps: ['Active recall techniques', 'Dealing with exam stress', 'Last minute prep tips']
    },
    {
      keywords: ['notes', 'note-taking', 'cornell', 'mind maps', 'outlining'],
      response: "Great notes save time later! The Cornell method is excellent for reviewing, while mind maps work well for visual learners connecting concepts. Outlining is best for structured lectures. Which one sounds like your style?",
      followUps: ['Explain the Cornell method', 'How to make a mind map', 'Digital vs paper notes']
    },
    {
      keywords: ['active recall', 'spaced repetition', 'flashcards', 'anki', 'quizlet'],
      response: "Active recall forces your brain to retrieve information, building stronger neural pathways. Pair it with spaced repetition (reviewing at increasing intervals) using apps like Anki or Quizlet for incredible long-term retention.",
      followUps: ['How to make good flashcards', 'What is the optimal review schedule?', 'Other active recall methods']
    },
    {
      keywords: ['pomodoro', 'technique', '25 minutes', 'break', 'timer'],
      response: "The Pomodoro Technique involves studying intensely for 25 minutes, followed by a 5-minute break. After 4 cycles, take a longer 15-30 minute break. It's fantastic for preventing burnout and maintaining high focus.",
      followUps: ['Apps for Pomodoro timer', 'What to do during the 5-min break', 'Can I do 50-minute blocks?']
    },
    {
      keywords: ['distraction', 'environment', 'phone', 'social media', 'focus'],
      response: "Your study environment dictates your focus. Put your phone in another room, use website blockers if necessary, and keep your desk clear of everything except what you are currently working on.",
      followUps: ['Website blocker recommendations', 'Music for studying', 'Finding a good study spot']
    },
    {
      keywords: ['group', 'study group', 'peers', 'friends', 'collaborate'],
      response: "Study groups are great if they stay on track! Try to limit the group to 3-4 people, assign specific topics for each person to teach the rest of the group, and set an agenda beforehand.",
      followUps: ['How to start a study group', 'What if my group gets off topic?', 'Teaching as a study method']
    },
    {
      keywords: ['difficult', 'hard', 'stuck', 'understand', 'confused'],
      response: "When a subject is difficult, break it down into the smallest possible components. Try the Feynman Technique: explain the concept in simple terms as if you were teaching a child. Where you get stuck is where you need to review.",
      followUps: ['What is the Feynman Technique?', 'Asking professors for help', 'Finding alternative explanations']
    },
    {
      keywords: ['assignment', 'deadline', 'essay', 'paper', 'project'],
      response: "For big assignments, work backward from the deadline. Set mini-deadlines for research, outlining, drafting, and editing. Starting the research phase early reduces stress significantly.",
      followUps: ['How to write a good outline', 'Curing writer\'s block', 'Proofreading tips']
    },
    {
      keywords: ['memory', 'remember', 'mnemonics', 'chunking', 'retain'],
      response: ["Mnemonics and chunking are powerful memory tools. Chunking groups information into smaller bites (like a phone number). Mnemonics use acronyms or silly stories to link facts together.", "To remember better, connect new information to something you already know. Creating vivid or bizarre mental images also makes facts stick better."],
      followUps: ['Give me an example of a mnemonic', 'How to remember lists', 'Memorizing formulas']
    },
    {
      keywords: ['reading', 'textbook', 'skim', 'sq3r', 'chapters'],
      response: "Don't read your textbooks like a novel! Try the SQ3R method: Survey (skim the chapter), Question (turn headings into questions), Read (to answer those questions), Recite, and Review.",
      followUps: ['How to skim effectively', 'Highlighting tips', 'Reading academic papers']
    },
    {
      keywords: ['online', 'resources', 'youtube', 'coursera', 'khan academy'],
      response: "Online resources are fantastic supplements. If a lecture didn't make sense, search the topic on YouTube or Coursera. Sometimes a different professor explaining the exact same concept will make it click instantly.",
      followUps: ['Best YouTube channels for math', 'Are online courses worth it?', 'Fact-checking online info']
    },
    {
      keywords: ['focus', 'concentrate', 'attention', 'zoning out', 'boring'],
      response: "If you're losing focus, your brain might be tired or under-stimulated. Try switching tasks, doing a quick 5-minute stretch, or chewing gum. Setting a clear, immediate goal for the next 15 minutes also helps.",
      followUps: ['Staying focused on boring subjects', 'Is multitasking bad?', 'Diet and concentration']
    },
    {
      keywords: ['anxiety', 'nervous', 'calm', 'panic', 'stress'],
      response: "Pre-exam anxiety is very common. Practice deep breathing (inhale for 4, hold for 4, exhale for 4). Remember that a test doesn't define your worth. Taking a brisk walk before the exam can burn off excess adrenaline.",
      followUps: ['Breathing exercises', 'Reframing negative thoughts', 'What to eat before an exam']
    },
    {
      keywords: ['time', 'management', 'during exam', 'running out of time', 'pacing'],
      response: "During an exam, quickly scan all the questions first. Allocate your time based on the points each section is worth. Do the easiest questions first to build confidence and guarantee those points, then tackle the hard ones.",
      followUps: ['What to do if I go blank', 'Multiple choice strategies', 'Essay question pacing']
    }
  ]
};
