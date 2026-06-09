import { useState, useMemo, useEffect } from "react";


// ─── Data ────────────────────────────────────────────────────────────────────

const TRENDING = [
  {
    id: 1,
    title: "Neural Document Processing",
    tag: "AI Mastery",
    duration: "4.5h",
    rating: 4.9,
    students: "12.4k",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB10b66sS0FuMgd276Rp7A7UOu5pg32sdrsB6FXa7dhSVDjb851sxEFTI9DnlERQmJmg3kx6jTWyYrqH71ARZyDEJEMjgba28ZshWBaPrdvoqEw6Zh_cqjHEXy1ET7CVwmCHJwqC8S-pwkb_BlDnqXOg5nFSF4dyKU1mJH_7pDqYm0DUnXzEpA9MApC7xB24qwy-QdMcY_16Mt2R2DTo92NKZYxw7d_aTdYiuUoZsvSbSXZheGbAVi2f-H9rPsFbTDz4216HfgKV1_L",
  },
  {
    id: 2,
    title: "Automated Content Audits",
    tag: "Workflows",
    duration: "2h",
    rating: 4.8,
    students: "8.2k",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXmi0m5jWGK50P96SExUlwVP8ORi9_0aOxllaIn1ki5JtO-9-jn9Ktt_bfP4Ekg7vRjBUvhiAJXOVr_311NZgKyofF04We9oQwGv-RDOrFNQf0THJ0fijuf91yBw2-lsalULAzgHeu5JROwJOMrFdXtwgs1CKeYompcj2Xc0FbMZkg4cRZT4rel_hE79_ImubUswwJkY66ax4f7Uce7obXpSAfe4tQKC2L4hTcC-jQDtwIpTPLDhT5ke1gsUij_P3ircBRp_P6p3x",
  },
  {
    id: 3,
    title: "Building AI Databases",
    tag: "Architecture",
    duration: "6.5h",
    rating: 5.0,
    students: "5.9k",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS9DiVGohU387Z-2SZfapiQtVrNnvVX9XooFjQqXhunCh9GYzBf5M0_eUA7ECKo_t5NzRx-20Bv1NdB5OwkzhmcD4yt6svEJjMnhf-Z52WUtIzfycEwbmR_3wnwv-OxTQRT6dMzm1AbH_ccDvBlcFp5MwLlk7gQ4MCvXCSLcfg97y-xUhaahTMj622ZRlr0BAGEn_UbePjdWYxDpMnFyfg-urbl0elNO3HR6Ie9xqNrY6eb30-wd2T-bnIc73-fcCD0CPESR8j0r7R",
  },
];

const ALL_COURSES = [
  {
    id: 1,
    title: "Data Privacy in AI Models",
    instructor: "Sarah Chen",
    rating: 4.7,
    lessons: 12,
    subject: "AI Fundamentals",
    level: "Intermediate",
    duration: "2 - 5 hours",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuArdb7eOmtXU8dofu6Ih2e1gztSPVfQ06PpGSZ06Nhlb4ubCvj00yMHq5a9_AngbMEldQ_qvikczKwZhtmqLMcbAE9BvVKhaWUA7TGvokFezNBJoOiVzDk85jg1yF1F2E0nwGV8nfFWyDofZ0u4PfMIGVri0g68CCPKEJCef915b75sJiMe-4cEEc7KV9H_MWg0L0t4k6hI1GzIKxpxIi0LJsqfShgI_vpQc_UEhmMaUXiq74huvFUmU39ixjpQPbk7GQZEmoqmecHT",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1lqmT_2ulJAYYybId_iiGoCq0-GgudGuWbBgaH0wXYAoiFfKvg45uWuaMtdAFz9wqlurHZM7XSoLmIMBpah8NQgy5UxQAHt6fPI2Zm1xKpFMHi0j2rHY2FjGWklVEEAeEniCFwZJd8p8toF-dkldx_DpHAOIBh1LXSrOBqzjedqMGSy5JM5kJNzGovSUbNucNvuEjoqO5AU1aaIHneAR9pQcSqxvWLfKrVixLL-91R4EcQcuHOINFTCkUsHqPi7qBaJKpqiEUW039",
  },
  {
    id: 2,
    title: "Optimizing Cloud Workflows",
    instructor: "David Miller",
    rating: 4.9,
    lessons: 8,
    subject: "Workflow Automation",
    level: "Advanced",
    duration: "2 - 5 hours",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2k2tzQShu8bFg7lfSrzA7MxWtdHoXTapERnDF-g6796U5bQdi-jZ2kKUlsZFiDy5BJB35Op7z5Olcu9195-oSplwamyTFQ2zh1mIduv9_HFyX8OPbjDIqE_d58nQcLP7jKpbdmaG3DdHEOwFAJRi4oVubUJuKGk_qlOP6PA-nYed5Mtw9wkyuHphIAK27zWBuxXAQuH7xYTgJcpA3V8ltsWPQ3Buo8JUu1qh36tTRyT1wyd87pof-nxP1zArBe1zGc0Y7vmbBx4FL",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzc_PRSMcm0K-5XoMKKaz6GC1u54B_vr1awpiTy3xOz5U9O22lOlE82QhHtuHzRS_7S2lQKqqBw2nU6kJj9L_Cq2Eqt4XWzt61dgm2TJYnf1jDnh4N7nBDeUqkXpE0DVZqCDkxRsORUVrmask8noSDLhiDxXbnTi4SRlzjxFDmtNqVkmP-Eimh-NDr8Cj_hEcuH_-ZT4IT-rT48GLbxt8oZ_wK7ZqwErdt87izIG90dlqm2A-MekYswzzQUQNkmNToV-oudXfyZWC_",
  },
  {
    id: 3,
    title: "Advanced Prompt Strategy",
    instructor: "Elena Rodriguez",
    rating: 4.6,
    lessons: 15,
    subject: "Prompt Engineering",
    level: "Advanced",
    duration: "5+ hours",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5LwmmFQkP77DP6UJ-pX3-U8ylMw9gQJ4xi1iaZklU-_kbxLnMy51O_gp8MVOn8uSaYhpundgNZgwBDnbF1Oks6-IxnYdKVyVhJdxNkR2ezrtmWGYX9eomJBzs_i1mMBXaZhv77BidGtHATklmN6uW2jprPXC8ae2ahhOc6njvekTSts_zoqvJ1IlmtkGoqOR-rrYU0sjo9aaaDr5UeGUwY9osl9Qd52KW7dazdQRHVK4jkAnEC3i4QJnfqu3ZqeBf0jnMF5OkhT3A",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0bfdK1t801l-meZawGF5XxPcdsEntnlJr1KTyfWpmwY3LpYCkRjUjApp18Sw9Oag8u3RNsgbaWDtSF9mTiL7SNkuJyw70i7nBa35aCEFOidkCFFf6ZrClZrz7EGmPKr6oA9muF4fqnsbQbNypXdi5VlN-xPuUd2UK6FE0EQU40Ge_EG82j3uVsWR6431PR8b6BJgIxFzEe1BUc4avDSJPxheNSk_JwV0ksc1HQeZyHBqyZ2EKYntlnYOnW3k1IBq-Dr1SsWookM0d",
  },
  {
    id: 4,
    title: "Real-time Document Sync",
    instructor: "James Wilson",
    rating: 4.8,
    lessons: 20,
    subject: "Data Processing",
    level: "Intermediate",
    duration: "5+ hours",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHn8thLLIQPTO-xkm9PunuDvj55pq-RnKZTWZD0rIKM8ldz0LSqJCR1pKMpphU4f12InLyVyKzEkXctk90jEd1wwo88f0wa6Qql5A_3mVjcU43dCKwNLlPcSwlv_00QD0oAojJO8Qkh9BJi6kkwUasohh0b9Y9Gco6vZXbnXGcoaOrboFkpLV4Q5e8Ot1g19JLVWw2pZw56oFrHRDJCg6P4xfUsj0WZuHjeVJZsSazNzj2Nqie9l90-3iZAJF4ETDb2gv8O1lhazSZ",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUTgzeJoq2LxmwuSgPo-ZBu6HuJRN59TN3q905iTxaXwMFSyHMHZYB2gq5t_I4YEy-tVgTf2MFOcAP6-sJ37LjsLsDQVOLWVRXYmyKvopVAd6pQBFRWvcWIpnbKXK81fXf2Wqwjwynd5TRJ5PDD--hRHle77uusSEsdNC68txyhwEMuiwvwXBHpNod4Kp6U09XkJ33T2VFoEe-M807rpyXbMuvukW5ZLgIFsSqX7i4-ktJpxqmos9KDG21QTxfU5KyY7YDEQAiHSaSg",
  },
  {
    id: 5,
    title: "Visual Logic & AI Design",
    instructor: "Maya Sato",
    rating: 4.9,
    lessons: 6,
    subject: "AI Fundamentals",
    level: "Beginner",
    duration: "Under 2 hours",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnZdKH0nFgfuuev18gQmWNR7nSjC8mWy2UuRXxP1wHfqmTfn9mOwnmFxuenXURv1RrGBP6bt1g8Lvj-1axyZXJWR3Kn6lzUO9usDlc9c7tM_DusjOZmdH0aSMmal8WP7mKlkNoWXWC2K-oWuxE6ZHuSzkOKn6vCd5viOWyjcANWWNQJC9BXSU9Xn1cVO3xiqR1r1RvEdXxvMwKGwdurDj2uNlAmDRPqyQYataMUsnJKNA1MHs3ZrSXDlQZ0qHuFGy0Obs9YEswaAyV",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC88B187laev3NZUVfUPXkCsfogYgpFESuL0vEAoFWrlMTZvbRcPcb83TGf9DJXjJXBCTKRpckYmN9qWu8ev0ISXF7s3FBNQ217JWiCZdiXARBg824qU9eQNL1PkvPNsuKExxrRu_iicT9UMu8jtUZH5-w2AsiQIM49V9luNVErNpnmTc56_5gJ7lPqOXvkqwlypXzGfd571Q0WKloBe4JSEUMxq5vKPlsYVQu8ZjxwzwS8Km-hVEO1o6RIYsOoFNRD0zRjGG1KkM",
  },
  {
    id: 6,
    title: "Multi-agent System Setup",
    instructor: "Dr. Alan Smithee",
    rating: 5.0,
    lessons: 10,
    subject: "Workflow Automation",
    level: "Advanced",
    duration: "2 - 5 hours",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUMugLq0n_W1_SK0qtFHS0xFjUd4-ry5yzNDR804qeQZTS93rx9wPoq01liBbORBdW4SPeEpiVGCcb4pdEujX7AqmxezGgIzRRlNnOtErWC5cD1eNz_7LuKm6n4KcS2T-sLVawnmwvGYPKvJ9cegHwTpe7oLf5jlUyPtvjgX0WwMIZ26-ABZNB3z5zTqI_4Qk0_wVBejQMJoeNCnetcxBNmDwd0UGfoxOxOTsnuHkafpBwjULc758CigsOLn5h-tvDE_VZ8QHT6_vg",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAffYjQi-jW85v-inSHHkitXyxk6JRP6dTHBEmOpc9eb3EUOx2E35IieuVF-QXRELioBd189SJXgVPyMhq69zLq1NpSDXhw-tFHGC1oMKpnQOoT23tDrLQ8P5WQNUnlUSNl58E8iZ4nhYJVxN4BtZ5RyDvOZPIXwAfsHD83kqSJlIf0dfUaDusqFZXhJ9ch-M-Mf0Nfrl7w6HJBe-kIlki4dmyyfTEACwUr-zDClfsYJyIgxSx1q1iIltA4NuMhnHGR7wNiWZtxenPy",
  },
  {
    id: 7,
    title: "LLM Fine-Tuning Bootcamp",
    instructor: "Priya Nair",
    rating: 4.8,
    lessons: 18,
    subject: "AI Fundamentals",
    level: "Advanced",
    duration: "5+ hours",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB10b66sS0FuMgd276Rp7A7UOu5pg32sdrsB6FXa7dhSVDjb851sxEFTI9DnlERQmJmg3kx6jTWyYrqH71ARZyDEJEMjgba28ZshWBaPrdvoqEw6Zh_cqjHEXy1ET7CVwmCHJwqC8S-pwkb_BlDnqXOg5nFSF4dyKU1mJH_7pDqYm0DUnXzEpA9MApC7xB24qwy-QdMcY_16Mt2R2DTo92NKZYxw7d_aTdYiuUoZsvSbSXZheGbAVi2f-H9rPsFbTDz4216HfgKV1_L",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1lqmT_2ulJAYYybId_iiGoCq0-GgudGuWbBgaH0wXYAoiFfKvg45uWuaMtdAFz9wqlurHZM7XSoLmIMBpah8NQgy5UxQAHt6fPI2Zm1xKpFMHi0j2rHY2FjGWklVEEAeEniCFwZJd8p8toF-dkldx_DpHAOIBh1LXSrOBqzjedqMGSy5JM5kJNzGovSUbNucNvuEjoqO5AU1aaIHneAR9pQcSqxvWLfKrVixLL-91R4EcQcuHOINFTCkUsHqPi7qBaJKpqiEUW039",
  },
  {
    id: 8,
    title: "API-First Documentation",
    instructor: "Tom Keller",
    rating: 4.5,
    lessons: 9,
    subject: "Data Processing",
    level: "Beginner",
    duration: "2 - 5 hours",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXmi0m5jWGK50P96SExUlwVP8ORi9_0aOxllaIn1ki5JtO-9-jn9Ktt_bfP4Ekg7vRjBUvhiAJXOVr_311NZgKyofF04We9oQwGv-RDOrFNQf0THJ0fijuf91yBw2-lsalULAzgHeu5JROwJOMrFdXtwgs1CKeYompcj2Xc0FbMZkg4cRZT4rel_hE79_ImubUswwJkY66ax4f7Uce7obXpSAfe4tQKC2L4hTcC-jQDtwIpTPLDhT5ke1gsUij_P3ircBRp_P6p3x",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzc_PRSMcm0K-5XoMKKaz6GC1u54B_vr1awpiTy3xOz5U9O22lOlE82QhHtuHzRS_7S2lQKqqBw2nU6kJj9L_Cq2Eqt4XWzt61dgm2TJYnf1jDnh4N7nBDeUqkXpE0DVZqCDkxRsORUVrmask8noSDLhiDxXbnTi4SRlzjxFDmtNqVkmP-Eimh-NDr8Cj_hEcuH_-ZT4IT-rT48GLbxt8oZ_wK7ZqwErdt87izIG90dlqm2A-MekYswzzQUQNkmNToV-oudXfyZWC_",
  },
  {
    id: 9,
    title: "Knowledge Graph Essentials",
    instructor: "Fiona Blake",
    rating: 4.7,
    lessons: 14,
    subject: "Data Processing",
    level: "Intermediate",
    duration: "5+ hours",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS9DiVGohU387Z-2SZfapiQtVrNnvVX9XooFjQqXhunCh9GYzBf5M0_eUA7ECKo_t5NzRx-20Bv1NdB5OwkzhmcD4yt6svEJjMnhf-Z52WUtIzfycEwbmR_3wnwv-OxTQRT6dMzm1AbH_ccDvBlcFp5MwLlk7gQ4MCvXCSLcfg97y-xUhaahTMj622ZRlr0BAGEn_UbePjdWYxDpMnFyfg-urbl0elNO3HR6Ie9xqNrY6eb30-wd2T-bnIc73-fcCD0CPESR8j0r7R",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC88B187laev3NZUVfUPXkCsfogYgpFESuL0vEAoFWrlMTZvbRcPcb83TGf9DJXjJXBCTKRpckYmN9qWu8ev0ISXF7s3FBNQ217JWiCZdiXARBg824qU9eQNL1PkvPNsuKExxrRu_iicT9UMu8jtUZH5-w2AsiQIM49V9luNVErNpnmTc56_5gJ7lPqOXvkqwlypXzGfd571Q0WKloBe4JSEUMxq5vKPlsYVQu8ZjxwzwS8Km-hVEO1o6RIYsOoFNRD0zRjGG1KkM",
  },
];


const SUBJECTS_FALLBACK = ["AI Fundamentals", "Data Processing", "Workflow Automation", "Prompt Engineering"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const DURATIONS = ["Under 2 hours", "2 - 5 hours", "5+ hours"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl transition-all duration-300 max-w-xs ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      {message}
    </div>
  );
}



function TrendingCard({ course, onEnroll }) {
  return (
    <div
      onClick={() => onEnroll(course.title)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.img}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-3 left-3 bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          Free
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded">
            {course.tag}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {course.duration}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-tight">
          {course.title || "Untitled Course"}
        </h3>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1 text-blue-600 font-semibold">
            <svg className="w-3.5 h-3.5 fill-blue-600" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {(Number(course.rating) || 0).toFixed(1)}
          </span>
          <span>{course.students || "0"} students</span>
        </div>
      </div>
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-200" />
      <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-3" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-slate-200" />
          <div className="h-3 bg-slate-200 rounded-md w-20" />
        </div>
        <div className="h-3 bg-slate-200 rounded-md w-8" />
      </div>
    </div>
  );
}

function CourseCard({ course, onEnroll }) {
  return (
    <div
      onClick={() => onEnroll(course.title)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-slate-100 shadow-sm group-hover:shadow-md transition-all duration-300">
        <img
          src={course.img}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2.5 left-2.5 bg-emerald-500/90 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
          Free
        </span>
        <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          {course.lessons} Lessons
        </span>
      </div>
      <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors">
        {course.title || "Untitled Course"}
      </h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <img
            src={course.avatar || "https://i.pravatar.cc/150"}
            alt={course.instructor || "Instructor"}
            className="w-5 h-5 rounded-full border border-slate-200 object-cover"
          />
          <span className="text-xs text-slate-500">{course.instructor || "Guest Instructor"}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
          <svg className="w-3 h-3 fill-blue-600" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {(Number(course.rating) || 0).toFixed(1)}
        </div>
      </div>
    </div>
  );
}

function FilterSidebar({ subjectOptions, levelOptions, durationOptions, selectedSubjects, selectedLevel, selectedDurations, onChange, onClear }) {
  return (
    <aside className="w-full lg:w-52 flex-shrink-0">
      <div className="lg:sticky lg:top-20 space-y-7">
        {/* Subject */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Subject</p>
          <div className="space-y-2">
            {subjectOptions.map((opt) => (
              <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(opt.label)}
                  onChange={() => onChange("subject", opt.label)}
                  className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${selectedSubjects.includes(opt.label) ? "text-slate-900 font-medium" : "text-slate-500 group-hover:text-slate-800"}`}>
                  {opt.label}
                </span>
                <span className="text-[10px] text-slate-400 font-medium ml-auto">{opt.count}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Level */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Level</p>
          <div className="space-y-2">
            {levelOptions.map((opt) => (
              <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="level"
                  checked={selectedLevel === opt.label}
                  onChange={() => onChange("level", opt.label)}
                  className="text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${selectedLevel === opt.label ? "text-slate-900 font-medium" : "text-slate-500 group-hover:text-slate-800"}`}>
                  {opt.label}
                </span>
                <span className="text-[10px] text-slate-400 font-medium ml-auto">{opt.count}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Duration</p>
          <div className="space-y-2">
            {durationOptions.map((opt) => (
              <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedDurations.includes(opt.label)}
                  onChange={() => onChange("duration", opt.label)}
                  className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${selectedDurations.includes(opt.label) ? "text-slate-900 font-medium" : "text-slate-500 group-hover:text-slate-800"}`}>
                  {opt.label}
                </span>
                <span className="text-[10px] text-slate-400 font-medium ml-auto">{opt.count}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={onClear}
          className="w-full py-2.5 text-xs font-semibold uppercase tracking-widest text-slate-500 border border-slate-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all"
        >
          Clear all filters
        </button>
      </div>
    </aside>
  );
}

function AIBar({ onAction }) {
  const [query, setQuery] = useState("");

  const handleAsk = () => {
    if (!query.trim()) return;
    onAction(`AI query sent: "${query}"`);
    setQuery("");
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-50">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-full px-3 py-2 flex items-center gap-3 shadow-xl shadow-blue-900/10">
        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask AI to suggest a course path…"
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
        />
        <button
          onClick={handleAsk}
          className="bg-white border border-slate-200 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all"
        >
          Ask →
        </button>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function CoursePage() {
  const [search, setSearch]           = useState("");
  const [courses, setCourses]         = useState([]);
  const [subjects, setSubjects]       = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState(null);
  
  const [activeFilters, setActiveFilters] = useState({
    subjects: [],
    levels: [],
    durations: [],
  });
  
  const [sortBy, setSortBy]           = useState("Most Recent");
  const [subjectFilters, setSubjectFilters] = useState([]);
  const [levelFilter, setLevelFilter] = useState("");
  const [durationFilters, setDurationFilters] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast]             = useState({ visible: false, message: "" });

  // Toast helper
  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 2800);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [coursesRes, subjectsRes] = await Promise.all([
          fetch("http://localhost:8080/api/courses"),
          fetch("http://localhost:8080/api/subjects")
        ]);

        if (!coursesRes.ok || !subjectsRes.ok) throw new Error("Failed to fetch data");

        const coursesData = await coursesRes.json();
        const subjectsData = await subjectsRes.json();

        // Map backend courses to frontend structure
        const mappedCourses = coursesData.map(c => ({
          ...c,
          title: c.title || "Untitled Course",
          img: c.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
          students: c.enrolled || "0k",
          subject: c.category || "General",
          instructor: c.instructor || "Guest Instructor",
          rating: c.rating || 0.0,
          lessons: c.lessons || 0,
          avatar: c.avatar || "https://i.pravatar.cc/150",
          level: c.level || "Beginner",
          duration: c.duration || "2 - 5 hours"
        }));

        setCourses(mappedCourses);
        setSubjects(subjectsData.length > 0 ? subjectsData.map(s => s.name) : SUBJECTS_FALLBACK);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to connect to the learning server. Please ensure the backend is running.");
        setSubjects(SUBJECTS_FALLBACK);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (title, id) => {
    if (id) {
      try {
        const res = await fetch(`http://localhost:8080/api/courses/${id}/enroll`, {
          method: 'PUT'
        });
        if (res.ok) {
          showToast(`✅ Successfully enrolled in ${title}!`);
        } else {
          showToast("❌ Enrollment failed. Please try again.");
        }
      } catch (err) {
        showToast("❌ Server error during enrollment.");
      }
    } else {
      showToast(`Welcome! Starting enrollment for "${title}"…`);
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === "subject") {
      setSubjectFilters((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else if (type === "level") {
      setLevelFilter((prev) => (prev === value ? "" : value));
    } else if (type === "duration") {
      setDurationFilters((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
    setVisibleCount(6);
  };

  const clearFilters = () => {
    setSubjectFilters([]);
    setLevelFilter("");
    setDurationFilters([]);
    setSearch("");
    setVisibleCount(6);
    showToast("Filters cleared");
  };

  const subjectFiltersList = useMemo(
    () => subjects.map((s) => ({ label: s, count: courses.filter((c) => c.subject === s).length })),
    [courses, subjects]
  );

  const levelFiltersList = useMemo(
    () => LEVELS.map((l) => ({ label: l, count: courses.filter((c) => c.level === l).length })),
    [courses]
  );

  const durationFiltersList = useMemo(
    () => DURATIONS.map((d) => ({ label: d, count: courses.filter((c) => c.duration === d).length })),
    [courses]
  );

  const filtered = useMemo(() => {
    let result = courses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase());
      const matchSubject =
        subjectFilters.length === 0 || subjectFilters.includes(c.subject);
      const matchLevel = !levelFilter || c.level === levelFilter;
      const matchDuration =
        durationFilters.length === 0 || durationFilters.includes(c.duration);
      return matchSearch && matchSubject && matchLevel && matchDuration;
    });

    if (sortBy === "Popularity")    result = [...result].sort((a, b) => b.lessons - a.lessons);
    if (sortBy === "Highest Rated") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [courses, search, subjectFilters, levelFilter, durationFilters, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="bg-transparent text-slate-900 font-sans">
      <Toast message={toast.message} visible={toast.visible} />
      
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        {/* ── Hero / Search ─────────────────────────────────── */}
        <section className="pt-12 pb-4 px-4 sm:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 leading-tight">
            Level up your{" "}
            <span className="text-blue-700">Workflow</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mb-7 leading-relaxed">
            Master AI-powered document management and automation with our curated free learning paths.
          </p>
          <div className="relative max-w-lg">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(6); }}
              placeholder="Search courses, tools, or instructors…"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
            />
          </div>
        </section>

        {/* ── Trending ──────────────────────────────────────── */}
        <section className="px-4 sm:px-8 max-w-7xl mx-auto py-8">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight">New &amp; Trending</h2>
              <p className="text-sm text-slate-500">Most popular starts this week</p>
            </div>
            <div className="flex gap-2">
              {[
                <path key="l" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />,
                <path key="r" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />,
              ].map((path, i) => (
                <button
                  key={i}
                  onClick={() => showToast(i === 0 ? "Previous batch" : "Next batch")}
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-blue-700 hover:border-blue-700 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    {path}
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRENDING.map((c) => (
              <TrendingCard key={c.id} course={c} onEnroll={handleEnroll} />
            ))}
          </div>
        </section>

        {/* ── Filters + Grid ────────────────────────────────── */}
        <div className="px-4 sm:px-8 max-w-7xl mx-auto pb-28">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="flex items-center gap-2 text-sm font-semibold text-blue-700 border border-blue-200 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              {sidebarOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
              <FilterSidebar
                subjectOptions={subjectFiltersList}
                levelOptions={levelFiltersList}
                durationOptions={durationFiltersList}
                selectedSubjects={subjectFilters}
                selectedLevel={levelFilter}
                selectedDurations={durationFilters}
                onChange={handleFilterChange}
                onClear={clearFilters}
              />
            </div>

            {/* Course grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-800">{filtered.length}</span> course{filtered.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  Sort by:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-none bg-transparent font-semibold text-blue-700 focus:outline-none cursor-pointer"
                  >
                    <option>Most Recent</option>
                    <option>Popularity</option>
                    <option>Highest Rated</option>
                  </select>
                </div>
              </div>

              <div className={`transition-opacity duration-500 ${isLoading ? "opacity-50" : "opacity-100"}`}>
                {error ? (
                  <div className="text-center py-16 px-6 bg-red-50 border border-red-100 rounded-2xl">
                    <span className="material-symbols-outlined text-red-400 text-4xl mb-3">error</span>
                    <p className="text-red-700 font-semibold mb-1">{error}</p>
                    <p className="text-red-600/70 text-sm">Please check your network connection or backend status.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <CourseSkeleton key={`skeleton-${i}`} />
                      ))
                    ) : visible.length === 0 ? (
                      <div className="text-center py-16 text-slate-400 col-span-full">
                        <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p className="text-base font-semibold text-slate-600 mb-1">No courses found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    ) : (
                      visible.map((c) => (
                        <CourseCard key={c.id} course={c} onEnroll={() => handleEnroll(c.title, c.id)} />
                      ))
                    )}
                  </div>
                )}
              </div>

              {visibleCount < filtered.length && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => { setVisibleCount((p) => p + 3); showToast("More courses loaded!"); }}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all shadow-sm"
                  >
                    Load more courses
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <AIBar onAction={showToast} />
      </div>
    </div>
  );
}
