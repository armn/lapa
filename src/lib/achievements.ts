import type { Achievement } from './types';

export const achievements: Achievement[] = [
  {
    id: 'first-words',
    name: 'First Steps',
    description: 'Write your first 100 words',
    icon: '📝',
    unlocked: false,
    progress: 0,
    target: 100,
    hint: 'Start writing! You need 100 words total to unlock this achievement.'
  },
  {
    id: 'word-warrior',
    name: 'Word Warrior',
    description: 'Reach 1000 total words',
    icon: '⚔️',
    unlocked: false,
    progress: 0,
    target: 1000,
    hint: 'Keep writing! You need 1000 total words across all sessions.'
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Complete 5 writing sessions',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    target: 5,
    hint: 'Complete 5 writing sessions by clicking "Complete session".'
  },
  // {
  //   id: 'delete-demon',
  //   name: 'Delete Demon',
  //   description: 'Delete 100 words (keep editing!)',
  //   icon: '❌',
  //   unlocked: false,
  //   progress: 0,
  //   target: 100,
  //   hint: 'Use backspace or delete to remove 100 characters while writing.'
  // },
  // {
  //   id: 'speed-demon',
  //   name: 'Speed Demon',
  //   description: 'Write 50 words in one minute',
  //   icon: '⚡',
  //   unlocked: false,
  //   progress: 0,
  //   target: 50,
  //   hint: 'Write quickly! You need 50 words in a single minute.'
  // },
  {
    id: 'marathon-writer',
    name: 'Marathon Writer',
    description: 'Complete 10 writing sessions',
    icon: '🏃',
    unlocked: false,
    progress: 0,
    target: 10,
    hint: 'Keep at it! Complete 10 writing sessions.'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Write between midnight and 5 AM',
    icon: '🦉',
    unlocked: false,
    progress: 0,
    target: 1,
    hint: 'Write during the night hours (12 AM - 5 AM).'
  },
  {
    id: 'wordsmith',
    name: 'Wordsmith',
    description: 'Use 10 words that are longer than 8 characters',
    icon: '📚',
    unlocked: false,
    progress: 0,
    target: 10,
    hint: 'Use longer words! You need 10 unique words with 8+ characters.'
  },
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    description: 'Spend 1 hour total writing',
    icon: '⌛',
    unlocked: false,
    progress: 0,
    target: 3600,
    hint: 'Keep writing! Total time needed: 1 hour across all sessions.'
  },
  {
    id: 'persistent-poet',
    name: 'Persistent Poet',
    description: 'Write for 30 minutes in one session',
    icon: '📜',
    unlocked: false,
    progress: 0,
    target: 1800,
    hint: 'Write for 30 minutes straight in a single session.'
  },
  {
    id: 'prolific-writer',
    name: 'Prolific Writer',
    description: 'Save 10 different texts',
    icon: '📚',
    unlocked: false,
    progress: 0,
    target: 10,
    hint: 'Complete and save 10 different writing sessions.'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Write between 5 AM and 7 AM',
    icon: '🌅',
    unlocked: false,
    progress: 0,
    target: 1,
    hint: 'Write during early morning hours (5 AM - 7 AM).'
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Write on both Saturday and Sunday',
    icon: '📅',
    unlocked: false,
    progress: 0,
    target: 2,
    hint: 'Write on both weekend days.'
  },
  {
    id: 'dedication',
    name: 'Dedication',
    description: 'Write for 7 days in total',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    target: 7,
    hint: 'Complete sessions on 7 different days.'
  },
  {
    id: 'novel-starter',
    name: 'Novel Starter',
    description: 'Write 5000 words total',
    icon: '📖',
    unlocked: false,
    progress: 0,
    target: 5000,
    hint: 'Keep writing! You need 5000 total words across all sessions.'
  },
  // {
  //   id: 'sentence-master',
  //   name: 'Sentence Master',
  //   description: 'Write a sentence with more than 20 words',
  //   icon: '📖',
  //   unlocked: false,
  //   progress: 0,
  //   target: 1,
  //   hint: 'Write a long, detailed sentence with more than 20 words.'
  // },
  // {
  //   id: 'vocabulary-virtuoso',
  //   name: 'Vocabulary Virtuoso',
  //   description: 'Use 20 unique words that are longer than 6 characters',
  //   icon: '📚',
  //   unlocked: false,
  //   progress: 0,
  //   target: 20,
  //   hint: 'Use varied vocabulary with words longer than 6 characters.'
  // },
  // {
  //   id: 'afternoon-author',
  //   name: 'Afternoon Author',
  //   description: 'Write between 2 PM and 5 PM',
  //   icon: '☀️',
  //   unlocked: false,
  //   progress: 0,
  //   target: 1,
  //   hint: 'Write during the afternoon hours (2 PM - 5 PM).'
  // },
  // {
  //   id: 'focused-flow',
  //   name: 'Focused Flow',
  //   description: 'Write for 15 minutes without deleting anything',
  //   icon: '🎯',
  //   unlocked: false,
  //   progress: 0,
  //   target: 900,
  //   hint: 'Keep writing for 15 minutes without using backspace or delete.'
  // },
  // {
  //   id: 'writing-ritual',
  //   name: 'Writing Ritual',
  //   description: 'Write at the same time for 3 days',
  //   icon: '⏰',
  //   unlocked: false,
  //   progress: 0,
  //   target: 3,
  //   hint: 'Start writing within the same hour for three different days.'
  // }
  
];