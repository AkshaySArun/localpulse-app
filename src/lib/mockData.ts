import { Event } from '@/types';

export const MOCK_EVENTS: Event[] = [
    {
        id: 'local-1',
        name: 'Bangalore Tech Summit',
        description: 'Join us for the biggest tech event in Karnataka! access the future with cutting-edge innovations in AI, Robotics, Biotech, and more.\n\n**Event Highlights:**\n- **Keynote Speakers:** Industry leaders from global tech giants.\n- **Startup Showcase:** Witness 50+ innovative startups pitching their ideas.\n- **Workshops:** Hands-on sessions on Generative AI and Cloud Computing.\n- **Networking:** Connect with over 2000+ professionals, investors, and enthusiasts.\n\nWhether you are a student, professional, or entrepreneur, this summit offers something for everyone. Don’t miss the opportunity to be part of the tech revolution!',
        city: 'Bengaluru',
        date: '2025-11-20',
        time: '09:00',
        location: 'Palace Grounds',
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop',
        rating: 4.8,
        price: '₹500',
        type: 'local',
        status: 'approved',
        coordinates: { latitude: 12.9982, longitude: 77.5920 }
    },
    {
        id: 'local-2',
        name: 'Evening Park Yoga',
        description: 'Unwind after a long day with our community evening yoga session. Surrounded by the lush greenery of Cubbon Park, this session is designed to help you relax, stretch, and find inner peace.\n\n**What to bring:**\n- Yoga mat\n- Water bottle\n- Comfortable clothing\n\n**Session Details:**\n- **Instructor:** Certified Yoga Trainer, Priya Sharma.\n- **Level:** Beginner to Intermediate.\n- **Focus:** Breathing techniques and stress relief.\n\nCome alone or with friends – everyone is welcome to join our growing community of wellness enthusiasts.',
        city: 'Bengaluru',
        date: '2025-07-17',
        time: '18:00',
        location: 'Cubbon Park',
        category: 'Wellness',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1840&auto=format&fit=crop',
        rating: 4.5,
        price: 'Free',
        type: 'local',
        status: 'approved',
        coordinates: { latitude: 12.9779, longitude: 77.5952 }
    },
    {
        id: 'college-1',
        name: 'RVCE Inter-College Fest',
        description: 'Experience the grandest cultural extravaganza! The RVCE Inter-College Fest brings together the best talents in music, dance, and coding. Join us for a 3-day journey filled with energy and creativity.\n\n**What to expect:**\n- Live Concerts by renowned artists\n- High-stakes Coding Hackathons\n- Traditional and Contemporary Dance battles\n- Food stalls from top vendors across Bengaluru',
        city: 'Bengaluru',
        date: '2025-10-15',
        time: '10:00',
        location: 'RV College of Engineering, Mysore Road',
        category: 'Cultural',
        imageUrl: 'https://picsum.photos/seed/college-1/1200/800',
        rating: 4.9,
        price: 'Free',
        type: 'college',
        college: 'RV College of Engineering',
        status: 'approved',
        coordinates: { latitude: 12.9234, longitude: 77.4987 }
    },
    {
        id: 'dept-1',
        name: 'UI/UX Design Workshop',
        description: 'Unlock your creative potential in this intensive UI/UX Design Workshop. Learn the industry-standard tools and methodologies used by top design firms.\n\n**Workshop Agenda:**\n- **Session 1:** Understanding User Psychology & Design Ethics\n- **Session 2:** Mastering Figma: From Wireframes to High-Fidelity Prototypes\n- **Session 3:** Portfolio Review and Career Guidance\n\n**How will be the event:**\nInteractive, hands-on, and focused on real-world projects. You will build a complete mobile app prototype by the end of the day!',
        city: 'Bengaluru',
        date: '2025-08-05',
        time: '14:00',
        location: 'CS Department, Lab 4, RVCE Campus',
        category: 'Art',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop',
        rating: 4.2,
        price: '₹100',
        type: 'department',
        college: 'RV College of Engineering',
        department: 'Computer Science',
        status: 'approved',
        coordinates: { latitude: 12.9226, longitude: 77.4969 }
    }
];

export const MOCK_USER = {
    uid: 'demo-user-123',
    email: 'demo@localpulse.app',
    displayName: 'Demo User',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
    role: 'organizer',
    userType: 'student',
    college: 'RV College of Engineering',
    department: 'Computer Science',
    bio: 'Event enthusiast and computer science student at RVCE. Excited to explore local events!',
    interests: ['Technology', 'Music', 'Design']
};
