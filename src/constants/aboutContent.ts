export type AboutCard = {
  title: string
  body: string
}

export type NarrativeBlock =
  | { type: "p"; en: string; ko?: string }
  | { type: "sub"; en: string; ko?: string }
  | { type: "quote"; en: string; ko?: string }
  | { type: "metrics"; items: { val: string; en: string; ko?: string }[] }
  | { type: "photos"; items: { src: string; captionEn: string; captionKo?: string }[] }
  | { type: "photo-wide"; src: string; altEn: string; altKo?: string }
  | { type: "ref"; href: string; label: string }
  | { type: "group"; photos: { src: string; altEn: string; altKo?: string }[]; en: string; ko?: string }

export type AboutSection = {
  id: string
  number: string
  title: string
  subtitle?: string
  subtitleKo?: string
  ghost?: string
  catToken: string
  narrative?: NarrativeBlock[]
  cards?: AboutCard[]
  cols?: string[]
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "built",
    number: "01",
    title: "BUILT",
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
        en: "Operating at that scale with three people meant automation was not optional. I built a modular Bash pipeline covering the full server onboarding process: hardware inventory, SSH configuration, tooling installation, and vulnerability scanning. <strong>Over 4,000 lines of scripts reduced onboarding time from four hours to thirty minutes.</strong> Because the process ran identically every time, pipeline output fed directly into audit evidence. The pipeline was designed from the start so that operational consistency and compliance documentation came from the same source.",
        ko: "그 규모를 세 명이서 운영한다는 것은 자동화가 선택이 아님을 의미했습니다. 서버 온보딩 전 과정을 커버하는 모듈형 Bash 파이프라인을 구축했습니다: 하드웨어 인벤토리, SSH 설정, 툴링 설치, 취약점 스캔. <strong>4,000줄 이상의 스크립트로 온보딩 시간을 4시간에서 30분으로 단축했습니다.</strong> 프로세스가 항상 동일하게 실행되었기 때문에 파이프라인 출력이 감사 증거로 직접 활용되었습니다.",
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
        en: "Storage was layered by access pattern. Block storage ran on a Dell ME4084 SAN over iSCSI direct-attach. File storage used NetApp NAS over NFS and SMB. Distributed storage ran on GlusterFS. Apache Ozone was evaluated as a replacement but ruled out: the genomic pipeline's access pattern was dominated by random reads on millions of small files, which does not suit object store architecture. Compute-to-storage interconnect ran at <strong>100G InfiniBand</strong> to keep the network from becoming a bottleneck.",
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
          { val: "85%", en: "faster provisioning", ko: "프로비저닝 단축" },
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
    subtitle: "— 4 Audit Cycles, 0 Failures",
    subtitleKo: "— 감사 4회, 결함 0건",
    ghost: "PROTECT",
    catToken: "systems",
    narrative: [
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
        type: "quote",
        en: "Instead, I designed a logging pipeline using Azure AD log queries to collect endpoint behavior across the organization, including USB activity. User behavior was unchanged, but all activity became auditable. This approach provided higher compliance coverage than port locks and passed the audit.",
        ko: "대신 Azure AD 로그 쿼리를 사용해 조직 전체의 엔드포인트 행동(USB 활동 포함)을 수집하는 로깅 파이프라인을 설계했습니다. 사용자 행동은 변하지 않았지만, 모든 활동이 감사 가능해졌습니다. 이 방식은 포트 잠금보다 높은 컴플라이언스 커버리지를 제공했고 감사를 통과했습니다.",
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
        type: "p",
        en: "<strong>Compliance held when it was treated as engineering, not paperwork.</strong>",
        ko: "<strong>컴플라이언스는 서류 작업이 아닌 엔지니어링으로 접근할 때 유지되었습니다.</strong>",
      },
    ],
  },
  {
    id: "broke",
    number: "03",
    title: "BROKE",
    subtitle: "— Attacker's Perspective",
    subtitleKo: "— 공격자의 시각",
    ghost: "BROKE",
    catToken: "reverse",
    narrative: [
      {
        type: "sub",
        en: "Web Application Penetration Testing — KISMI",
        ko: "웹 애플리케이션 침투 테스트 — KISMI",
      },
      {
        type: "p",
        en: "Before graduating, I worked at KISMI conducting web application security assessments for SK Telecom, KAKAO VX, and InBody. Black-box assessments covering SQL injection, XSS, and authentication bypass. One case started with an HTTP 500 error. The stack trace and path information in the response opened the next attack vector. <strong>If you know what you are looking for, an error is information.</strong>",
        ko: "졸업 전 KISMI에서 SK텔레콤, KAKAO VX, 인바디를 대상으로 웹 애플리케이션 보안 평가를 수행했습니다. SQL 인젝션, XSS, 인증 우회를 포함한 블랙박스 평가였습니다. 한 케이스는 HTTP 500 에러로 시작했습니다. 응답의 스택 트레이스와 경로 정보가 다음 공격 벡터를 열었습니다. <strong>무엇을 찾는지 알면, 에러는 정보입니다.</strong>",
      },
      {
        type: "sub",
        en: "Binary Exploitation",
        ko: "바이너리 익스플로잇",
      },
      {
        type: "p",
        en: "I worked through <strong>stack overflow, GOT/PLT hijacking, and heap exploitation</strong> in sequence, implementing each in C and tracing execution through GDB and pwndbg at the assembly level. After each successful exploit, I wrote an analysis report explaining the exact address and mechanism by which control flow transferred. Getting the exploit to work was not the endpoint.",
        ko: "<strong>스택 오버플로우, GOT/PLT 하이재킹, 힙 익스플로잇</strong>을 순서대로 진행하며 C로 구현하고 GDB와 pwndbg로 어셈블리 수준에서 실행을 추적했습니다. 익스플로잇 성공 후에는 제어 흐름이 전환된 정확한 주소와 메커니즘을 설명하는 분석 보고서를 작성했습니다.",
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
        en: "I worked through four connected exercises on an AWS-based e-commerce environment: IAM policy design from the defender's side, enumeration of the same configuration from the attacker's side, forensic reconstruction from CloudTrail logs, and a hands-on SSRF exploit chain.",
        ko: "AWS 기반 전자상거래 환경에서 네 가지 연결된 실습을 수행했습니다: 방어자 측 IAM 정책 설계, 공격자 측 동일 설정 열거, CloudTrail 로그 포렌식 재구성, 실습 SSRF 익스플로잇 체인.",
      },
      {
        type: "p",
        en: "For the individual work, I built a <strong>seven-step attack chain</strong> from Lambda environment variable exposure through SSRF, IMDSv1 credential theft, and S3 exfiltration. I reconstructed a <strong>48-minute 58-second account compromise timeline</strong> from seven CloudTrail files and wrote Sigma detection rules and Athena queries for each attack phase. The team report covered five domains across <strong>91 pages</strong> with a remediation roadmap mapped to PCI-DSS, GDPR, and NIST 800-53.",
        ko: "개인 과제에서 Lambda 환경 변수 노출부터 SSRF, IMDSv1 자격 증명 탈취, S3 유출에 이르는 <strong>7단계 공격 체인</strong>을 구성했습니다. 7개의 CloudTrail 파일에서 <strong>48분 58초의 계정 침해 타임라인</strong>을 재구성하고 각 공격 단계에 대한 Sigma 탐지 규칙과 Athena 쿼리를 작성했습니다.",
      },
      {
        type: "quote",
        en: "Across all four reports, the pattern was consistent. The entry point changed every time. The missing controls were the same.",
        ko: "네 개의 보고서 전반에서 패턴은 일관되었습니다. 진입점은 매번 바뀌었습니다. 누락된 통제는 동일했습니다.",
      },
      {
        type: "ref",
        href: "https://github.com/J1w0n-H",
        label: "github.com/J1w0n-H/aws-cloud-security",
      },
    ],
  },
  {
    id: "designs",
    number: "04",
    title: "DESIGNS WHAT COMES NEXT",
    ghost: "DESIGN",
    catToken: "crypto",
    narrative: [
      {
        type: "sub",
        en: "📡 IoT Security",
        ko: "📡 IoT 보안",
      },
      {
        type: "p",
        en: "I built an ESP32 and BME680 sensor system for real-time data collection over MQTT and presented it as a course project. After the presentation, I noticed periodic data gaps in the Grafana dashboard and kept experimenting after the assignment was complete. This was a course I had requested outside of my standard curriculum.",
        ko: "ESP32와 BME680 센서 시스템을 구축해 MQTT로 실시간 데이터를 수집하고 과제 프로젝트로 발표했습니다. 발표 후 Grafana 대시보드에서 주기적인 데이터 공백을 발견하고 과제 완료 후에도 실험을 계속했습니다.",
      },
      {
        type: "p",
        en: "I ran experiments with FreeRTOS task separation, mutex application, and dual-core pinning. Explicit core pinning did not consistently outperform automatic scheduler placement. I extended the work by adding <strong>TLS and mTLS</strong> to the same pipeline to test whether real-time performance and security could coexist.",
        ko: "FreeRTOS 태스크 분리, 뮤텍스 적용, 듀얼 코어 피닝 실험을 수행했습니다. 명시적 코어 피닝이 자동 스케줄러 배치를 일관되게 능가하지는 않았습니다. 실시간 성능과 보안이 공존할 수 있는지 테스트하기 위해 동일한 파이프라인에 <strong>TLS와 mTLS</strong>를 추가해 작업을 확장했습니다.",
      },
      {
        type: "ref",
        href: "https://github.com/J1w0n-H/iot-sensor-tls-experiment",
        label: "github.com/J1w0n-H/iot-sensor-tls-experiment",
      },
      {
        type: "sub",
        en: "🤖 LLM Security",
        ko: "🤖 LLM 보안",
      },
      {
        type: "p",
        en: "I analyzed over 15 papers across five layers — token, context, conversation, architecture, and workflow — and ran experiments in an attacker role. In AgentDAM experiments, I traced paths through which LLM web agents exposed session tokens and user data across domains. <strong>Between 40 and 60 percent of agents produced some form of privacy leakage.</strong> PentestGPT generated commands with unresolved placeholders like <code>&lt;target_ip&gt;</code> under zero-shot conditions; three to five few-shot examples brought command completion <strong>from 20 to 100 percent</strong>.",
        ko: "토큰, 컨텍스트, 대화, 아키텍처, 워크플로우 5개 레이어에서 15개 이상의 논문을 분석하고 공격자 역할로 실험을 수행했습니다. AgentDAM 실험에서 LLM 웹 에이전트가 도메인 간 세션 토큰과 사용자 데이터를 노출하는 경로를 추적했습니다. <strong>에이전트의 40~60%가 어떤 형태로든 개인정보 유출을 발생시켰습니다.</strong>",
      },
      {
        type: "p",
        en: "On the supply chain side, I built a two-phase pipeline combining structural patch signals with LLM-based semantic classification to detect defensive workarounds in fuzz-driven patch datasets. These are patches that stop a crash locally while leaving the upstream library bug unchanged and untracked in CVE feeds. Across <strong>517 use-of-uninitialized-value cases</strong> from the ARVO dataset, I identified <strong>23 P3 workarounds</strong> targeting 10 upstream libraries.",
        ko: "공급망 측면에서, 퍼즈 기반 패치 데이터셋의 방어적 우회를 탐지하기 위해 구조적 패치 신호와 LLM 기반 의미론적 분류를 결합한 2단계 파이프라인을 구축했습니다. ARVO 데이터셋의 <strong>517개 미초기화 값 사용 케이스</strong>에서 10개의 업스트림 라이브러리를 대상으로 하는 <strong>23개의 P3 우회</strong>를 식별했습니다.",
      },
      {
        type: "ref",
        href: "https://j1w0n.vercel.app",
        label: "j1w0n.vercel.app — LLM Security Series (5 parts)",
      },
      {
        type: "ref",
        href: "https://github.com/J1w0n-H/ATTRIB",
        label: "github.com/J1w0n-H/ATTRIB",
      },
      {
        type: "sub",
        en: "⚙️ GitOps Security",
        ko: "⚙️ GitOps 보안",
      },
      {
        type: "p",
        en: "I am investigating a failure mode in GitOps-based infrastructure where ArgoCD's <code>selfHeal</code> feature <strong>classifies emergency security patches applied outside Git as drift and reverts them automatically</strong>. The cluster reports Synced and Healthy while the security patch is gone. I am validating scenarios with an hourly GitHub Actions pipeline.",
        ko: "GitOps 기반 인프라에서 ArgoCD의 <code>selfHeal</code> 기능이 <strong>Git 외부에서 적용된 긴급 보안 패치를 드리프트로 분류하고 자동으로 되돌리는</strong> 장애 모드를 연구하고 있습니다. 클러스터는 패치가 사라진 상태에서 Synced와 Healthy를 보고합니다.",
      },
      {
        type: "p",
        en: "<strong>Three different problems, one shared question. What fails silently while the system reports healthy.</strong>",
        ko: "<strong>세 가지 다른 문제, 하나의 공통 질문. 시스템이 정상 상태를 보고하는 동안 조용히 실패하는 것은 무엇인가.</strong>",
      },
    ],
  },
  {
    id: "outside",
    number: "05",
    title: "OUTSIDE OF WORK",
    ghost: "LIFE",
    catToken: "lime",
    narrative: [
      {
        type: "group",
        photos: [
          { src: "/about/workingout.jpg", altEn: "UMD promotional material", altKo: "UMD 홍보물" },
          { src: "/about/25k.png", altEn: "25k run", altKo: "25k 달리기" },
        ],
        en: "<strong>Self-driven.</strong> 180 km over four weeks, half marathon completed. People are consistently surprised by the consistency. I have not missed a day of exercise in quite a while. The first photo was taken at the campus gym without my knowledge. Apparently I ended up in UMD promotional material. Look at the expression.",
        ko: "<strong>자기 주도적.</strong> 4주간 180km, 하프마라톤 완주. 사람들은 항상 그 일관성에 놀랍니다. 꽤 오랫동안 운동을 빠진 날이 없었습니다. 첫 번째 사진은 캠퍼스 헬스장에서 몰래 찍혔습니다. UMD 홍보물에 실렸다고 합니다. 표정을 보세요.",
      },
      {
        type: "group",
        photos: [
          { src: "/about/theragen.webp", altEn: "뛰라젠 running club", altKo: "뛰라젠 러닝 클럽" },
          { src: "/about/interview1.png", altEn: "Company interview card news", altKo: "사내 인터뷰 카드뉴스" },
          { src: "/about/interview2.webp", altEn: "Company interview card news", altKo: "사내 인터뷰 카드뉴스" },
        ],
        en: "<strong>Spark.</strong> More than 20 colleagues started running after seeing this, which is how I ended up founding a running club. I do not tend to initiate conversations. I prefer working alone with deep focus. People still find their way to me — sometimes with a question, sometimes just to talk.",
        ko: "<strong>촉발.</strong> 이를 본 동료 20명 이상이 달리기를 시작했고, 이것이 러닝 클럽을 만들게 된 계기입니다. 먼저 대화를 시작하는 편이 아닙니다. 깊은 집중으로 혼자 작업하는 것을 선호합니다. 그래도 사람들은 찾아옵니다 — 때로는 질문으로, 때로는 그냥 이야기하러.",
      },
      {
        type: "group",
        photos: [
          { src: "/about/desk.jpeg", altEn: "Desktop build", altKo: "데스크탑 조립" },
          { src: "/about/coffeemachine.jpg", altEn: "Espresso machine repair", altKo: "에스프레소 머신 수리" },
        ],
        en: "<strong>Steady.</strong> The reason people come is not just familiarity. I have disassembled a broken espresso machine and repaired it. I completely stripped a Nintendo and rebuilt it with a custom housing. Desktop builds are routine. I treat disassembly and troubleshooting as a way to understand something properly. <strong>When I solve a problem, I document or automate it so it does not happen the same way again.</strong>",
        ko: "<strong>한결같음.</strong> 사람들이 찾아오는 이유는 단순한 친숙함만이 아닙니다. 고장난 에스프레소 머신을 분해하고 수리했습니다. 닌텐도를 완전히 분해하고 커스텀 케이스로 재조립했습니다. 분해와 트러블슈팅을 무언가를 제대로 이해하는 방법으로 삼습니다. <strong>문제를 해결하면, 같은 방식으로 반복되지 않도록 문서화하거나 자동화합니다.</strong>",
      },
    ],
  },
  {
    id: "looking-for",
    number: "06",
    title: "WHAT I AM LOOKING FOR",
    ghost: "SEEK",
    catToken: "research",
    narrative: [
      {
        type: "p",
        en: "Running a 200-node environment with three people trained a specific kind of judgment. I want to apply it at a different order of magnitude and see how the same principles behave when scale changes the failure modes themselves.",
        ko: "세 명이서 200노드 환경을 운영하며 특정한 판단력을 길렀습니다. 이를 다른 크기의 규모에서 적용하고 — 규모가 장애 모드 자체를 변화시킬 때 동일한 원칙이 어떻게 작동하는지 보고 싶습니다.",
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
