module.exports = {
  strings: {
    prompt: [`Let's go!`, `I'm ready!`],
    start: [
      `What kind of activity are you interested in?`, `What do you want to do?`
    ],
    continue: [`What's next?`, `What now?`],
    suggest_location: [
      `Why don't you try {name}? It has {rating} stars`,
      `How about {name}? It's got {rating} stars from Google Places`
    ],
    suggest_location_again: [
      `Alright, let's try again. Why don't you try {name}? It has {rating} stars`,
      `Another shot: How about {name}?`
    ],
    ask_party_type: [
      `Who are you going with?`,
      `Is anyone going with you?`
    ],
    finished: [
      `Let's do it again sometime!`,
      `Hope you had fun! Let me know when you're looking for something else.`
    ],

    'type:eat': {
      start_confirmation: [
        `Excellent, I'm hungry too.`,
        `I thought I heard your stomach growling...`,
        `Oh yeah, it's getting to be that time`
      ],
      successful_suggestion: [
        `Cool! I thought you'd like that.`,
        `Glad you're interested!`
      ],

      'party_type:solo': {
        finding_suggestions: [
          `I'll find a comfortable dining place for one.`,
          `🤖 locating a stellar spot for a solo nosh...`,
          `You won't be totally alone, I'll be with you!`,
          `Cool, lemme think...`
        ],
        rejected_suggestion_acknowledgement: [
          `Okay, I'll try again.`,
          `To each, their own. Lemme look again...`,
          `Ah, okay. Digging up another spot...`,
          `Alright, one sec...`
        ]
      },

      'party_type:friends': {
        finding_suggestions: [
          `I'll find someplace for you all to eat.`,
          `🎶 I'll be there for youuuu🎶 - searching...`,
          `Looking for a great spot for Pals/Gals/Buds/BFFs`,
          `🤖 commencing group noshery search...`
        ],
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:family': {
        finding_suggestions: [
          `I'll find someplace for you all to eat.`,
          `I know a thing or two about familial dining...`,
          `Tell your folks to get their forks...`,
          `Munchies for your kin, on it!`
        ],
        rejected_suggestion_acknowledgement: [
          `Okay, I'll try again.`,
          `No problem, I'll try again.`,
          `Alright, stick with me...`,
          `I get the feeling you all have a hard time agreeing...`,
          `This is never easy, but I'm gonna stick with you all.`
        ]
      },

      'party_type:date': {
        finding_suggestions: [
          `I'll find somewhere for you two to eat!`,
          `💞 Gotcha. I'm looking...`,
          `On it!`
        ],
        rejected_suggestion_acknowledgement: [
          `Okay, I'll try again.`,
          `I'll get this right, hang tight...`,
          `No problem. I'll try again.`
        ]
      },

      suggest_activity: [
        `Maybe this will prime your appetite:`,
        `Okay, check this out:`,
        `Here's something I've learned is pretty good here:`,
        `Here's a suggestion from other Stringers:`,
        `Check out what other people have done here:`
      ],
      successful_activity_suggestion: [
        `Nice, got it.`,
        `Cool!`
      ],
      prompt_activity: `Tell me a little about what you did!`
    },
    'type:drink': {
      start_confirmation: [
        `Let's find something to wet your whistle.`,
        `I'm determined to quench your thirst one way or another`,
        `🤖 accessing database of liquid dispenseries...`,
        `I'll hunt down a watering hole for you.`
      ],
      successful_suggestion: [
        `Cool! I thought you'd like that.`,
        `Nice!`
      ],

      'party_type:solo': {
        finding_suggestions: `Let's find a place of solitude for you. `,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:friends': {
        finding_suggestions: `Let me find something that the crew might like.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:family': {
        finding_suggestions: `I'll find someplace for you all to sip on something.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:date': {
        finding_suggestions: `Libations for two, got it 😉`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      suggest_activity: [
        `How's this for starters?:`,
        `Here's something other Stringers have tried here:`,
        `Wanna try this? Somebody else thought it was pretty good.`
      ],
      successful_activity_suggestion: [
        `Nice, got it.`,
        `Great!`
      ],
      prompt_activity: [
        `Tell me a little about what you did!`,
        `What did you end up doing?`
      ]
    },
    'type:see': {
      start_confirmation: `Plenty to look at around here.`,
      suggest_activity: `Try checking this out first:`,

      'party_type:solo': {
        finding_suggestions: `Let's find a place of solitude for you. `,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:friends': {
        finding_suggestions: `Let me find something that the crew might like.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:family': {
        finding_suggestions: `I'll find somthing fun for the family to check out.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:date': {
        finding_suggestions: `Sightseeing for two!`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      successful_suggestion: `Cool! I thought you'd like that.`,
      successful_activity_suggestion: `Nice, got it.`,
      prompt_activity: `Tell me a little about what you did!`
    },
    'type:do': {
      suggest_activity: `Give this a shot:`,
      start_confirmation: `Plenty to do around here.`,

      'party_type:solo': {
        finding_suggestions: `Let's something you can do alone.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:friends': {
        finding_suggestions: `Let me find something that the crew might like.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:family': {
        finding_suggestions: `I'll find somthing fun for the family to do.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:date': {
        finding_suggestions: `Something to do for two, let me think...`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      successful_suggestion: `Cool! I thought you'd like that.`,
      successful_activity_suggestion: `Nice, got it.`,
      prompt_activity: `Tell me a little about what you did!`
    }
  },

  activities: {
    created: `Thanks for letting me know!`,
    declined_photo_upload: [
      `Cool, no worries. Other Stringers can use their imaginations 😋`,
      `A picture is worth a thousand words, so I hope your thumbs are warmed up...`,
      `No problem!`
    ],
    prompt_image: [
      `Would you like to share an image with the rest of the String community?`,
      `Wanna share a photo of your experience?`,
      `How about a pic of what you did?`
    ],
    prompt_recommendation: [
      `Would you recommend this activity?`,
      `Was this a good time?`,
      `What'd you think of it?`
    ],
    acknowledge_recommendation: {
      positive: [
        `Thanks! We'll let everyone know this is a good thing`,
        `Great! Thanks for helping other Stringers find something fun to do.`
      ],
      negative: [
        `Bummer. We'll inform others so they won't have a bad time.`,
        `😔 I'm sorry I put you throught that. Thanks for letting me know.`,
        `Alright, that wasn't cool, I gotcha.`
      ]
    },
    image_received: [
      `Excellent! Thanks for sharing.`,
      `Lookin' good! Thanks for sharing.`
    ]
  },

  errors: {
    no_locations: `This is embarassing...I'm all out of places to {activity_type}.`,
    no_activities: `Doesn't look like anybody has told me about things they've done here. You could be the first!`
  }
}
