export const wellbeingConfig = {
  greetingTriggers: ['hello', 'hi', 'hey', 'start', 'help'],
  greetingResponse: "Hi there! I'm your Wellbeing Assistant 🌱 I'm here to support your mental health, stress management, and overall wellbeing as a student. How are you feeling today?",
  fallbackResponse: "Taking care of yourself is so important. I can help with stress, sleep, anxiety, burnout, and building healthy habits. What would you like to talk about?",
  entries: [
    {
      keywords: ['stress', 'stressed', 'overwhelmed', 'pressure', 'manage'],
      response: "It's completely normal to feel stressed, especially with academic pressure. Try the 4-7-8 breathing technique, prioritize your tasks by urgency, and make sure you're taking brief breaks away from your screen. You can't pour from an empty cup.",
      followUps: ['What is 4-7-8 breathing?', 'How to prioritize tasks', 'Quick stress relief exercises']
    },
    {
      keywords: ['burnout', 'exhausted', 'tired all the time', 'no motivation', 'drained'],
      response: ["Burnout happens when prolonged stress isn't managed. The most important step right now is absolute rest—step away from work if you can. Re-engage with hobbies that demand nothing from you.", "If you're feeling burnt out, try reducing your immediate workload to just the bare essentials. Talk to your professors about extensions if needed. Your health comes first."],
      followUps: ['Signs of academic burnout', 'How to talk to professors about burnout', 'Rebuilding motivation slowly']
    },
    {
      keywords: ['sleep', 'insomnia', 'cant sleep', 'tired', 'hygiene'],
      response: "Good sleep hygiene is crucial! Try to go to bed and wake up at the exact same time every day. Avoid screens 1 hour before bed, keep your room cool, and use your bed only for sleep and rest, not studying.",
      followUps: ['Wind-down routine ideas', 'Does caffeine really impact sleep?', 'Napping during the day']
    },
    {
      keywords: ['eat', 'food', 'diet', 'healthy', 'nutrition'],
      response: "When we get busy, nutrition is often the first thing to go. Focus on whole foods, stay hydrated, and try not to skip meals. Meal prepping on weekends can save you immense stress during a hectic week.",
      followUps: ['Easy meal prep ideas for students', 'Brain foods for studying', 'Drinking enough water']
    },
    {
      keywords: ['exercise', 'workout', 'gym', 'move', 'physical'],
      response: "You don't need a 2-hour gym session to see mental health benefits! Even a 20-minute brisk walk, some light yoga, or a quick bodyweight circuit in your room can significantly boost your mood and reduce anxiety.",
      followUps: ['Quick workout routines', 'Yoga for stress relief', 'Finding motivation to exercise']
    },
    {
      keywords: ['anxiety', 'anxious', 'panic', 'worry', 'nervous'],
      response: "Anxiety can feel very overwhelming. When it hits, try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. It helps bring your brain back to the present moment.",
      followUps: ['More grounding techniques', 'Difference between stress and anxiety', 'When to seek therapy']
    },
    {
      keywords: ['lonely', 'friends', 'social', 'isolated', 'alone'],
      response: "University can be surprisingly lonely. Remember that many other students feel exactly the same way. The best way to make friends is through shared interests—try joining a society, a study group, or volunteering on campus.",
      followUps: ['How to start conversations', 'Dealing with FOMO', 'Joining societies']
    },
    {
      keywords: ['homesick', 'home', 'miss family', 'far away'],
      response: "Homesickness is really tough. Try to establish a new comfortable routine in your current environment while scheduling regular virtual calls with family. Bring touches of home to your room, like photos or familiar smells.",
      followUps: ['Making a dorm feel like home', 'How to build a new support system', 'Is it okay to go home on weekends?']
    },
    {
      keywords: ['balance', 'work-life', 'social life', 'time', 'juggling'],
      response: "Work-life balance as a student means accepting you can't be perfect at everything every day. Schedule your downtime just like you schedule classes. If it's not on the calendar, you might feel guilty for resting—so make rest official!",
      followUps: ['Time blocking method', 'How to say no securely', 'Scheduling guilt-free rest']
    },
    {
      keywords: ['mindful', 'meditation', 'present', 'app', 'headspace'],
      response: "Mindfulness is just the practice of paying attention to the present moment without judgment. You don't have to sit cross-legged for an hour! Start with just 3 minutes of focusing on your breath using apps like Headspace or InsightTimer.",
      followUps: ['Beginner meditation tips', 'Mindfulness while walking', 'Best free meditation apps']
    },
    {
      keywords: ['fail', 'failure', 'bad grade', 'disappointed', 'mistake'],
      response: "A bad grade feels awful, but it is not a reflection of your intelligence or worth. Give yourself a day to feel disappointed, then look at the feedback objectively. What can you change for next time? This is just data for growth.",
      followUps: ['How to bounce back from failure', 'Talking to the professor after a bad grade', 'Growth mindset']
    },
    {
      keywords: ['confidence', 'imposter syndrome', 'self-esteem', 'fake', 'believe'],
      response: "If you're feeling Imposter Syndrome, know that highly capable people experience it the most! Keep a 'brag file'—a folder of compliments, good grades, and achievements you can look at when you doubt yourself. You earned your spot here.",
      followUps: ['What is Imposter Syndrome?', 'How to build self-confidence', 'Stop comparing myself to others']
    },
    {
      keywords: ['positive', 'self-talk', 'inner critic', 'negative', 'harsh'],
      response: "We are often our own harshest critics. Notice your inner dialogue. If you make a mistake and think 'I'm so stupid', ask yourself: would you say that to a friend? Try to speak to yourself with the same compassion you'd give to someone you care about.",
      followUps: ['Reframing negative thoughts', 'Self-compassion exercises', 'Journaling ideas']
    },
    {
      keywords: ['screen', 'digital detox', 'phone', 'social media', 'doomscrolling'],
      response: "Doomscrolling massively impacts our mental health. Try a 'digital sunset'—putting all electronics away an hour before bed. Make your phone less appealing by turning the screen to grayscale or setting aggressive app timers.",
      followUps: ['How to do a digital detox', 'Grayscale phone trick', 'Alternatives to scrolling']
    },
    {
      keywords: ['help', 'counseling', 'therapy', 'professional', 'therapist'],
      response: "Seeking professional help is one of the strongest things you can do. Most universities offer free short-term counseling services. A therapist provides a safe, neutral space to process your feelings and learn coping strategies.",
      followUps: ['How to access campus counseling', 'What to expect in a first therapy session', 'Different types of therapy']
    }
  ],
  crisisKeywords: ['suicide', 'kill myself', 'end my life', 'self harm', 'hurt myself', "don't want to live", 'hopeless', 'no reason to live'],
  crisisResponse: "I hear you, and I'm really glad you reached out. 💙 What you're feeling matters. Please talk to someone who can truly support you — reach out to your university's counseling center, or contact a helpline in your country. You don't have to face this alone.\n[Pakistan: Umang helpline 0317-4288665 | International: findahelpline.com]"
};
