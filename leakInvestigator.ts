import { Log } from "../../../odnUtils";
import { AccountConfigs, AccountData } from "../../../configs/accountConfigs";
import { OdnTweets } from "../../../odnTweets";
import { OdnProfiles } from "../../../odnProfiles";
import { TwitterProfileConfigs } from "../../../configs/twitterProfileConfigs";
const os = require('os');

export class LeakInvestigator {
  constructor(private accountData: AccountData, private nowDate: Date, private fullName: string) {}

  /**
   * プラグインのメイン処理を実行
   *
   * @param {(isProcessed?: boolean) => void} finish
   */
  run(finish: (isProcessed?: boolean) => void) {
    try {
        global.gc();
    } catch(error) {
        Log.i("You must run program with 'node --expose-gc index.js' or 'npm start'");
        Log.t("gc error: ", error);
    }

    const heapUsed = process.memoryUsage().heapUsed;
    const profile = TwitterProfileConfigs.getProfile(this.accountData.userId);
    let text = '@' + profile.screenName + ' ODN-CLIENT サーバステータス\n';
    text += 'TotalMem: ' + this.convByteToMega(os.totalmem()) + 'MB\n';
    text += 'FreeMem: ' + this.convByteToMega(os.freemem()) + 'MB\n';
    text += 'ProcessMem: ' + this.convByteToMega(heapUsed) + 'MB';
    Log.i(text.replace(/\n/g, ', '));

    if (this.isValidTweetTime(this.nowDate)) {
      const t = new OdnTweets(this.accountData);
      t.text = text;
      t.postTweet();
    }

    finish();
  }

  /**
   * プラグインを実行するかどうか判定
   *
   * @param accountData
   * @param nowDate
   * @returns {boolean}
   */
  static isValid(accountData: AccountData, nowDate: Date): boolean {
    return true; // 毎分実行
  }

  isValidTweetTime(nowDate: Date): boolean {
    return Constants.tweetHour.some((hour) => {
      return hour === nowDate.getHours() && 0 === nowDate.getMinutes();
    });
  }

  private convByteToMega(byte: number): number {
    return parseFloat((byte / (1024 * 1024)).toFixed(1));
  }
}

namespace Constants {
  export const tweetHour = [0, 12];
}
