export type AboutCard = {
  title: string
  body: string
}

export type NarrativeBlock =
  | { type: "p"; en: string; ko?: string }
  | { type: "quote"; en: string; ko?: string }
  | { type: "metrics"; items: { val: string; en: string; ko?: string }[] }
  | { type: "photos"; items: { src: string; captionEn: string; captionKo?: string }[] }

export type AboutSection = {
  id: string
  number: string
  title: string
  catToken: string
  cards?: AboutCard[]
  cols?: string[]
  narrative?: NarrativeBlock[]
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "built",
    number: "01",
    title: "BUILT",
    catToken: "ctf",
    narrative: [
      {
        type: "p",
        en: "TheragenBio is a bioinformatics company handling genomic data. The entire IT operation outside of the development team was run by three people. Automation was not optional.",
        ko: "테라젠바이오는 유전체 데이터를 다루는 바이오인포매틱스 기업입니다. 개발팀 외 IT 운영 전체를 세 명이 담당했습니다. 자동화는 선택이 아니었습니다.",
      },
      {
        type: "p",
        en: "I built a modular Bash pipeline covering the full server onboarding process. <strong>4,000+ lines of scripts cut provisioning time from four hours to thirty minutes.</strong> Because the process ran identically every time, pipeline output fed directly into audit evidence — operational consistency and compliance documentation from the same source.",
        ko: "서버 온보딩 전 과정을 커버하는 모듈형 Bash 파이프라인을 구축했습니다. <strong>4,000줄 이상의 스크립트로 프로비저닝 시간을 4시간에서 30분으로 단축했습니다.</strong> 프로세스가 항상 동일하게 실행되었기 때문에, 파이프라인 출력이 감사 증거로 직접 활용되어 운영 일관성과 컴플라이언스 문서화가 동일한 소스에서 나왔습니다.",
      },
      {
        type: "metrics",
        items: [
          { val: "200+", en: "nodes managed", ko: "노드 관리" },
          { val: "72hr", en: "migration, 0 data loss", ko: "마이그레이션, 데이터 손실 없음" },
          { val: "100G", en: "InfiniBand fabric", ko: "InfiniBand 패브릭" },
        ],
      },
      {
        type: "p",
        en: "Following a corporate spinoff, I migrated <strong>over 100 servers in 72 hours</strong>. The DR plan was validated under real conditions: an SGE master node lost power overnight. I traveled to the datacenter, reprovisioned from the runbook, reconfigured all slave nodes. No data was lost.",
        ko: "회사 분리 이후 <strong>72시간 안에 100대 이상의 서버를 마이그레이션했습니다</strong>. DR 계획은 실제 상황에서 검증되었습니다. SGE 마스터 노드가 야간에 전원이 꺼졌고, 직접 데이터센터에 가서 런북으로 재프로비저닝하고 모든 슬레이브 노드를 재설정했습니다. 데이터 손실은 없었습니다.",
      },
    ],
  },
  {
    id: "protected",
    number: "02",
    title: "PROTECTED",
    catToken: "systems",
    narrative: [
      {
        type: "p",
        en: "I led <strong>ISO 27001, ISO 27701, and GCLP</strong> audits across <strong>four consecutive cycles with zero findings</strong>. ISO 27701 was required because the organization handled patient-linked genomic data.",
        ko: "<strong>ISO 27001, ISO 27701, GCLP</strong> 감사를 <strong>4회 연속 결함 없이</strong> 이끌었습니다. ISO 27701은 조직이 환자 연계 유전체 데이터를 다루었기 때문에 필요했습니다.",
      },
      {
        type: "quote",
        en: "An external auditor recommended physical USB port locks. I watched employees routing around existing controls. A stronger physical constraint produces quieter workarounds — not compliance.",
        ko: "외부 감사관이 물리적 USB 포트 잠금을 권고했습니다. 직원들이 기존 통제를 우회하는 것을 관찰했습니다. 더 강한 물리적 제약은 더 조용한 우회를 만들 뿐 — 컴플라이언스가 아닙니다.",
      },
      {
        type: "p",
        en: "Instead, I built an <strong>Azure AD log query pipeline</strong> to collect endpoint behavior including USB activity across the entire organization. User behavior was unchanged, but all activity became auditable. Higher compliance coverage than port locks — and it passed the audit.",
        ko: "대신 조직 전체의 엔드포인트 행동(USB 활동 포함)을 수집하는 <strong>Azure AD 로그 쿼리 파이프라인</strong>을 구축했습니다. 사용자 행동은 변하지 않았지만, 모든 활동이 감사 가능해졌습니다. USB 잠금보다 높은 컴플라이언스 커버리지 — 그리고 감사를 통과했습니다.",
      },
    ],
  },
  {
    id: "broke",
    number: "03",
    title: "BROKE",
    catToken: "reverse",
    narrative: [
      {
        type: "p",
        en: "One web assessment started with an HTTP 500 error. The stack trace and path information in the response opened the next attack vector. <strong>If you know what you are looking for, an error is information.</strong>",
        ko: "한 웹 평가는 HTTP 500 에러로 시작했습니다. 응답의 스택 트레이스와 경로 정보가 다음 공격 벡터를 열었습니다. <strong>무엇을 찾는지 알면, 에러는 정보입니다.</strong>",
      },
      {
        type: "p",
        en: "For the AWS cloud security assessment, I built a <strong>seven-step attack chain</strong>: Lambda credential exposure → SSRF → IMDSv1 → S3 exfiltration. I reconstructed a <strong>48-minute account compromise timeline</strong> from seven CloudTrail files and wrote Sigma detection rules for each attack phase.",
        ko: "AWS 클라우드 보안 평가에서 <strong>7단계 공격 체인</strong>을 구성했습니다: Lambda 자격 증명 노출 → SSRF → IMDSv1 → S3 유출. 7개의 CloudTrail 파일에서 <strong>48분짜리 계정 침해 타임라인</strong>을 재구성하고, 각 단계에 대한 Sigma 탐지 규칙을 작성했습니다.",
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
    narrative: [
      {
        type: "photos",
        items: [
          {
            src: "/about/DCprofile.jpg",
            captionEn: "DC Half Marathon",
            captionKo: "DC 하프마라톤",
          },
          {
            src: "/about/workingout.jpg",
            captionEn: "UMD promotional material",
            captionKo: "UMD 홍보물에 실린 사진",
          },
        ],
      },
      {
        type: "p",
        en: "<strong>180km over four weeks. DC Half Marathon completed.</strong> People are consistently surprised by the consistency. The first photo was taken at the campus gym without my knowledge — I ended up in UMD promotional material. More than 20 colleagues started running after seeing this, which is how I ended up founding a running club at work.",
        ko: "<strong>4주간 180km. DC 하프마라톤 완주.</strong> 사람들은 항상 그 일관성에 놀랍니다. 첫 번째 사진은 캠퍼스 헬스장에서 몰래 찍혔는데 — UMD 홍보물에 실리게 되었습니다. 이를 본 동료 20명 이상이 달리기를 시작했고, 이것이 직장 러닝 클럽을 만들게 된 계기입니다.",
      },
      {
        type: "p",
        en: "I have disassembled a broken espresso machine and repaired it. Completely stripped a Nintendo and rebuilt it with a custom housing. I treat disassembly and troubleshooting as an opportunity to understand something properly. <strong>When I solve a problem, I document or automate it so it does not happen the same way again.</strong>",
        ko: "고장난 에스프레소 머신을 분해하고 수리했습니다. 닌텐도를 완전히 분해하고 커스텀 케이스로 재조립했습니다. 분해와 트러블슈팅을 무언가를 제대로 이해하는 기회로 삼습니다. <strong>문제를 해결하면, 같은 방식으로 반복되지 않도록 문서화하거나 자동화합니다.</strong>",
      },
    ],
  },
  {
    id: "looking-for",
    number: "06",
    title: "WHAT I AM LOOKING FOR",
    catToken: "research",
    narrative: [
      {
        type: "p",
        en: "Running a 200-node environment with three people trained a specific kind of judgment. I want to apply it at a larger scale — <strong>tens of thousands of nodes</strong> — and see how the same principles behave differently.",
        ko: "세 명이서 200노드 환경을 운영하며 특정한 판단력을 길렀습니다. 이를 더 큰 규모에서 적용하고 싶습니다 — <strong>수만 개의 노드</strong> — 같은 원칙이 어떻게 다르게 작동하는지 보고 싶습니다.",
      },
      {
        type: "p",
        en: "I left consulting early for a reason. Diagnosing a problem and walking away was not enough. I am looking for an environment with <strong>real ownership over systems and real authority to make decisions</strong>. Teams where the first question after an incident is <em>why did this happen</em>, not who did this.",
        ko: "일찍 컨설팅을 떠난 이유가 있습니다. 문제를 진단하고 떠나는 것만으로는 충분하지 않았습니다. <strong>시스템에 대한 실질적인 소유권과 결정 권한</strong>이 있는 환경을 찾고 있습니다. 사고 발생 후 첫 번째 질문이 누가 했느냐가 아니라 <em>왜 발생했는가</em>인 팀을.",
      },
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
