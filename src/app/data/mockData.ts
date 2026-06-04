export const users = {
  1: {
    id: 1,
    name: "王丽丽",
    avatar: "https://images.unsplash.com/photo-1761933808230-9a2e78956daa?auto=format&fit=crop&q=80&w=300",
    bio: "疯狂植物与宠物爱好者 🌿🐶",
    followers: 1204,
    following: 45,
    pets: [
      { name: "贝利", breed: "金毛", avatar: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150" },
      { name: "咪咪", breed: "布偶猫", avatar: "https://images.unsplash.com/photo-1586289883499-f11d28aaf52f?auto=format&fit=crop&q=80&w=150" },
    ],
  },
  2: {
    id: 2,
    name: "陈小波",
    avatar: "https://images.unsplash.com/photo-1536548665027-b96d34a005ae?auto=format&fit=crop&q=80&w=300",
    bio: "只是个爱猫的人",
    followers: 89,
    following: 120,
    pets: [
      { name: "小橘", breed: "橘猫", avatar: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=150" },
    ],
  },
  3: {
    id: 3,
    name: "张小花",
    avatar: "https://images.unsplash.com/photo-1615464670798-6e92fafa2a89?auto=format&fit=crop&q=80&w=300",
    bio: "八哥犬选择了我的生活",
    followers: 567,
    following: 342,
    pets: [
      { name: "八哥", breed: "八哥犬", avatar: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=150" },
    ],
  },
  4: {
    id: 4,
    name: "李大伟",
    avatar: "https://images.unsplash.com/photo-1536548665027-b96d34a005ae?auto=format&fit=crop&q=80&w=300",
    bio: "带着哈士奇户外探险",
    followers: 231,
    following: 45,
    pets: [
      { name: "二哈", breed: "哈士奇", avatar: "https://images.unsplash.com/photo-1489924034176-2e678c29d4c6?auto=format&fit=crop&q=80&w=150" },
      { name: "小白", breed: "萨摩耶", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" },
    ],
  },
  5: {
    id: 5,
    name: "赵小美",
    avatar: "https://images.unsplash.com/photo-1761933808230-9a2e78956daa?auto=format&fit=crop&q=80&w=300",
    bio: "泰迪妈妈 🐩",
    followers: 890,
    following: 12,
    pets: [
      { name: "球球", breed: "泰迪", avatar: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?auto=format&fit=crop&q=80&w=150" },
    ],
  }
};

export const nearbyUsers = [
  { ...users[4], distance: "500m", petBreed: "哈士奇" },
  { ...users[5], distance: "1.2km", petBreed: "泰迪" },
  { ...users[2], distance: "2.5km", petBreed: "布偶猫" }
];

export const breeds = [
  {
    id: "golden-retriever",
    name: "金毛",
    enName: "Golden Retriever",
    icon: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=800",
    description: "性格温顺，聪明听话，是极佳的家庭伴侣犬。"
  },
  {
    id: "corgi",
    name: "柯基",
    enName: "Corgi",
    icon: "https://images.unsplash.com/photo-1668757183096-bc55a8992558?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1668757183096-bc55a8992558?auto=format&fit=crop&q=80&w=800",
    description: "短腿大屁股，精力充沛，曾经是英国王室的爱犬。"
  },
  {
    id: "ragdoll",
    name: "布偶猫",
    enName: "Ragdoll",
    icon: "https://images.unsplash.com/photo-1586289883499-f11d28aaf52f?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1586289883499-f11d28aaf52f?auto=format&fit=crop&q=80&w=800",
    description: "脾气极好，被人抱起时会像布偶一样全身放松。"
  },
  {
    id: "poodle",
    name: "泰迪",
    enName: "Poodle",
    icon: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?auto=format&fit=crop&q=80&w=800",
    description: "聪明活泼，不掉毛，是很受欢迎的城市伴侣犬。"
  },
  {
    id: "husky",
    name: "哈士奇",
    enName: "Husky",
    icon: "https://images.unsplash.com/photo-1489924034176-2e678c29d4c6?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1489924034176-2e678c29d4c6?auto=format&fit=crop&q=80&w=800",
    description: "精力旺盛，有着狼一样的外表和二哈的灵魂。"
  },
  {
    id: "shiba",
    name: "柴犬",
    enName: "Shiba Inu",
    icon: "https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?auto=format&fit=crop&q=80&w=800",
    description: "固执又可爱的日本国宝级犬种，表情包大户。"
  },
  {
    id: "pug",
    name: "八哥犬",
    enName: "Pug",
    icon: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=800",
    description: "满脸褶皱，呼噜声很大，非常亲人。"
  },
  {
    id: "kitten",
    name: "幼猫",
    enName: "Kitten",
    icon: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=800",
    description: "任何品种的小奶猫，可爱到让人无法拒绝。"
  }
];

export const posts = [
  {
    id: 1,
    userId: 1,
    time: "2小时前",
    breedId: "golden-retriever",
    breed: "金毛",
    location: "阳光公园",
    images: [
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1668757183096-bc55a8992558?auto=format&fit=crop&q=80&w=800"
    ],
    description: "今天在公园玩得太开心了！贝利非常乖，还交到了一个柯基新朋友。🐾☀️",
    likes: 342,
    comments: 12,
    shares: 5,
    isLiked: true,
    isCollected: false
  },
  {
    id: 2,
    userId: 2,
    time: "5小时前",
    breedId: "kitten",
    breed: "猫咪",
    location: "温馨的家",
    images: [
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=800"
    ],
    description: "欢迎家里最小的新成员！还在想名字... 大家有什么建议吗？🐱❤️",
    likes: 891,
    comments: 45,
    shares: 12,
    isLiked: false,
    isCollected: true
  },
  {
    id: 3,
    userId: 3,
    time: "1天前",
    breedId: "pug",
    breed: "八哥犬",
    location: "市中心咖啡馆",
    images: [
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=800"
    ],
    description: "不知道他是在享受咖啡时光，还是单纯在等我掉面包屑... 😂☕️",
    likes: 124,
    comments: 8,
    shares: 2,
    isLiked: false,
    isCollected: false
  },
  {
    id: 4,
    userId: 1,
    time: "2天前",
    breedId: "ragdoll",
    breed: "布偶猫",
    location: "客厅",
    images: [
      "https://images.unsplash.com/photo-1586289883499-f11d28aaf52f?auto=format&fit=crop&q=80&w=800"
    ],
    description: "周日下午的氛围。彻底放松。☁️💤",
    likes: 56,
    comments: 2,
    shares: 1,
    isLiked: true,
    isCollected: true
  },
  {
    id: 5,
    userId: 4,
    time: "3天前",
    breedId: "husky",
    breed: "哈士奇",
    location: "雪山",
    images: [
      "https://images.unsplash.com/photo-1489924034176-2e678c29d4c6?auto=format&fit=crop&q=80&w=800"
    ],
    description: "这是他的主场！迎来了今年的第一场雪。❄️🐺",
    likes: 450,
    comments: 21,
    shares: 30,
    isLiked: false,
    isCollected: false
  },
  {
    id: 6,
    userId: 5,
    time: "4天前",
    breedId: "poodle",
    breed: "泰迪",
    location: "宠物美容室",
    images: [
      "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?auto=format&fit=crop&q=80&w=800"
    ],
    description: "我的小公主剪了新发型！🎀",
    likes: 672,
    comments: 34,
    shares: 8,
    isLiked: true,
    isCollected: true
  },
  {
    id: 7,
    userId: 1,
    time: "5天前",
    breedId: "shiba",
    breed: "柴犬",
    location: "城市街道",
    images: [
      "https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?auto=format&fit=crop&q=80&w=800"
    ],
    description: "那个每次都能融化我心的经典柴犬微笑。😊",
    likes: 890,
    comments: 56,
    shares: 15,
    isLiked: false,
    isCollected: false
  }
];

export const comments = [
  {
    id: 1,
    postId: 1,
    userId: 2,
    text: "太可爱了！我们应该安排一起玩！",
    time: "1小时前",
    likes: 5,
    replies: [
      {
        id: 101,
        userId: 1,
        text: "好呀！下周末怎么样？",
        time: "45分钟前"
      }
    ]
  },
  {
    id: 2,
    postId: 1,
    userId: 3,
    text: "贝利长得好快呀！",
    time: "30分钟前",
    likes: 2,
    replies: []
  }
];

export const mapPreviewImage = "https://images.unsplash.com/photo-1584972191378-d70853fc47fc?auto=format&fit=crop&q=80&w=800";
