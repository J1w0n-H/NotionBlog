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
  | { type: "ref"; href: string; label: string }
  | { type: "group"; photos: { src: string; altEn: string; altKo?: string }[]; en: string; ko?: string; shape?: "portrait" | "rect" }
  | { type: "li"; en: string; ko?: string }

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
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "path",
    number: "00",
    title: "Path",
    titleKo: "경로",
    subtitle: "math → infra → security",
    subtitleKo: "수학 → 인프라 → 공격자 시각",
    ghost: "PATH",
    catToken: "cyan",
    narrative: [
      {
        type: "p",
        en: "I build infrastructure, secure it, and pressure-test it for what it misses. I got here by filling the gaps no one assigned me, and each move answered a limit I'd hit in the role before it.",
        ko: "만들고, 부수고, 다음을 설계하는 사람 — 정해진 경로를 따른 게 아니라, 아무도 맡기지 않은 공백을 스스로 채우다 보니 여기까지 왔습니다.",
      },
      {
        type: "sub",
        en: "Operations over consulting",
        ko: "컨설팅보다 운영",
      },
      {
        type: "p",
        en: "On a major telecom's ISMS audit, I was the only intern asked to stay on for the post-audit remediation. That turned into a full-time offer with graduate tuition attached, and I turned it down: I wanted to build and run infrastructure and own the outcome, not diagnose it and hand over a report.",
        ko: "대형 통신사 ISMS 진단 프로젝트에서 인턴 신분으로 사후 개선 공정까지 맡았고, 학비 지원이 포함된 정규직 제안을 받았지만 사양했습니다. 문제를 진단하고 보고서만 넘기는 역할보다, 인프라를 직접 만들고 운영하며 결과까지 책임지고 싶었기 때문입니다.",
      },
      {
        type: "sub",
        en: "Operations into security",
        ko: "운영에서 연구로",
      },
      {
        type: "p",
        en: "I spent the next three years and eight months running a 200-node cluster and owning its security end to end. Running it taught me how systems break under real load; I came to UMD to learn how they look from the other side of an attack.",
        ko: "그 길로 3년 8개월간 200노드 규모 클러스터를 운영했습니다. 방어자의 시각만으로는 부족하고 공격자의 관점이 필요하다는 게 분명해져, 그 공백을 메우려 UMD에 진학했습니다.",
      },
      {
        type: "sub",
        en: "One question",
        ko: "하나의 질문",
      },
      {
        type: "p",
        en: "One question drives my work: how do you keep security, speed, and operability from becoming a trade-off, even as the infrastructure underneath keeps changing?",
        ko: "지금은 클라우드, LLM, GitOps 보안을 연구하며 한 가지에 집중하고 있습니다. \"인프라가 끊임없이 바뀌는 환경에서 방어는 어디에 있어야 효과를 유지하는가.\"",
      },
    ],
  },
  {
    id: "infrastructure",
    number: "01",
    title: "Built",
    titleKo: "구축",
    subtitle: "200 nodes · 3-person team",
    subtitleKo: "200노드 · 3인 팀",
    ghost: "BUILD",
    catToken: "ctf",
    narrative: [
      {
        type: "p",
        en: "At TheragenBio, a genomics company, three of us ran the entire IT infrastructure, outside the development team.",
        ko: "유전체 데이터 기업 '테라젠바이오'에서 개발팀을 제외한 전사 IT 인프라를 단 세 명이서 책임지고 운영했습니다.",
      },
      {
        type: "sub",
        en: "Onboarding automation",
        ko: "온보딩 자동화",
      },
      {
        type: "p",
        en: "Manual provisioning was a risk with so few people, so I built a 4,000-line modular Bash pipeline covering hardware inventory, hardening, and vulnerability scanning. It cut onboarding from <strong>four hours to thirty minutes</strong>, and because it ran identically every time, its logs doubled as reliable audit evidence.",
        ko: "소수 인원으로 대규모 인프라를 관리해야 했기에, 수작업 프로비저닝을 최소화하는 것이 급선무였습니다. 하드웨어 인벤토리 수집부터 서버 하드닝, 취약점 스캔까지 전 과정을 4,000줄 규모의 모듈형 Bash 파이프라인으로 자동화했습니다. 덕분에 기존 <strong>4시간이 걸리던 온보딩 시간을 30분으로 단축시켰고</strong>, 모든 서버가 동일한 환경으로 세팅되면서 출력 로그 자체가 신뢰할 수 있는 감사 증거가 되었습니다.",
      },
      {
        type: "sub",
        en: "Root-cause habit",
        ko: "근본 원인 규명",
      },
      {
        type: "p",
        en: "Our HPC workloads ran on SGE and SLURM with brittle dependency chains across NVIDIA drivers, CUDA, and Python. The failures that cost the most time were never loud: a single changed environment variable inverting the precedence between others, or someone installing a package locally instead of using the global one, so the pipeline resolved to the wrong path. Each looked fine on the surface and only gave way when I traced the change back to its origin.",
        ko: "SGE 및 SLURM 스케줄러 기반의 HPC 환경에서 NVIDIA 드라이버, CUDA, Python 등으로 이어지는 까다로운 의존성 체인을 관리했습니다. 단순히 컨테이너를 쓰는 것만으로 해결되지 않는 영역이었습니다. 장애가 발생했을 때 임시방편으로 서버를 '재시작'하기보다, 문제의 근본 원인을 디버깅하여 완전히 해결하는 것을 팀의 기본 문화로 정착시켰습니다.",
      },
      {
        type: "sub",
        en: "Workload-driven storage",
        ko: "워크로드 맞춤 스토리지",
      },
      {
        type: "p",
        en: "I designed the storage tier around how each workload actually touched data, not around a default stack. Block, file, and distributed access have different speed and consistency needs, so I split them: Dell SAN over iSCSI for block, NetApp NAS over NFS/SMB for file, GlusterFS for distributed. I evaluated Apache Ozone and ruled it out, since genomic analysis reads millions of small files at random and its metadata overhead compounds too quickly for that pattern. Compute and storage ran over <strong>100G InfiniBand</strong> so the fabric was never the bottleneck.",
        ko: "데이터 접근 패턴을 분석해 스토리지를 철저히 분리했습니다. 블록 스토리지는 Dell SAN(iSCSI), 파일은 NetApp NAS(NFS/SMB), 분산 스토리지는 GlusterFS로 이원화했습니다. Apache Ozone 도입도 검토했으나, 유전체 분석 특성상 수백만 개의 작은 파일들을 무작위로 읽는(Random read) 패턴이 많아 메타데이터 오버헤드가 과도하게 누적된다고 판단해 제외했습니다. 데이터 병목을 원천 차단하기 위해 컴퓨팅 노드와 스토리지는 <strong>100G InfiniBand 패브릭</strong>으로 직접 결합했습니다.",
      },
      {
        type: "sub",
        en: "Migration and DR",
        ko: "데이터센터 이전과 DR",
      },
      {
        type: "p",
        en: "During a corporate spin-off I migrated over <strong>100 servers in 72 hours</strong>. When an SGE master node lost power overnight mid-migration, I brought up the standby from the runbook, reconfigured the slave nodes, and recovered with zero data loss; the standby was fully operational in under an hour.",
        ko: "기업 분할 과정에서 <strong>72시간 만에 100대 이상의 서버를 마이그레이션했습니다</strong>. 야간 작업 중 SGE 마스터 노드의 전원이 차단되는 돌발 상황이 있었지만, 미리 작성해 둔 런북(Runbook)을 토대로 standby 서버를 즉시 구동하고 슬레이브 노드들을 재설정해 복구했습니다. 런북 설계가 실제 장애 상황에서 검증된 사례였습니다. 한 시간 이내에 복구를 완료했고 데이터 유실은 없었습니다.",
      },
      {
        type: "metrics",
        items: [
          { val: "200+", en: "nodes managed", ko: "노드 관리" },
          { val: "4h→30m", en: "provisioning time", ko: "프로비저닝 시간" },
          { val: "100+", en: "servers migrated, 0 data loss", ko: "서버 마이그레이션, 손실 없음" },
        ],
      },
    ],
  },
  {
    id: "compliance",
    number: "02",
    title: "Protected",
    titleKo: "보호",
    subtitle: "4 audit cycles · 0 failures",
    subtitleKo: "4회 감사 · 부적합 0건",
    ghost: "GUARD",
    catToken: "systems",
    narrative: [
      {
        type: "sub",
        en: "Zero major non-conformities",
        ko: "중대 부적합 0건 감사",
      },
      {
        type: "p",
        en: "I led four consecutive global audits (<strong>ISO 27001, ISO 27701, and GCLP</strong>) to zero major non-conformities, closing minor findings within the same cycle through targeted fixes. I was the technical bridge between engineering and the external auditors.",
        ko: "ISO 27001, ISO 27701, GCLP(우수 임상검사실 관리기준) 등 4회 연속 글로벌 보안 감사에서 중대 부적합 0건을 달성했습니다. 식별된 경부적합 사항은 동일 감사 주기 내에 시정 조치를 완료했으며, 엔지니어링 팀과 외부 감사관 사이에서 기술적 가교 역할을 했습니다.",
      },
      {
        type: "sub",
        en: "Logging over lockdown",
        ko: "차단보다 로깅",
      },
      {
        type: "p",
        en: "Auditors recommended physically locking USB ports, but in practice that only pushes people toward shadow IT, and at the time USB activity wasn't logged at all. Intune couldn't capture it natively, so instead of blocking ports I built a pipeline that centralized endpoint logs and queried them on usage-based billing to track USB activity across the org. It kept day-to-day work flexible while making everything traceable, and it passed the audit.",
        ko: "감사관이 USB 포트 물리 차단을 권고했지만, 실제 사용 행태를 보면 우회 경로(섀도 IT)를 키울 뿐이었습니다. 당시 USB 사용 로그조차 없던 상태라, 포트를 막는 대신 Azure AD 로그 쿼리로 전사 USB 활동을 수집하는 로깅 파이프라인을 설계했습니다. 업무 유연성은 두면서 추적 가능성은 넓혔고, 이 방식으로 감사를 통과했습니다.",
      },
      {
        type: "sub",
        en: "Endpoint & identity baseline",
        ko: "M365 전환",
      },
      {
        type: "p",
        en: "When the company moved from scattered tools to Microsoft 365, I owned the security baseline underneath it: Azure AD for identity and access, and Intune MDM/MAM for device and app management. Running a pilot group first to refine policy meant the org-wide rollout landed with far less friction.",
        ko: "카카오톡·Gmail로 흩어진 협업 도구를 M365로 옮기는 작업을 주도했습니다. 파일럿 그룹을 먼저 운영하며 피드백을 받고 정책을 다듬은 뒤 전사로 확대해, 전면 적용 단계의 혼선을 줄였습니다.",
      },
      {
        type: "sub",
        en: "The human variable",
        ko: "사람이라는 변수",
      },
      {
        type: "p",
        en: "For a phishing assessment, I hand-built the cloned login page myself and ran the campaign and result collection through Microsoft Defender for Endpoint. Of 79 employees, 67 entered their credentials. I treated that as a baseline, not a failure, and used it to redefine the metric from click rate to report rate: adding a one-click report button and targeted training so the org got faster at catching the next one.",
        ko: "2022년 전사 피싱 모의 훈련을 기획해, 사내 로그인 페이지를 본뜬 HTML 페이지를 직원 79명에게 보냈고 <strong>67명이 자격 증명을 입력했습니다</strong>. 이 수치를 실패가 아니라 기준선(Baseline)으로 삼아 맞춤 교육을 설계하고 원클릭 신고 기능을 도입했습니다. 보안 지표를 '최초 클릭률 낮추기'에서 '신고 비율 높이기'로 옮겼습니다.",
      },
      {
        type: "quote",
        en: "I'd rather make a system traceable than lock it down. The controls people can work with are the ones that hold.",
        ko: "규제를 만족하기 위해 억지로 우회하게 만드는 통제가 아니라, 실무자들이 기꺼이 따를 수 있는 실효성 있는 방어 체계를 만듭니다.",
      },
    ],
  },
  {
    id: "offensive",
    number: "03",
    title: "Broke",
    titleKo: "침투",
    subtitle: "penetration testing & detection",
    subtitleKo: "공격자 시각",
    ghost: "BREAK",
    catToken: "reverse",
    narrative: [
      {
        type: "sub",
        en: "Penetration testing",
        ko: "웹 모의해킹",
      },
      {
        type: "p",
        en: "For enterprises across telecom, gaming, and hardware manufacturing, I ran black-box assessments with no inside knowledge. In one, an authentication endpoint leaked internal details through an unhandled error, exposing the framework version and the admin paths its default routing had left open. I showed how those could be combined toward an authentication bypass, reported it, and the finding was remediated. In a separate full-chain exercise against a zero-knowledge target, I took a single foothold to full compromise, moving from nmap recon through parameter tampering, credential cracking, a command-injection web shell, password spraying, and lateral SSH movement to a SQL-injection database dump and an offline hash crack. Four flags, every layer from the network to the database.",
        ko: "대형 통신사, 게임사, 하드웨어 제조사 등 다양한 대기업 인프라를 대상으로 블랙박스 취약점 진단을 수행했습니다. 한 제조사 진단에서 인증 엔드포인트에 예외 처리가 누락돼 HTTP 500 에러와 함께 상세 스택 트레이스가 노출됐습니다. 이를 통해 백엔드 웹 프레임워크의 정확한 버전을 식별했고, 해당 버전의 기본(Default) 라우팅 규칙이 그대로 활성화되어 있음을 파악해 관리자 제어 경로를 예측했습니다. <strong>에러 노출 → 경로 추정 → 인증 우회</strong>로 이어지는 체인이었습니다. 개별 보안 컴포넌트들은 정상이었지만, 취약점은 시스템 간 연결부와 경계면에서 발생한다는 것을 실증했습니다.",
      },
      {
        type: "ref",
        href: "https://j1w0n.vercel.app/JW-217",
        label: "j1w0n.vercel.app/JW-217",
      },
      {
        type: "sub",
        en: "Binary exploitation",
        ko: "바이너리 익스플로잇",
      },
      {
        type: "p",
        en: "I worked through twelve low-level labs in C, compiling with gcc and stepping through the running program in GDB and pwndbg. I overflowed a stack buffer to overwrite a return address and redirect execution into a shell, hijacked a function pointer through a format-string bug, overwrote GOT entries to launch a shell, and corrupted heap chunks to bend malloc/free into giving up control. I cared less about landing each exploit than about seeing exactly where a protection gives way, because that is the knowledge a defender uses to pick the most cost-effective mitigation.",
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
        en: "I reconstructed a full cloud breach end to end: how one leaked credential in a Lambda function lets an attacker pivot, step by step, all the way to stealing a company's data. The chain ran seven stages, from the leaked variable through an SSRF request that reaches the cloud's internal metadata service (IMDSv1) to steal access keys, and on to copying data out of S3. I rebuilt the 48-minute timeline from AWS's own audit logs (CloudTrail) and wrote a Sigma detection rule for each stage. The credential-theft step was fully recorded yet raised no alert under the default config: the kind of gap that hides in plain sight, logged but unwatched.",
        ko: "Lambda 환경 변수 유출에서 SSRF, IMDSv1 자격 증명 탈취, S3 유출로 이어지는 <strong>7단계 공격 체인</strong>을 설계했습니다. 이후 CloudTrail 로그를 분석해 <strong>48분간의 공격 타임라인</strong>을 복원하고 단계별 Sigma 탐지 규칙을 작성했습니다. 특히 자격 증명 탈취 단계는 CloudTrail에 전부 기록됐는데도 기본 설정에서는 경보가 울리지 않았는데, 기록은 있지만 아무도 보지 않는 상태가 가장 위험하다는 걸 보여준 사례였습니다.",
      },
      {
        type: "ref",
        href: "https://j1w0n.vercel.app/JW-283",
        label: "j1w0n.vercel.app/JW-283",
      },
      {
        type: "quote",
        en: "I read systems from the attacker's side because that's where you see where the defense actually has to sit.",
        ko: "개별 컴포넌트가 정상이어도 그 연결부나 모니터링 공백에서 공격 체인이 어떻게 완성되는지 공격자 시각으로 식별하며, 이를 바탕으로 방어선이 배치되어야 할 지점을 정확히 판단합니다.",
      },
    ],
  },
  {
    id: "research",
    number: "04",
    title: "Designs What Comes Next",
    titleKo: "다음을 설계하다",
    subtitle: "cloud · LLM · GitOps",
    subtitleKo: "클라우드 · LLM · GitOps",
    ghost: "NEXT",
    catToken: "crypto",
    cards: [
      {
        title: "⚙️ GitOps Security",
        titleKo: "⚙️ GitOps 보안",
        body: "<p>As an RA at UMD's SEED Lab, I started from a broader question: how misconfigurations hide once container and cloud layers stack up. ArgoCD became one concrete case. When an emergency patch is applied outside the cluster, ArgoCD's <code>selfHeal</code> reads it as drift and rolls it back, yet the dashboard still shows Synced &amp; Healthy after the patch is gone. Using a GitHub Actions pipeline across several scenarios, I confirmed that <strong>standard Kubernetes health metrics don't catch this missing-patch state</strong>.</p>",
        bodyKo: "<p>UMD SEED Lab에서 쿠버네티스와 ArgoCD 같은 선언적 IaC 도구의 보안 사각지대를 연구하고 있습니다. 클러스터 외부 인프라 레이어에서 긴급 보안 패치를 직접 적용하면, ArgoCD의 <code>selfHeal</code> 로직이 이를 드리프트로 판단해 자동으로 패치 전 상태로 복구합니다. 패치가 사라진 뒤에도 ArgoCD 대시보드는 여전히 Synced &amp; Healthy로 표시됩니다. GitHub Actions 파이프라인으로 여러 시나리오를 검증해, <strong>표준 쿠버네티스 상태 지표로는 이 보안 패치 누락을 잡지 못한다</strong>는 걸 확인했습니다.</p>",
      },
      {
        title: "🤖 LLM & Supply-Chain Security",
        titleKo: "🤖 LLM 공급망 보안 연구",
        body: "<p>Downstream projects often stop a crash without fixing the upstream bug, so the real risk never gets indexed by CVE trackers. I built <a href=\"https://j1w0n.vercel.app/JW-282\" target=\"_blank\" rel=\"noopener noreferrer\">a pipeline to catch that</a>: the first stage uses an LLM to read each patch's intent and tell a genuine fix from a defensive workaround that just masks the upstream defect, and the second stage groups cases by shared dependency to confirm the pattern across projects. Across 517 OSS-Fuzz cases it surfaced 23 candidates where the standard patch-location heuristic disagreed with the actual intent, including bugs left exploitable for every other downstream user. Reviewers noted the obvious limit, that confirming each candidate still needs human judgment, but called the problem framing itself original and worth pursuing.</p>",
        bodyKo: "<p>다운스트림의 임시 우회 패치가 업스트림 라이브러리 결함을 은폐하여 CVE 추적을 방해하는 공급망 보안의 맹점을 연구했습니다. 대학원 코어 과정(CMSC818) 중 기존 ARVO 등의 데이터셋이 크래시 위치만 제공할 뿐 공급망 귀속 라벨이 없다는 점에 착안해 혼자 시작한 연구입니다. 패치 위치(Patch Location) 신호와 LLM 시맨틱 분석을 결합해 크래시 경로와 방어 코드 간의 불일치를 감지하는 2단계 파이프라인을 설계했으며, <strong>517개 케이스 중 23개의 바이패스 후보군</strong>을 1차로 필터링했습니다.</p><p>학술 저널(WOOT '26) 제출 후, 리뷰어들로부터 <em>\"반드시 정량화해야 하는 참신하고 흥미로운 문제 공간\"</em>이라는 호평과 함께, 전수조사 없는 로컬 접근법이 실무 도입 관점에서 매력적이라는 독창성을 인정받았습니다. 다만 수동 검증 부재 시 LLM이 API 오용과 실제 라이브러리 결함을 오인할 리스크가 있다는 날카로운 지적도 함께 수용했습니다.</p><p>이를 바탕으로 LLM 의존도를 낮추고 빌드 아티팩트와 스택 트레이스 위치 가중치 중심의 <strong>경량화된 구조적 휴리스틱 신호 파이프라인</strong>으로 설계를 피벗하여 실용적이고 결정론적인 위험 스크리너로 포지셔닝했습니다. 궁극적인 검증을 위해서는 전수 휴먼 검토와 대규모 API 재실험이 필요하나, 2026년 5월 졸업 타임라인에 맞춰 추가 확장을 통제(Freeze)함으로써 <strong>로컬 공급망 스크리너의 엔지니어링적 실현 가능성을 성공적으로 증명</strong>하며 프로젝트를 완수했습니다.</p>",
      },
      {
        title: "📡 Network Encryption & Concurrency",
        titleKo: "📡 IoT 보안과 동시성 제어",
        body: "<p>I built an MQTT pipeline on ESP32 sensors and added mTLS to secure device communication, then measured how the <a href=\"https://j1w0n.vercel.app/JW-132\" target=\"_blank\" rel=\"noopener noreferrer\">encryption overhead traded off against real-time throughput</a> under different FreeRTOS scheduling, and <a href=\"https://j1w0n.vercel.app/JW-158\" target=\"_blank\" rel=\"noopener noreferrer\">where packets dropped</a> under load. The finding: explicit core pinning doesn't always beat the automatic scheduler, and securing the channel is as much a scheduling problem as a cryptographic one.</p>",
        bodyKo: "<p>ESP32와 BME680 센서로 mTLS가 적용된 MQTT 데이터 파이프라인을 구축했습니다. FreeRTOS 환경에서 mTLS 암호화 레이어를 추가하자, 멀티코어 태스크 스케줄링 상태에 따라 불규칙한 데이터 유실과 레이턴시 변동이 발생했습니다. 분석 결과, 개발자가 특정 코어에 태스크를 고정하는 방식이 OS의 자동 스케줄러보다 언제나 효율적이진 않다는 점을 발견했습니다. 암호화 오버헤드와 실시간 처리량 사이의 균형은 보안 문제인 동시에 정교한 시스템 스케줄링의 영역이었습니다.</p>",
        refs: [
          { href: "https://github.com/J1w0n-H/iot-sensor-tls-experiment", label: "github.com/J1w0n-H/iot-sensor-tls-experiment" },
        ],
      },
    ],
    footer: [
      {
        type: "quote",
        en: "None of these were part of a job I was running; they were stacks I wanted to understand from the inside. I take each far enough to find where it breaks down, and I stay clear about where my evidence stops.",
        ko: "새로운 기술 스택을 마주할 때도 동일한 접근 방식을 취합니다. 직접 빌드해 보고, 시스템이 놓치는 사각지대를 끝까지 추적합니다.",
      },
    ],
  },
  {
    id: "person",
    number: "05",
    title: "The Person Behind It",
    titleKo: "나에 대해",
    subtitle: "curiosity · consistency · connection",
    subtitleKo: "호기심 · 꾸준함",
    ghost: "PERSON",
    catToken: "lime",
    narrative: [
      {
        type: "group",
        shape: "rect",
        photos: [
          { src: "/about/coffeemachine.jpg", altEn: "Espresso machine repair", altKo: "에스프레소 머신 수리" },
          { src: "/about/nintendo.png", altEn: "Nintendo with custom housing", altKo: "닌텐도 커스텀 하우징" },
        ],
        en: "<p>I need to take things apart and see them through. I fix broken espresso machines, rebuild retro consoles in custom housings, and say yes whenever someone needs a PC build or hardware troubleshooting. Taking something apart is the fastest way to understand it, and it's the same curiosity that took a math major into infrastructure and security.</p>",
        ko: "<p>고장 난 에스프레소 머신을 분해해 고치거나, 레트로 닌텐도 게임기를 완전히 분해해 커스텀 하우징으로 재조립하는 일에서 순수한 재미를 느낍니다. PC 빌드나 하드웨어 트러블슈팅 요청이 오면 언제든 흔쾌히 돕습니다. 내부를 직접 뜯어보는 것이 작동 원리를 이해하는 가장 확실한 방법이기 때문입니다. 수학 전공자가 밑바닥부터 인프라와 보안 전문성을 쌓아올릴 수 있었던 원동력이 바로 여기에 있습니다.</p>",
      },
      {
        type: "group",
        shape: "rect",
        photos: [
          { src: "/about/workingout.jpg", altEn: "UMD promotional material", altKo: "UMD 홍보물" },
          { src: "/about/theragen.webp", altEn: "뛰라젠 running club", altKo: "뛰라젠 러닝 클럽" },
        ],
        en: "<p>I run up to 180 km a month and have finished a half marathon; my training routine ended up in UMD promotional material. At my last company, colleagues who saw me run every day started joining on their own until it turned into an internal running club. I never organized it.</p>",
        ko: "<p>엔지니어로서 장기적인 페이스를 유지하려 러닝을 꾸준히 합니다. 한 달에 최고 180km까지 달리며 하프 마라톤을 완주했고, 이 훈련 모습이 UMD 프로모션 미디어에 자연스럽게 소개되기도 했습니다. 전 직장에서는 제가 매일 즐겁게 달리는 모습을 보고 동료들이 하나둘 합류하면서, 전사 임직원의 25% 이상인 20여 명 규모의 사내 러닝 클럽 '뛰라젠'이 결성되었습니다. 먼저 나서서 판을 짜지 않아도, 무언가를 진심으로 즐기며 지속하는 모습 자체가 주변에 가장 자연스럽고 건강한 동기부여가 됨을 확인한 경험이었습니다.</p>",
      },
      {
        type: "group",
        shape: "rect",
        photos: [
          { src: "/about/interview1.png", altEn: "Company spotlight card", altKo: "사내 스포트라이트 카드" },
          { src: "/about/interview2.webp", altEn: "Company spotlight article", altKo: "사내 스포트라이트 기사" },
        ],
        en: "<p>Communicating easily across roles led to a 2023 internal feature titled <strong>\"For medicine, see the pharmacist; for systems, see Jiwon.\"</strong> That was then; I've stayed close with those colleagues since.</p>",
        ko: "<p>직군을 막론하고 편하게 소통해온 결과, 2023년 사내 인터뷰에서 <strong>\"약은 약사에게, 시스템은 지원님에게\"</strong>라는 제목을 얻었습니다. 이때 쌓은 신뢰는 퇴사 후에도 이어져, 전 직장 동료들이 아키텍처 설계나 네트워크 문제, 커리어 결정을 앞두고 여전히 먼저 조언을 구합니다.</p>",
      },
    ],
  },
  {
    id: "looking-for",
    number: "06",
    title: "What I'm Looking For",
    titleKo: "찾고 있는 것",
    subtitle: "larger scale · broader ownership",
    subtitleKo: "더 큰 규모 · 더 넓은 책임",
    ghost: "SEEK",
    catToken: "research",
    narrative: [
      {
        type: "p",
        en: "Running a 200-node cluster with a three-person team for three years and eight months builds a calibrated instinct: which components fail quietly, which alerts are just cognitive noise, and why a clear runbook matters at 2 AM when things go sideways. I know the operational cost of keeping infrastructure healthy, and I understand the danger of a system that fails silently without tripping a single alarm.",
        ko: "세 명으로 200노드 클러스터를 3년 반 동안 운영하면 고유한 감각이 생깁니다. 어떤 컴포넌트가 조용히 먼저 무너지는지, 어떤 알람이 인지 피로를 유발하는 노이즈인지, 모두가 공황에 빠진 새벽 2시 장애 상황에서 실효성 있는 런북(Runbook)이 왜 필요한지 정확히 판별하게 됩니다. 인프라를 건강하게 유지하기 위해 치러야 할 비용과, '시스템에 문제가 있으나 아무런 경고등도 들어오지 않는 상태'의 위험성을 누구보다 잘 이해하고 있습니다.",
      },
      {
        type: "p",
        en: "I want to run infrastructure I'm fully accountable for, not diagnose it from the outside. I'm looking for a role where I own the system end-to-end and carry the results.",
        ko: "컨설팅 정규직 제안을 사양한 이유는 분명합니다. 진단하고 보고서만 넘기기보다 직접 설계하고 운영하며 결과까지 책임지고 싶었기 때문이고, 이 생각은 지금도 같습니다. 저는 시스템을 처음부터 끝까지 직접 소유하고 결과에 책임질 수 있는 역할을 찾고 있습니다.",
      },
      {
        type: "li",
        en: "The scale and scope of infrastructure I can own and be fully accountable for",
        ko: "스스로 통제하고 책임질 수 있는 인프라의 규모와 범위",
      },
      {
        type: "li",
        en: "A blameless culture that asks \"why did the system allow this to fail\" rather than \"who made the mistake\"",
        ko: "장애 시 '누가 실수했는가'보다 '시스템이 왜 구조적으로 실패할 수밖에 없었는가'를 중심에 두는 무비난(Blameless) 회고 문화",
      },
      {
        type: "p",
        en: "<strong>Roles of interest:</strong> Security Engineer · Infrastructure Security Engineer",
        ko: "<strong>관심 직무:</strong> 보안 엔지니어 · 클라우드 인프라 아키텍트 · SRE",
      },
    ],
  },
]

export type AboutMetric = {
  value: string
  label: string
}

export const ABOUT_METRICS: AboutMetric[] = [
  { value: "4h→30m", label: "provisioning time" },
  { value: "72hr", label: "migration · 0 data loss" },
  { value: "100+", label: "users migrated" },
  { value: "7-step", label: "AWS attack chain" },
]

export type LIArticle = {
  num: string
  en: string
  ko: string
  views: string
  href: string
}

export const LI_ARTICLES: LIArticle[] = [
  {
    num: "P01",
    en: "Fake It Till You Make It — My Crash Course in Security Consulting",
    ko: "보안 컨설팅 현장에서 맨땅에 헤딩하며 배운 실무 레슨",
    views: "1,236",
    href: "https://www.linkedin.com/pulse/e1-p01-fake-till-you-make-my-crash-course-security-consulting-hwang-h1zge/",
  },
  {
    num: "P02",
    en: "Trading the Checklist for Command Line — Why I Switched to Systems Administration",
    ko: "체크리스트 검토 대신 커맨드 라인을 선택하고 시스템 인프라로 전향한 이유",
    views: "613",
    href: "https://www.linkedin.com/pulse/e1-p02-trading-checklist-command-linewhy-i-switched-system-hwang-jatne",
  },
  {
    num: "P03",
    en: "Bridging Two Worlds — Security Meets Systems and Finding My Footing",
    ko: "보안과 시스템 인프라, 두 세계가 만나는 지점에서 찾은 엔지니어로서의 정체성",
    views: "2,244",
    href: "https://www.linkedin.com/pulse/e1-p03-bridging-two-worlds-security-meets-systems-jiwon-hwang-ynaxe/",
  },
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
