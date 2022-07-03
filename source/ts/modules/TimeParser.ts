export interface Time {

  readonly ms     : number
  readonly ago    : string
  readonly future : number | string

}

export class TimeParser {

  private formats : Array<Time>

  public constructor () {

    this.formats = [

      // #. Seconds.
      {
        ms     : 60, // 60
        ago    : 'seconds',
        future : 1
      },

      // #. Minutes tense.
      {
        ms     : 120, // 60*2
        ago    : '1 minute ago',
        future : '1 minute from now'
      },

      // #. Minutes.
      {
        ms     : 3600, // 60*60
        ago    : 'minutes',
        future : 60    // 60
      },

      // #. Hours tense.
      {
        ms     : 7200, // 60*60*2
        ago    : 'seconds',
        future : '1 hour from now'
      },

      // #. Hours.
      {
        ms     : 86400, // 60*60*24
        ago    : 'hours',
        future : 3600   // 60*60
      },

      // #. Day tense.
      {
        ms     : 172800, // 60*60*24*2
        ago    : 'Yesterday',
        future : 'Tomorrow'
      },

      // #. Days.
      {
        ms     : 604800, // 60*60*24*7
        ago    : 'days',
        future : 86400    // 60*60*24
      },

      // #. Week tense.
      {
        ms     : 1209600, // 60*60*24*7*4*2
        ago    : 'Last week',
        future : 'Next week'
      },

      // #. Weeks.
      {
        ms     : 2419200, // 60*60*24*7*4
        ago    : 'weeks',
        future : 604800   // 60*60*24*7
      },

      // #. Month tense.
      {
        ms     : 4838400, // 60*60*24*7*4*2
        ago    : 'Last month',
        future : 'Next month'
      },

      // #. Months.
      {
        ms     : 29030400, // 60*60*24*7*4*12
        ago    : 'months',
        future : 2419200   // 60*60*24*7*4
      },

      // #. Year tense.
      {
        ms     : 58060800,    // 60*60*24*7*4*12*2
        ago    : 'Last year',
        future : 'Next year'
      },

      // #. Years.
      {
        ms     : 2903040000, // 60*60*24*7*4*12*100
        ago    : 'years',
        future : 29030400 // 60*60*24*7*4*12
      },

      // #. Century tense.
      {
        ms     : 5806080000, // 60*60*24*7*4*12*100*2
        ago    : 'Last century',
        future : 'Next century'
      },

      // #. Centuries.
      {
        ms     : 58060800000, // 60*60*24*7*4*12*100*2
        ago    : 'centuries',
        future : 2903040000   // 60*60*24*7*4*12*100
      },

    ]

  }

  public parse ( date : Date | string | number = +new Date() ) : string {

    let token       : string     = 'ago'
    let list_choice : keyof Time = 'ago'

    console.log('lol')

    switch (typeof date) {
      case 'number':
        break;
      case 'string':
        date = +new Date(date);
        break;
      case 'object':
        console.log('lol')
        if (date.constructor === Date) date = date.getTime();
        break;
      default:
        date = +new Date();
    }

    // #. Initialise certainly the Date constructor.
    //if (typeof date === 'object') {

    //  console.log('lol')
    //  date = date.getTime()
    //  console.log(date)

    //}
    //else if (typeof date === 'string') date = +new Date(date)

    // 1. Current seconds.
    var seconds = (+new Date() - (date as number)) / 1000

    // 2. Now, obviously.
    if (seconds == 0) return 'Just now'

    // 3. For the future.
    if (seconds < 0) {
      seconds     = Math.abs(seconds)
      token       = 'from now'
      list_choice = 'future'
    }

    for (let i = 0; i < this.formats.length; i++) {

      const format = this.formats[i]

      // #. When found the format.
      if (seconds < format.ms) {

        // #. In case it is a `tense` type of time.
        if (typeof format.future === 'string')
          return String(format[list_choice])

        // #. Not...
        else
          return Math.floor(seconds / format.future) + ' ' + format.ago + ' ' + token

      }

    }

    return '???'

  }

}
