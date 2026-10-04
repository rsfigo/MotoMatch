import { t } from '@/i18n';
import { formatChf, formatKw, formatPs, formatSeatHeight } from '@/lib/format';
import type { MatchReason } from '@/lib/match';

/** Text zu einer Begründung, z. B. «Stark für Stadt und Touren (8/10)». */
export function reasonText(reason: MatchReason): string {
  const texts = t.match.reasons;
  switch (reason.kind) {
    case 'purpose':
      return texts.purpose(
        t.match.listAnd(reason.purposes.map((purpose) => t.profile[purpose])),
        reason.score,
      );
    case 'purposeWeak':
      return texts.purposeWeak(t.profile[reason.purpose], reason.score);
    case 'withinBudget':
      return texts.withinBudget(formatChf(reason.priceChf));
    case 'overBudget':
      return texts.overBudget(formatChf(reason.overChf));
    case 'seatFits':
      return texts.seatFits(formatSeatHeight(reason.seatHeightMm));
    case 'seatHigh':
      return texts.seatHigh(formatSeatHeight(reason.seatHeightMm));
    case 'beginnerFriendly':
      return texts.beginnerFriendly(reason.score);
    case 'forExperienced':
      return texts.forExperienced(reason.score);
    case 'power':
      return texts.power(formatPs(reason.powerKw));
    case 'sound':
      return texts.sound(reason.score);
    case 'tuning':
      return texts.tuning(reason.score);
    case 'throttle':
      return texts.throttle(formatKw(reason.throttledPowerKw));
  }
}
