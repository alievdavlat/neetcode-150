/**
 * 3090. Swift Scheduling   ·   Easy   ·   Exercism
 *
 * Your task is to convert delivery date descriptions to actual delivery dates,
 * based on when the meeting started.
 *
 * There are two types of delivery date descriptions:
 *
 * 1. Fixed: a predefined set of words.
 * 2. Variable: words that have a variable component, but follow a predefined
 * set of patterns.
 *
 * There are three fixed delivery date descriptions:
 *
 * - "NOW"
 * - "ASAP" (As Soon As Possible)
 * - "EOW" (End Of Week)
 *
 * The following table shows how to translate them:
 *
 * | Description | Meeting start | Delivery date | | ----------- |
 * ----------------------------- | ----------------------------------- | |
 * "NOW" | - | Two hours after the meeting started | | "ASAP" | Before 13:00 |
 * Today at 17:00 | | "ASAP" | After or at 13:00 | Tomorrow at 13:00 | | "EOW"
 * | Monday, Tuesday, or Wednesday | Friday at 17:00 | | "EOW" | Thursday or
 * Friday | Sunday at 20:00 |
 *
 * There are two variable delivery date description patterns:
 *
 * - "<N>M" (N-th month)
 * - "Q<N>" (N-th quarter)
 *
 * | Description | Meeting start | Delivery date | | ----------- |
 * ------------------------- |
 * --------------------------------------------------------- | | "<N>M" |
 * Before N-th month
 *
 * Example 1:
 *   Input:  meetingStart = "2012-02-13T09:00:00", description = "NOW"
 *   Output: "2012-02-13T11:00:00"
 *
 * Example 2:
 *   Input:  meetingStart = "1999-06-03T09:45:00", description = "ASAP"
 *   Output: "1999-06-03T17:00:00"
 *
 * Example 3:
 *   Input:  meetingStart = "2008-12-21T13:00:00", description = "ASAP"
 *   Output: "2008-12-22T13:00:00"
 *
 * Example 4:
 *   Input:  meetingStart = "2008-12-21T14:50:00", description = "ASAP"
 *   Output: "2008-12-22T13:00:00"
 *
 * Example 5:
 *   Input:  meetingStart = "2025-02-03T16:00:00", description = "EOW"
 *   Output: "2025-02-07T17:00:00"
 *
 * Example 6:
 *   Input:  meetingStart = "1997-04-29T10:50:00", description = "EOW"
 *   Output: "1997-05-02T17:00:00"
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function deliveryDate(meetingStart: string, description: string): string {
  throw new Error('Not implemented');
}
