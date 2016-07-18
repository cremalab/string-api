module.exports = {
  strings: {
    start: `What kind of activity are you interested in?`,
    suggest_location: `Why don't you try {name}? It has {rating} stars`,
    suggest_location_again: `Alright, let's try again. Why don't you try {name}? It has {rating} stars`,
    ask_party_type: `Who are you going with?`,

    'type:eat': {
      start_confirmation: `Excellent, I'm hungry too.`,

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
      }
    },
    'type:drink': {
      start_confirmation: `Let's find something to wet your whistle.`,

    },
    'type:see': {
      start_confirmation: `Plenty to look at around here.`
    },
    'type:do': {
      start_confirmation: `Plenty to do around here.`
    }
  },

  errors: {
    no_locations: `This is embarassing...I'm all out of places to {activity_type}.`  
  }
}
