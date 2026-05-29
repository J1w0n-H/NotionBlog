export type AboutCard = {
  title: string
  titleKo?: string
  body: string
  bodyKo?: string
  refs?: { href: string; label: string }[]
}

export type NarrativeBlock =
  | { type: "p"; en: string; ko?: string }
  | { type: "sub"; en: string; ko?: string }
  | { type: "quote"; en: string; ko?: string }
  | { type: "metrics"; items: { val: string; en: string; ko?: string }[] }
  | { type: "photos"; items: { src: string; captionEn: string; captionKo?: string }[] }
  | { type: "photo-wide"; src: string; altEn: string; altKo?: string }
  | { type: "ref"; href: string; label: string }
  | { type: "group"; photos: { src: string; altEn: string; altKo?: string }[]; en: string; ko?: string; shape?: "portrait" | "rect" }

export type AboutSection = {
  id: string
  number: string
  title: string
  titleKo?: string
  subtitle?: string
  subtitleKo?: string
  ghost?: string
  catToken: string
  narrative?: NarrativeBlock[]
  cards?: AboutCard[]
  footer?: NarrativeBlock[]
  cols?: string[]
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "built",
    number: "01",
    title: "BUILT",
    titleKo: "구축",
    subtitle: "— 200 Nodes, 3-Person Team",
    subtitleKo: "— 200노드, 3인 팀",
    ghost: "BUILT",
    catToken: "ctf",
    narrative: [
      {
        type: "p",
        en: "TheragenBio is a bioinformatics company handling genomic data. The entire IT operation outside of the development team was run by three people.",
        ko: "테라젠바이오는 유전체 데이터를 다루는 바이오인포매틱스 기업입니다. 개발팀 외 IT 운영 전체를 세 명이 담당했습니다.",
      },
      {
        type: "sub",
        en: "Server Operations and Automation",
        ko: "서버 운영 및 자동화",
      },
      {
        type: "p",
        en: "Operating at that scale with three people meant automation was not optional. I built a modular Bash pipeline covering the full server onboarding process: hardware inventory, SSH configuration, tooling installation, and vulnerability scanning. <strong>Over 4,000 lines of scripts reduced onboarding time from four hours to thirty minutes.</strong> Because the process ran identically every time, pipeline output fed directly into audit evidence. Operational consistency and compliance documentation came from the same source — not reconciled after the fact.",
        ko: "그 규모를 세 명이서 운영한다는 것은 자동화가 선택이 아님을 의미했습니다. 서버 온보딩 전 과정을 커버하는 모듈형 Bash 파이프라인을 구축했습니다: 하드웨어 인벤토리, SSH 설정, 툴링 설치, 취약점 스캔. <strong>4,000줄 이상의 스크립트로 온보딩 시간을 4시간에서 30분으로 단축했습니다.</strong> 프로세스가 항상 동일하게 실행되었기 때문에 파이프라인 출력이 감사 증거로 직접 활용되었습니다. 운영 일관성과 컴플라이언스 문서화는 동일한 소스에서 나왔습니다 — 사후에 맞추는 방식이 아닌.",
      },
      {
        type: "sub",
        en: "HPC Infrastructure and Dependency Management",
        ko: "HPC 인프라 및 의존성 관리",
      },
      {
        type: "p",
        en: "Genomic analysis workloads ran on SGE and SLURM schedulers across the cluster, and a single dependency mismatch could stop the entire pipeline. The version chain across NVIDIA GPU drivers, CUDA libraries, Python, and analysis modules was not fully resolvable through containerization alone. Distinguishing environment variable conflicts from library path issues from version drift became a consistent practice. <strong>When failures occurred, the default response was root cause analysis, not restart.</strong>",
        ko: "유전체 분석 워크로드는 클러스터 전체에서 SGE와 SLURM 스케줄러로 실행되었으며, 단 하나의 의존성 불일치가 전체 파이프라인을 멈출 수 있었습니다. <strong>장애가 발생했을 때 기본 대응은 재시작이 아니라 근본 원인 분석이었습니다.</strong>",
      },
      {
        type: "p",
        en: "Storage was layered by access pattern. Block storage ran on a Dell ME4084 SAN over iSCSI direct-attach. File storage used NetApp NAS over NFS and SMB. Distributed storage ran on GlusterFS. Apache Ozone was evaluated as a replacement but ruled out: genomic pipelines generate millions of small files with random read patterns, which is where object store architecture loses to distributed file storage in practice. Compute-to-storage interconnect ran at <strong>100G InfiniBand</strong> to keep the network from becoming a bottleneck. The access pattern determined the architecture, not the other way around.",
      },
      {
        type: "sub",
        en: "Datacenter Migration and DR",
        ko: "데이터센터 마이그레이션 및 DR",
      },
      {
        type: "p",
        en: "Following a corporate spinoff, I migrated <strong>over 100 servers in 72 hours</strong>. Before the migration, I documented the full network topology, service map, and operational runbooks. Those documents became the foundation for independent operation at the new site.",
        ko: "회사 분리 이후 <strong>72시간 안에 100대 이상의 서버를 마이그레이션했습니다</strong>. 마이그레이션 전 전체 네트워크 토폴로지, 서비스 맵, 운영 런북을 문서화했고, 이 문서들이 신규 사이트 독립 운영의 기반이 되었습니다.",
      },
      {
        type: "p",
        en: "The DR plan was validated under real conditions during the migration. An SGE master node lost power overnight. I traveled to the datacenter in the morning, reprovisioned a standby server from the runbook, and reconfigured all slave nodes to recognize the new master. <strong>No data was lost.</strong> The runbook was updated based on that experience.",
        ko: "DR 계획은 마이그레이션 중 실제 상황에서 검증되었습니다. SGE 마스터 노드가 야간에 전원이 꺼졌고, 직접 데이터센터에 가서 런북으로 스탠바이 서버를 재프로비저닝하고 모든 슬레이브 노드를 새 마스터로 재설정했습니다. <strong>데이터 손실은 없었습니다.</strong>",
      },
      {
        type: "metrics",
        items: [
          { val: "200+", en: "nodes managed", ko: "노드 관리" },
          { val: "4h→30m", en: "provisioning time", ko: "프로비저닝 시간" },
          { val: "100G", en: "InfiniBand fabric", ko: "InfiniBand 패브릭" },
          { val: "72hr", en: "migration, 0 data loss", ko: "마이그레이션, 손실 없음" },
        ],
      },
    ],
  },
  {
    id: "protected",
    number: "02",
    title: "PROTECTED",
    titleKo: "보호",
    subtitle: "— 4 Audit Cycles, 0 Failures",
    subtitleKo: "— 감사 4회, 결함 0건",
    ghost: "PROTECT",
    catToken: "systems",
    narrative: [
      {
        type: "p",
        en: "Two decisions in this section look unrelated on the surface. One is about a port lock. The other is about an HTML clone of the login page. Both came down to the same question: what happens to a security control when it meets an actual user?",
        ko: "이 섹션의 두 결정은 겉으로 무관해 보입니다. 하나는 포트 잠금에 관한 것이고, 다른 하나는 로그인 페이지의 HTML 레플리카에 관한 것입니다. 둘 다 같은 질문으로 귀결되었습니다: 실제 사용자를 만났을 때 보안 통제는 어떻게 되는가?",
      },
      {
        type: "sub",
        en: "Compliance as an Engineering Problem",
        ko: "엔지니어링 문제로서의 컴플라이언스",
      },
      {
        type: "p",
        en: "I led <strong>ISO 27001, ISO 27701, and GCLP</strong> audits across <strong>four consecutive cycles</strong>. ISO 27701 extends 27001 into personal data processing, which was required given that the organization handled patient-linked genomic data. I prepared evidence packages directly, served as the interface between the engineering team and external auditors, and reported findings to executive leadership.",
        ko: "<strong>ISO 27001, ISO 27701, GCLP</strong> 감사를 <strong>4회 연속</strong> 이끌었습니다. ISO 27701은 개인정보 처리로 27001을 확장한 것으로, 조직이 환자 연계 유전체 데이터를 다루었기 때문에 필요했습니다. 증거 패키지를 직접 준비하고, 엔지니어링 팀과 외부 감사관 사이의 인터페이스 역할을 하며 결과를 경영진에 보고했습니다.",
      },
      {
        type: "sub",
        en: "Declining the Port Lock Recommendation",
        ko: "포트 잠금 권고 거절",
      },
      {
        type: "p",
        en: "During one audit cycle, an external auditor recommended physical USB port locks. Observation of actual user behavior made this untenable: employees were already routing around existing controls, and a stronger physical constraint would produce quieter workarounds rather than compliance. USB activity was not being tracked at all.",
        ko: "한 감사 사이클에서 외부 감사관이 물리적 USB 포트 잠금을 권고했습니다. 실제 사용자 행동을 관찰한 결과 이는 실현 불가능했습니다: 직원들은 이미 기존 통제를 우회하고 있었고, 더 강한 물리적 제약은 컴플라이언스가 아닌 더 조용한 우회를 만들 뿐이었습니다.",
      },
      {
        type: "p",
        en: "Instead, I designed a logging pipeline using Azure AD log queries to collect endpoint behavior across the organization, including USB activity. User behavior was unchanged, but all activity became auditable. This approach provided higher compliance coverage than port locks and passed the audit.",
        ko: "대신 Azure AD 로그 쿼리를 사용해 조직 전체의 엔드포인트 행동(USB 활동 포함)을 수집하는 로깅 파이프라인을 설계했습니다. 사용자 행동은 변하지 않았지만, 모든 활동이 감사 가능해졌습니다. 이 방식은 포트 잠금보다 높은 컴플라이언스 커버리지를 제공했고 감사를 통과했습니다.",
      },
      {
        type: "sub",
        en: "Testing the People Layer",
        ko: "사람 레이어 테스트",
      },
      {
        type: "p",
        en: "Controls that look complete on paper fail when they meet actual user behavior. In 2022 I ran a phishing simulation across the organization: built an HTML replica of the company login page, targeted 79 employees, and <strong>67 entered their credentials</strong>. That number is not a failure — it is a baseline. Security awareness training without a measured starting point is guesswork.",
        ko: "서류상으로 완전해 보이는 통제도 실제 사용자 행동을 만나면 실패합니다. 2022년 조직 전체를 대상으로 피싱 시뮬레이션을 진행했습니다: 회사 로그인 페이지의 HTML 레플리카를 만들어 직원 79명을 대상으로 했고, <strong>67명이 자격 증명을 입력했습니다</strong>. 이 수치는 실패가 아닙니다 — 기준선입니다. 측정된 시작점 없는 보안 인식 교육은 추측에 불과합니다.",
      },
      {
        type: "p",
        en: "I used the results to design a targeted curriculum and built an email reporting mechanism so employees had a low-friction way to flag suspicious messages. The follow-up rate was the metric that mattered, not the initial click rate.",
        ko: "결과를 바탕으로 맞춤형 교육 커리큘럼을 설계하고, 직원들이 의심스러운 메일을 간편하게 신고할 수 있는 이메일 보고 메커니즘을 구축했습니다. 중요한 지표는 초기 클릭률이 아닌 후속 보고율이었습니다.",
      },
      {
        type: "sub",
        en: "M365 Migration",
        ko: "M365 마이그레이션",
      },
      {
        type: "p",
        en: "Moving the company from KakaoTalk and Gmail to M365 was as much a cultural change as a technical one. I ran a pilot group first, collected feedback, adjusted policies, and rolled out company-wide only after most employees already had hands-on experience with the platform. By the time of full rollout, most policy questions had already surfaced and been resolved during the pilot.",
        ko: "카카오톡과 Gmail에서 M365로의 전환은 기술적 변화만큼이나 문화적 변화였습니다. 먼저 파일럿 그룹을 운영하고, 피드백을 수집하고, 정책을 조정한 뒤 대부분의 직원이 이미 플랫폼 경험을 가진 후에야 전사 롤아웃을 진행했습니다.",
      },
      {
        type: "quote",
        en: "Compliance held when it was treated as engineering, not paperwork.",
        ko: "컴플라이언스는 서류 작업이 아닌 엔지니어링으로 접근할 때 유지되었습니다.",
      },
    ],
  },
  {
    id: "broke",
    number: "03",
    title: "BROKE",
    titleKo: "해킹",
    subtitle: "— Attacker's Perspective",
    subtitleKo: "— 공격자의 시각",
    ghost: "BROKE",
    catToken: "reverse",
    narrative: [
      {
        type: "p",
        en: "The goal across these assessments was not to collect vulnerabilities. It was to find what they had in common. The entry point changed every time — an authentication endpoint, a stack buffer, a misconfigured IAM role. The missing controls underneath were the same.",
        ko: "이 평가들의 목표는 취약점을 모으는 것이 아니었습니다. 공통점을 찾는 것이었습니다. 진입점은 매번 달랐습니다 — 인증 엔드포인트, 스택 버퍼, 잘못 설정된 IAM 역할. 그 아래에 빠진 통제는 동일했습니다.",
      },
      {
        type: "sub",
        en: "Web Application Penetration Testing — KISMI",
        ko: "웹 애플리케이션 침투 테스트 — KISMI",
      },
      {
        type: "p",
        en: "At KISMI I conducted black-box assessments for SK Telecom, KAKAO VX, and InBody. The work covered SQL injection, authentication bypass, parameter manipulation, and XSS across HTTP/HTTPS services. On the InBody engagement, an authentication endpoint returned a verbose HTTP 500 with enough stack trace detail to identify the underlying framework version and a predictable admin path. The vulnerability was chained: <strong>error disclosure → path enumeration → authentication bypass</strong>. Findings were documented with reproduction steps and remediation recommendations delivered directly to the client security team.",
        ko: "KISMI에서 SK텔레콤, KAKAO VX, 인바디를 대상으로 블랙박스 평가를 수행했습니다. SQL 인젝션, 인증 우회, 파라미터 조작, XSS를 HTTP/HTTPS 서비스 전반에 걸쳐 점검했습니다. 인바디 과제에서 인증 엔드포인트가 반환한 상세한 HTTP 500에는 기반 프레임워크 버전과 예측 가능한 관리자 경로를 파악하기에 충분한 스택 트레이스가 포함되어 있었습니다. 취약점은 연쇄적이었습니다: <strong>에러 공개 → 경로 열거 → 인증 우회</strong>. 재현 단계와 개선 권고안을 포함한 결과를 클라이언트 보안 팀에 직접 전달했습니다.",
      },
      {
        type: "p",
        en: "On the SK Telecom ISMS engagement, I was one of three on the team — and the only one retained through post-audit remediation. A full-time offer followed, with graduate school sponsorship. I turned it down.",
        ko: "SK텔레콤 ISMS 과제에서는 팀원 세 명 중 유일하게 감사 후 개선 과정까지 남겨달라는 요청을 받았습니다. 이후 대학원 지원이 포함된 정규직 제안을 받았습니다. 거절했습니다.",
      },
      {
        type: "sub",
        en: "Binary Exploitation",
        ko: "바이너리 익스플로잇",
      },
      {
        type: "p",
        en: "In a graduate binary exploitation course at UMD, I worked through twelve labs — <strong>stack overflow, format string vulnerabilities, GOT/PLT hijacking, and heap exploitation</strong>. Each category targeted a specific protection mechanism: stack canaries and how they interact with return addresses, format strings as arbitrary read/write primitives, dynamic linker function pointer overwriting, and allocator behavior under fragmentation. Each successful exploit was documented in a LaTeX report tracing the exact instruction at which control flow transferred. The 4/4 CTF flags at the end applied the same techniques against a target with no prior knowledge of the vulnerability surface. Working at that level changes how you reason about mitigations. A heap exploit is not an abstract vulnerability category — it is a specific allocator state sequence. Knowing the mechanism makes the difference between a mitigation that holds and one an attacker reasons around.",
        ko: "UMD 대학원 바이너리 익스플로잇 수업에서 12개의 랩을 진행했습니다 — <strong>스택 오버플로우, 포맷 스트링 취약점, GOT/PLT 하이재킹, 힙 익스플로잇</strong>. 각 카테고리는 특정 보호 메커니즘을 대상으로 했습니다: 스택 카나리와 리턴 주소 상호작용, 임의 읽기/쓰기 프리미티브로서의 포맷 스트링, 동적 링커 함수 포인터 덮어쓰기, 단편화 상황에서의 할당자 동작. 각 익스플로잇 성공 후 제어 흐름이 전환된 정확한 명령어를 추적하는 LaTeX 리포트를 작성했습니다. 마지막 CTF 4/4 플래그는 취약점 표면에 대한 사전 지식 없이 동일한 기법을 적용한 결과입니다. 이 수준에서 작업하면 방어 수단에 대한 사고가 바뀝니다. 힙 익스플로잇은 추상적인 취약점 분류가 아닙니다 — 특정 할당자 상태 시퀀스입니다. 메커니즘을 알면 유효한 완화와 공격자가 우회할 수 있는 완화를 구분할 수 있습니다.",
      },
      {
        type: "ref",
        href: "https://github.com/J1w0n-H/Hacking",
        label: "github.com/J1w0n-H/Hacking",
      },
      {
        type: "sub",
        en: "AWS Cloud Security Assessment",
        ko: "AWS 클라우드 보안 평가",
      },
      {
        type: "p",
        en: "The AWS cloud security project ran across four phases on a shared e-commerce environment: IAM policy design from the defender's side, attacker enumeration of the same configuration, forensic reconstruction from CloudTrail logs, and a hands-on SSRF exploit chain.",
        ko: "AWS 클라우드 보안 프로젝트는 공유 전자상거래 환경에서 네 단계로 진행되었습니다: 방어자 측 IAM 정책 설계, 동일 설정에 대한 공격자 열거, CloudTrail 로그 포렌식 재구성, 실습 SSRF 익스플로잇 체인.",
      },
      {
        type: "p",
        en: "For the individual work, I built a <strong>seven-step attack chain</strong> from Lambda environment variable exposure through SSRF, IMDSv1 credential theft, and S3 exfiltration. I reconstructed a <strong>48-minute 58-second account compromise timeline</strong> from seven CloudTrail files and wrote Sigma detection rules and Athena queries for each attack phase. The team report covered five domains across <strong>91 pages</strong> with a remediation roadmap mapped to PCI-DSS, GDPR, and NIST 800-53.",
        ko: "개인 과제에서 Lambda 환경 변수 노출부터 SSRF, IMDSv1 자격 증명 탈취, S3 유출에 이르는 <strong>7단계 공격 체인</strong>을 구성했습니다. 7개의 CloudTrail 파일에서 <strong>48분 58초의 계정 침해 타임라인</strong>을 재구성하고 각 공격 단계에 대한 Sigma 탐지 규칙과 Athena 쿼리를 작성했습니다. 팀 리포트는 5개 도메인, <strong>91페이지</strong>에 걸쳐 PCI-DSS, GDPR, NIST 800-53에 매핑된 개선 로드맵을 포함했습니다.",
      },
      {
        type: "quote",
        en: "Across all four reports, the pattern was consistent. The entry point changed every time. The missing controls were the same.",
        ko: "네 개의 보고서 전반에서 패턴은 일관되었습니다. 진입점은 매번 바뀌었습니다. 누락된 통제는 동일했습니다.",
      },
      {
        type: "ref",
        href: "https://github.com/J1w0n-H",
        label: "github.com/J1w0n-H",
      },
    ],
  },
  {
    id: "designs",
    number: "04",
    title: "DESIGNING",
    titleKo: "설계 중",
    subtitle: "— 3 Open Questions",
    subtitleKo: "— 3가지 열린 질문",
    ghost: "DESIGN",
    catToken: "crypto",
    cards: [
      {
        title: "📡 IoT Security",
        titleKo: "📡 IoT 보안",
        body: "Built an ESP32/BME680 sensor pipeline over MQTT for a course project. After the presentation, noticed periodic data gaps in Grafana and kept experimenting — FreeRTOS task separation, mutex application, dual-core pinning. Explicit core pinning did not consistently outperform automatic scheduler placement. Extended the work by adding <strong>TLS and mTLS</strong> to test whether real-time performance and security could coexist.",
        bodyKo: "ESP32와 BME680 센서 파이프라인을 MQTT로 구축하고 과제 프로젝트로 발표했습니다. 발표 후 Grafana에서 주기적인 데이터 공백을 발견하고 과제 완료 후에도 계속 실험했습니다 — FreeRTOS 태스크 분리, 뮤텍스, 듀얼 코어 피닝. 명시적 코어 피닝이 자동 스케줄러를 일관되게 능가하지는 않았습니다. 동일한 파이프라인에 <strong>TLS와 mTLS</strong>를 추가해 실시간 성능과 보안의 공존 가능성을 테스트했습니다.",
        refs: [
          { href: "https://github.com/J1w0n-H/iot-sensor-tls-experiment", label: "github.com/J1w0n-H/iot-sensor-tls-experiment" },
        ],
      },
      {
        title: "🤖 LLM Security",
        titleKo: "🤖 LLM 보안",
        body: "<p>Reproduced experiments from published research in an attacker role. In AgentDAM, traced paths through which web agents exposed session tokens across domains — <strong>40–60% of agents produced cross-domain leakage</strong> even with guardrails active. In PentestGPT, zero-shot prompting generated commands with unresolved placeholders; three to five few-shot examples brought completion <strong>from 20 to 100%</strong>. Testing the CaMeL policy engine surfaced a structural gap: a legitimate workflow and an attacker's workflow can require identical permissions, making tool-level enforcement insufficient.</p><p>The supply chain work was original. Built a two-phase pipeline — structural patch signal filtering followed by LLM semantic classification — to detect defensive workarounds in OSS-Fuzz crash datasets: patches that silence the crash downstream while the upstream library bug remains untracked in CVE feeds. Across <strong>517 uninitialized-value cases</strong> from ARVO, identified <strong>23 P3 workarounds</strong> across 10 upstream libraries. Submitted to WOOT 2026.</p>",
        bodyKo: "<p>공격자 역할로 발표된 연구의 실험을 재현했습니다. AgentDAM에서 웹 에이전트가 도메인 간 세션 토큰을 노출하는 경로를 추적했습니다 — 가드레일이 활성화된 상태에서도 <strong>에이전트의 40~60%가 크로스도메인 유출</strong>을 발생시켰습니다. PentestGPT에서 제로샷 프롬프팅은 미해결 플레이스홀더가 있는 명령어를 생성했고, few-shot 예시 3~5개로 완성률이 <strong>20%에서 100%로</strong> 향상됐습니다. CaMeL 정책 엔진 테스트에서 구조적 공백을 발견했습니다: 합법적인 워크플로우와 공격자의 워크플로우가 동일한 권한을 요구할 수 있어, 도구 수준의 강제 적용이 불충분합니다.</p><p>공급망 작업은 독창적이었습니다. OSS-Fuzz 충돌 데이터셋에서 방어적 우회를 탐지하기 위해 구조적 패치 신호 필터링과 LLM 의미론적 분류를 결합한 2단계 파이프라인을 구축했습니다. ARVO의 <strong>517개 미초기화 값 케이스</strong>에서 10개 업스트림 라이브러리의 <strong>23개 P3 우회</strong>를 식별했습니다. WOOT 2026 제출.</p>",
        refs: [
          { href: "https://j1w0n.vercel.app", label: "j1w0n.vercel.app — LLM Security Series (5 parts)" },
          { href: "https://github.com/J1w0n-H/ATTRIB", label: "github.com/J1w0n-H/ATTRIB" },
        ],
      },
      {
        title: "⚙️ GitOps Security",
        titleKo: "⚙️ GitOps 보안",
        body: "<p>Investigating a structural failure mode at SEED Lab: ArgoCD's <code>selfHeal</code> feature <strong>classifies emergency security patches applied outside Git as drift and reverts them automatically</strong>. The cluster reports Synced and Healthy while the patch is absent.</p><p>Validated across multiple scenarios with an hourly GitHub Actions pipeline. Key finding: standard Kubernetes health indicators do not capture security patch drift. An organization relying on GitOps dashboard status for audit evidence may be passing compliance checks on infrastructure that is missing security patches — with no log entry indicating the revert happened. It is the same failure mode §02 surfaces at the human layer: the audit report and the actual state have quietly diverged.</p>",
        bodyKo: "<p>SEED Lab에서 구조적 장애 모드를 연구 중입니다: ArgoCD의 <code>selfHeal</code> 기능이 <strong>Git 외부에서 적용된 긴급 보안 패치를 드리프트로 분류하고 자동으로 되돌립니다</strong>. 클러스터는 패치가 사라진 상태에서 Synced와 Healthy를 보고합니다.</p><p>매시간 GitHub Actions 파이프라인으로 여러 시나리오를 검증했습니다. 핵심 발견: 표준 Kubernetes 상태 지표는 보안 패치 드리프트를 포착하지 못합니다. GitOps 대시보드 상태를 감사 증거로 사용하는 조직은 보안 패치가 없는 인프라에서 컴플라이언스 검사를 통과하고 있을 수 있습니다 — 되돌림이 발생했다는 로그 항목도 없이. §02에서 사람 레이어에서 발생하는 것과 동일한 장애 모드입니다: 감사 보고서와 실제 상태가 조용히 분기합니다.</p>",
      },
    ],
    footer: [
      {
        type: "quote",
        en: "Three different problems, one shared question. What fails silently while the system reports healthy.",
        ko: "세 가지 다른 문제, 하나의 공통 질문. 시스템이 정상 상태를 보고하는 동안 조용히 실패하는 것은 무엇인가.",
      },
    ],
  },
  {
    id: "outside",
    number: "05",
    title: "HOW I WORK",
    titleKo: "나의 작업 방식",
    ghost: "WORK",
    catToken: "lime",
    narrative: [
      {
        type: "group",
        shape: "rect",
        photos: [
          { src: "/about/desk.jpeg", altEn: "Desktop build", altKo: "데스크탑 조립" },
          { src: "/about/coffeemachine.jpg", altEn: "Espresso machine repair", altKo: "에스프레소 머신 수리" },
          { src: "/about/nintendo.png", altEn: "Nintendo with custom housing", altKo: "닌텐도 커스텀 하우징" },
        ],
        en: "<p>I disassembled a broken espresso machine and fixed it. Stripped a Nintendo completely and rebuilt it with a custom housing. Desktop builds come up regularly and I say yes. The reason is not that I find these tasks easy — it is that taking something apart is the fastest way to understand how it actually works.</p><p><strong>When I solve a problem, I write it down.</strong> Not because anyone asked, but because the next time it breaks, the answer should already exist. That habit did not start at work. The 4,000-line provisioning framework and the documentation library both came from the same place.</p>",
        ko: "<p>고장난 에스프레소 머신을 분해하고 수리했습니다. 닌텐도를 완전히 분해하고 커스텀 하우징으로 재조립했습니다. 데스크탑 조립 요청이 오면 항상 응합니다. 이 작업들이 쉬워서가 아닙니다 — 분해하는 것이 실제로 어떻게 작동하는지 이해하는 가장 빠른 방법이기 때문입니다.</p><p><strong>이런 방식으로 문제를 해결하면, 써둡니다.</strong> 누가 부탁해서가 아니라, 다음에 같은 문제가 생겼을 때 답이 이미 있어야 하기 때문입니다. 그 습관은 직장에서 시작된 게 아닙니다. 4,000줄짜리 프로비저닝 프레임워크와 문서 라이브러리는 같은 곳에서 나왔습니다.</p>",
      },
      {
        type: "group",
        shape: "rect",
        photos: [
          { src: "/about/workingout.jpg", altEn: "UMD promotional material", altKo: "UMD 홍보물" },
          { src: "/about/theragen.webp", altEn: "뛰라젠 running club", altKo: "뛰라젠 러닝 클럽" },
        ],
        en: "<p>I have not missed a day of exercise in quite a while — 180 km over four weeks at one point, half marathon finished. The first photo was taken at the campus gym without my knowledge. I ended up in UMD promotional material.</p><p>At TheragenBio, more than twenty colleagues started running after seeing this. I had not organized anything or suggested it. They asked if they could join. That became a running club. <strong>I do not tend to initiate these things. I prefer working alone with deep focus. People find their way regardless.</strong></p>",
        ko: "<p>꽤 오랫동안 운동을 빠진 날이 없었습니다 — 한때는 4주간 180km, 하프마라톤을 완주했습니다. 첫 번째 사진은 캠퍼스 헬스장에서 몰래 찍혔습니다. UMD 홍보물에 실렸습니다.</p><p>테라젠바이오에서 이를 본 동료 20명 이상이 달리기를 시작했습니다. 내가 무언가를 조직하거나 제안한 게 아닙니다. 그들이 함께해도 되냐고 물었습니다. 그게 러닝 클럽이 됐습니다. <strong>이런 것들을 먼저 시작하는 편이 아닙니다. 깊은 집중으로 혼자 작업하는 것을 선호합니다. 그래도 사람들은 찾아옵니다.</strong></p>",
      },
      {
        type: "group",
        shape: "rect",
        photos: [
          { src: "/about/interview1.png", altEn: "Company spotlight card", altKo: "사내 스포트라이트 카드" },
          { src: "/about/interview2.webp", altEn: "Company spotlight article", altKo: "사내 스포트라이트 기사" },
        ],
        en: "<p>In January 2023, TheragenBio ran an employee spotlight on me. The title was <strong>\"For systems, come to Jiwon.\"</strong> I did not write that.</p><p>Those connections continued after I left. I still occasionally get asked to help — a desktop build, a network question, sometimes just to talk through a decision. The work builds a kind of trust that does not expire when the contract does.</p>",
        ko: "<p>2023년 1월, 테라젠바이오에서 직원 스포트라이트를 진행했습니다. 제목은 <strong>\"시스템 문제는 지원에게.\"</strong> 내가 쓴 게 아닙니다.</p><p>그 연결은 퇴직 후에도 이어졌습니다. 지금도 가끔 도움 요청이 옵니다 — 데스크탑 조립, 네트워크 문제, 때로는 그냥 결정에 대한 대화. 일은 계약이 끝나도 사라지지 않는 신뢰를 만듭니다.</p>",
      },
    ],
  },
  {
    id: "looking-for",
    number: "06",
    title: "WHAT I AM LOOKING FOR",
    titleKo: "찾고 있는 것",
    ghost: "SEEK",
    catToken: "research",
    narrative: [
      {
        type: "p",
        en: "Three years of running 200-node infrastructure with three people produces a specific calibration — what breaks first, what warning signs get ignored, where documentation actually matters. I want to test those same judgments at a larger scale — <strong>tens of thousands of nodes</strong> — and see which ones hold and which ones need to be relearned.",
        ko: "세 명이서 200노드 인프라를 3년간 운영하면 특정한 감각이 생깁니다 — 무엇이 먼저 깨지는지, 어떤 경고 신호가 무시되는지, 문서화가 실제로 중요한 곳이 어디인지. <strong>수만 노드</strong> 규모에서 같은 판단들을 테스트하고, 어떤 것이 유효하고 어떤 것을 다시 배워야 하는지 보고 싶습니다.",
      },
      {
        type: "p",
        en: "I turned down the consulting offer for a reason. Diagnosing a problem and walking away was not enough. The role I needed was one where I built things, operated them, and <strong>owned the results</strong>. That has not changed. I am looking for an environment where I have <strong>real ownership over systems and real authority to make decisions</strong>, not a position where I am one interchangeable part in a larger process.",
        ko: "컨설팅 제안을 거절한 이유가 있습니다. 문제를 진단하고 떠나는 것만으로는 충분하지 않았습니다. 내가 필요로 했던 역할은 무언가를 구축하고, 운영하고, <strong>결과를 책임지는</strong> 것이었습니다. 그것은 변하지 않았습니다. <strong>시스템에 대한 실질적인 소유권과 결정 권한</strong>이 있는 환경을 찾고 있습니다.",
      },
      {
        type: "p",
        en: "SRE, Security Engineering, Cloud Security: the title matters less than two things. The scale to work at directly, and the scope to take responsibility for. Teams where the first question after an incident is <strong>\"why did this happen\"</strong> rather than \"who did this.\" Teams where documentation is written to be read. That is where I grow fastest and stay longest.",
        ko: "SRE, 보안 엔지니어링, 클라우드 보안: 직함보다 중요한 두 가지가 있습니다. 직접 작업할 수 있는 규모, 그리고 책임질 수 있는 범위. 사고 발생 후 첫 번째 질문이 \"누가 했는가\"가 아니라 <strong>\"왜 발생했는가\"</strong>인 팀. 문서가 읽히기 위해 작성되는 팀. 그곳에서 가장 빠르게 성장하고 가장 오래 머뭅니다.",
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
  { value: "4h→30m", label: "provisioning time" },
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
