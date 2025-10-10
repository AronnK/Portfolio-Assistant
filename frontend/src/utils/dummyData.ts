import { ParsedResumeData } from "@/app/types";

export const dummyResumeData: ParsedResumeData = {
  "EDUCATION": [
    {
      title: "B.Tech, Artificial Intelligence and Data Science",
      subtitle: "Panimalar Engineering College, Chennai City Campus",
      date: "2022-2026",
      description: "CGPA: 8.5"
    },
    {
      title: "HSC",
      subtitle: "Velammal Vidyalaya",
      date: "2021-2022",
      description: "Percentage: 85%"
    },
    {
      title: "SSLC",
      subtitle: "DAV Gill Nagar",
      date: "2019-2020",
      description: "Percentage: 91%"
    }
  ],
  "SKILLS": [
    {
      title: "Programming",
      description: "Python, SQL, Java, JavaScript, TypeScript"
    },
    {
      title: "Full Stack Dev",
      description: "ReactJS, React Native, Next.JS, NodeJS"
    },
    {
      title: "AI/ML",
      description: "Machine Learning, Deep Learning, NLP, GenAI"
    },
    {
      title: "Data Science",
      description: "PowerBI, Tableau, Hadoop"
    }
  ],
  "PROJECTS": [
    {
      title: "2048-AI",
      description: "A simple Reinforcement-Learning AI agent to try to solve the 2048 game."
    },
    {
      title: "GymJam",
      description: "Simple workout logger website built with MERN stack and has GitHub like contributions section."
    },
    {
      title: "GalleRoon",
      description: "Simple gallery website to display my hobby as a street photographer."
    },
    {
      title: "Minesweeper",
      description: "A simple Minesweeper game using Java with AI."
    },
    {
      title: "Attendance Website",
      description: "A website created with MERN stack to help my college log daily attendance."
    }
  ],
  "INTERNSHIPS": [
    {
      title: "IOT and Backend Developer",
      subtitle: "Atlanwa",
      date: "July 2024 - August 2024",
      description: "Developed an image processing system to find irregularities in train parts and an interface to store, load and view welding data with RFID."
    },
    {
      title: "Full Stack Development",
      subtitle: "Slarity",
      date: "January 2025 - Present",
      description: "Currently building a cross platform web and native app using NextJs and React Native named Vadzo (available in PlayStore and AppStore)."
    }
  ],
  "HACKATHONS": [
    {
        title: "NLP Hackathon (Naan Mudhalvan GUVI)",
        description: "Led a 6-member team to build a real-time sentiment analysis model for brand monitoring. Secured 1st place overall and in the NLP category. Honored with the Student Achiever Award for standout performance."
    }
  ]
};