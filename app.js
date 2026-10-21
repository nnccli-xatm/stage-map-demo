/**
 * 阶段地图 · H5 免费传播版 v2.0-free
 * 内容对齐 md/15-chatgpt-content-design.md（职场迷茫 + 副业过载 · G3）
 * 合规：非医疗 · 无支付 · 隐私本地 · 「本次信息不足」· 无 Human 3.0 商标
 */
(function () {
  "use strict";

  var VERSION = "v2.0-free";
  /** 洞察外链表单占位；就绪后填入完整 URL */
  var FORM_URL = "";
  var INSIGHT_KEY = "stage-map-insight-v2";

  var DIMS = ["思考行动", "精力恢复", "关系意义", "工作方向"];

  var FREQ_OPTS = [
    { id: "none", label: "没有", days: 0 },
    { id: "d12", label: "1–2 天", days: 1.5 },
    { id: "d35", label: "3–5 天", days: 4 },
    { id: "d6", label: "6 天及以上", days: 6 },
    { id: "na", label: "不适用或记不清", days: null, na: true },
  ];

  var PERSONAS = {
    career: {
      id: "career",
      name: "职场迷茫",
      h1: "工作还能做下去，但你不想一直这样做下去。",
      lead: "回答约 8 个关于最近两周的问题，看看眼下哪件事值得先理清。免费拿到当前卡点和今天一步；完整地图再展开接下来 30 天的取舍与安排——全部免费。",
      cta: "看看我现在卡在哪",
      punchDefault: "先试一个方向，不必今晚决定去留。",
      shareAlt: "先弄清想换什么，再决定要不要走。",
      exampleHint: "例如：岗位日常任务、一段作品、一个工作条件（不推断你一定想辞职）。",
    },
    side: {
      id: "side",
      name: "副业过载",
      h1: "一个晚上忙了三件事，最想推进的那件还是没动。",
      lead: "回答约 8 个关于最近两周的问题。免费拿到当前卡点和今天一步；完整地图继续展开先留哪一件、暂缓什么、忙不过来时怎样缩小——全部免费。",
      cta: "看看我现在卡在哪",
      punchDefault: "暂停几条线，给一件事留时间。",
      shareAlt: "这周先让一件事有结果。",
      exampleHint: "例如：一段脚本、一页服务介绍、一份样品（不推断收入或保证盈利）。",
    },
  };

  var QUESTIONS = [
    {
      id: "q1",
      dim: "思考行动",
      signal: "prep",
      title: "最近 14 天，有几天你为这件事继续查资料，查完却仍没开始一个小尝试？",
      hint: "按最近两周实际情况选。查资料本身不是问题；本题观察「准备是否落地」。",
    },
    {
      id: "q2",
      dim: "思考行动",
      signal: "attempt",
      title: "最近 14 天，有几天你完成过一个能带回新信息的小动作，比如试做一小段任务，或问清一个实际条件？",
      hint: "小动作包括 15 分钟试做、核实一个条件等。没有也如实说。",
    },
    {
      id: "q3",
      dim: "精力恢复",
      signal: "spare",
      title: "最近 14 天，忙完当天必须做的事后，还有精力用 10 分钟做一件自选小事的日子，有几天？",
      hint: "只看「忙完必要事后是否还有余量」，不评判你忙不忙。",
    },
    {
      id: "q4",
      dim: "精力恢复",
      signal: "restStolen",
      title: "最近 14 天，原本准备留给自己休息的时间，被临时加进来的事占走，有几天？",
      hint: "「不适用或记不清」不等于「没有」。",
    },
    {
      id: "q5",
      dim: "关系意义",
      signal: "othersFirst",
      title: "最近 14 天，有几天你把原本留给自己的时间，改成了回应别人临时的安排？",
      hint: "不据此判断关系质量，更不推断「不被爱」。",
    },
    {
      id: "q6",
      dim: "关系意义",
      signal: "selfChoice",
      title: "最近 14 天，有几天你做过一件自己想做、也觉得值得的小事，即使不用向别人交代成果？",
      hint: "散步、听完整一首歌、翻几页书都可以算。",
    },
    {
      id: "q7",
      dim: "工作方向",
      signal: "switchDir",
      title: "最近 14 天，有几天你在两个或更多方向间来回换，到当天结束仍没确定先试哪一项？",
      hint: "未采集具体路线时，不自动断言你在哪些选项之间选择。",
    },
    {
      id: "q8",
      dim: "工作方向",
      signal: "multiGoal",
      title: "最近 14 天，有几天你因为同时推进多个目标，推迟了原先最想完成的那一项？",
      hint: "项目多本身不等于有问题；能从容推进时不会套用「过载」摘要。",
    },
  ];

  var PHASES = {
    fork: {
      id: "fork",
      name: "岔路拉扯期",
      token: "pull",
      oneLiner: "几个方向都在考虑，哪条先试还没落定。",
      hedge: "这是对近期行为组合的方便称呼，不是人格标签",
    },
    prep: {
      id: "prep",
      name: "准备打转期",
      token: "pull",
      oneLiner: "准备不断增加，实际验证还没跟上。",
      hedge: "已有少量尝试时，不会写「从未开始」",
    },
    multi: {
      id: "multi",
      name: "多线挤满期",
      token: "overload",
      oneLiner: "几件事同时开着，最想完成的那件被挤后了。",
      hedge: "能从容推进多线的人不会套用本相位",
    },
    spare: {
      id: "spare",
      name: "余量紧张期",
      token: "overload",
      oneLiner: "必须做的事情占满了最近的精力。",
      hedge: "只描述你自述的近期余量，不推断健康状况",
    },
    selfLast: {
      id: "selfLast",
      name: "自己靠后期",
      token: "restart",
      oneLiner: "别人的安排回应了，自己的期待经常排到最后。",
      hedge: "不推断关系质量或谁在消耗你",
    },
    trial: {
      id: "trial",
      name: "小步试路期",
      token: "stable",
      oneLiner: "已经做了一些尝试，眼下需要看清哪些值得继续。",
      hedge: "再测用于比较近况，不承诺「升级」",
    },
    unclear: {
      id: "unclear",
      name: "线索不足",
      token: "stable",
      oneLiner: "这次回答还不足以用一个相位概括。",
      hedge: "先保留最清楚的一条观察",
    },
  };

  var PROGRESS_FEEL = ["刚起步", "画面浮现", "快到半路", "半图亮了", "还差几站", "快收束了", "最后两问", "收束中"];

  var state = {
    persona: "career",
    screen: "chooser",
    qIndex: 0,
    answers: {},
    result: null,
  };

  var $ = function (sel) {
    return document.querySelector(sel);
  };
  var $$ = function (sel) {
    return Array.from(document.querySelectorAll(sel));
  };

  function showToast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2200);
  }

  function showScreen(id) {
    $$(".screen").forEach(function (s) {
      s.classList.toggle("active", s.id === "screen-" + id);
    });
    state.screen = id;
    window.scrollTo(0, 0);
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function daysOf(ans) {
    if (!ans || ans.na) return null;
    return typeof ans.days === "number" ? ans.days : null;
  }

  function high(d) {
    return d != null && d >= 3.5;
  }
  function midHigh(d) {
    return d != null && d >= 1.5;
  }
  function low(d) {
    return d != null && d < 1.5;
  }
  function veryLow(d) {
    return d != null && d < 0.5;
  }

  function scoreAnswers(answers) {
    var sig = {};
    QUESTIONS.forEach(function (q) {
      sig[q.signal] = daysOf(answers[q.id]);
    });

    var evidence = {};
    DIMS.forEach(function (d) {
      evidence[d] = [];
    });
    QUESTIONS.forEach(function (q) {
      var a = answers[q.id];
      if (!a || a.na) return;
      evidence[q.dim].push(q.id.toUpperCase() + "·" + a.label);
    });

    var levels = {};
    // 越高表示该维「近期更顺 / 资源更多」；无线索 → null（本次信息不足）
    levels["思考行动"] =
      sig.attempt == null && sig.prep == null
        ? null
        : sig.attempt != null && high(sig.attempt)
          ? 3
          : sig.prep != null && high(sig.prep) && (sig.attempt == null || low(sig.attempt))
            ? 1
            : 2;
    levels["精力恢复"] =
      sig.spare == null && sig.restStolen == null
        ? null
        : (sig.spare != null && veryLow(sig.spare)) || (sig.restStolen != null && high(sig.restStolen))
          ? 1
          : sig.spare != null && high(sig.spare)
            ? 3
            : 2;
    levels["关系意义"] =
      sig.selfChoice == null && sig.othersFirst == null
        ? null
        : sig.selfChoice != null && midHigh(sig.selfChoice)
          ? 3
          : sig.othersFirst != null && high(sig.othersFirst) && (sig.selfChoice == null || low(sig.selfChoice))
            ? 1
            : 2;
    levels["工作方向"] =
      sig.switchDir == null && sig.multiGoal == null
        ? null
        : (sig.switchDir != null && high(sig.switchDir)) || (sig.multiGoal != null && high(sig.multiGoal))
          ? 1
          : 2;

    var phase = pickPhase(sig);
    var persona = PERSONAS[state.persona] || PERSONAS.career;
    var pack = buildContentPack(persona, phase, sig, levels, evidence);

    return {
      sig: sig,
      levels: levels,
      evidence: evidence,
      phase: phase,
      persona: persona,
      seen: pack.seen,
      situation: pack.situation,
      todayStep: pack.todayStep,
      punch: pack.punch,
      cite: pack.cite,
      blocks: pack.blocks,
    };
  }

  function pickPhase(sig) {
    var candidates = [];
    if (high(sig.switchDir) && (sig.attempt == null || low(sig.attempt))) {
      candidates.push({ p: PHASES.fork, w: 3 });
    }
    if (high(sig.prep) && (sig.attempt == null || low(sig.attempt))) {
      candidates.push({ p: PHASES.prep, w: 3 });
    }
    if (high(sig.multiGoal) && (low(sig.spare) || high(sig.restStolen) || midHigh(sig.multiGoal))) {
      candidates.push({ p: PHASES.multi, w: 3 });
    }
    if ((veryLow(sig.spare) || (sig.spare != null && low(sig.spare))) && high(sig.restStolen)) {
      candidates.push({ p: PHASES.spare, w: 2 });
    }
    if (high(sig.othersFirst) && (sig.selfChoice == null || low(sig.selfChoice))) {
      candidates.push({ p: PHASES.selfLast, w: 2 });
    }
    if (midHigh(sig.attempt) && !high(sig.multiGoal) && !high(sig.switchDir)) {
      candidates.push({ p: PHASES.trial, w: 2 });
    }

    var usable = Object.keys(sig).filter(function (k) {
      return sig[k] != null;
    }).length;
    if (usable < 3 && candidates.length === 0) return PHASES.unclear;
    if (candidates.length === 0) {
      if (midHigh(sig.attempt)) return PHASES.trial;
      if (high(sig.multiGoal)) return PHASES.multi;
      if (high(sig.switchDir) || high(sig.prep)) return PHASES.fork;
      return PHASES.unclear;
    }
    candidates.sort(function (a, b) {
      return b.w - a.w;
    });
    return candidates[0].p;
  }

  function buildContentPack(persona, phase, sig, levels, evidence) {
    var isSide = persona.id === "side";
    var punch = persona.punchDefault;
    var todayStep;
    var seen;
    var situation;

    if (phase.id === "fork") {
      seen = "被说中：你这两周反复比较几个方向，能用来判断的亲身反馈还不够。";
      situation =
        "你这两周更像：**" +
        phase.name +
        "**。你反复比较几个方向，还没有完成一次能带回新信息的小尝试。先给选择补一条亲身反馈，会让下一次比较更具体。";
      todayStep = isSide
        ? "把正在推进的方向各写一行，只圈出本周最想留下的一个小成果；选一项尚未承诺的新任务移到下周。"
        : "打开一份感兴趣的岗位介绍，圈出一项日常任务；写下一个能用 15 分钟体验它的小动作。";
      punch = isSide ? persona.punchDefault : "先试一个方向，不必今晚决定去留。";
    } else if (phase.id === "prep") {
      seen = "被说中：准备一直在继续，第一次验证还没有落地。";
      situation =
        "你这两周更像：**" +
        phase.name +
        "**。你查过不少资料，却还没亲手试过其中一件事。今天可以先把尝试缩到 15 分钟。";
      todayStep = isSide
        ? "打开保留项目，用 15 分钟完成一个看得见的部分，如脚本开头、样品照片或一页服务介绍。"
        : "用 10 分钟写下最近一次特别想换工作的具体时刻；在任务、合作方式、工作时间、收入中，只圈出这次最想改变的一项。";
      punch = "先把尝试缩到 15 分钟，再决定要不要继续准备。";
    } else if (phase.id === "multi") {
      seen = "被说中：忙完必须做的事，最想留下的成果经常被挤到后面。";
      situation =
        "你这两周更像：**" +
        phase.name +
        "**。你已经开始尝试，但几件事同时推进，最想留下的成果经常被挤到后面。先给一个小成果留出位置。";
      todayStep =
        "把项目各写一行，圈出本周要留下的一个小成果；暂缓一项尚未承诺给他人的新增任务。";
      punch = persona.punchDefault;
    } else if (phase.id === "spare") {
      seen = "被说中：必须做的事占满了最近的精力，原定休息也常被占用。";
      situation =
        "你这两周更像：**" +
        phase.name +
        "**。忙完必要事务后余量很少。本月安排要有上限，把行动缩小，而不是再加一条线。";
      todayStep = "今晚先不加新计划；把手里这一件缩成 5–10 分钟也能动手的开头。";
      punch = "今晚先不加新计划，把手里这一件缩小一点。";
    } else if (phase.id === "selfLast") {
      seen = "被说中：日程里可能少了一块由你决定用途的时间。";
      situation =
        "你这两周更像：**" +
        phase.name +
        "**。你常把原本留给自己的时间改成回应别人的安排。今天先给一件自选的小事留 15 分钟。";
      todayStep = "在接下来两天选 15 分钟，散步、听一首完整的歌或翻几页想看的书；只做其中一件，不要求产出。";
      punch = "我的日程里，也该有一件我想做的事。";
    } else if (phase.id === "trial") {
      seen = "被说中：你已经做了一些尝试，眼下需要看清哪些值得继续。";
      situation =
        "你这两周更像：**" +
        phase.name +
        "**。已经有实际小尝试。接下来留下一条反馈，再决定继续、缩小还是换一个问题。";
      todayStep = isSide
        ? "检查最近一份小样，或收集一次实际反馈，只改一个地方；写下愿不愿意再给它一次时间。"
        : "根据最近一次小体验，写下「愿不愿意再做一次」和一条理由；月底前只加深这一条。";
      punch = "留下一条反馈，再决定下一步。";
    } else {
      seen = "这次回答呈现了几种不同情况，暂时不适合用一个相位概括。";
      situation =
        "我们先保留最清楚的一条观察：按你选过的题目，先挑一件最想理清的小事，写下今天能核实的一个问题。";
      todayStep = "选一件最想理清的小事，只写下一个今天能核实的问题（不知道的写「待核实」）。";
      punch = "先认出一件事，再走下一小步。";
    }

    var citeParts = [];
    QUESTIONS.forEach(function (q) {
      var a = state.answers[q.id];
      if (a && !a.na) citeParts.push(q.id.toUpperCase() + "「" + a.label + "」");
    });
    var cite =
      citeParts.length > 0
        ? "判断依据摘录：" + citeParts.slice(0, 4).join("；") + "。" + phase.hedge + "。"
        : "本次部分题目选择了「不适用或记不清」，对应维度显示「本次信息不足」。" + phase.hedge + "。";

    return {
      seen: seen,
      situation: situation,
      todayStep: { text: todayStep, minutes: 15, short: todayStep.slice(0, 28) },
      punch: punch,
      cite: cite,
      blocks: buildBlocks(persona, phase, sig, levels, evidence, todayStep),
    };
  }

  function levelLine(dim, level) {
    if (!level) return "<strong>" + escapeHtml(dim) + "：</strong>本次信息不足。";
    var map = {
      思考行动: {
        1: "准备较多或尝试尚未落地；这月先增加一次具体反馈。",
        2: "准备与尝试各有一些；保持一次可检查的小动作即可。",
        3: "已有能带回信息的小尝试，可以从现有内容继续。",
      },
      精力恢复: {
        1: "余量较少，或休息常被挤占；本月安排要有上限。",
        2: "余量一般；可以从短任务开始，不必每天安排。",
        3: "仍有一些可用余量；记得保留休息，不把余量填满。",
      },
      关系意义: {
        1: "个人时间常让给他人安排，自选小事较少；先留 15 分钟自选时间。",
        2: "自选与回应他人安排并存；保留一块由你决定用途的时间。",
        3: "你也做过自己选择的小事，这部分时间值得保留。",
      },
      工作方向: {
        1: "方向来回换或多目标挤压重点；先收窄到一两个再补信息。",
        2: "方向线索一般；本周只明确先试哪一件。",
        3: "重点相对清楚；用一次反馈决定是否继续。",
      },
    };
    return "<strong>" + escapeHtml(dim) + "：</strong>" + (map[dim][level] || "");
  }

  function buildBlocks(persona, phase, sig, levels, evidence, todayStep) {
    var isSide = persona.id === "side";
    var overview;
    var mechanism;
    var weeks;
    var reduce;
    var review;

    if (isSide || phase.id === "multi") {
      overview =
        "<p>你已经投入过行动。接下来 30 天，先让一个项目得到连续但有限的尝试时间，留下一份能检查的成果，再决定继续多少。其他想法可以暂存。</p>";
      mechanism =
        "<p>主卡点是同时推进的目标太多；次因素是可用余量偏少或休息被挤占。两者可能互相加重：事情越多，越难连续完成；未完成的事又继续占着下一晚。请核对这是否符合你最近的情况。先减少新增任务，给一项已有尝试连续的位置。</p>";
      weeks = [
        ["第 1–7 天", "写出各项目下一份最小成果，根据目标与现有时间，保留一个本月重点。", "一张「保留／暂缓」清单。"],
        ["第 8–14 天", "给保留项目安排两次 15 分钟，完成第一份小样。", "一份可检查的内容或样品。"],
        ["第 15–21 天", "检查小样，或收集一次实际反馈，只改一个地方。", "一条反馈与一次修改。"],
        ["第 22–30 天", "核对实际用时、完成情况与继续意愿。", "写明继续、缩小或暂停及理由。"],
      ];
      reduce =
        "<ul><li>优先履行已经答应的交付。</li><li>先不新开项目，不为没用上的工具增加学习任务。</li><li>把暂缓事项放到月底再看，不要求每天重新决定。</li></ul>";
      review =
        "<p>每次回看只问：留下了什么？实际用了多少时间？下周还愿意给它多少时间？没做成时记录被什么挤掉，再减少范围。月底再测，看看重点是否更少被挤占，不以项目数量给自己打分。</p>";
    } else {
      overview =
        "<p>你已经花时间为下一步做准备。接下来一个月，值得优先完成的是一次小验证：挑一个候选方向，了解它每天实际做什么，再试做其中的一小部分。关于去留，可以等新信息出现后再判断。</p>" +
        "<p>先补这张对照表（内容由你填写）：</p>" +
        "<table><thead><tr><th>我想改变的一项</th><th>我想保留的一项</th></tr></thead><tbody><tr><td>______</td><td>______</td></tr></tbody></table>";
      mechanism =
        "<p>主卡点是几个方向迟迟没有排出先试顺序；次卡点是准备尚未转成实际体验。一个可能的循环是：缺少体验，让比较一直依赖想象；比较越久，又越难开始。请核对这是否符合你最近的情况。本月先用一个小样打断这次反复。</p>";
      weeks = [
        ["第 1–7 天", "结合改变项与保留项，选两个岗位，各抄下三项日常任务，圈一项想了解的任务。", "一张两列对照。"],
        ["第 8–14 天", "选其中一项任务，用 20 分钟做一个最小样例。", "留下一份样例与一句「愿不愿意再做」。"],
        ["第 15–21 天", "找一份实际从业说明，或向有经验的人核实一个具体问题。", "核实一个问题，记下与原先判断一致或不同的地方。"],
        ["第 22–30 天", "根据这次体验与新信息，决定继续了解哪条、暂缓哪条。", "一个选择与一条理由。"],
      ];
      reduce =
        "<ul><li>这月先暂停没有明确用途的新课程。</li><li>把新增方向记在旁边，不立即同时启动。</li><li>保留现有工作中的必要事项；暂缓项目在月底统一回看。</li></ul>";
      review =
        "<p>第 7、14、30 天各回看一次：我实际做了什么？增加了什么信息？下一步要继续、缩小还是换一个问题？月底若愿意再测，比较的是最近两周的做事方式，不看「升到哪一层」。</p>";
    }

    if (phase.id === "spare") {
      reduce =
        "<ul><li>今晚先不加新计划。</li><li>把手头任务缩成 5 分钟开头。</li><li>保留必要工作与已作出的承诺；可选新增一律暂缓到余量回来。</li></ul>";
    }

    var snap =
      "<ul>" +
      DIMS.map(function (d) {
        return "<li>" + levelLine(d, levels[d]) + "</li>";
      }).join("") +
      "</ul>";

    var weekHtml =
      "<table><thead><tr><th>时间</th><th>本周只推进的事</th><th>完成标志</th></tr></thead><tbody>" +
      weeks
        .map(function (w) {
          return (
            "<tr><td>" +
            escapeHtml(w[0]) +
            "</td><td>" +
            escapeHtml(w[1]) +
            "</td><td>" +
            escapeHtml(w[2]) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table>" +
      "<p>忙的时候，把试做缩成 5 分钟的开头；月底仍拿不到足够信息，可以继续验证，不急于得出结论。</p>" +
      "<p><strong>今天一步：</strong>" +
      escapeHtml(todayStep) +
      "</p>";

    var evBits = [];
    DIMS.forEach(function (d) {
      if (evidence[d] && evidence[d].length) evBits.push(evidence[d].slice(0, 2).join("、"));
    });

    return [
      {
        title: "1. 总览",
        html:
          overview +
          "<p class=\"cite\">依据摘录：" +
          escapeHtml(evBits.slice(0, 2).join("；") || "见各题选项") +
          "。</p>",
      },
      { title: "2. 四维快照", html: snap },
      { title: "3. 主/次卡点", html: mechanism },
      { title: "4. 30 天行动", html: weekHtml },
      { title: "5. 减负", html: reduce },
      { title: "6. 复盘与再测", html: review },
    ];
  }

  function applyPersonaLanding() {
    var p = PERSONAS[state.persona] || PERSONAS.career;
    $("#landing-h1").textContent = p.h1;
    $("#landing-lead").textContent = p.lead;
    $("#btn-start").textContent = p.cta;
    $("#landing-brand-sub").textContent = p.name + " · 免费完整地图 · " + VERSION;
  }

  function renderQuiz() {
    var q = QUESTIONS[state.qIndex];
    var total = QUESTIONS.length;
    var n = state.qIndex + 1;
    $("#progress-label").textContent = "第 " + n + " / " + total + " 题";
    $("#progress-feel").textContent = PROGRESS_FEEL[state.qIndex] || "";
    $("#progress-fill").style.width = Math.round((n / total) * 100) + "%";
    $("#q-label").textContent = "Q" + n;
    $("#q-title").textContent = q.title;
    var p = PERSONAS[state.persona];
    $("#q-hint").textContent = q.hint + (p ? " " + p.exampleHint : "");
    $("#micro-echo").hidden = true;

    var box = $("#options");
    box.innerHTML = "";
    var prev = state.answers[q.id];
    FREQ_OPTS.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt" + (prev && prev.id === opt.id ? " selected" : "");
      btn.textContent = opt.label;
      btn.addEventListener("click", function () {
        state.answers[q.id] = {
          id: opt.id,
          label: opt.label,
          days: opt.days,
          na: !!opt.na,
        };
        $$("#options .opt").forEach(function (b) {
          b.classList.remove("selected");
        });
        btn.classList.add("selected");
        setTimeout(function () {
          nextQuestion();
        }, 180);
      });
      box.appendChild(btn);
    });

    $("#quiz-next-wrap").style.display = "none";
    $("#btn-quiz-back").style.visibility = state.qIndex === 0 ? "hidden" : "visible";
  }

  function nextQuestion() {
    if (state.qIndex >= QUESTIONS.length - 1) {
      finishQuiz();
      return;
    }
    state.qIndex += 1;
    renderQuiz();
  }

  function prevQuestion() {
    if (state.qIndex <= 0) return;
    state.qIndex -= 1;
    renderQuiz();
  }

  function finishQuiz() {
    for (var i = 0; i < QUESTIONS.length; i++) {
      if (!state.answers[QUESTIONS[i].id]) {
        showToast("还有题目未作答");
        state.qIndex = i;
        renderQuiz();
        return;
      }
    }
    state.result = scoreAnswers(state.answers);
    renderSummary();
    showScreen("summary");
  }

  function renderSummary() {
    var r = state.result;
    $("#sum-seen").textContent = r.seen;
    $("#sum-phase").textContent = r.phase.name;
    $("#sum-phase").className = "phase-chip phase-" + (r.phase.token || "stable");
    $("#sum-situation").innerHTML = r.situation.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    $("#sum-today").innerHTML = "<strong>今天一步：</strong>" + escapeHtml(r.todayStep.text);
    $("#sum-cite").textContent = r.cite;
  }

  function renderReport() {
    var r = state.result;
    var brand = $("#report-brand");
    if (brand) brand.className = "brand report-brand phase-bar-" + (r.phase.token || "stable");
    var nav = $("#report-nav");
    var body = $("#report-blocks");
    nav.innerHTML = "";
    body.innerHTML = "";
    r.blocks.forEach(function (b, i) {
      var nb = document.createElement("button");
      nb.type = "button";
      nb.textContent = b.title.replace(/^\d+\.\s*/, "");
      nb.className = i === 0 ? "active" : "";
      nb.addEventListener("click", function () {
        selectBlock(i);
      });
      nav.appendChild(nb);

      var sec = document.createElement("section");
      sec.className = "report-block card" + (i === 0 ? " active" : "");
      sec.dataset.index = String(i);
      sec.innerHTML = "<h2>" + escapeHtml(b.title) + '</h2><div class="body">' + b.html + "</div>";
      body.appendChild(sec);
    });
    renderShareCard();
  }

  function renderShareCard() {
    var r = state.result;
    $("#sc-phase-name").textContent = "我这两周更像：" + r.phase.name;
    var punch = r.punch || r.phase.oneLiner;
    if (punch.length > 32) punch = punch.slice(0, 32);
    $("#sc-punch").textContent = punch;
    var action = r.todayStep.short || r.todayStep.text;
    if (action.length > 36) action = action.slice(0, 36) + "…";
    $("#sc-action").textContent = "今天一步：" + action;
    $("#sc-foot").textContent = "阶段地图｜也去标一下你的坐标 → · 免费";
  }

  function shareText() {
    var r = state.result;
    return (
      "阶段地图\n我这两周更像：" +
      r.phase.name +
      "\n" +
      r.punch +
      "\n今天一步：" +
      r.todayStep.text +
      "\n近期自我梳理参考 · 免费"
    );
  }

  function selectBlock(i) {
    $$("#report-nav button").forEach(function (b, idx) {
      b.classList.toggle("active", idx === i);
    });
    $$("#report-blocks .report-block").forEach(function (s, idx) {
      s.classList.toggle("active", idx === i);
    });
  }

  function saveInsight() {
    var entry = {
      at: new Date().toISOString(),
      version: VERSION,
      persona: state.persona,
      phase: state.result && state.result.phase && state.result.phase.name,
      seen: $("#insight-seen").value || null,
      share: $("#insight-share").value || null,
      note: ($("#insight-note").value || "").trim() || null,
    };
    var list = [];
    try {
      list = JSON.parse(localStorage.getItem(INSIGHT_KEY) || "[]");
      if (!Array.isArray(list)) list = [];
    } catch (e) {
      list = [];
    }
    list.push(entry);
    try {
      localStorage.setItem(INSIGHT_KEY, JSON.stringify(list));
      showToast("已保存到本机（不上传）");
      $("#insight-meta").textContent =
        "已保存 " + list.length + " 条到本机。外链表单：" + (FORM_URL || "待定（FORM_URL）") + "。";
    } catch (e2) {
      showToast("本机保存失败（可能无痕模式）");
    }
    return entry;
  }

  function bind() {
    $$(".persona-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.persona = btn.getAttribute("data-persona") || "career";
        applyPersonaLanding();
        var agree = $("#agree");
        agree.checked = false;
        $("#btn-start").disabled = true;
        showScreen("landing");
      });
    });

    $("#btn-back-chooser").addEventListener("click", function () {
      showScreen("chooser");
    });

    var agree = $("#agree");
    var start = $("#btn-start");
    agree.addEventListener("change", function () {
      start.disabled = !agree.checked;
    });
    start.addEventListener("click", function () {
      if (!agree.checked) return;
      state.qIndex = 0;
      state.answers = {};
      state.result = null;
      showScreen("quiz");
      renderQuiz();
    });

    $("#btn-quiz-back").addEventListener("click", prevQuestion);
    $("#btn-quiz-next").addEventListener("click", nextQuestion);

    $("#btn-expand").addEventListener("click", function () {
      renderReport();
      showScreen("report");
      document.body.classList.add("map-unlocked");
      setTimeout(function () {
        document.body.classList.remove("map-unlocked");
      }, 1200);
      showToast("地图已展开（免费）");
    });

    $("#btn-restart").addEventListener("click", function () {
      state.qIndex = 0;
      state.answers = {};
      state.result = null;
      agree.checked = false;
      start.disabled = true;
      $("#insight-seen").value = "";
      $("#insight-share").value = "";
      $("#insight-note").value = "";
      showScreen("chooser");
    });

    $("#btn-copy-share").addEventListener("click", function () {
      var t = shareText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(
          function () {
            showToast("分享文案已复制");
          },
          function () {
            showToast("复制失败，请手动选择分享卡");
          }
        );
      } else {
        showToast("请长按分享卡手动复制");
      }
    });

    $("#btn-save-insight").addEventListener("click", function () {
      saveInsight();
    });
    $("#btn-copy-insight").addEventListener("click", function () {
      var entry = saveInsight();
      var raw = JSON.stringify(entry, null, 2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(raw).then(
          function () {
            showToast("反馈 JSON 已复制");
          },
          function () {
            showToast("复制失败");
          }
        );
      }
      if (FORM_URL) {
        window.open(FORM_URL, "_blank", "noopener");
      }
    });

    $("#link-help").addEventListener("click", function (e) {
      e.preventDefault();
      $("#help-modal").classList.add("show");
    });
    $("#link-privacy").addEventListener("click", function (e) {
      e.preventDefault();
      $("#privacy-modal").classList.add("show");
    });
    $("#btn-close-help").addEventListener("click", function () {
      $("#help-modal").classList.remove("show");
    });
    $("#btn-close-privacy").addEventListener("click", function () {
      $("#privacy-modal").classList.remove("show");
    });
    $("#help-modal").addEventListener("click", function (e) {
      if (e.target.id === "help-modal") $("#help-modal").classList.remove("show");
    });
    $("#privacy-modal").addEventListener("click", function (e) {
      if (e.target.id === "privacy-modal") $("#privacy-modal").classList.remove("show");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bind();
    showScreen("chooser");
    try {
      console.info("[stage-map]", VERSION, { formUrl: FORM_URL || "(TBD)" });
    } catch (e) {}
  });
})();
