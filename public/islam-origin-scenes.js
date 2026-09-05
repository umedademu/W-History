// 01 イスラーム教の成立と正統カリフ（16場面）
// 原文との対応・補正事項は docs/content-review.md を参照。

export const places = {
  "mecca": {
    "name": "メッカ",
    "point": [
      39.83,
      21.42
    ]
  },
  "medina": {
    "name": "メディナ",
    "point": [
      39.61,
      24.47
    ]
  },
  "damascus": {
    "name": "ダマスクス",
    "point": [
      36.29,
      33.51
    ]
  },
  "jerusalem": {
    "name": "エルサレム",
    "point": [
      35.21,
      31.77
    ]
  },
  "alexandria": {
    "name": "アレクサンドリア",
    "point": [
      29.92,
      31.2
    ]
  },
  "fustat": {
    "name": "フスタート",
    "point": [
      31.24,
      30
    ]
  },
  "basra": {
    "name": "バスラ",
    "point": [
      47.78,
      30.51
    ]
  },
  "kufa": {
    "name": "クーファ",
    "point": [
      44.4,
      32.03
    ]
  },
  "ctesiphon": {
    "name": "クテシフォン",
    "point": [
      44.58,
      33.09
    ]
  },
  "nihavand": {
    "name": "ニハーヴァンド",
    "point": [
      48.37,
      34.19
    ]
  },
  "siffin": {
    "name": "シッフィーン",
    "point": [
      38.5,
      35.8
    ]
  },
  "yemen": {
    "name": "イエメン",
    "point": [
      44.2,
      15.3
    ]
  }
};

export const zones = {
  "byzantine": {
    "color": "#54728c",
    "points": [
      [
        25,
        42
      ],
      [
        35,
        42
      ],
      [
        37,
        36
      ],
      [
        34,
        31
      ],
      [
        28,
        31
      ],
      [
        25,
        35
      ]
    ]
  },
  "sasanian": {
    "color": "#8b5648",
    "points": [
      [
        44,
        38
      ],
      [
        52,
        38
      ],
      [
        60,
        36
      ],
      [
        62,
        30
      ],
      [
        54,
        27
      ],
      [
        46,
        30
      ],
      [
        43,
        34
      ]
    ]
  },
  "islam_core": {
    "color": "#3a7d44",
    "points": [
      [
        38,
        28
      ],
      [
        42,
        28
      ],
      [
        44,
        22
      ],
      [
        41,
        19
      ],
      [
        37,
        21
      ]
    ]
  },
  "caliphate_expanded": {
    "color": "#43894e",
    "points": [
      [
        28,
        32
      ],
      [
        37,
        37
      ],
      [
        48,
        38
      ],
      [
        58,
        36
      ],
      [
        55,
        27
      ],
      [
        46,
        18
      ],
      [
        37,
        18
      ],
      [
        30,
        25
      ]
    ]
  }
};

export const scenes = [
  {
    "frame": [
      27,
      12.696000000000002,
      53,
      39.604
    ],
    "zones": [
      "byzantine",
      "sasanian"
    ],
    "pins": [
      "mecca",
      "medina",
      "damascus",
      "yemen"
    ],
    "routes": [
      {
        "points": [
          [
            44.2,
            15.3
          ],
          [
            39.83,
            21.42
          ],
          [
            39.61,
            24.47
          ],
          [
            36.29,
            33.51
          ]
        ],
        "kind": "trade"
      }
    ],
    "tags": [
      {
        "at": [
          30,
          37
        ],
        "text": "ビザンツ帝国"
      },
      {
        "at": [
          50,
          33
        ],
        "text": "ササン朝ペルシア"
      }
    ],
    "facts": [
      "交易路：紅海東岸の陸路",
      "中心都市：メッカ・ヤスリブ"
    ],
    "actors": [
      {
        "name": "アラブ商人",
        "image": "quraysh-merchant",
        "at": "mecca",
        "offset": [
          30,
          0
        ],
        "bubble": "メッカが大繁盛だ",
        "route": 0
      }
    ],
    "props": [],
    "duration": 3400,
    "id": "trade-route",
    "chapter": 0,
    "year": "6世紀後半",
    "kicker": "砂漠を行き交う隊商",
    "title": "交易路の変化で、\nメッカが繁栄する。",
    "body": [
      "ビザンツ帝国とササン朝ペルシアの抗争が続くなか、アラビア半島を通る隊商路の重要性が高まった。紅海沿岸からシリアへ、商人と品物が行き交う。",
      "その中継地が<strong>メッカ</strong>や<strong>ヤスリブ（後のメディナ）</strong>。メッカはカーバ聖殿への巡礼でも人を集め、商業と信仰の拠点になった。"
    ],
    "takeaway": "交易路と巡礼の拠点として、メッカが繁栄した。",
    "note": "メッカは古くからアラビア多神教の聖地でもあり、アラビア各地から巡礼者が集まる拠点でした。",
    "focus": "メッカと交易路",
    "mapHeading": "アラビア半島の隊商ルート",
    "before": "紅海沿岸からシリアへ、隊商が移動する",
    "after": "交易と巡礼が、メッカの繁栄を支える"
  },
  {
    "frame": [
      36.83,
      18.92,
      42.83,
      23.92
    ],
    "zones": [],
    "pins": [
      "mecca"
    ],
    "routes": [],
    "tags": [],
    "facts": [
      "支配部族：クライシュ族",
      "聖所：カーバ神殿（多神教偶像）"
    ],
    "actors": [
      {
        "name": "クライシュ族商人",
        "image": "quraysh-merchant",
        "at": "mecca",
        "offset": [
          -30,
          0
        ],
        "bubble": "富は我らのもの"
      }
    ],
    "props": [
      {
        "name": "カーバ神殿",
        "image": "kaaba-sanctuary",
        "at": "mecca",
        "kind": "prop",
        "offset": [
          32,
          0
        ],
        "size": 84
      }
    ],
    "duration": 1600,
    "id": "quraysh-greed",
    "chapter": 0,
    "year": "6世紀末〜7世紀初頭",
    "kicker": "富の独占と社会不安",
    "title": "クライシュ族が富を握り、\n貧富の格差が広がる。",
    "body": [
      "メッカでは<strong>クライシュ族</strong>の有力商人が交易を担い、富と発言力を持った。一方で貧富の差が広がり、孤児や貧しい人々の暮らしは不安定だった。",
      "部族の結びつきが社会を支えたが、部族間の対立もあった。ムハンマドの教えは、こうした社会で<strong>血縁や富を超えた人間のあり方</strong>を問いかけることになる。"
    ],
    "takeaway": "クライシュ族の富の独占 ＋ 多神教信仰 → 社会不安の増大。",
    "note": "カーバ聖殿はイスラーム成立以前からの聖所です。宗教と交易が結びついていたことを押さえましょう。",
    "focus": "メッカの社会矛盾",
    "mapHeading": "メッカの繁栄とカーバ神殿",
    "before": "交易を担う有力商人に富が集まる",
    "after": "繁栄の一方で、貧富の差が広がる",
    "capital": "mecca"
  },
  {
    "frame": [
      36.83,
      18.92,
      42.83,
      23.92
    ],
    "zones": [],
    "pins": [
      "mecca"
    ],
    "routes": [],
    "tags": [],
    "facts": [
      "誕生：570年頃・ハーシム家",
      "妻：ハディージャ",
      "啓示：610年頃"
    ],
    "actors": [
      {
        "name": "ハディージャ",
        "image": "khadija-merchant",
        "at": "mecca",
        "offset": [
          30,
          0
        ],
        "bubble": "あなたを信じます"
      }
    ],
    "props": [
      {
        "name": "教団の象徴",
        "image": "prophet-banner",
        "at": "mecca",
        "offset": [
          -30,
          0
        ],
        "kind": "prop",
        "size": 84
      }
    ],
    "duration": 1600,
    "id": "revelation",
    "chapter": 0,
    "year": "610年頃",
    "kicker": "ヒラー山での天啓",
    "title": "ムハンマドに、\n唯一神アッラーの啓示が下る。",
    "body": [
      "570年頃、クライシュ族のハーシム家に生まれた<strong>ムハンマド</strong>は、幼くして親を失い、後に隊商交易に携わった。商人<strong>ハディージャ</strong>と結婚する。",
      "イスラームの伝承では、610年頃にメッカ近郊のヒラー山で、天使ジブリールを通じて<strong>唯一神アッラーの啓示</strong>を受けた。ムハンマドはその言葉を人々に伝え始めた。"
    ],
    "takeaway": "610年頃・ムハンマドが唯一神アッラーの啓示を受ける。",
    "note": "イスラームではムハンマドは神ではなく預言者です。地図の旗は共同体を示す教材上の記号で、当時の旗の復元ではありません。",
    "focus": "預言者ムハンマド",
    "mapHeading": "ヒラー山とメッカ",
    "before": "瞑想の中で天使ジブリールが現れる",
    "after": "唯一神の言葉を人々に語り始める"
  },
  {
    "frame": [
      36.83,
      18.92,
      42.83,
      23.92
    ],
    "zones": [],
    "pins": [
      "mecca"
    ],
    "routes": [],
    "tags": [],
    "facts": [
      "経典：コーラン（アラビア語）",
      "教義：神の前の平等・最後の審判"
    ],
    "actors": [
      {
        "name": "アブー＝バクル",
        "image": "abu-bakr-calm",
        "at": "mecca",
        "offset": [
          28,
          0
        ],
        "bubble": "真理に従おう"
      }
    ],
    "props": [
      {
        "name": "イスラームの旗",
        "image": "prophet-banner",
        "at": "mecca",
        "offset": [
          -28,
          0
        ],
        "kind": "prop",
        "size": 84
      }
    ],
    "duration": 1600,
    "id": "quran-teachings",
    "chapter": 0,
    "year": "610年代",
    "kicker": "神の前での平等",
    "title": "コーランの教えは、\n偶像崇拝を否定し平等を説く。",
    "body": [
      "ムハンマドは唯一神アッラーへの信仰を説き、<strong>偶像崇拝を否定</strong>した。神の前では、家柄や財産によって人間の価値が決まるわけではない。",
      "人は<strong>最後の審判</strong>で信仰と行いを問われるとされ、困窮者への助けも重んじられた。啓示の言葉は、後に経典<strong>『コーラン（クルアーン）』</strong>としてまとめられる。"
    ],
    "takeaway": "コーランの教え＝唯一神信仰・偶像崇拝否定・神の前の平等・最後の審判。",
    "note": "アラビア語の原文が特別に重んじられます。各言語への翻訳もありますが、原文と同じものではなく意味の説明として扱われます。",
    "focus": "イスラームの教え",
    "mapHeading": "メッカに広がる新しい教え",
    "before": "偶像崇拝を捨て、神の前の平等を説く",
    "after": "虐げられた人々が信徒に加わる"
  },
  {
    "frame": [
      36.83,
      18.92,
      42.83,
      23.92
    ],
    "zones": [],
    "pins": [
      "mecca"
    ],
    "routes": [],
    "tags": [],
    "facts": [
      "六信：信じる内容",
      "預言者：モーセ・イエス・ムハンマドなど"
    ],
    "actors": [
      {
        "name": "敬虔な信徒",
        "image": "abu-bakr-calm",
        "at": "mecca",
        "offset": [
          30,
          0
        ],
        "bubble": "五行を実践する"
      }
    ],
    "props": [
      {
        "name": "イスラームの旗",
        "image": "prophet-banner",
        "at": "mecca",
        "offset": [
          -30,
          0
        ],
        "kind": "prop",
        "size": 84
      }
    ],
    "duration": 1600,
    "id": "faith-duties",
    "chapter": 0,
    "year": "教義の確立",
    "kicker": "信じる柱と行う義務",
    "title": "六信は、\n何を信じるかを示す。",
    "body": [
      "信じる内容を整理したものが<strong>六信</strong>。神・天使・諸経典・預言者・来世・天命の六つを指す。",
      "ムハンマドだけでなく、アブラハム、モーセ、イエスなども預言者として位置づけられる。ユダヤ教やキリスト教と、<strong>伝統を共有する面</strong>がある。"
    ],
    "takeaway": "六信＝神・天使・諸経典・預言者・来世・天命。",
    "note": "ここでは主にスンナ派の教義の整理を扱います。次の場面では信徒の実践である五行を見ます。",
    "focus": "信じる内容と日常の実践を分ける",
    "mapHeading": "メッカを中心とする信仰",
    "before": "信仰の内容を六つに整理する",
    "after": "六信が教義を理解する手がかりになる"
  },
  {
    "zones": [],
    "pins": [
      "mecca",
      "medina",
      "damascus"
    ],
    "routes": [
      {
        "points": [
          [
            36.29,
            33.51
          ],
          [
            39.61,
            24.47
          ],
          [
            39.83,
            21.42
          ]
        ],
        "kind": "move"
      }
    ],
    "tags": [],
    "facts": [
      "礼拝：一日五回、メッカの方角へ",
      "巡礼：可能な人が一生に一度"
    ],
    "actors": [
      {
        "name": "巡礼する信徒",
        "image": "arab-elder",
        "at": "damascus",
        "route": 0,
        "bubble": "聖地メッカへ"
      }
    ],
    "props": [
      {
        "name": "カーバ聖殿",
        "image": "kaaba-sanctuary",
        "at": "mecca",
        "kind": "prop"
      }
    ],
    "duration": 3400,
    "id": "five-practices",
    "chapter": 0,
    "year": "信徒の実践",
    "kicker": "日々の行いを知る",
    "title": "五行は、\n信仰を日々の行いにする。",
    "body": [
      "五行は<strong>信仰告白・礼拝・喜捨・断食・巡礼</strong>。一日五回メッカの方角へ礼拝し、喜捨を通して困窮者を助ける。",
      "ラマダーン月には原則として夜明けから日没まで飲食を断つ。経済面や健康面で可能な人は、一生に一度<strong>メッカ巡礼</strong>を行う。"
    ],
    "takeaway": "六信は「信じること」、五行は「実践すること」。",
    "note": "病気や旅行など、事情に応じた免除・延期の規定があります。すべての人が同じ条件で行うわけではありません。",
    "focus": "離れた土地の信徒がメッカに向く",
    "mapHeading": "礼拝の方角と巡礼の目的地",
    "before": "各地の信徒がメッカを目指す",
    "after": "共通の実践が、地域を超えて信徒を結ぶ",
    "frame": [
      33.29,
      18.92,
      42.83,
      36.01
    ]
  },
  {
    "frame": [
      36.61,
      18.92,
      42.83,
      26.97
    ],
    "zones": [],
    "pins": [
      "mecca",
      "medina"
    ],
    "routes": [
      {
        "points": [
          [
            39.83,
            21.42
          ],
          [
            39.7,
            23
          ],
          [
            39.61,
            24.47
          ]
        ],
        "kind": "move"
      }
    ],
    "tags": [],
    "facts": [
      "年代：622年（イスラーム暦元年）",
      "目的地：ヤスリブ（メディナ）"
    ],
    "actors": [
      {
        "name": "アブー＝バクル",
        "image": "abu-bakr-calm",
        "at": "medina",
        "offset": [
          28,
          0
        ],
        "bubble": "新天地で国を築く"
      }
    ],
    "props": [
      {
        "name": "教団の移動",
        "image": "prophet-banner",
        "at": "mecca",
        "route": 0,
        "offset": [
          -28,
          0
        ],
        "kind": "prop",
        "size": 84
      }
    ],
    "duration": 3400,
    "id": "hijra",
    "chapter": 1,
    "year": "622年",
    "kicker": "迫害を逃れて北へ",
    "title": "ヒジュラ（聖遷）により、\nメッカからメディナへ脱出。",
    "body": [
      "唯一神への信仰は、メッカの従来の宗教秩序を揺さぶった。有力者との対立が深まり、ムハンマドと信徒たちは迫害を受ける。",
      "622年、ムハンマドらは<strong>メッカからヤスリブ（メディナ）へ移住</strong>した。これが<strong>ヒジュラ（聖遷）</strong>。後に制定されるイスラーム暦では、この年を元年とする。"
    ],
    "takeaway": "622年・ヒジュラ（聖遷）＝ メッカからメディナへ。イスラーム暦元年。",
    "note": "ヤスリブは後に「預言者の町（メディナ）」と改称されました。",
    "focus": "ヒジュラ（聖遷）",
    "mapHeading": "メッカからメディナへの移動",
    "before": "迫害を逃れ、北のメディナへ脱出",
    "after": "622年がイスラーム暦の元年となる"
  },
  {
    "frame": [
      36.61,
      21.97,
      42.61,
      26.97
    ],
    "zones": [
      "islam_core"
    ],
    "pins": [
      "medina"
    ],
    "routes": [],
    "tags": [],
    "facts": [
      "共同体名：ウンマ",
      "指導者：ムハンマド（宗教＋政治＋軍事）"
    ],
    "actors": [
      {
        "name": "アリー",
        "image": "ali-calm",
        "at": "medina",
        "offset": [
          28,
          0
        ],
        "bubble": "共同体を守る"
      }
    ],
    "props": [
      {
        "name": "ウンマの旗",
        "image": "prophet-banner",
        "at": "medina",
        "offset": [
          -28,
          0
        ],
        "kind": "prop",
        "size": 84
      }
    ],
    "duration": 1600,
    "id": "ummah",
    "chapter": 1,
    "year": "622〜629年",
    "kicker": "信仰で結ばれた共同体",
    "title": "メディナで、\n教団共同体「ウンマ」を結成。",
    "body": [
      "メディナに移ったムハンマドは、血縁や部族の枠組みを超えた信仰の共同体「<strong>ウンマ</strong>」を組織した。",
      "ムハンマドは宗教の指導者にとどまらず、政治・軍事・裁判の最高指導者となり、教団国家としての基礎を固めてメッカ軍の攻撃を撃退していった。"
    ],
    "takeaway": "メディナでウンマ（教団共同体）を結成。政治・軍事も統合。",
    "note": "部族の争いをやめ、アッラーのもとで一つの共同体として結束したことが、その後の大躍進の原動力となりました。",
    "focus": "ウンマの成立",
    "mapHeading": "メディナの教団国家",
    "before": "血縁を超えた信徒の共同体をつくる",
    "after": "政治・軍事・宗教がひとつに統合",
    "capital": "medina"
  },
  {
    "frame": [
      36.61,
      18.92,
      42.83,
      26.97
    ],
    "zones": [
      "islam_core"
    ],
    "pins": [
      "mecca",
      "medina"
    ],
    "routes": [
      {
        "points": [
          [
            39.61,
            24.47
          ],
          [
            39.83,
            21.42
          ]
        ],
        "kind": "campaign"
      }
    ],
    "tags": [],
    "facts": [
      "630年：メッカ征服・偶像破壊",
      "632年：ムハンマド死去"
    ],
    "actors": [],
    "props": [
      {
        "name": "教団軍",
        "image": "prophet-banner",
        "at": "medina",
        "route": 0,
        "offset": [
          -30,
          0
        ],
        "kind": "prop",
        "size": 84
      },
      {
        "name": "カーバ神殿",
        "image": "kaaba-sanctuary",
        "at": "mecca",
        "kind": "prop",
        "offset": [
          32,
          0
        ],
        "size": 84
      }
    ],
    "duration": 3400,
    "id": "mecca-conquest",
    "chapter": 1,
    "year": "630・632年",
    "kicker": "聖地の奪還と預言者の死",
    "title": "メッカの聖所が、\n共同体の中心になる。",
    "body": [
      "メディナを拠点に勢力を広げたムハンマドは、630年に<strong>メッカをほぼ戦闘なしで征服</strong>した。故郷の聖所が、新しい共同体の中心へと変わる。",
      "カーバ聖殿の偶像は取り除かれ、唯一神への礼拝の聖地となった。アラビア半島の諸部族への影響力が広がるなか、632年にムハンマドが死去する。"
    ],
    "takeaway": "630年・メッカ無血開城 → カーバの偶像破壊。632年・ムハンマド死去。",
    "note": "ムハンマドの死後、共同体を誰が率いるかが課題になりました。次の場面から四代の正統カリフをたどります。",
    "focus": "メッカ奪回と偶像破壊",
    "mapHeading": "メッカへの凱旋と統合",
    "before": "メッカを無血開城させ偶像を破壊",
    "after": "メッカが礼拝の中心となり、632年にムハンマドが死去する",
    "capital": "medina"
  },
  {
    "frame": [
      36.61,
      18.92,
      42.83,
      26.97
    ],
    "zones": [
      "islam_core"
    ],
    "pins": [
      "medina",
      "mecca"
    ],
    "routes": [],
    "tags": [],
    "facts": [
      "初代カリフ：アブー＝バクル",
      "合議制で選ばれた「正統カリフ」"
    ],
    "actors": [
      {
        "name": "アブー＝バクル",
        "image": "abu-bakr-calm",
        "at": "medina",
        "offset": [
          -28,
          0
        ],
        "bubble": "共同体を守り抜く"
      },
      {
        "name": "アラブ戦士",
        "image": "arab-warrior",
        "at": "medina",
        "offset": [
          28,
          0
        ]
      }
    ],
    "props": [],
    "duration": 1600,
    "id": "abu-bakr",
    "chapter": 2,
    "year": "632〜634年",
    "kicker": "初代カリフの選出",
    "title": "アブー＝バクルが即位し、\n半島の離反部族を鎮圧する。",
    "body": [
      "預言者の死後、信徒たちの合議・選挙によって親友で岳父の<strong>アブー＝バクル</strong>が初代カリフ（後継者・代理人）に選ばれた。",
      "ムハンマドの死に乗じてアラビア各地で部族の反乱や偽預言者が蜂起したが、アブー＝バクルは断固として鎮圧し、半島の再統一を果たした。"
    ],
    "takeaway": "初代カリフ・アブー＝バクル。離反部族を鎮圧して半島を再統一。",
    "note": "初代から第四代までが正統カリフ時代（632〜661年）です。選出の方法は合議・前任者の指名など、各代で異なりました。",
    "focus": "初代アブー＝バクル",
    "mapHeading": "アラビア半島の再統一",
    "before": "預言者亡き後の反乱を鎮圧",
    "after": "初代カリフのもとで結束を取り戻す",
    "capital": "medina"
  },
  {
    "frame": [
      26.92,
      21.97,
      42.61,
      36.01
    ],
    "zones": [
      "caliphate_expanded"
    ],
    "pins": [
      "medina",
      "damascus",
      "jerusalem",
      "alexandria"
    ],
    "routes": [
      {
        "points": [
          [
            39.61,
            24.47
          ],
          [
            35.21,
            31.77
          ],
          [
            36.29,
            33.51
          ]
        ],
        "kind": "campaign"
      },
      {
        "points": [
          [
            35.21,
            31.77
          ],
          [
            29.92,
            31.2
          ]
        ],
        "kind": "campaign"
      }
    ],
    "tags": [],
    "facts": [
      "第2代カリフ：ウマル",
      "征服地：シリア・エジプト"
    ],
    "actors": [
      {
        "name": "ウマル",
        "image": "umar-march",
        "at": "medina",
        "route": 0,
        "offset": [
          -30,
          0
        ],
        "bubble": "ジハードを率いる"
      },
      {
        "name": "アラブ騎兵",
        "image": "arab-cavalry",
        "at": "damascus",
        "offset": [
          30,
          0
        ],
        "route": 1
      }
    ],
    "props": [],
    "duration": 3400,
    "id": "umar-expansion",
    "chapter": 2,
    "year": "634〜644年",
    "kicker": "領土の大拡大",
    "title": "第2代ウマルが、\nシリアとエジプトを征服。",
    "body": [
      "第2代カリフ<strong>ウマル</strong>の時代、アラブ軍はアラビア半島の外へ征服を広げた。長く戦争を続けていた二大帝国と衝突する。",
      "ビザンツ帝国から<strong>シリア</strong>を奪い、さらに<strong>エジプト</strong>へ進んだ。ダマスクスやアレクサンドリアなどの都市が、イスラーム勢力の支配下に入る。"
    ],
    "takeaway": "第2代ウマル：ビザンツからシリア・エジプトを奪う大躍進。",
    "note": "資料では遠征をジハード（聖戦）と関連づけています。ジハードには、信仰のための努力という広い意味もあります。ヒジュラ暦の制定もウマルの治世です。",
    "focus": "第2代ウマル",
    "mapHeading": "シリア・エジプトへの大進軍",
    "before": "メディナから北と西へ大遠征",
    "after": "シリア・エジプトをビザンツから奪取"
  },
  {
    "frame": [
      41.58,
      30.590000000000003,
      51.37,
      36.69
    ],
    "zones": [
      "caliphate_expanded"
    ],
    "pins": [
      "ctesiphon",
      "nihavand"
    ],
    "routes": [
      {
        "points": [
          [
            44.58,
            33.09
          ],
          [
            48.37,
            34.19
          ]
        ],
        "kind": "campaign"
      }
    ],
    "tags": [],
    "facts": [
      "合戦：ニハーヴァンドの戦い（642年）",
      "ササン朝滅亡（651年）"
    ],
    "actors": [
      {
        "name": "ウマル軍",
        "image": "umar-march",
        "at": "ctesiphon",
        "route": 0,
        "offset": [
          -30,
          0
        ],
        "bubble": "ペルシアを破った"
      },
      {
        "name": "アラブ戦士",
        "image": "arab-warrior",
        "at": "nihavand",
        "offset": [
          30,
          0
        ]
      }
    ],
    "props": [],
    "duration": 3400,
    "id": "nihavand",
    "chapter": 2,
    "year": "642年",
    "kicker": "ササン朝の息根を止める",
    "title": "ニハーヴァンドの戦いで、\nササン朝ペルシアを破る。",
    "body": [
      "イラクへ進んだアラブ軍は、ササン朝ペルシアと戦った。642年の<strong>ニハーヴァンドの戦い</strong>で勝利し、イラン高原への征服を進める。",
      "ササン朝は各地で抵抗を続けたが、651年に最後の王が死去して滅亡した。<strong>642年の戦いと651年の滅亡</strong>を区別して押さえよう。"
    ],
    "takeaway": "642年・ニハーヴァンドの戦い → ササン朝ペルシア軍壊滅（651年滅亡）。",
    "note": "支配の拡大と住民の改宗は同じ速度では進みません。イランのイスラーム化は、その後も長い時間をかけて進みました。",
    "focus": "ニハーヴァンドの戦い",
    "mapHeading": "イラン高原での決戦",
    "before": "アラブ軍がペルシア軍本隊と激突",
    "after": "642年の勝利後に征服が進み、651年にササン朝が滅亡する",
    "battle": "nihavand"
  },
  {
    "frame": [
      28.24,
      27.5,
      50.78,
      34.53
    ],
    "zones": [
      "caliphate_expanded"
    ],
    "pins": [
      "fustat",
      "kufa",
      "basra"
    ],
    "routes": [],
    "tags": [],
    "facts": [
      "ミスル：フスタート・クーファ・バスラ",
      "戦士手当：アター（現金給料）"
    ],
    "actors": [
      {
        "name": "アラブ戦士",
        "image": "arab-warrior",
        "at": "kufa",
        "offset": [
          30,
          0
        ],
        "bubble": "アターを受け取る"
      }
    ],
    "props": [
      {
        "name": "ミスル城塞",
        "image": "misr-fortress",
        "at": "fustat",
        "kind": "prop",
        "offset": [
          -30,
          0
        ],
        "size": 84
      }
    ],
    "duration": 1600,
    "id": "misr-and-atar",
    "chapter": 2,
    "year": "統治体制の整備",
    "kicker": "軍営都市と戦士の給与",
    "title": "軍営都市ミスルを築き、\nアター（恩給）を支給する。",
    "body": [
      "広大な征服地を統治するため、ウマルはアラブ戦士が現地民の土地を奪うことを禁じ、軍の駐屯拠点として<strong>ミスル（軍営都市）</strong>を建設した。",
      "イラクの<strong>バスラ</strong>や<strong>クーファ</strong>、エジプトの<strong>フスタート</strong>などがミスルとして建設され、戦士たちには国庫の税収から現金給料「<strong>アター</strong>」が分配された。"
    ],
    "takeaway": "軍営都市ミスル（バスラ・クーファ・フスタート）＋ 戦士の給与アター。",
    "note": "フスタートは後のカイロの母体となり、クーファやバスラは新興のイスラーム学術都市へと発展しました。",
    "focus": "軍営都市ミスル",
    "mapHeading": "各地に建設された軍営都市",
    "before": "征服地に軍事拠点を新設",
    "after": "戦士をミスルに駐屯させアターを支給"
  },
  {
    "frame": [
      26.92,
      28.7,
      47.58,
      36.01
    ],
    "zones": [
      "caliphate_expanded"
    ],
    "pins": [
      "damascus",
      "alexandria",
      "ctesiphon"
    ],
    "routes": [],
    "tags": [],
    "facts": [
      "ジズヤ：人頭税（生命・財産の保護代）",
      "ハラージュ：地租（土地税）"
    ],
    "actors": [
      {
        "name": "長老カリフ",
        "image": "umar-calm",
        "at": "damascus",
        "offset": [
          -30,
          0
        ],
        "bubble": "信仰の自由を認める"
      },
      {
        "name": "保護民（ジンミー）",
        "image": "arab-elder",
        "at": "alexandria",
        "offset": [
          30,
          0
        ]
      }
    ],
    "props": [],
    "duration": 1600,
    "id": "jizya-and-kharaj",
    "chapter": 2,
    "year": "税制の確立",
    "kicker": "二大税制と宗教寛容",
    "title": "ジズヤとハラージュを課し、\n啓典の民に信仰の自由を認める。",
    "body": [
      "征服地では、キリスト教徒やユダヤ教徒などが、一定の条件で信仰・生命・財産を保護される<strong>ジンミー（保護民）</strong>となった。",
      "<strong>ジズヤ</strong>は主に非ムスリムに課される人頭税、<strong>ハラージュ</strong>は土地にかかる税。税を取り、軍を維持するしくみが広い領土の支配を支えた。"
    ],
    "takeaway": "ジズヤは人に、ハラージュは土地にかかる税。",
    "note": "「啓典の民」は宗教上の区分、「ジンミー」は統治上の地位です。保護には条件や制限があり、現代の平等な市民権と同じではありません。",
    "focus": "税制と寛容策",
    "mapHeading": "広大な征服地の統治",
    "before": "征服地で税を徴収し、軍の財源を確保する",
    "after": "保護と納税を組み合わせた統治が整う"
  },
  {
    "frame": [
      36.61,
      21.97,
      42.61,
      26.97
    ],
    "zones": [
      "caliphate_expanded"
    ],
    "pins": [
      "medina"
    ],
    "routes": [],
    "tags": [],
    "facts": [
      "第3代カリフ：ウスマン",
      "功績：コーランの正本結集",
      "結末：暗殺（656年）"
    ],
    "actors": [
      {
        "name": "ウスマン",
        "image": "uthman-calm",
        "at": "medina",
        "offset": [
          -28,
          0
        ],
        "bubble": "コーランを結集した"
      },
      {
        "name": "不満派戦士",
        "image": "arab-warrior",
        "at": "medina",
        "offset": [
          28,
          0
        ],
        "bubble": "身内びいきは許さぬ"
      }
    ],
    "props": [],
    "duration": 1600,
    "id": "uthman-dilemma",
    "chapter": 2,
    "year": "644〜656年",
    "kicker": "第3代の光と影",
    "title": "第3代ウスマン、\nコーランを結集するが暗殺される。",
    "body": [
      "ウマルの死後、富裕なウマイヤ家出身の<strong>ウスマン</strong>が第3代カリフに就任。各地で読み方が分かれていた『<strong>コーラン</strong>』の正本を結集・編纂した。",
      "しかし、要職に自分のウマイヤ家一族を露骨に優遇したため各地の戦士や不満派の反発を買い、656年、メディナの自宅で不満派によって暗殺された。"
    ],
    "takeaway": "第3代ウスマン：コーラン正本の結集完了。ウマイヤ家優遇で暗殺。",
    "note": "ウスマンが定めたコーランの標準正本は、現在世界中で読まれているコーランの底本となっています。",
    "focus": "第3代ウスマン",
    "mapHeading": "メディナの動揺",
    "before": "コーランの正本を結集して統一",
    "after": "身内びいきへの不満から暗殺される",
    "capital": "medina"
  },
  {
    "frame": [
      33.29,
      29.53,
      47.4,
      38.3
    ],
    "zones": [
      "caliphate_expanded"
    ],
    "pins": [
      "kufa",
      "damascus",
      "siffin"
    ],
    "routes": [
      {
        "points": [
          [
            44.4,
            32.03
          ],
          [
            38.5,
            35.8
          ]
        ],
        "kind": "campaign"
      },
      {
        "points": [
          [
            36.29,
            33.51
          ],
          [
            38.5,
            35.8
          ]
        ],
        "kind": "campaign"
      }
    ],
    "tags": [],
    "facts": [
      "第4代カリフ：アリー（ムハンマドの娘婿）",
      "敵対：ムアーウィヤ（シリア総督）",
      "661年：アリー暗殺"
    ],
    "actors": [
      {
        "name": "アリー",
        "image": "ali-march",
        "at": "kufa",
        "route": 0,
        "afterImage": "ali-calm",
        "bubble": "調停をめぐり分裂する"
      },
      {
        "name": "ムアーウィヤ",
        "image": "muawiya-calm",
        "at": "damascus",
        "route": 1,
        "afterImage": "muawiya-ruler",
        "bubble": "シリアを足場に台頭"
      }
    ],
    "props": [],
    "duration": 3400,
    "id": "ali-and-fitna",
    "chapter": 2,
    "year": "656〜661年",
    "kicker": "内乱と正統カリフの終焉",
    "title": "第4代アリーとムアーウィヤが激突、\n内乱の末に暗殺される。",
    "body": [
      "第4代カリフにムハンマドの従弟で娘婿の<strong>アリー</strong>が選ばれたが、シリア総督<strong>ムアーウィヤ</strong>（ウマイヤ家）がウスマン暗殺の責任を追及して反旗を翻した。",
      "シッフィーンの戦いでアリーが妥協に応じると、急進派の<strong>ハワーリジュ派</strong>が離脱。661年、アリーはハワーリジュ派に暗殺され、正統カリフ時代は幕を閉じた。"
    ],
    "takeaway": "アリー vs ムアーウィヤの内乱。ハワーリジュ派離脱。661年アリー暗殺。",
    "note": "このアリー暗殺とムアーウィヤの台頭が、後の「スンナ派」と「シーア派」の決定的分裂へと直結します。",
    "focus": "第4代アリーと内乱",
    "mapHeading": "シッフィーンの戦いとアリー暗殺",
    "before": "アリーとムアーウィヤがシッフィーンで激突",
    "after": "661年アリー暗殺、正統カリフ時代終了",
    "battle": "siffin"
  }
];
