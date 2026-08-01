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
    drawButtonGenerating: "生成中...请稍候",
    streamingOption: "实时回应:",
    stopGeneration: "停止生成",
    copyButton: "复制",
    copyButtonCopied: "已复制！",
    copyButtonError: "错误！"
  },
  
  // Messages d'interprétation
  interpretation: {
    loading: "正在分析牌局...",
    loadingWithModel: "正在使用{model}分析牌局，由{persona}解读...",
    default: "抽牌后解读将显示在这里。",
    loadingError: "加载解读时出错",
    retry: "重试",
    cardTitle: "卡牌",
    questionTitle: "问题",
    noModelAvailable: "没有可用的AI模型",
    promptDisplay: "这是本应发送给AI的提示：",
    error: {
      general: "解读过程中发生错误。请重试。",
      noQuestion: "请在抽牌前输入问题",
      generationStopped: "生成已被用户停止",
      interpretationError: "解读过程中出错",
      api: "API错误: {0}"
    },
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
    useStandardPrompt: "使用标准提示以提高兼容性",
    modelUnavailable: "模型不可用",
    modelUnavailableDetails: "模型{modelName}不可用",
    error: "错误",
    checkConnection: "检查您的互联网连接",
    checkOllamaRunning: "Ollama未启动",
    checkNetworkConnection: "检查您的网络连接",
    checkOllama: "Ollama不可用",
    checkAPIKey: "检查您的API密钥",
    configureOpenAI: "添加API密钥",
    apiKeyMissing: "无法访问OpenAI API",
    apiKeyMissingDetails: "{modelName}需要API密钥",
    configureAPIKey: "配置API密钥",
    useLocalModel: "使用本地模型(Ollama)",
    refreshOllamaModels: "刷新Ollama模型列表",
    tryAgain: "重试",
    unexpectedError: "发生意外错误",
    pullModel: "通过'ollama pull'安装",
    selectDifferentModel: "选择不同的模型",
    modelMayBeLoading: "模型可能正在加载中",
    checkOllamaMemory: "检查您的系统是否有足够的内存",
    pullModelManually: "通过<a href='https://ollama.com/library' target='_blank'>ollama.com/library</a>安装",
    checkOllamaVersion: "检查您是否使用最新版本的Ollama",
    modelTooLarge: "模型可能对您的系统来说太大",
    ollamaUnavailable: "Ollama问题",
    noOllamaModels: "缺少模型",
    noOllamaModelsDetails: "安装Ollama模型",
    installModel: "通过<a href='https://ollama.com/library' target='_blank'>ollama.com</a>安装",
    selectModel: "选择模型"
  },
  
  // Meta prompt pour l'IA
  metaprompt: {
    base: `回答格式（400-450字，单条消息）：
- 使用表情符号和markdown格式化
- 融入心理学和象征意义，建立牌之间的联系
- 保持易懂，避免过度术语
- 以实用可行的建议结束
- 完全体现角色：风格、词汇、世界观`,
    
    emphasis: `⚠️ 必须：精确回答所提问题。
您解读的每个元素都必须阐明此问题的具体方面。`
  },
  
  // 连接消息
  connectivity: {
    connecting: "连接中...",
    connected: "已连接",
    disconnected: "已断开",
    error: "连接错误"
  },
  
  // 部分标题
  sections: {
    reading: "塔罗牌阵",
    interpretations: "解读"
  },
  
  // 配置
  config: {
    apiKeyTitle: "OpenAI API密钥配置",
    apiKeyDescription: "输入您的OpenAI API密钥以访问OpenAI模型。您的API密钥存储在本地浏览器中，永远不会被共享。",
    configureAPIKey: "配置API密钥",
    save: "保存",
    cancel: "取消",
    apiKeySaved: "API密钥保存成功",
    apiKeyEmpty: "API密钥不能为空"
  },
  
  // 消息
  messages: {
    ollamaConnected: "Ollama连接成功",
    modelAvailable: "模型可用",
    modelUnavailable: "模型不可用"
  },
  
  // 卡牌
  cards: {
    reversed: "逆位",
    closeHint: "✕ 点击关闭",
    major_arcana: {
      fool: "愚者",
      magician: "魔术师",
      high_priestess: "女祭司",
      empress: "皇后",
      emperor: "皇帝",
      hierophant: "教皇",
      lovers: "恋人",
      chariot: "战车",
      justice: "正义",
      hermit: "隐士",
      wheel_of_fortune: "命运之轮",
      strength: "力量",
      hanged_man: "倒吊者",
      death: "死神",
      temperance: "节制",
      devil: "恶魔",
      tower: "高塔",
      star: "星星",
      moon: "月亮",
      sun: "太阳",
      judgement: "审判",
      world: "世界",
      back: "卡牌背面"
    }
  }
};

export default zh; 