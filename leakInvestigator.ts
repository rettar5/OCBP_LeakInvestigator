import { Log } from "../../../odnUtils";
import { AccountConfigs, AccountData } from "../../../configs/accountConfigs";

export class LeakInvestigator {
  constructor(private accountData: AccountData, private nowDate: Date, private fullName: string) {}

  /**
   * プラグインのメイン処理を実行
   *
   * @param {(isProcessed?: boolean) => void} finish
   */
  run(finish: (isProcessed?: boolean) => void) {
    const heapUsed = process.memoryUsage().heapUsed;
    const heapUsedMB = heapUsed / (1024 * 1024);
    Log.i('LeakInvestigator heap used: ' + heapUsed + 'byte, ' + heapUsedMB.toFixed(1) + 'MB');
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
}

namespace Constants {
}
