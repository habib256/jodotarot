/**
 * Traductions chinoises
 */

const zh = {
  // Titre de la page
  pageTitle: "十字塔罗牌阅读",
  appTitle: "JodoTarot:",
  
  // Éléments de l'en-tête
  header: {
    language: "语言：",
    persona: "角色：",
    cardSet: "牌组：",
    spreadType: "铺牌方式：",
    iaModel: "AI模型：",
    question: "您的问题：",
    questionPlaceholder: "输入您对此次塔罗牌阅读的问题...",
    drawButton: "抽牌",
    streamingOption: "实时回应:"
  },
  
  // Messages d'interprétation
  interpretation: {
    loading: "正在分析牌阵...",
    loadingWithModel: "正在使用{model}由{persona}解析十字牌阵...",
    default: "解读将在抽牌后显示在这里。",
    error: "解读过程中发生错误。请重试。",
    apiError: "API错误: {0}",
    apiWarning: "解读意外终止。以下是部分结果：",
    userQuestion: "用户提出的问题是：",
    userMessage: "我想要一个详细且个性化的十字塔罗牌阅读。请根据每张牌的位置分析其象征意义，并建立牌与牌之间的联系，提供一个连贯的解读，准确回应我的问题。",
    ollamaPromo: "下载 <a href='https://ollama.com' target='_blank'>ollama</a> 和 <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> 开始使用。刷新页面并进行您的牌阵",
    streamingResponse: "生成回应中",
    // Messages pour les cartes spécifiques
    loveCardsMeaning: {
      moon_bottomLeft: "「月亮」在感情位置揭示了深层的、有时混乱或矛盾的情感。探索你的内心世界，以更好地理解你真正的渴望。",
      sun_bottomRight: "「太阳」在近期未来位置预示着你的爱情生活将迎来一个繁荣和清晰的时期。新的光明机会正向你展开。"
    }
  },
  
  // Textes pour le prompt de tirage
  tarotReading: {
    intro: {
      cross: "这是为咨询者解读的十字牌阵：",
      horseshoe: "这是为咨询者解读的马蹄形牌阵：",
      love: "这是为咨询者解读的爱情塔罗牌阵：",
      celticCross: "这是为咨询者解读的凯尔特十字牌阵："
    },
    positions: {
      top: "上方",
      right: "右侧",
      bottom: "下方",
      left: "左侧",
      center: "中心",
      horseshoe1: "当前状况",
      horseshoe2: "挑战或障碍",
      horseshoe3: "近期过去",
      horseshoe4: "近期未来",
      horseshoe5: "外部影响",
      horseshoe6: "建议态度",
      horseshoe7: "可能结果",
      love1: "你自己",
      love2: "你的伴侣或爱慕对象",
      love3: "当前动态",
      love4: "关系中的挑战",
      love5: "外部影响",
      love6: "前进道路",
      love7: "可能结果",
      celticCross1: "当前状况",
      celticCross2: "挑战或障碍",
      celticCross3: "近期过去",
      celticCross4: "近期未来",
      celticCross5: "目标或理想",
      celticCross6: "过去的影响",
      celticCross7: "你对情况的态度",
      celticCross8: "外部影响",
      celticCross9: "希望或恐惧",
      celticCross10: "最终结果"
    }
  },
  
  // Personas et leurs descriptions
  personaGroups: {
    divinationArts: "🔮 占卜艺术",
    spiritualTraditions: "🕊️ 精神传统",
    esotericTraditions: "⚡ 密传传统",
    psychoanalysts: "🧠 精神分析家",
    philosophersSages: "📚 哲学家与智者",
    supernaturalEntities: "👻 超自然实体"
  },
  
  // AI模型组
  iaGroups: {
    ollama: "🧠 Ollama",
    openai: "🤖 OpenAI"
  },
  
  // 角色名称
  personas: {
    tarologue: "🎴 塔罗牌解读者",
    oracle: "🌟 神秘预言家",
    voyante: "🔮 吉普赛占卜师",
    pretre: "✝️ 圣经诠释牧师",
    rabbin: "✡️ 卡巴拉拉比",
    imam: "☪️ 苏菲伊玛目",
    dalailama: "☸️ 达赖喇嘛",
    sorciere: "🧙‍♀️ 古老女巫",
    alchimiste: "⚗️ 神秘炼金术士",
    mage: "🌌 元素法师",
    francmacon: "🏛️ 共济会大师",
    freud: "🛋️ 西格蒙德·弗洛伊德",
    jung: "🌓 卡尔·古斯塔夫·荣格",
    lacan: "🪞 雅克·拉康",
    dolto: "👶 弗朗索瓦丝·多尔托",
    socrate: "🏺 苏格拉底",
    salomon: "👑 所罗门王",
    montaigne: "✒️ 米歇尔·德·蒙田",
    quichotte: "🗡️ 堂吉诃德",
    demon: "😈 莫塔里恩",
    noegoman: "🧘 无我者"
  },
  
  // Types de tirages
  spreadTypes: {
    cross: "十字",
    horseshoe: "马蹄形",
    love: "爱情塔罗",
    celticCross: "凯尔特十字"
  },
  
  // Messages d'avertissement
  warnings: {
    connectionFailed: "连接错误",
    modelNotFound: "未找到模型",
    noConnection: "无法连接到{model}。请确保Ollama服务器正在运行。",
    suggestions: "建议：",
    checkRunning: "检查Ollama是否正在运行",
    installOllama: "从ollama.com安装Ollama",
    downloadModel: "使用以下命令下载模型：ollama pull {model}",
    useOpenAI: "使用OpenAI模型作为替代",
    customizePrompt: "自定义您的提示以获得更好的结果",
    useStandardPrompt: "使用标准提示以提高兼容性"
  },
  
  // Meta prompt pour l'IA
  metaprompt: {
    base: `必需格式（400-450字）：
1) 在一条消息中提供简洁完整的回答
2) 使用相关的塔罗主题表情符号来说明概念
3) 仅使用HTML格式：<h2>/<h3>标题，<em>/<strong>强调，<blockquote>引用，<ul>/<li>列表
4) 融入牌的心理和象征方面
5) 建立互补或对立的牌之间的联系
6) 避免过于深奥的术语，保持易懂
7) 以实用建议和行动建议结束
8) 不使用Markdown或纯文本标题。不要使用这种格式的标题：** **
9) 使用中文
10) 您必须完全体现所选角色的特点，使用其特定的风格、词汇和世界观`,
    
    emphasis: `重要提示：您的回答必须与这个问题直接且具体相关。
请专注于问题所精确询问的内容，并根据问题中提到的元素调整您的解读。
请勿提供泛泛而论的回答。
您解读的每个方面都应该回应问题的某个方面。`
  }
};

export default zh; 