export const mentorConfig = {
  greetingTriggers: ['hello', 'hi', 'hey', 'start', 'help'],
  greetingResponse: "Hello! I'm your Mentor Assistant 🎯 I can guide you on finding mentors, career planning, interview prep, resume tips, and professional growth. What's on your mind?",
  fallbackResponse: "Great question for a mentor! I can help with career planning, finding mentors, interview prep, and professional development. Which area would you like to explore first?",
  entries: [
    {
      keywords: ['find', 'looking', 'search', 'right mentor', 'who to ask'],
      response: "Finding the right mentor starts with knowing your goals. Look for alumni or senior students whose career paths align with where you want to go. Don't be afraid to reach out—most are happy to help!",
      followUps: ['Where to find alumni', 'How to approach someone', 'What makes a good mentor?']
    },
    {
      keywords: ['approach', 'message', 'reach out', 'contact', 'cold email'],
      response: "When approaching a potential mentor, keep your initial message concise and respectful. Introduce yourself, state specifically why you admire their background, and ask for a brief 15-minute chat, not a massive lifelong commitment upfront.",
      followUps: ['Cold email template', 'Messaging on LinkedIn', 'What if they ignore me?']
    },
    {
      keywords: ['prepare', 'session', 'meeting', 'first time', 'questions'],
      response: ["Before a mentoring session, prepare a brief intro (your elevator pitch) and 3-4 specific questions. Have a clear objective for the meeting. Your mentor will appreciate that you respect their time.", "Send an agenda ahead of time if possible! During the meeting, listen actively and take notes on their advice."],
      followUps: ['Good questions to ask a mentor', 'How to introduce myself', 'Following up after a meeting']
    },
    {
      keywords: ['career', 'path', 'guidance', 'future', 'don\'t know what to do'],
      response: "It's normal to be unsure about your career path! Start by listing your core strengths, interests, and values. Then, do informational interviews with professionals in various roles to see what resonates with you.",
      followUps: ['What is an informational interview?', 'Identifying my strengths', 'Should I take a gap year?']
    },
    {
      keywords: ['resume', 'cv', 'tips', 'format', 'build'],
      response: "A strong resume is concise (1 page for students) and results-oriented. Use action verbs and quantify your achievements (e.g., 'Led a team of 5 to increase sales by 10%'). Tailor it to the specific job you're applying for.",
      followUps: ['Best resume templates', 'How to list projects', 'What if I have no experience?']
    },
    {
      keywords: ['internship', 'search', 'apply', 'summer', 'job'],
      response: "For internships, start early! Fall is prime recruitment time for many industries. Leverage university career fairs, your alumni network, and platforms like LinkedIn or Handshake. Quality of applications beats quantity.",
      followUps: ['How to stand out in applications', 'Handling rejection', 'Paid vs unpaid internships']
    },
    {
      keywords: ['linkedin', 'profile', 'branding', 'personal brand', 'connect'],
      response: "Your LinkedIn is your professional landing page. Ensure you have a professional photo, a compelling headline (more than just 'Student at X'), and a summary that tells your story and goals. Engage with content in your target industry.",
      followUps: ['How to write a LinkedIn summary', 'Sending connection requests', 'What to post on LinkedIn']
    },
    {
      keywords: ['interview', 'prep', 'preparation', 'questions', 'star method'],
      response: "For behavioral interviews, use the STAR method to structure your answers: Situation, Task, Action, Result. Always research the company beforehand and prepare thoughtful questions to ask the interviewer.",
      followUps: ['Common interview questions', 'Explain the STAR method', 'Questions to ask the interviewer']
    },
    {
      keywords: ['networking', 'network', 'events', 'mingle', 'connections'],
      response: "Networking isn't just about collecting business cards; it's about building genuine relationships. Focus on being interested rather than interesting. Ask people about their journeys and follow up afterward.",
      followUps: ['How to handle networking events if I\'m shy', 'Following up effectively', 'Maintaining the network']
    },
    {
      keywords: ['skills', 'gap', 'learn', 'develop', 'improve'],
      response: "To analyze your skill gaps, look at job descriptions for your dream role. Note the recurring requirements you lack, and make a plan to acquire them via online courses, side projects, or university electives.",
      followUps: ['Hard skills vs soft skills', 'Best platforms to learn skills', 'Showcasing new skills']
    },
    {
      keywords: ['feedback', 'critique', 'ask', 'improve', 'review'],
      response: "Asking for feedback is a superpower. Ask specific questions like 'What is one thing I could have done better in that presentation?' rather than a generic 'How did I do?'. And most importantly, receive it without getting defensive.",
      followUps: ['Handling negative feedback', 'Implementing feedback into action', 'Feedback on my resume']
    },
    {
      keywords: ['goals', 'smart', 'setting', 'achieve', 'milestones'],
      response: "Set SMART goals to stay on track: Specific, Measurable, Achievable, Relevant, and Time-bound. Break large 5-year goals down into 1-year, 1-month, and weekly actionable steps.",
      followUps: ['Examples of SMART goals', 'Tracking goal progress', 'What if my goals change?']
    },
    {
      keywords: ['switch', 'pivot', 'change', 'field', 'major'],
      response: "Switching fields is common! Focus on identifying your 'transferable skills'—abilities like problem-solving, communication, or analytics that apply anywhere. Frame your previous experience as a unique perspective you bring to the new field.",
      followUps: ['What are transferable skills?', 'Explaining a pivot in an interview', 'Do I need to start over?']
    },
    {
      keywords: ['industry', 'research', 'trends', 'market', 'companies'],
      response: "To research an industry, read trade publications, follow thought leaders on LinkedIn, and listen to industry-specific podcasts. Understand the major players, the challenges the industry is facing, and where it's heading.",
      followUps: ['Best ways to stay updated', 'Researching a specific company', 'Identifying startup trends']
    },
    {
      keywords: ['email', 'professional', 'write', 'subject line', 'etiquette'],
      response: "Professional emails should be clear, concise, and courteous. Use a descriptive subject line. State your purpose early, use bullet points if necessary for readability, and always include a clear call to action or next step.",
      followUps: ['Emailing a professor', 'Follow-up email timing', 'Signing off professionally']
    }
  ]
};
