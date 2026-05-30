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
    id: "infrastructure",
    number: "01",
    title: "INFRASTRUCTURE",
    titleKo: "인프라",
    subtitle: "— 200 Nodes, 3-Person Team",
    subtitleKo: "— 3인 팀, 200노드",
    ghost: "INFRA",
    catToken: "ctf",
    narrative: [
      {
        type: "p",
        en: "At Theragen Bio, a genomics company, three of us ran the entire IT infrastructure outside the development team.",
        ko: "유전체 데이터 기업 테라젠바이오에서 개발팀을 제외한 전사 IT 인프라를 세 명이 맡았습니다.",
      },
      {
        type: "sub",
        en: "Onboarding automation",
        ko: "온보딩 자동화",
      },
      {
        type: "p",
        en: "With so few people, manual provisioning was a risk. I built a 4,000-line modular Bash pipeline covering hardware inventory, hardening, and scanning, which cut onboarding time from <strong>four hours to thirty minutes</strong>. Because it ran the same way every time, the output logs doubled as audit evidence.",
        ko: "소수 인원으로 수작업은 리스크였습니다. 하드웨어 인벤토리부터 하드닝, 스캔까지 서버 온보딩 전 과정을 4,000줄 규모 Bash 파이프라인으로 자동화해 온보딩 시간을 <strong>4시간에서 30분으로 단축했습니다</strong>. 매번 같은 방식으로 실행되다 보니 출력 로그가 그대로 감사 증거가 됐습니다.",
      },
      {
        type: "sub",
        en: "Root-cause habit",
        ko: "근본 원인 규명",
      },
      {
        type: "p",
        en: "Our HPC workloads ran on SGE and SLURM schedulers with brittle dependency chains across NVIDIA drivers, CUDA, and Python that containers alone couldn't resolve. When something broke, the default became finding the root cause first rather than restarting.",
        ko: "SGE/SLURM 스케줄러 기반 HPC 환경에서 까다로운 의존성 체인을 관리했습니다. NVIDIA 드라이버, CUDA, Python으로 이어지는 버전 체인은 컨테이너만으로 해결되지 않았고, 장애가 나면 재시작부터 하기보다 원인을 먼저 규명하는 게 습관이 됐습니다.",
      },
      {
        type: "sub",
        en: "Workload-driven storage",
        ko: "워크로드 맞춤 스토리지",
      },
      {
        type: "p",
        en: "I separated storage by access pattern: Dell SAN over iSCSI for block, NetApp NAS over NFS/SMB for file, GlusterFS for distributed. I evaluated Apache Ozone but ruled it out — genomic analysis reads millions of small files at random and object stores fall behind distributed file storage there. Compute and storage were linked over <strong>100G InfiniBand</strong> to avoid a network bottleneck.",
        ko: "접근 패턴에 따라 블록은 Dell SAN(iSCSI), 파일은 NetApp NAS(NFS/SMB), 분산은 GlusterFS로 나눴습니다. Apache Ozone도 검토했지만, 유전체 분석은 작은 파일 수백만 개를 무작위로 읽는 패턴이라 오브젝트 스토어가 불리해 제외했습니다. 병목을 막으려 컴퓨트와 스토리지는 <strong>100G InfiniBand</strong>로 연결했습니다.",
      },
      {
        type: "sub",
        en: "Migration and DR",
        ko: "데이터센터 이전과 DR",
      },
      {
        type: "p",
        en: "During a corporate spin-off, I migrated <strong>over 100 servers in 72 hours</strong>. When an SGE master node lost power overnight mid-migration, I followed the runbook to bring up a standby and reconfigured the slave nodes to recognize the new master, recovering with no data loss. I updated the runbook based on what happened.",
        ko: "기업 분할 과정에서 <strong>72시간 만에 서버 100대 이상을 이전했습니다</strong>. 이전 중 야간에 SGE 마스터 노드 전원이 나갔지만, 준비해둔 런북대로 예비 서버를 띄우고 슬레이브 노드가 새 마스터를 인식하도록 재설정해 데이터 손실 없이 복구했습니다. 이 경험을 반영해 런북을 보완했습니다.",
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
      {
        type: "sub",
        en: "Bottom Line",
        ko: "하단 라인",
      },
      {
        type: "quote",
        en: "I understand the dependencies and data access patterns of large HPC infrastructure, and I recover calmly during outages by working from runbooks.",
        ko: "대규모 HPC 인프라의 의존성과 데이터 접근 패턴을 이해하고 있고, 장애 상황에서도 런북에 기반해 침착하게 복구합니다.",
      },
    ],
  },
  {
    id: "compliance",
    number: "02",
    title: "COMPLIANCE",
    titleKo: "컴플라이언스",
    subtitle: "— 4 Audits, 0 Non-conformities",
    subtitleKo: "— 감사 4회, 결함 0건",
    ghost: "COMPLY",
    catToken: "systems",
    narrative: [
      {
        type: "sub",
        en: "Zero-defect audits",
        ko: "결함 0건 감사",
      },
      {
        type: "p",
        en: "I led four consecutive global audits — <strong>ISO 27001, ISO 27701, and GCLP</strong> — through with zero non-conformities, serving as the technical bridge between engineers and external auditors.",
        ko: "<strong>ISO 27001, ISO 27701, GCLP</strong> 등 4회 연속 글로벌 보안 감사를 결함 0건으로 통과했습니다. 엔지니어링 팀과 외부 감사관 사이에서 기술적 가교 역할을 했습니다.",
      },
      {
        type: "sub",
        en: "Logging over lockdown",
        ko: "차단보다 로깅",
      },
      {
        type: "p",
        en: "Auditors recommended physically locking USB ports, but in practice that only pushes people toward shadow IT — and at the time USB activity wasn't logged at all. Instead of blocking ports, I built a logging pipeline using Azure AD queries to collect USB activity across the org. It kept day-to-day work flexible while making everything traceable, and it passed the audit.",
        ko: "감사관이 USB 포트 물리 차단을 권고했지만, 실제 사용 행태를 보면 우회 경로(섀도 IT)를 키울 뿐이었습니다. 당시 USB 사용 로그조차 없던 상태라, 포트를 막는 대신 Azure AD 로그 쿼리로 전사 USB 활동을 수집하는 로깅 파이프라인을 설계했습니다. 업무 유연성은 두면서 추적 가능성은 넓혔고, 이 방식으로 감사를 통과했습니다.",
      },
      {
        type: "sub",
        en: "The human variable",
        ko: "사람이라는 변수",
      },
      {
        type: "p",
        en: "In 2022 I ran a phishing simulation, sending an HTML clone of our login page to 79 employees; <strong>67 entered their credentials</strong>. I treated that as a baseline rather than a failure, using it to design targeted training and add a one-click report button — shifting the metric from lowering initial clicks to raising report rates.",
        ko: "2022년 전사 피싱 모의 훈련을 기획해, 사내 로그인 페이지를 본뜬 HTML 페이지를 직원 79명에게 보냈고 <strong>67명이 자격 증명을 입력했습니다</strong>. 이 수치를 실패가 아니라 기준선(Baseline)으로 삼아 맞춤 교육을 설계하고 원클릭 신고 기능을 도입했습니다. 보안 지표를 '최초 클릭률 낮추기'에서 '신고 비율 높이기'로 옮겼습니다.",
      },
      {
        type: "sub",
        en: "M365 migration",
        ko: "M365 전환",
      },
      {
        type: "p",
        en: "I led the move from scattered tools (KakaoTalk, Gmail) to M365. Running a pilot group first to gather feedback and refine policy meant the company-wide rollout had far less friction.",
        ko: "카카오톡·Gmail로 흩어진 협업 도구를 M365로 옮기는 작업을 주도했습니다. 파일럿 그룹을 먼저 운영하며 피드백을 받고 정책을 다듬은 뒤 전사로 확대해, 전면 적용 단계의 혼선을 줄였습니다.",
      },
      {
        type: "sub",
        en: "Bottom Line",
        ko: "하단 라인",
      },
      {
        type: "quote",
        en: "Compliance is engineering, not paperwork. Rather than controls that obstruct users, I design defenses that keep the business running while staying traceable.",
        ko: "컴플라이언스는 서류가 아니라 엔지니어링입니다. 사용자를 억누르는 통제 대신, 업무 연속성을 지키면서 추적 가능성을 확보하는 방어 체계를 설계합니다.",
      },
    ],
  },
  {
    id: "offensive",
    number: "03",
    title: "OFFENSIVE SECURITY",
    titleKo: "공격 보안",
    subtitle: "— Attacker's Perspective",
    subtitleKo: "— 공격자의 시각",
    ghost: "BREAK",
    catToken: "reverse",
    narrative: [
      {
        type: "sub",
        en: "Web pentesting",
        ko: "웹 모의해킹",
      },
      {
        type: "p",
        en: "I ran black-box assessments for SK Telecom, Kakao VX, and InBody. At InBody, an authentication endpoint returned a full stack trace on an HTTP 500 — once that revealed the framework version, the admin path became predictable, chaining <strong>error disclosure into path enumeration into an auth bypass</strong>. Each control worked on its own, but the gap was in the handoff between components, and across engagements the problems kept showing up at exactly those boundaries.",
        ko: "SK텔레콤, 카카오 VX, 인바디를 대상으로 블랙박스 진단을 했습니다. 인바디 진단에서는 인증 엔드포인트가 HTTP 500과 함께 스택 트레이스를 노출했고, 거기서 프레임워크 버전이 드러나자 관리자 경로가 예측됐습니다. <strong>에러 노출이 경로 추정으로, 다시 인증 우회로 이어지는 체인</strong>이었습니다. 통제 하나하나는 정상이었지만 컴포넌트 사이 연결부에 빈틈이 있었고, 진단을 거듭하며 문제는 늘 그 경계에서 나온다는 걸 확인했습니다.",
      },
      {
        type: "sub",
        en: "Binary exploitation",
        ko: "바이너리 익스플로잇",
      },
      {
        type: "p",
        en: "In a UMD course I implemented 12 systems-hacking labs — <strong>stack/heap overflows, GOT/PLT hijacking</strong> — stepping through assembly in GDB to see where mitigations like ASLR, canaries, and NX break. I cared less about landing the exploit than about understanding those mechanisms, since that's the knowledge a defender uses to choose the most cost-effective mitigation. At the capstone CTF I captured all 4 flags against zero-knowledge targets.",
        ko: "UMD 과정에서 <strong>스택/힙 오버플로우, GOT/PLT 하이재킹</strong> 등 12개 시스템 해킹을 직접 구현했습니다. GDB로 어셈블리를 따라가며 ASLR, 카나리, NX 같은 보호 기법이 어디서 무력화되는지 분석했는데, 공격 성공 자체보다 이 메커니즘을 이해하는 게 방어자가 비용 대비 효과적인 방어를 짤 때 필요한 지식이라는 걸 알게 됐습니다. 학기 말 CTF에서는 사전 정보 없는 타깃을 대상으로 플래그 4개를 모두 획득했습니다.",
      },
      {
        type: "ref",
        href: "https://github.com/J1w0n-H/Hacking",
        label: "github.com/J1w0n-H/Hacking",
      },
      {
        type: "sub",
        en: "AWS incident analysis",
        ko: "AWS 침해 사고 분석",
      },
      {
        type: "p",
        en: "I built a <strong>7-stage attack chain</strong> from a leaked Lambda variable through SSRF, IMDSv1 credential theft, and S3 exfiltration, then reconstructed the <strong>48-minute timeline</strong> from CloudTrail logs and wrote Sigma rules for each stage. The credential-theft step was fully recorded in CloudTrail yet raised no alert under the default config — a record no one watches is the most dangerous state.",
        ko: "Lambda 환경 변수 유출에서 SSRF, IMDSv1 자격 증명 탈취, S3 유출로 이어지는 <strong>7단계 공격 체인</strong>을 설계했습니다. 이후 CloudTrail 로그를 분석해 <strong>48분간의 공격 타임라인</strong>을 복원하고 단계별 Sigma 탐지 규칙을 작성했습니다. 특히 자격 증명 탈취 단계는 CloudTrail에 전부 기록됐는데도 기본 설정에서는 경보가 울리지 않았는데, 기록은 있지만 아무도 보지 않는 상태가 가장 위험하다는 걸 보여준 사례였습니다.",
      },
      {
        type: "sub",
        en: "Bottom Line",
        ko: "하단 라인",
      },
      {
        type: "quote",
        en: "Even when individual components look fine, I can see how a chain forms at their connections or in monitoring gaps. That's how I judge where defenses actually belong.",
        ko: "개별 컴포넌트가 정상이어도 그 연결부나 모니터링 공백에서 공격 체인이 어떻게 완성되는지 공격자 시각으로 봅니다. 방어선을 어디에 둬야 하는지 판단하는 근거입니다.",
      },
      {
        type: "ref",
        href: "https://github.com/J1w0n-H",
        label: "github.com/J1w0n-H",
      },
    ],
  },
  {
    id: "research",
    number: "04",
    title: "ADVANCED RESEARCH",
    titleKo: "연구",
    subtitle: "— 3 Domains, 1 Question",
    subtitleKo: "— 3개 도메인, 1가지 질문",
    ghost: "STUDY",
    catToken: "crypto",
    cards: [
      {
        title: "📡 IoT Security",
        titleKo: "📡 IoT 보안",
        body: "Built an ESP32/BME680 sensor pipeline over MQTT. After finding periodic data loss in Grafana, I worked through task separation, mutex synchronization, and dual-core pinning under FreeRTOS — explicit core pinning didn't always beat the automatic scheduler. I then added mTLS to measure the trade-off between encryption and real-time throughput.",
        bodyKo: "ESP32와 BME680 센서로 MQTT 데이터 파이프라인을 만들었습니다. Grafana에서 주기적인 데이터 유실을 발견한 뒤 FreeRTOS 환경에서 태스크 분리, 뮤텍스 동기화, 듀얼 코어 피닝을 적용하며 원인을 좁혔는데, 코어를 명시적으로 고정하는 방식이 자동 스케줄러보다 항상 낫지는 않았습니다. 이후 mTLS를 더해 암호화와 실시간 처리 성능 사이의 트레이드오프를 검증했습니다.",
        refs: [
          { href: "https://github.com/J1w0n-H/iot-sensor-tls-experiment", label: "github.com/J1w0n-H/iot-sensor-tls-experiment" },
        ],
      },
      {
        title: "🤖 LLM & Supply-Chain Security",
        titleKo: "🤖 LLM 및 공급망 보안",
        body: "<p>I analyzed 20+ LLM security papers through four lenses: peer reviewer, hacker, archaeologist, and citation analyst. That work led me to downstream projects that patch around an upstream library bug on their own side instead of fixing it — because those patches don't show up in CVE tracking, other projects using the same library stay exposed. I built a static analysis pipeline to detect them, reviewed <strong>517 cases</strong>, and identified <strong>23 workaround patches across 10 upstream libraries</strong>. Submitted to WOOT 2026 and received peer review.</p>",
        bodyKo: "<p>주요 LLM 보안 논문 20여 편을 피어 리뷰어, 해커, 고고학자, 인용 분석가 네 시각으로 각각 분석했습니다. 이 과정에서 다운스트림 프로젝트가 업스트림 라이브러리의 버그를 근본적으로 고치지 않고 자기 쪽에서만 우회하는 패치에 주목했는데, 이런 패치는 CVE 추적에 잡히지 않아 같은 라이브러리를 쓰는 다른 프로젝트는 계속 노출됩니다. 이를 탐지하는 정적 분석 파이프라인을 만들어 <strong>517개 사례</strong>를 검토했고, <strong>10개 라이브러리에서 23개의 우회 패치</strong>를 식별했습니다. WOOT 2026에 제출해 피어 리뷰를 받았습니다.</p>",
        refs: [
          { href: "https://j1w0n.vercel.app", label: "j1w0n.vercel.app — LLM Security Series" },
          { href: "https://github.com/J1w0n-H/ATTRIB", label: "github.com/J1w0n-H/ATTRIB" },
        ],
      },
      {
        title: "⚙️ GitOps Security",
        titleKo: "⚙️ GitOps 보안",
        body: "<p>At UMD's SEED Lab I'm studying structural failures in declarative infrastructure. When an emergency patch is applied outside the cluster, ArgoCD's <code>selfHeal</code> reads it as drift and rolls it back automatically — yet the dashboard still shows Synced &amp; Healthy after the patch is gone. Using a GitHub Actions pipeline to validate several scenarios, I confirmed that <strong>standard Kubernetes health metrics don't catch this missing-patch state</strong>.</p>",
        bodyKo: "<p>UMD SEED Lab에서 선언적 인프라 환경의 구조적 결함을 연구하고 있습니다. 클러스터 외부에서 긴급 보안 패치를 적용하면 ArgoCD의 <code>selfHeal</code>이 이를 드리프트로 판단해 자동으로 롤백하는데, 패치가 사라진 뒤에도 대시보드는 Synced &amp; Healthy로 표시됩니다. GitHub Actions 파이프라인으로 여러 시나리오를 검증해, <strong>표준 쿠버네티스 상태 지표로는 이 보안 패치 누락을 잡지 못한다</strong>는 걸 확인했습니다.</p>",
      },
    ],
    footer: [
      {
        type: "quote",
        en: "I research the structural failures that don't surface while a dashboard reads green. I reviewed 517 cases to demonstrate these workaround patches, and I plan to extend the work as resources allow.",
        ko: "대시보드가 정상을 가리킬 때 그 이면에서 드러나지 않는 구조적 결함을 찾는 연구를 합니다. 517개 사례를 검토해 우회 패치를 실증했고, 자원이 확보되면 이 연구를 더 확장할 계획입니다.",
      },
    ],
  },
  {
    id: "person",
    number: "05",
    title: "THE PERSON BEHIND IT",
    titleKo: "나에 대해",
    ghost: "PERSON",
    catToken: "lime",
    narrative: [
      {
        type: "p",
        en: "The research instinct for finding hidden structural failures comes from the same place as my personal habits: I need to take things apart and see them through.",
        ko: "보이지 않는 구조적 실패를 찾는 연구는, 무엇이든 직접 뜯어보고 끝을 봐야 직성이 풀리는 개인적 기질과 맞닿아 있습니다.",
      },
      {
        type: "group",
        shape: "rect",
        photos: [
          { src: "/about/desk.jpeg", altEn: "Desktop build", altKo: "데스크탑 조립" },
          { src: "/about/coffeemachine.jpg", altEn: "Espresso machine repair", altKo: "에스프레소 머신 수리" },
          { src: "/about/nintendo.png", altEn: "Nintendo with custom housing", altKo: "닌텐도 커스텀 하우징" },
        ],
        en: "<p>I genuinely enjoy taking apart a broken espresso machine to fix it, or stripping a game console to rebuild it with custom housing. When someone needs a PC build or hardware troubleshooting, I always say yes. Taking something apart is the fastest way to understand how it works — and that same intrinsic curiosity is what drove a math major to build up infrastructure and security expertise from scratch.</p>",
        ko: "<p>고장 난 에스프레소 머신을 분해해 고치거나 게임기를 뜯어 커스텀 하우징으로 다시 조립하는 일에 흥미를 느낍니다. PC 조립이나 하드웨어 트러블슈팅 요청이 오면 언제든 응합니다. 내부를 직접 뜯어보는 게 작동 원리를 이해하는 가장 확실한 방법이기 때문입니다. 수학 전공자가 인프라와 보안까지 스스로 부딪혀가며 전문성을 쌓아온 동력이 여기 있습니다.</p>",
      },
      {
        type: "group",
        shape: "rect",
        photos: [
          { src: "/about/workingout.jpg", altEn: "UMD promotional material", altKo: "UMD 홍보물" },
          { src: "/about/theragen.webp", altEn: "뛰라젠 running club", altKo: "뛰라젠 러닝 클럽" },
        ],
        en: "<p>To keep a sustainable pace as an engineer, I run regularly — averaging about 180 km a month, and I've finished a half marathon. (A photo from that training was featured in UMD's official institutional media.) At my last job, colleagues saw me running consistently and around 20 of them joined on their own out of sheer curiosity, which naturally evolved into an internal running club. I didn't organize it; the daily routine just became its own quiet motivation.</p>",
        ko: "<p>엔지니어로서 장기적인 페이스를 유지하려 러닝을 꾸준히 합니다. 한 달에 180km를 뛰고 하프 마라톤을 완주하는 과정을 온전히 즐깁니다. (이 훈련 모습이 UMD 공식 홍보 미디어에 실리기도 했습니다.) 전 직장에서는 제가 꾸준히 뛰는 모습을 보고 동료 20여 명이 자발적으로 합류해 사내 러닝 클럽이 됐습니다. 먼저 나서서 모임을 조직한 것이 아니라, 매일 꾸준히 하는 모습이 주위에 자연스러운 호기심과 동기부여를 줬습니다.</p>",
      },
      {
        type: "group",
        shape: "rect",
        photos: [
          { src: "/about/interview1.png", altEn: "Company spotlight card", altKo: "사내 스포트라이트 카드" },
          { src: "/about/interview2.webp", altEn: "Company spotlight article", altKo: "사내 스포트라이트 기사" },
        ],
        en: "<p>Communicating easily across roles led to a 2023 internal interview titled <strong>\"For medicine, see the pharmacist; for systems, see Jiwon.\"</strong> That trust outlasted the job — former colleagues still reach out first when they're weighing an architecture decision, a network issue, or a career move.</p>",
        ko: "<p>직군을 막론하고 편하게 소통해온 결과, 2023년 사내 인터뷰에서 <strong>\"약은 약사에게, 시스템은 지원님에게\"</strong>라는 제목을 얻었습니다. 이때 쌓은 신뢰는 퇴사 후에도 이어져, 전 직장 동료들이 아키텍처 설계나 네트워크 문제, 커리어 결정을 앞두고 여전히 먼저 조언을 구합니다.</p>",
      },
      {
        type: "sub",
        en: "Bottom Line",
        ko: "하단 라인",
      },
      {
        type: "quote",
        en: "I tend to show rather than tell. I solve problems because I find the process inherently rewarding, set a steady example through consistency, and build lasting trust with the people I've worked with.",
        ko: "말보다 행동으로 보여주는 편입니다. 문제를 파고드는 과정 자체에서 재미를 찾고, 꾸준한 자기관리로 주위에 긍정적인 자극을 주며, 함께 일한 동료와는 오래가는 신뢰를 쌓습니다.",
      },
    ],
  },
  {
    id: "looking-for",
    number: "06",
    title: "WHAT I AM LOOKING FOR",
    titleKo: "찾고 있는 것",
    subtitle: "— Scale and Ownership",
    subtitleKo: "— 규모와 책임",
    ghost: "SEEK",
    catToken: "research",
    narrative: [
      {
        type: "p",
        en: "Running a 200-node infrastructure with a team of three for over three years builds a specific sense for which components fail first, which alerts cause fatigue, and where documentation matters during an outage. I want to test and sharpen that sense in an environment of tens of thousands of nodes.",
        ko: "세 명으로 200노드 인프라를 3년 넘게 운영하면 특정한 감각이 생깁니다. 어떤 컴포넌트가 먼저 무너지는지, 어떤 알람이 피로를 유발하는지, 장애 상황에서 문서가 필요한 지점이 어디인지 판별하게 됩니다. 이제 이 감각을 수만 노드 규모 환경에서 다시 검증하고 고도화하고 싶습니다.",
      },
      {
        type: "p",
        en: "I turned down the full-time consulting offer for a clear reason: I'd rather design and run systems and own the results than diagnose them and hand over a report. That hasn't changed. I prefer an environment where I can fully own infrastructure and make decisions — not be an interchangeable part inside a large governance structure.",
        ko: "컨설팅 정규직 제안을 사양한 이유는 분명합니다. 진단하고 보고서만 넘기기보다 직접 설계하고 운영하며 결과까지 책임지고 싶었기 때문이고, 이 생각은 지금도 같습니다. 큰 거버넌스 속 대체 가능한 부품이 아니라, 인프라를 온전히 소유하고 의사결정을 내릴 수 있는 환경을 선호합니다.",
      },
      {
        type: "p",
        en: "More than the title — SRE, security engineer, cloud architect — I'm looking for a team that offers two things:",
        ko: "SRE, 보안 엔지니어, 클라우드 아키텍트 등 직함보다는 다음 두 가지를 제공하는 팀을 찾고 있습니다:",
      },
      {
        type: "p",
        en: "<strong>Ownership</strong> — The scale and scope of infrastructure I can own and be accountable for.",
        ko: "<strong>오너십</strong> — 내가 온전히 소유하고 책임질 수 있는 인프라의 규모와 범위.",
      },
      {
        type: "p",
        en: "<strong>Blameless culture</strong> — A team that asks \"why did this happen\" rather than \"who did this\" after an incident.",
        ko: "<strong>무비난 문화</strong> — 장애 시 \"누가 했는가\" 대신 \"왜 발생했는가\"를 중심에 두는 팀.",
      },
    ],
  },
]

export type AboutMetric = {
  value: string
  label: string
}

export const ABOUT_METRICS: AboutMetric[] = [
  { value: "200+", label: "nodes managed" },
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
