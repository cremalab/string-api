module.exports = {
  strings: {
    start: `What kind of activity are you interested in?`,
    continue: `What's next?`,
    suggest_location: `Why don't you try {name}? It has {rating} stars`,
    suggest_location_again: `Alright, let's try again. Why don't you try {name}? It has {rating} stars`,
    ask_party_type: `Who are you going with?`,

    'type:eat': {
      start_confirmation: `Excellent, I'm hungry too.`,
      successful_suggestion: `Cool! I thought you'd like that.`,

      'party_type:solo': {
        finding_suggestions: `I'll find a comfortable dining place for one.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:friends': {
        finding_suggestions: `I'll find someplace for you all to eat.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:family': {
        finding_suggestions: `I'll find someplace for you all to eat.`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      'party_type:date': {
        finding_suggestions: `I'll find somewhere for you two to eat!`,
        rejected_suggestion_acknowledgement: `Okay, I'll try again.`
      },

      suggest_activity: `Maybe this will prime your appetite:`,
      successful_activity_suggestion: `Nice, got it.`,
      prompt_activity: `Tell me a little about what you did!`
    },
    'type:drink': {
      start_confirmation: `Let's find something to wet your whistle.`,
      successful_suggestion: `Cool! I thought you'd like that.`,

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

      suggest_activity: `How's this for starters?:`,
      successful_activity_suggestion: `Nice, got it.`,
      prompt_activity: `Tell me a little about what you did!`
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
    declined_photo_upload: `Cool, no worries. Other users can use their imaginations 😋`,
    prompt_image: `Would you like to share an image with the rest of the String community?`,
    prompt_recommendation: `Would you recommend this activity?`
  },

  errors: {
    no_locations: `This is embarassing...I'm all out of places to {activity_type}.`,
    no_activities: `Doesn't look like anybody has told me about things they've done here. You could be the first!`
  }
}
