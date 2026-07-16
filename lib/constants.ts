export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Summit India 2025",
    slug: "react-summit-india-2025",
    location: "Bengaluru, Karnataka, India",
    date: "2025-11-07",
    time: "09:00 AM",
  },
  {
    image: "/images/event2.png",
    title: "KubeCon + CloudNativeCon India 2026",
    slug: "kubecon-cloudnativecon-india-2026",
    location: "Hyderabad, Telangana, India",
    date: "2026-03-18",
    time: "10:00 AM",
  },
  {
    image: "/images/event3.png",
    title: "AWS re:Invent India 2025",
    slug: "aws-reinvent-india-2025",
    location: "Mumbai, Maharashtra, India",
    date: "2025-12-01",
    time: "08:30 AM",
  },
  {
    image: "/images/event4.png",
    title: "Next.js Conf India 2025",
    slug: "nextjs-conf-india-2025",
    location: "Bengaluru, Karnataka, India (Hybrid)",
    date: "2025-11-12",
    time: "09:30 AM",
  },
  {
    image: "/images/event5.png",
    title: "Google Cloud Next India 2026",
    slug: "google-cloud-next-india-2026",
    location: "New Delhi, India",
    date: "2026-04-07",
    time: "09:00 AM",
  },
  {
    image: "/images/event6.png",
    title: "ETHGlobal Hackathon India 2026",
    slug: "ethglobal-india-2026",
    location: "Goa, India",
    date: "2026-07-10",
    time: "10:00 AM",
  },
  {
    image: "/images/event-full.png",
    title: "Open Source Summit India 2026",
    slug: "oss-india-2026",
    location: "Chennai, Tamil Nadu, India",
    date: "2026-06-22",
    time: "09:00 AM",
  },
];

export default events;