/** Korean translations for the section-nav sidebar (categories, labels, placeholders). */
export const KO_NAV: Record<string, string> = {
  Navigate: "탐색",
  Pinned: "고정됨",
  "Search posts…": "게시물 검색…",
  "Search…": "검색…",
  "No category sections match the current filters. Clear tag / search.":
    "현재 필터에 맞는 카테고리가 없습니다. 태그 또는 검색을 지워주세요.",
  Education: "학력",
  "Work Experience": "경력",
  Conferences: "컨퍼런스",
  ExtraCurricular: "과외 활동",
  Life: "일상",
  "Career / Talks / Community": "커리어 / 강연 / 커뮤니티",
  Activities: "활동",
  Personal: "개인",
  "Personal Life": "개인 생활",
  "Cloud Security": "클라우드 보안",
  "Detection & Response (Observability)": "탐지 & 대응 (관측)",
  "Security Research (AI Security)": "보안 연구 (AI 보안)",
  "Cryptography & TLS": "암호학 & TLS",
  "Reverse Engineering": "리버스 엔지니어링",
  "CTF Writeups": "CTF 풀이",
  "Systems & RTOS": "시스템 & RTOS",
  "Research Notes": "연구 노트",
  "Infrastructure Engineering": "인프라 엔지니어링",
  Other: "기타",
}

/** Korean translations for resume section data (institutions, roles, periods, highlights). */
export const KO_RESUME: Record<string, string> = {
  // Section titles
  Education: "학력",
  "Work Experience": "경력",

  // — Education —
  "University of Maryland, College Park": "메릴랜드 대학교 칼리지파크",
  "MD, USA": "미국 메릴랜드",
  "Master of Engineering (M.Eng.) in Cybersecurity": "사이버보안 공학 석사 (M.Eng.)",
  "Aug 2024 – May 2026": "2024년 8월 – 2026년 5월",
  "Hacking C & Unix Binaries": "C 해킹 및 유닉스 바이너리",
  "LLMs, Security, and Privacy": "대규모 언어 모델, 보안 및 개인정보",
  "Fundamentals of AI and Deep Learning": "AI 및 딥러닝 기초",
  "Cloud Computing": "클라우드 컴퓨팅",
  "Graduate Research Assistant": "대학원 연구 조교",
  "Mar 2026 – May 2026": "2026년 3월 – 2026년 5월",
  "Studied Kubernetes configuration drift when GitOps reconciliation overwrites emergency patches, widening gaps between live cluster state and audit reporting; validated across scenarios with production risk implications.":
    "GitOps 조정 시 긴급 패치가 덮어쓰이면서 발생하는 쿠버네티스 설정 드리프트를 연구하고, 실제 클러스터 상태와 감사 보고 간의 불일치 심화 현상을 분석했습니다. 운영 리스크가 수반되는 다양한 시나리오를 대상으로 검증을 수행했습니다.",
  "Seoul Women's University": "서울여자대학교",
  "Seoul, Korea": "한국 서울",
  "B.S. in Mathematics & B.E. in Information Security": "수학 이학사 · 정보보안 공학사",
  "Mar 2015 – Aug 2020": "2015년 3월 – 2020년 8월",
  "Linear Algebra": "선형대수학",
  "Java Programming": "자바 프로그래밍",
  "Windows Programming": "윈도우 프로그래밍",
  "Applied Cryptology": "응용 암호학",

  // — Work Experience —
  "Theragen Bio": "테라젠바이오",
  "Pangyo, Korea": "경기도 판교",
  "System Administrator": "시스템 관리자",
  "Dec 2020 – Aug 2024": "2020년 12월 – 2024년 8월",
  "Infrastructure & Automation": "인프라 및 자동화",
  "Administered 200+ Linux servers; developed a 4,000-line Bash script that automated deployment and slashed provisioning time by 85%.":
    "리눅스 서버 200대 이상을 관리하고, 배포를 자동화하여 프로비저닝 시간을 85% 단축한 4,000줄 규모의 Bash 스크립트를 개발했습니다.",
  "Cloud Migration": "클라우드 마이그레이션",
  "Led the enterprise migration to Microsoft 365 and Azure AD for 100+ users, enforcing security policies via Intune.":
    "100명 이상의 사용자를 대상으로 Microsoft 365 및 Azure AD 기업 마이그레이션을 주도하고, Intune을 통한 보안 정책을 시행했습니다.",
  "Subsidiary Spin-off": "자회사 분리",
  "Directed the zero-downtime infrastructure separation of 13 services and 200+ servers for a subsidiary spin-off.":
    "자회사 분리를 위해 13개 서비스 및 200대 이상의 서버에 대한 무중단 인프라 분리를 지휘했습니다.",
  "Security & Compliance": "보안 및 컴플라이언스",
  "Hardened infrastructure against ISO 27001 and GCLP standards using vulnerability assessments, MFA, and encryption; achieved 85% engagement in phishing simulations.":
    "취약점 평가, MFA 및 암호화를 통해 ISO 27001·GCLP 기준으로 인프라를 강화하고, 피싱 시뮬레이션에서 85% 참여율을 달성했습니다.",
  "Operations & Networking": "운영 및 네트워킹",
  "Monitored system health using Grafana/Prometheus, authored a 300+ page IT knowledge base, and managed core network functions (DNS, DHCP, VLANs, VPNs, firewalls).":
    "Grafana/Prometheus로 시스템 상태를 모니터링하고, 300페이지 이상의 IT 지식베이스를 작성하며, 핵심 네트워크 기능(DNS, DHCP, VLAN, VPN, 방화벽)을 관리했습니다.",
  "Korean Information Security Management Institute": "한국정보보호경영연구소",
  "Security Audit & Penetration Testing Consultant": "보안 감사 및 침투 테스트 컨설턴트",
  "May 2020 – Nov 2020": "2020년 5월 – 2020년 11월",
  "Security Audits & Pentesting": "보안 인증 감사 및 모의 해킹",
  "Conducted comprehensive IT security audits and penetration testing for major enterprise clients, including KAKAO VX, InBody, and SK Telecom.":
    "KAKAO VX, 인바디, SK텔레콤 등 주요 기업 고객을 대상으로 종합적인 IT 보안 감사 및 침투 테스트를 수행했습니다.",
  "Cloud Policy Development": "클라우드 정책 개발",
  "Authored and aligned cloud security policies with ISO 27017/27018 standards to support client certifications.":
    "고객사 인증 취득을 지원하기 위해 ISO 27017/27018 기준에 맞는 클라우드 보안 정책을 수립하고 정합성을 검토했습니다.",
  "Defensive Hardening": "방어적 강화",
  "Evaluated and remediated security misconfigurations to strengthen identity and access management (IAM), encryption, and network defenses under ISO 27001/27017/27018 and ISMS-P frameworks.":
    "ISO 27001/27017/27018 및 ISMS-P 프레임워크에 따라 보안 취약 설정을 평가·개선하여 IAM, 암호화, 네트워크 방어를 강화했습니다.",
}

/** Korean translations for the About drawer (TOC labels, timeline, metric suffixes). */
export const KO_ABOUT: Record<string, string> = {
  "— PATH": "— 경로",
  "ON THIS PAGE": "이 페이지",
  TIMELINE: "타임라인",
  "KEY METRICS": "주요 지표",
  "nodes managed": "노드 관리",
  "provisioning time": "프로비저닝 시간",
  "users migrated": "사용자 마이그레이션",
  "services separated": "서비스 분리",
  "ops experience": "운영 경험",
  graduating: "졸업 예정",
  "M.Eng. Cybersecurity": "사이버보안 공학 석사",
  "University of Maryland": "메릴랜드 대학교",
  "Aug 2024 – May 2026": "2024년 8월 – 2026년 5월",
  "Graduate Research Assistant": "대학원 연구 조교",
  "SEED Lab · UMD": "SEED Lab · UMD",
  "Mar – May 2026": "2026년 3월 – 2026년 5월",
  "System Administrator": "시스템 관리자",
  "Theragen Bio": "테라젠바이오",
  "Dec 2020 – Aug 2024": "2020년 12월 – 2024년 8월",
  "Security Consultant": "보안 컨설턴트",
  KISMI: "한국정보보호경영연구소",
  "May – Nov 2020": "2020년 5월 – 2020년 11월",
  "B.S. Math & B.E. InfoSec": "수학 이학사 · 정보보안 공학사",
  "Seoul Women's University": "서울여자대학교",
  "Mar 2015 – Aug 2020": "2015년 3월 – 2020년 8월",
}
