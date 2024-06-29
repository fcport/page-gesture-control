export const handKeypoint = {
  wrist: 0,
  thumbCmc: 1,
  thumbMcp: 2,
  thumbIp: 3,
  thumbTip: 4,
  indexMcp: 5,
  indexPip: 6,
  indexDip: 7,
  indexTip: 8,
  middleMcp: 9,
  middlePip: 10,
  middleDip: 11,
  middleTip: 12,
  ringMcp: 13,
  ringPip: 14,
  ringDip: 15,
  ringTip: 16,
  pinkyMcp: 17,
  pinkyPip: 18,
  pinkyDip: 19,
  pinkyTip: 20,
};

export const cards = [
  {
    title: 'Why did I choose to start this project',
    content: `I've created a hand gesture navigable website for a few important reasons.
     First off, I really enjoy studying new technologies and that's ome of the main drive for me.
     The tech world is always evolving, and I find it fascinating to explore cutting-edge solutions.
      This project allowed me to dive into gesture recognition, which is an exciting field with lots of potential.\n\n

      Another big reason was my desire to learn more about AI and TensorFlow. 
      Artificial intelligence is a game-changer in many areas, and I believe it's crucial to understand it better.
      By using TensorFlow in my website, I'm getting hands-on experience with these powerful tools.\n\n

      Lastly, I was inspired by Charlie Gerard's work. Her projects in human-computer interaction are really impressive,
      and they motivated me to try something similar on my own.\n\n

      This project has been a great learning experience for me. 
      It's challenging to blend gesture recognition, AI, and web development, but it's also very rewarding.
      I've learned a lot about how computers can understand human movements and how to implement this in a practical way.
      \n\n
There are always new features to add and ways to make the user experience smoother, 
      It's exciting to think about how this technology could be used in different applications in the future.\n\n

      Overall, I'm proud of what I've accomplished so far. It's not perfect, but it's a good start,
       and I'm eager to keep learning and developing my skills in this area.`,
  },
  {
    title: 'How is it built',
    content: `The core of my hand gesture navigable website is built using a combination of TensorFlow.js and MediaPipe, two powerful libraries for machine learning and computer vision. 
    TensorFlow.js allows me to run complex AI models directly in the browser,
     while MediaPipe provides efficient real-time hand tracking.\n\n

     To create the gesture recognition system,
      I utilized MediaPipe's pre-trained hand landmark model. 
      This model detects 21 key points on a hand,
       which I then use to recognize specific gestures.
        TensorFlow.js comes into play for custom gesture recognition 
        based on these landmarks.
        \n\n
The front-end of the website is built with Angular. 
        It was outstanding to find out how extensible can Js (and its frameworks) are even in the matter of AI which i thought was mostly evolved in other laguages like Python.
         The hand tracking runs in real-time, constantly analyzing the video feed from the user's webcam.
         \n\n
I had to balance accuracy with speed to ensure the gestures were recognized quickly without slowing down the website, nut either way that recognition was not perfect all the time. As a matter of fact a lot of factors weight in when it comes to accuracy like: the camera image quality, the background, etc...\n\n

          Throughout the development process, I had to do a lot of testing and tweaking to ensure the best accuracy in the gestures recognition although I am aware that it can be further improved.
      Getting the gesture recognition to work reliably across different lighting conditions and webcam qualities
       was particularly tricky, but MediaPipe's robust hand tracking helped a lot.\n\n

       Overall, building this website has been a great way to deepen my understanding of web development,
        machine learning, and computer vision. 
        It's exciting to see all these (apparently) different technologies come together in a practical application.`,
  },
  {
    title: 'Possible benefits',
    content: `While my project focuses on hand gesture recognition,
     this technology opens up a world of possibilities for improving accessibility in digital interfaces.
      One exciting area is eye movement recognition,
       which could be incredibly beneficial for people with limited mobility.\n\n
    Eye-tracking technology could allow users to navigate websites,
     type and many more interacitons using only their eye movements.
      This would be a game-changer for individuals who can't use traditional input methods like keyboards or mice.
       For example, someone with ALS or severe paralysis could browse the internet or communicate just by moving their eyes.
       \n\n
    Beyond eye tracking, other forms of movement recognition could also enhance accessibility.
     Head movements, facial expressions, or even slight muscle twitches could be translated into computer commands (provided the capturing methods can be that precise).
      This would provide more options for users with different abilities and preferences.\n\n
    These technologies could also benefit people with temporary injuries or situational limitations.
     Imagine being able to scroll through a recipe while cooking, without having to touch your device with messy hands.
     \n\n
    Moreover, gesture and movement recognition could make virtual and augmented reality experiences more accessible.
     Users could interact with virtual environments in ways that suit their physical capabilities and possibilities.\n\n
   The goal should be to create flexible, customizable interfaces that adapt to the needs of the user
    rather than forcing users to adapt to technology.\n\n
    Overall, the potential for improving digital accessibility through various forms of movement recognition is immense. 
    It's an area blooming with innovations and could significantly enhance digital inclusion for many people.`,
  },
  {
    title: 'Definitely a filler',
    content:
      "This is definitely a filler to create content to scroll down (and up) so let's get excited with some lorem ipsum dolor.\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    title: 'Definitely a filler',
    content:
      "This is definitely a filler to create content to scroll down (and up) so let's get excited with some lorem ipsum dolor.\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    title: 'Definitely a filler',
    content:
      "This is definitely a filler to create content to scroll down (and up) so let's get excited with some lorem ipsum dolor.\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];
