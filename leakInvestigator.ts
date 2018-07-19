import { Log } from "../../../odnUtils";
import { AccountConfigs, AccountData } from "../../../configs/accountConfigs";
import { OdnTweets } from "../../../odnTweets";
declare let os;

export class LeakInvestigator {
  constructor(private accountData: AccountData, private nowDate: Date, private fullName: string) {}

  /**
   * プラグインのメイン処理を実行
   *
   * @param {(isProcessed?: boolean) => void} finish
   */
  run(finish: (isProcessed?: boolean) => void) {
    const heapUsed = process.memoryUsage().heapUsed;
    let text = '@subSC13 ODN-CLIENT サーバステータス\n';
    text += 'TotalMem: ' + this.convByteToMega(os.totalmem()) + '\n';
    text += 'FreeMem: ' + this.convByteToMega(os.freemem()) + '\n';
    text += 'ProcessMem: ' + this.convByteToMega(heapUsed) + '\n';
    Log.i(text);

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
    return (byte / (1024 * 1024)).toFixed(1);
  }
}

namespace Constants {
  export const tweetHour = [0, 12];
}
