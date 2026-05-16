export type AboutCard = {
  title: string
  body: string
}

export type AboutSection = {
  id: string
  number: string
  title: string
  catToken: string
  cards?: AboutCard[]
  cols?: string[]
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "built",
    number: "01",
    title: "BUILT",
    catToken: "ctf",
    cards: [
      {
        title: "Linux Infrastructure",
        body: "Administered 200+ Linux servers; automated deployment with a 4,000-line Bash framework that cut provisioning time by 85%.",
      },
      {
        title: "Cloud Migration",
        body: "Led the enterprise migration to Microsoft 365 and Azure AD for 100+ users, enforcing security policies via Intune.",
      },
      {
        title: "Zero-Downtime Separation",
        body: "Directed the clean infrastructure separation of 13 services and 200+ servers during a subsidiary spin-off.",
      },
    ],
  },
  {
    id: "protected",
    number: "02",
    title: "PROTECTED",
    catToken: "systems",
    cards: [
      {
        title: "ISO 27001 & GCLP",
        body: "Hardened infrastructure against ISO 27001 and GCLP standards via vulnerability assessments, MFA rollout, and encryption enforcement.",
      },
      {
        title: "Enterprise Audits",
        body: "Conducted penetration testing and IT security audits for KAKAO VX, InBody, and SK Telecom.",
      },
      {
        title: "IAM & Network Defense",
        body: "Remediated IAM misconfigurations and strengthened network defenses under ISMS-P and ISO 27001/27017/27018.",
      },
    ],
  },
  {
    id: "broke",
    number: "03",
    title: "BROKE",
    catToken: "reverse",
    cards: [
      {
        title: "Binary Exploitation",
        body: "Built and documented offensive techniques — buffer overflows, ROP chains, heap exploitation — in the public Hacking repo.",
      },
      {
        title: "Enterprise Pentesting",
        body: "Penetration-tested web and cloud environments for major enterprise clients under ISO 27001/27017 audit scopes.",
      },
      {
        title: "K8s Drift Research",
        body: "Studied GitOps reconciliation vs. emergency patch drift in Kubernetes clusters at SEED Lab — production risk implications.",
      },
    ],
  },
  {
    id: "designs",
    number: "04",
    title: "DESIGNS WHAT COMES NEXT",
    catToken: "crypto",
    cards: [
      {
        title: "Secure IoT Protocols",
        body: "Implemented TLS on RTOS to validate mutual auth and latency tradeoffs on resource-constrained sensor nodes.",
      },
      {
        title: "AI & LLM Security",
        body: "Researching how language models expand the threat surface — coursework in LLMs, Security, and Privacy at UMD.",
      },
      {
        title: "Cloud-Native Controls",
        body: "Designing cloud-native security controls and observability pipelines for production Kubernetes environments.",
      },
    ],
  },
  {
    id: "outside",
    number: "05",
    title: "OUTSIDE OF WORK",
    catToken: "lime",
    cards: [
      {
        title: "CTF & Hacking Research",
        body: "Active in Capture-the-Flag competitions; maintains a public binary exploitation and hacking research repo.",
      },
      {
        title: "Open-Source Projects",
        body: "ABLE — attribute-based logging engine; ATTRIB — attribution framework for security events.",
      },
      {
        title: "Continuous Learning",
        body: "M.Eng. coursework spanning AI, deep learning, cloud computing, and advanced cryptography.",
      },
    ],
  },
  {
    id: "looking-for",
    number: "06",
    title: "WHAT I AM LOOKING FOR",
    catToken: "research",
    cols: [
      "Security engineering roles at the intersection of infrastructure depth and cloud-native architecture — detection engineering, cloud security, platform security, or security research.",
      "US-based or remote-friendly. Graduating May 2026 and available immediately. Open to startup, scale-up, and enterprise environments.",
    ],
  },
]

export type AboutMetric = {
  value: string
  label: string
}

export const ABOUT_METRICS: AboutMetric[] = [
  { value: "200+", label: "servers managed" },
  { value: "85%", label: "faster provisioning" },
  { value: "100+", label: "users migrated" },
  { value: "13", label: "services separated" },
  { value: "3.5 yr", label: "ops experience" },
  { value: "2026", label: "graduating" },
]

export type AboutTimelineItem = {
  label: string
  org: string
  period: string
  type: "edu" | "work"
}

export const ABOUT_TIMELINE: AboutTimelineItem[] = [
  {
    label: "M.Eng. Cybersecurity",
    org: "University of Maryland",
    period: "Aug 2024 – May 2026",
    type: "edu",
  },
  {
    label: "Graduate Research Assistant",
    org: "SEED Lab · UMD",
    period: "Mar – May 2026",
    type: "work",
  },
  {
    label: "System Administrator",
    org: "Theragen Bio",
    period: "Dec 2020 – Aug 2024",
    type: "work",
  },
  {
    label: "Security Consultant",
    org: "KISMI",
    period: "May – Nov 2020",
    type: "work",
  },
  {
    label: "B.S. Math & B.E. InfoSec",
    org: "Seoul Women's University",
    period: "Mar 2015 – Aug 2020",
    type: "edu",
  },
]
